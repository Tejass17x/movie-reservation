import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';

// 10-minute seat hold window
const HOLD_TTL_MS = 10 * 60 * 1000;

const isHeldExpired = (booking) =>
  booking.createdAt.getTime() + HOLD_TTL_MS < Date.now();

export const listMovies = async (req, res) => {
  const { search, genre } = req.query;

  try {
    const where = {};
    if (search) {
      where.title = { contains: search };
    }
    if (genre && genre !== 'All') {
      where.genre = { equals: genre };
    }

    const movies = await prisma.movie.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.json(movies);
  } catch (err) {
    console.error('Get public movies error:', err);
    return res.status(500).json({ error: 'Failed to fetch movies.' });
  }
};

export const listMovieShowtimes = async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await prisma.movie.findUnique({
      where: { id: parseInt(id) },
    });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found.' });
    }

    const showtimes = await prisma.showtime.findMany({
      where: {
        movieId: movie.id,
        startTime: { gte: new Date() },
      },
      include: {
        screen: {
          include: {
            theater: { select: { id: true, name: true, location: true } },
          },
        },
      },
      orderBy: { startTime: 'asc' },
    });

    return res.json({ movie, showtimes });
  } catch (err) {
    console.error('Get movie showtimes error:', err);
    return res.status(500).json({ error: 'Failed to fetch showtimes.' });
  }
};

export const listShowtimes = async (req, res) => {
  const { movie_id, date } = req.query;

  try {
    const where = {
      startTime: { gte: new Date() },
    };
    if (movie_id) {
      where.movieId = parseInt(movie_id);
    }
    if (date) {
      const start = new Date(`${date}T00:00:00`);
      const end = new Date(`${date}T23:59:59`);
      where.startTime = { gte: start, lte: end };
    }

    const showtimes = await prisma.showtime.findMany({
      where,
      include: {
        movie: { select: { id: true, title: true, durationMinutes: true, rating: true, posterUrl: true, genre: true } },
        screen: {
          include: {
            theater: { select: { id: true, name: true, location: true } },
          },
        },
      },
      orderBy: { startTime: 'asc' },
    });

    return res.json(showtimes);
  } catch (err) {
    console.error('Get showtimes error:', err);
    return res.status(500).json({ error: 'Failed to fetch showtimes.' });
  }
};

// Resolve the optional Authorization header into a user id (or null).
const getOptionalUserId = (req) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  try {
    const decoded = jwt.verify(
      header.split(' ')[1],
      process.env.JWT_SECRET || 'super-secret-cinema-admin-jwt-key-2026!'
    );
    return decoded.id ?? null;
  } catch {
    return null;
  }
};

export const getSeatMap = async (req, res) => {
  const { id } = req.params;

  try {
    const showtime = await prisma.showtime.findUnique({
      where: { id: parseInt(id) },
      include: {
        movie: {
          select: { id: true, title: true, genre: true, durationMinutes: true, rating: true, posterUrl: true, description: true },
        },
        screen: {
          include: {
            theater: { select: { id: true, name: true, location: true } },
          },
        },
      },
    });

    if (!showtime) {
      return res.status(404).json({ error: 'Showtime not found.' });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        showtimeId: showtime.id,
        status: { in: ['held', 'confirmed'] },
      },
      include: { bookingSeats: true },
    });

    const userId = getOptionalUserId(req);

    const occupied = {}; // label -> 'reserved' | 'held'
    const mySeats = new Set();

    // Lazily release expired holds (fire-and-forget, non-blocking)
    const expiredIds = [];
    for (const booking of bookings) {
      if (booking.status === 'held' && isHeldExpired(booking)) {
        expiredIds.push(booking.id);
        continue;
      }
      const seatState = booking.status === 'confirmed' ? 'reserved' : 'held';
      for (const bs of booking.bookingSeats) {
        occupied[bs.seatLabel] = seatState;
        if (booking.status === 'held' && userId && booking.userId === userId) {
          mySeats.add(bs.seatLabel);
        }
      }
    }
    if (expiredIds.length > 0) {
      prisma.booking
        .updateMany({ where: { id: { in: expiredIds } }, data: { status: 'cancelled' } })
        .catch(() => {});
    }

    // Build the seat grid from the screen dimensions
    const { rows, columns } = showtime.screen;
    const seats = [];
    for (let r = 0; r < rows; r++) {
      const row = String.fromCharCode(65 + r);
      for (let c = 1; c <= columns; c++) {
        const label = `${row}${c}`;
        seats.push({
          id: label,
          row,
          number: c,
          status: occupied[label] || 'available',
        });
      }
    }

    return res.json({
      showtime: {
        id: showtime.id,
        startTime: showtime.startTime,
        price: showtime.price,
        movie: showtime.movie,
        screen: showtime.screen,
      },
      seats,
      mySeats: Array.from(mySeats),
    });
  } catch (err) {
    console.error('Get seat map error:', err);
    return res.status(500).json({ error: 'Failed to fetch seat map.' });
  }
};
