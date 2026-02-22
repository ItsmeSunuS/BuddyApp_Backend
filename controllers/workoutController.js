const Workout = require("../models/Workout");
const User = require("../models/User");
const {
  calculateBMI,
  weightLossFromCalories,
  estimateDaysToTarget
} = require("../utils/bmiUtils");

exports.addWorkout = async (req, res) => {
  try {
    const { workoutType, duration, caloriesBurned } = req.body;

    const workout = await Workout.create({
      userId: req.user._id,
      workoutType,
      duration,
      caloriesBurned
    });

    // Calculate total calories
    const workouts = await Workout.find({ userId: req.user._id });

    const totalCalories = workouts.reduce(
      (sum, w) => sum + w.caloriesBurned,
      0
    );

    const weightLoss = weightLossFromCalories(totalCalories);

    const user = await User.findById(req.user._id);

    const updatedWeight = user.weight - weightLoss;
    const currentBMI = calculateBMI(updatedWeight, user.height);
    const targetBMI = calculateBMI(user.targetWeight, user.height);

    const avgDailyCalories = totalCalories / 7;

    const estimatedDays = estimateDaysToTarget(
      updatedWeight,
      user.targetWeight,
      avgDailyCalories
    );

    res.json({
      workout,
      totalCalories,
      weightLoss,
      currentBMI,
      targetBMI,
      estimatedDays
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};