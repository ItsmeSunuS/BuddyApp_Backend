const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createGroup,
  joinGroup,
  updateGroupProgress,
  getGroup
} = require("../controllers/groupController");

router.post("/create", protect, createGroup);
router.post("/join/:id", protect, joinGroup);
router.put("/update/:id", protect, updateGroupProgress);
router.get("/:id", protect, getGroup);

module.exports = router;