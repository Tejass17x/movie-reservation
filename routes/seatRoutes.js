const express = require("express");

const {
  createSeat,
  getAllSeats,
  getSeatById,
  updateSeat,
  deleteSeat,
} = require("../controllers/seatController");

const router = express.Router();

router.post("/", createSeat);

router.get("/", getAllSeats);

router.get("/:id", getSeatById);

router.put("/:id", updateSeat);

router.delete("/:id", deleteSeat);

module.exports = router;