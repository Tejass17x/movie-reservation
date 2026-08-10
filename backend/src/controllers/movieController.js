import prisma from '../prisma.js';

export const getMovies = async (req, res) => {
  const { search, genre } = req.query;

  try {
    const where = {};
    if (search) {
      where.title = {
        contains: search,
      };
    }
    if (genre && genre !== 'All') {
      where.genre = {
        equals: genre,
      };
    }

    const movies = await prisma.movie.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.json(movies);
  } catch (err) {
    console.error('Get movies error:', err);
    return res.status(500).json({ error: 'Failed to fetch movies.' });
  }
};

export const getMovieById = async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await prisma.movie.findUnique({
      where: { id: parseInt(id) },
    });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found.' });
    }

    return res.json(movie);
  } catch (err) {
    console.error('Get movie error:', err);
    return res.status(500).json({ error: 'Failed to fetch movie.' });
  }
};

export const createMovie = async (req, res) => {
  const { title, genre, durationMinutes, description, posterUrl, rating } = req.body;

  try {
    const movie = await prisma.movie.create({
      data: {
        title,
        genre,
        durationMinutes,
        description,
        posterUrl,
        rating,
      },
    });

    return res.status(201).json(movie);
  } catch (err) {
    console.error('Create movie error:', err);
    return res.status(500).json({ error: 'Failed to create movie.' });
  }
};

export const updateMovie = async (req, res) => {
  const { id } = req.params;
  const { title, genre, durationMinutes, description, posterUrl, rating } = req.body;

  try {
    const movie = await prisma.movie.update({
      where: { id: parseInt(id) },
      data: {
        title,
        genre,
        durationMinutes,
        description,
        posterUrl,
        rating,
      },
    });

    return res.json(movie);
  } catch (err) {
    console.error('Update movie error:', err);
    // Check if record not found
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Movie not found.' });
    }
    return res.status(500).json({ error: 'Failed to update movie.' });
  }
};

export const deleteMovie = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.movie.delete({
      where: { id: parseInt(id) },
    });

    return res.json({ message: 'Movie deleted successfully.' });
  } catch (err) {
    console.error('Delete movie error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Movie not found.' });
    }
    return res.status(500).json({ error: 'Failed to delete movie.' });
  }
};
