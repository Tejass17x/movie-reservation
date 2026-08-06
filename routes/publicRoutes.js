const express = require("express");

const {
  getMovies,
  getTheaters,
  getShowtimes,
} = require("../controllers/publicController");

const router = express.Router();

router.get("/movies", getMovies);

router.get("/theaters", getTheaters);

router.get("/showtimes", getShowtimes);

module.exports = router;