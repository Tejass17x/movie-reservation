import prisma from '../prisma.js';

export const getBookings = async (req, res) => {
  const { movie_id, date, status, page = 1, limit = 10 } = req.query;

  try {
    const where = {};
    if (movie_id) {
      where.showtime = {
        movieId: parseInt(movie_id),
      };
    }
    if (date) {
      const startDate = new Date(date);
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setUTCHours(23, 59, 59, 999);
      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }
    if (status) {
      where.status = status;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await prisma.booking.count({ where });

    const bookings = await prisma.booking.findMany({
      where,
      skip,
      take: limitNum,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        bookingSeats: {
          select: { id: true, seatLabel: true },
        },
        showtime: {
          include: {
            movie: {
              select: { id: true, title: true },
            },
            screen: {
              include: {
                theater: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      bookings,
    });
  } catch (err) {
    console.error('Get bookings error:', err);
    return res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
};

export const getBookingStats = async (req, res) => {
  try {
    // 1. Total Revenue
    const revenueQuery = await prisma.booking.aggregate({
      where: { status: 'confirmed' },
      _sum: { totalCost: true },
    });
    const totalRevenue = parseFloat(revenueQuery._sum.totalCost || 0);

    // 2. Total Bookings
    const totalBookings = await prisma.booking.count();

    // 3. Bookings per movie
    const movies = await prisma.movie.findMany({
      include: {
        showtimes: {
          include: {
            bookings: {
              where: { status: 'confirmed' },
              include: {
                bookingSeats: true,
              },
            },
          },
        },
      },
    });

    const bookingsPerMovie = movies
      .map((movie) => {
        let bookingsCount = 0;
        let revenue = 0;
        movie.showtimes.forEach((st) => {
          bookingsCount += st.bookings.length;
          st.bookings.forEach((b) => {
            revenue += parseFloat(b.totalCost);
          });
        });
        return {
          movieId: movie.id,
          title: movie.title,
          bookingsCount,
          revenue,
        };
      })
      .sort((a, b) => b.bookingsCount - a.bookingsCount);

    // 4. Occupancy Rate
    const showtimes = await prisma.showtime.findMany({
      include: {
        screen: {
          select: { rows: true, columns: true },
        },
        bookings: {
          where: { status: 'confirmed' },
          include: {
            bookingSeats: true,
          },
        },
      },
    });

    let totalCapacity = 0;
    let totalSeatsBooked = 0;

    showtimes.forEach((st) => {
      if (st.screen) {
        const capacity = st.screen.rows * st.screen.columns;
        totalCapacity += capacity;
        st.bookings.forEach((b) => {
          totalSeatsBooked += b.bookingSeats.length;
        });
      }
    });

    const occupancyRate = totalCapacity > 0 ? (totalSeatsBooked / totalCapacity) * 100 : 0;

    // 5. Revenue Trend (last 7 days including today)
    const trend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const start = new Date(d);
      start.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);

      const dayRevenueQuery = await prisma.booking.aggregate({
        where: {
          status: 'confirmed',
          createdAt: {
            gte: start,
            lte: end,
          },
        },
        _sum: { totalCost: true },
      });

      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      trend.push({
        date: label,
        revenue: parseFloat(dayRevenueQuery._sum.totalCost || 0),
      });
    }

    // 6. Total Movies
    const totalMovies = await prisma.movie.count();

    return res.json({
      totalRevenue,
      totalBookings,
      totalMovies,
      occupancyRate: Math.round(occupancyRate * 10) / 10, // round to 1 decimal place
      bookingsPerMovie,
      revenueTrend: trend,
    });
  } catch (err) {
    console.error('Get booking stats error:', err);
    return res.status(500).json({ error: 'Failed to generate statistics.' });
  }
};
