const Theater = require("../models/Theater");

// =============================
// Create Theater
// =============================
const createTheater = async (req, res) => {
  try {
    const theater = await Theater.create(req.body);

    res.status(201).json({
      success: true,
      message: "Theater created successfully",
      data: theater,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get All Theaters
// =============================
const getAllTheaters = async (req, res) => {
  try {
    const theaters = await Theater.findAll({
      order: [["createdAt", "DESC"]],
    });

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

// =============================
// Get Theater By ID
// =============================
const getTheaterById = async (req, res) => {
  try {
    const theater = await Theater.findByPk(req.params.id);

    if (!theater) {
      return res.status(404).json({
        success: false,
        message: "Theater not found",
      });
    }

    res.status(200).json({
      success: true,
      data: theater,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Update Theater
// =============================
const updateTheater = async (req, res) => {
  try {
    const theater = await Theater.findByPk(req.params.id);

    if (!theater) {
      return res.status(404).json({
        success: false,
        message: "Theater not found",
      });
    }

    await theater.update(req.body);

    res.status(200).json({
      success: true,
      message: "Theater updated successfully",
      data: theater,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Delete Theater
// =============================
const deleteTheater = async (req, res) => {
  try {
    const theater = await Theater.findByPk(req.params.id);

    if (!theater) {
      return res.status(404).json({
        success: false,
        message: "Theater not found",
      });
    }

    await theater.destroy();

    res.status(200).json({
      success: true,
      message: "Theater deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTheater,
  getAllTheaters,
  getTheaterById,
  updateTheater,
  deleteTheater,
};