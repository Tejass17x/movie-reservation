const express = require("express");

const {
  createShowtime,
  getAllShowtimes,
  getShowtimeById,
  updateShowtime,
  deleteShowtime,
} = require("../controllers/showtimeController");

const validateShowtime = require("../middleware/validateShowtime");

const router = express.Router();

// Create Showtime
router.post("/", validateShowtime, createShowtime);

// Get All Showtimes
router.get("/", getAllShowtimes);

// Get Showtime By ID
router.get("/:id", getShowtimeById);

// Update Showtime
router.put("/:id", validateShowtime, updateShowtime);

// Delete Showtime
router.delete("/:id", deleteShowtime);

module.exports = router;