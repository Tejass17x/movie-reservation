const express = require("express");

const {
  createTheater,
  getAllTheaters,
  getTheaterById,
  updateTheater,
  deleteTheater,
} = require("../controllers/theaterController");

const router = express.Router();

router.post("/", createTheater);

router.get("/", getAllTheaters);

router.get("/:id", getTheaterById);

router.put("/:id", updateTheater);

router.delete("/:id", deleteTheater);

module.exports = router;