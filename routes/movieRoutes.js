const express = require("express");

const {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} = require("../controllers/movieController");

const router = express.Router();

// Create Movie
router.post("/", createMovie);

// Get All Movies
router.get("/", getAllMovies);

// Get Movie By ID
router.get("/:id", getMovieById);

// Update Movie
router.put("/:id", updateMovie);

// Delete Movie
router.delete("/:id", deleteMovie);

module.exports = router;