const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { updateProfile, getAllUsers } = require("../controllers/userController");
const { findMatches } = require("../controllers/userController");
const {addBuddy } = require("../controllers/userController");



router.post("/add-buddy/:id", protect, addBuddy);
router.get("/matches", protect, findMatches);
router.put("/profile", protect, updateProfile);
router.get("/all", protect, authorizeRoles("admin"), getAllUsers);

module.exports = router;