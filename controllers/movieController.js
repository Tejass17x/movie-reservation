const Movie = require("../models/Movie");

// ==============================
// Create Movie
// ==============================
const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);

    res.status(201).json({
      success: true,
      message: "Movie created successfully",
      data: movie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get All Movies
// ==============================
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Movie By ID
// ==============================
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Movie
// ==============================
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    await movie.update(req.body);

    res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      data: movie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete Movie
// ==============================
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    await movie.destroy();

    res.status(200).json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
};