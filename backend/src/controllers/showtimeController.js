import prisma from '../prisma.js';

export const getShowtimes = async (req, res) => {
  const { movie_id, date } = req.query;

  try {
    const where = {};
    if (movie_id) {
      where.movieId = parseInt(movie_id);
    }
    if (date) {
      const startDate = new Date(date);
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setUTCHours(23, 59, 59, 999);
      where.startTime = {
        gte: startDate,
        lte: endDate,
      };
    }

    const showtimes = await prisma.showtime.findMany({
      where,
      include: {
        movie: {
          select: { id: true, title: true, durationMinutes: true },
        },
        screen: {
          include: {
            theater: {
              select: { id: true, name: true },
            },
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

export const getShowtimeById = async (req, res) => {
  const { id } = req.params;

  try {
    const showtime = await prisma.showtime.findUnique({
      where: { id: parseInt(id) },
      include: {
        movie: true,
        screen: {
          include: { theater: true },
        },
      },
    });

    if (!showtime) {
      return res.status(404).json({ error: 'Showtime not found.' });
    }

    return res.json(showtime);
  } catch (err) {
    console.error('Get showtime error:', err);
    return res.status(500).json({ error: 'Failed to fetch showtime.' });
  }
};

export const createShowtime = async (req, res) => {
  const { movieId, screenId, startTime, price } = req.body;

  try {
    // Validate movie and screen exist
    const movieExists = await prisma.movie.findUnique({ where: { id: movieId } });
    if (!movieExists) {
      return res.status(404).json({ error: 'Movie not found.' });
    }

    const screenExists = await prisma.screen.findUnique({ where: { id: screenId } });
    if (!screenExists) {
      return res.status(404).json({ error: 'Screen not found.' });
    }

    // Check for schedule conflicts on the same screen (approximate, movie duration)
    const newStart = new Date(startTime);
    const newEnd = new Date(newStart.getTime() + movieExists.durationMinutes * 60 * 1000);

    const conflicting = await prisma.showtime.findFirst({
      where: {
        screenId,
        startTime: {
          gte: new Date(newStart.getTime() - 4 * 60 * 60 * 1000), // Check within a 4 hour window
          lte: new Date(newStart.getTime() + 4 * 60 * 60 * 1000),
        },
      },
      include: { movie: true },
    });

    if (conflicting) {
      const conflictStart = new Date(conflicting.startTime);
      const conflictEnd = new Date(conflictStart.getTime() + conflicting.movie.durationMinutes * 60 * 1000);
      
      // Check overlap
      if (
        (newStart >= conflictStart && newStart < conflictEnd) ||
        (newEnd > conflictStart && newEnd <= conflictEnd) ||
        (newStart <= conflictStart && newEnd >= conflictEnd)
      ) {
        return res.status(409).json({
          error: `Time conflict: Screen is occupied by '${conflicting.movie.title}' from ${conflictStart.toLocaleTimeString()} to ${conflictEnd.toLocaleTimeString()}.`,
        });
      }
    }

    const showtime = await prisma.showtime.create({
      data: {
        movieId,
        screenId,
        startTime: new Date(startTime),
        price,
      },
    });

    return res.status(201).json(showtime);
  } catch (err) {
    console.error('Create showtime error:', err);
    return res.status(500).json({ error: 'Failed to create showtime.' });
  }
};

export const updateShowtime = async (req, res) => {
  const { id } = req.params;
  const { movieId, screenId, startTime, price } = req.body;

  try {
    // Validate movie and screen
    const movieExists = await prisma.movie.findUnique({ where: { id: movieId } });
    if (!movieExists) {
      return res.status(404).json({ error: 'Movie not found.' });
    }

    const screenExists = await prisma.screen.findUnique({ where: { id: screenId } });
    if (!screenExists) {
      return res.status(404).json({ error: 'Screen not found.' });
    }

    const showtime = await prisma.showtime.update({
      where: { id: parseInt(id) },
      data: {
        movieId,
        screenId,
        startTime: new Date(startTime),
        price,
      },
    });

    return res.json(showtime);
  } catch (err) {
    console.error('Update showtime error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Showtime not found.' });
    }
    return res.status(500).json({ error: 'Failed to update showtime.' });
  }
};

export const deleteShowtime = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.showtime.delete({
      where: { id: parseInt(id) },
    });

    return res.json({ message: 'Showtime deleted successfully.' });
  } catch (err) {
    console.error('Delete showtime error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Showtime not found.' });
    }
    return res.status(500).json({ error: 'Failed to delete showtime.' });
  }
};
