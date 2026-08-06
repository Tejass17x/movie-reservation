const Movie = require("../models/Movie");
const Theater = require("../models/Theater");
const Screen = require("../models/Screen");
const Showtime = require("../models/Showtime");

// ===============================
// Get All Movies
// ===============================
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll();

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

// ===============================
// Get All Theaters
// ===============================
const getTheaters = async (req, res) => {
  try {
    const theaters = await Theater.findAll();

    res.status(200).json({
      success: true,
      count: theaters.length,
      data: theaters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get Available Showtimes
// ===============================
const getShowtimes = async (req, res) => {
  try {
    const { movieId, screenId, date } = req.query;

    const where = {};

    if (movieId) where.movieId = movieId;
    if (screenId) where.screenId = screenId;
    if (date) where.showDate = date;

    const showtimes = await Showtime.findAll({
      where,
      include: [
        {
          model: Movie,
        },
        {
          model: Screen,
          include: [Theater],
        },
      ],
      order: [
        ["showDate", "ASC"],
        ["startTime", "ASC"],
      ],
    });

    res.status(200).json({
      success: true,
      count: showtimes.length,
      data: showtimes,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  getMovies,
  getTheaters,
  getShowtimes,
};