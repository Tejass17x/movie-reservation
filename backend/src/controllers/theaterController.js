import prisma from '../prisma.js';

// Theaters Controllers
export const getTheaters = async (req, res) => {
  try {
    const theaters = await prisma.theater.findMany({
      include: {
        screens: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(theaters);
  } catch (err) {
    console.error('Get theaters error:', err);
    return res.status(500).json({ error: 'Failed to fetch theaters.' });
  }
};

export const getTheaterById = async (req, res) => {
  const { id } = req.params;
  try {
    const theater = await prisma.theater.findUnique({
      where: { id: parseInt(id) },
      include: { screens: true },
    });
    if (!theater) {
      return res.status(404).json({ error: 'Theater not found.' });
    }
    return res.json(theater);
  } catch (err) {
    console.error('Get theater error:', err);
    return res.status(500).json({ error: 'Failed to fetch theater.' });
  }
};

export const createTheater = async (req, res) => {
  const { name, location } = req.body;
  try {
    const theater = await prisma.theater.create({
      data: { name, location },
    });
    return res.status(201).json(theater);
  } catch (err) {
    console.error('Create theater error:', err);
    return res.status(500).json({ error: 'Failed to create theater.' });
  }
};

export const updateTheater = async (req, res) => {
  const { id } = req.params;
  const { name, location } = req.body;
  try {
    const theater = await prisma.theater.update({
      where: { id: parseInt(id) },
      data: { name, location },
    });
    return res.json(theater);
  } catch (err) {
    console.error('Update theater error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Theater not found.' });
    }
    return res.status(500).json({ error: 'Failed to update theater.' });
  }
};

export const deleteTheater = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.theater.delete({
      where: { id: parseInt(id) },
    });
    return res.json({ message: 'Theater and its screens deleted successfully.' });
  } catch (err) {
    console.error('Delete theater error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Theater not found.' });
    }
    return res.status(500).json({ error: 'Failed to delete theater.' });
  }
};

// Nested Screens Controllers
export const getScreensByTheater = async (req, res) => {
  const { theaterId } = req.params;
  try {
    const screens = await prisma.screen.findMany({
      where: { theaterId: parseInt(theaterId) },
      orderBy: { name: 'asc' },
    });
    return res.json(screens);
  } catch (err) {
    console.error('Get screens error:', err);
    return res.status(500).json({ error: 'Failed to fetch screens for this theater.' });
  }
};

export const createScreen = async (req, res) => {
  const { theaterId } = req.params;
  const { name, rows, columns } = req.body;
  try {
    // Verify theater exists
    const theater = await prisma.theater.findUnique({
      where: { id: parseInt(theaterId) },
    });
    if (!theater) {
      return res.status(404).json({ error: 'Theater not found.' });
    }

    const screen = await prisma.screen.create({
      data: {
        theaterId: parseInt(theaterId),
        name,
        rows,
        columns,
      },
    });
    return res.status(201).json(screen);
  } catch (err) {
    console.error('Create screen error:', err);
    return res.status(500).json({ error: 'Failed to create screen.' });
  }
};

// Screen Specific Actions
export const updateScreen = async (req, res) => {
  const { id } = req.params;
  const { name, rows, columns } = req.body;
  try {
    const screen = await prisma.screen.update({
      where: { id: parseInt(id) },
      data: { name, rows, columns },
    });
    return res.json(screen);
  } catch (err) {
    console.error('Update screen error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Screen not found.' });
    }
    return res.status(500).json({ error: 'Failed to update screen.' });
  }
};

export const deleteScreen = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.screen.delete({
      where: { id: parseInt(id) },
    });
    return res.json({ message: 'Screen deleted successfully.' });
  } catch (err) {
    console.error('Delete screen error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Screen not found.' });
    }
    return res.status(500).json({ error: 'Failed to delete screen.' });
  }
};
