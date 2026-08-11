import prisma from '../prisma.js';

// 10-minute seat hold window
const HOLD_TTL_MS = 10 * 60 * 1000;

const isHeldExpired = (booking) =>
  booking.createdAt.getTime() + HOLD_TTL_MS < Date.now();

export const holdSeats = async (req, res) => {
  const { id } = req.params;
  const { seats } = req.body;

  try {
    const showtime = await prisma.showtime.findUnique({
      where: { id: parseInt(id) },
      include: { screen: true },
    });

    if (!showtime) {
      return res.status(404).json({ error: 'Showtime not found.' });
    }

    const { rows, columns } = showtime.screen;

    // Validate labels against the screen dimensions and dedupe
    const unique = [...new Set(seats)];
    for (const label of unique) {
      const rowIdx = label.charCodeAt(0) - 65;
      const num = parseInt(label.slice(1), 10);
      if (rowIdx < 0 || rowIdx >= rows || num < 1 || num > columns) {
        return res.status(400).json({
          error: `Seat ${label} is outside the screen layout (${rows} rows x ${columns} columns).`,
        });
      }
    }

    const userId = req.user.id;

    // Cancel any previous active hold by this user for this showtime
    const prior = await prisma.booking.findMany({
      where: { userId, showtimeId: showtime.id, status: 'held' },
    });
    const expiredPrior = prior.filter((b) => isHeldExpired(b));
    const activePrior = prior.filter((b) => !isHeldExpired(b));

    if (activePrior.length > 0) {
      await prisma.booking.updateMany({
        where: { id: { in: activePrior.map((b) => b.id) } },
        data: { status: 'cancelled' },
      });
    }
    if (expiredPrior.length > 0) {
      await prisma.booking.updateMany({
        where: { id: { in: expiredPrior.map((b) => b.id) } },
        data: { status: 'cancelled' },
      });
    }

    // Load existing occupied seats (confirmed + non-expired held)
    const existingBookings = await prisma.booking.findMany({
      where: {
        showtimeId: showtime.id,
        status: { in: ['held', 'confirmed'] },
      },
      include: { bookingSeats: true },
    });

    const occupied = new Set();
    for (const booking of existingBookings) {
      if (booking.status === 'held' && isHeldExpired(booking)) continue;
      for (const bs of booking.bookingSeats) occupied.add(bs.seatLabel);
    }

    for (const label of unique) {
      if (occupied.has(label)) {
        return res.status(409).json({
          error: `Seat ${label} is no longer available.`,
          seat: label,
        });
      }
    }

    const totalCost = parseFloat(showtime.price) * unique.length;

    const booking = await prisma.$transaction(async (tx) => {
      const created = await tx.booking.create({
        data: {
          userId,
          showtimeId: showtime.id,
          totalCost,
          status: 'held',
          bookingSeats: {
            create: unique.map((label) => ({ seatLabel: label })),
          },
        },
        include: { bookingSeats: true },
      });
      return created;
    });

    const expiresAt = new Date(booking.createdAt.getTime() + HOLD_TTL_MS);

    return res.status(201).json({
      id: booking.id,
      status: 'held',
      totalCost,
      seats: unique,
      expiresAt,
    });
  } catch (err) {
    console.error('Hold seats error:', err);
    return res.status(500).json({ error: 'Failed to hold seats.' });
  }
};

export const confirmBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    if (booking.userId !== req.user.id) {
      return res.status(403).json({ error: 'You do not have access to this booking.' });
    }

    if (booking.status !== 'held') {
      return res.status(409).json({ error: 'This booking is not pending confirmation.' });
    }

    if (isHeldExpired(booking)) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'cancelled' },
      });
      return res.status(409).json({ error: 'Hold expired. Please select your seats again.' });
    }

    const confirmed = await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'confirmed' },
      include: {
        bookingSeats: true,
        showtime: {
          include: {
            movie: { select: { id: true, title: true, posterUrl: true, rating: true, genre: true } },
            screen: { include: { theater: { select: { id: true, name: true, location: true } } } },
          },
        },
      },
    });

    return res.json(confirmed);
  } catch (err) {
    console.error('Confirm booking error:', err);
    return res.status(500).json({ error: 'Failed to confirm booking.' });
  }
};

export const cancelBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    if (booking.userId !== req.user.id) {
      return res.status(403).json({ error: 'You do not have access to this booking.' });
    }

    if (booking.status === 'confirmed') {
      return res.status(409).json({ error: 'Confirmed bookings cannot be cancelled.' });
    }

    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'cancelled' },
    });

    return res.json({ message: 'Booking cancelled.', id: booking.id });
  } catch (err) {
    console.error('Cancel booking error:', err);
    return res.status(500).json({ error: 'Failed to cancel booking.' });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        bookingSeats: true,
        showtime: {
          include: {
            movie: { select: { id: true, title: true, posterUrl: true, rating: true, genre: true, durationMinutes: true } },
            screen: { include: { theater: { select: { id: true, name: true, location: true } } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Attach expiresAt to held bookings so the UI can show a live countdown
    const mapped = bookings.map((booking) => ({
      ...booking,
      expiresAt:
        booking.status === 'held'
          ? new Date(booking.createdAt.getTime() + HOLD_TTL_MS)
          : null,
    }));

    return res.json(mapped);
  } catch (err) {
    console.error('Get my bookings error:', err);
    return res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
};
