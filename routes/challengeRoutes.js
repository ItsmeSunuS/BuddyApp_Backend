const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { requireCompleteProfile } = require("../middleware/profileMiddleware");

const {
  createChallenge,
  joinChallenge,
  updateProgress,
  getChallenge
} = require("../controllers/challengeController");

router.post("/create", protect, createChallenge);
router.post("/join/:id", protect, joinChallenge);
router.put("/update/:id", protect, updateProgress);
router.get("/:id", protect, getChallenge);
router.post("/create", protect, requireCompleteProfile, createChallenge);
router.post("/join/:id", protect, requireCompleteProfile, joinChallenge);
router.put("/update/:id", protect, requireCompleteProfile, updateProgress);

module.exports = router;