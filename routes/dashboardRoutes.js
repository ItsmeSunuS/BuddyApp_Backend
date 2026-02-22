const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { getDashboardSummary } = require("../controllers/dashboardController");
const { requireCompleteProfile } = require("../middleware/profileMiddleware");

router.get("/summary", protect, getDashboardSummary);
router.get("/summary", protect, requireCompleteProfile, getDashboardSummary);

module.exports = router;