const Screen = require("../models/Screen");

// Create Screen
const createScreen = async (req, res) => {
  try {
    const screen = await Screen.create(req.body);

    res.status(201).json({
      success: true,
      message: "Screen created successfully",
      data: screen,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Screens
const getAllScreens = async (req, res) => {
  try {
    const screens = await Screen.findAll();

    res.status(200).json({
      success: true,
      count: screens.length,
      data: screens,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Screen By ID
const getScreenById = async (req, res) => {
  try {
    const screen = await Screen.findByPk(req.params.id);

    if (!screen) {
      return res.status(404).json({
        success: false,
        message: "Screen not found",
      });
    }

    res.status(200).json({
      success: true,
      data: screen,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Screen
const updateScreen = async (req, res) => {
  try {
    const screen = await Screen.findByPk(req.params.id);

    if (!screen) {
      return res.status(404).json({
        success: false,
        message: "Screen not found",
      });
    }

    await screen.update(req.body);

    res.status(200).json({
      success: true,
      message: "Screen updated successfully",
      data: screen,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Screen
const deleteScreen = async (req, res) => {
  try {
    const screen = await Screen.findByPk(req.params.id);

    if (!screen) {
      return res.status(404).json({
        success: false,
        message: "Screen not found",
      });
    }

    await screen.destroy();

    res.status(200).json({
      success: true,
      message: "Screen deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createScreen,
  getAllScreens,
  getScreenById,
  updateScreen,
  deleteScreen,
};