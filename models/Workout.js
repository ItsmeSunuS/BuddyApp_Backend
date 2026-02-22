const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  workoutType: String,
  duration: Number,
  caloriesBurned: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Workout", workoutSchema);