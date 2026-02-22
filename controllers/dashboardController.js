const User = require("../models/User");
const Workout = require("../models/Workout");
const Challenge = require("../models/Challenge");
const Group = require("../models/Group");

const {
  calculateBMI,
  weightLossFromCalories,
  estimateDaysToTarget
} = require("../utils/bmiUtils");

exports.getDashboardSummary = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Get all workouts
    const workouts = await Workout.find({ userId: req.user._id });

    const totalWorkouts = workouts.length;

    const totalCalories = workouts.reduce(
      (sum, w) => sum + w.caloriesBurned,
      0
    );

    const weightLoss = weightLossFromCalories(totalCalories);

    const updatedWeight = user.weight - weightLoss;

    const currentBMI = calculateBMI(updatedWeight, user.height);
    const targetBMI = calculateBMI(user.targetWeight, user.height);

    const avgDailyCalories =
      totalCalories > 0 ? totalCalories / 7 : 0;

    const estimatedDays = estimateDaysToTarget(
      updatedWeight,
      user.targetWeight,
      avgDailyCalories
    );

    // Active Challenges
    const activeChallenges = await Challenge.find({
      "participants.userId": req.user._id
    });

    // Active Groups
    const activeGroups = await Group.find({
      "members.userId": req.user._id
    });

    // Weekly Workout Summary (Last 7 days)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const weeklyWorkouts = await Workout.find({
      userId: req.user._id,
      date: { $gte: last7Days }
    });

    const weeklyCalories = weeklyWorkouts.reduce(
      (sum, w) => sum + w.caloriesBurned,
      0
    );

    res.json({
      user: {
        name: user.name,
        weight: updatedWeight,
        height: user.height,
        buddyCount: user.buddies.length
      },
      stats: {
        totalWorkouts,
        totalCalories,
        weeklyCalories,
        weightLoss,
        currentBMI,
        targetBMI,
        estimatedDays
      },
      engagement: {
        activeChallenges: activeChallenges.length,
        activeGroups: activeGroups.length
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};