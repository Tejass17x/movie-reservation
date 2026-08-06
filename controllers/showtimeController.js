const Showtime = require("../models/Showtime");
const isSlotAvailable = require("../services/overlapValidator");

// ===============================
// Create Showtime
// ===============================
const createShowtime = async (req, res) => {
  try {
    const {
      movieId,
      screenId,
      showDate,
      startTime,
      endTime,
      ticketPrice,
      status,
    } = req.body;

    const available = await isSlotAvailable(
      screenId,
      showDate,
      startTime,
      endTime
    );

    if (!available) {
      return res.status(400).json({
        success: false,
        message: "Another show is already scheduled during this time slot.",
      });
    }

    const showtime = await Showtime.create({
      movieId,
      screenId,
      showDate,
      startTime,
      endTime,
      ticketPrice,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Showtime created successfully",
      data: showtime,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get All Showtimes
// ===============================
const getAllShowtimes = async (req, res) => {
  try {
    const showtimes = await Showtime.findAll();

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

// ===============================
// Get Showtime By ID
// ===============================
const getShowtimeById = async (req, res) => {
  try {
    const showtime = await Showtime.findByPk(req.params.id);

    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: "Showtime not found",
      });
    }

    res.status(200).json({
      success: true,
      data: showtime,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Update Showtime
// ===============================
const updateShowtime = async (req, res) => {
  try {
    const showtime = await Showtime.findByPk(req.params.id);

    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: "Showtime not found",
      });
    }

    const available = await isSlotAvailable(
      req.body.screenId || showtime.screenId,
      req.body.showDate || showtime.showDate,
      req.body.startTime || showtime.startTime,
      req.body.endTime || showtime.endTime,
      showtime.showtimeId
    );

    if (!available) {
      return res.status(400).json({
        success: false,
        message: "Another show is already scheduled during this time slot.",
      });
    }

    await showtime.update(req.body);

    res.status(200).json({
      success: true,
      message: "Showtime updated successfully",
      data: showtime,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Delete Showtime
// ===============================
const deleteShowtime = async (req, res) => {
  try {
    const showtime = await Showtime.findByPk(req.params.id);

    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: "Showtime not found",
      });
    }

    await showtime.destroy();

    res.status(200).json({
      success: true,
      message: "Showtime deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createShowtime,
  getAllShowtimes,
  getShowtimeById,
  updateShowtime,
  deleteShowtime,
};