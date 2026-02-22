const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { addWorkout } = require("../controllers/workoutController");
const { requireCompleteProfile } = require("../middleware/profileMiddleware");

router.post("/add", protect, addWorkout);
router.post("/add", protect, requireCompleteProfile, addWorkout);

module.exports = router;