const express = require("express");

const {
  createScreen,
  getAllScreens,
  getScreenById,
  updateScreen,
  deleteScreen,
} = require("../controllers/screenController");

const router = express.Router();

router.post("/", createScreen);

router.get("/", getAllScreens);

router.get("/:id", getScreenById);

router.put("/:id", updateScreen);

router.delete("/:id", deleteScreen);

module.exports = router;