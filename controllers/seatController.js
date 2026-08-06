const Seat = require("../models/Seat");

// Create Seat
const createSeat = async (req, res) => {
  try {
    const seat = await Seat.create(req.body);

    res.status(201).json({
      success: true,
      message: "Seat created successfully",
      data: seat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Seats
const getAllSeats = async (req, res) => {
  try {
    const seats = await Seat.findAll();

    res.status(200).json({
      success: true,
      count: seats.length,
      data: seats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Seat By ID
const getSeatById = async (req, res) => {
  try {
    const seat = await Seat.findByPk(req.params.id);

    if (!seat) {
      return res.status(404).json({
        success: false,
        message: "Seat not found",
      });
    }

    res.status(200).json({
      success: true,
      data: seat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Seat
const updateSeat = async (req, res) => {
  try {
    const seat = await Seat.findByPk(req.params.id);

    if (!seat) {
      return res.status(404).json({
        success: false,
        message: "Seat not found",
      });
    }

    await seat.update(req.body);

    res.status(200).json({
      success: true,
      message: "Seat updated successfully",
      data: seat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Seat
const deleteSeat = async (req, res) => {
  try {
    const seat = await Seat.findByPk(req.params.id);

    if (!seat) {
      return res.status(404).json({
        success: false,
        message: "Seat not found",
      });
    }

    await seat.destroy();

    res.status(200).json({
      success: true,
      message: "Seat deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSeat,
  getAllSeats,
  getSeatById,
  updateSeat,
  deleteSeat,
};