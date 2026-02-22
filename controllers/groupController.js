const Group = require("../models/Group");
const Workout = require("../models/Workout");

// Create group
exports.createGroup = async (req, res) => {
  try {
    const { name, goalType, targetValue, startDate, endDate } = req.body;

    const group = await Group.create({
      name,
      goalType,
      targetValue,
      startDate,
      endDate,
      createdBy: req.user._id,
      members: [
        {
          userId: req.user._id,
          progress: 0
        }
      ]
    });

    res.status(201).json(group);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//join Group 
exports.joinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (group.members.length >= 5)
      return res.status(400).json({ message: "Group is full (max 5 members)" });

    const alreadyMember = group.members.find(
      m => m.userId.toString() === req.user._id.toString()
    );

    if (alreadyMember)
      return res.status(400).json({ message: "Already a member" });

    group.members.push({
      userId: req.user._id,
      progress: 0
    });

    await group.save();

    res.json({ message: "Joined group successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//update Group Progress
exports.updateGroupProgress = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    const workouts = await Workout.find({
      userId: req.user._id,
      date: {
        $gte: group.startDate,
        $lte: group.endDate
      }
    });

    let total = 0;

    if (group.goalType === "calories") {
      total = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
    }

    if (group.goalType === "duration") {
      total = workouts.reduce((sum, w) => sum + w.duration, 0);
    }

    if (group.goalType === "distance") {
      total = workouts.reduce((sum, w) => sum + (w.distance || 0), 0);
    }

    const member = group.members.find(
      m => m.userId.toString() === req.user._id.toString()
    );

    if (member) {
      member.progress = total;
      await group.save();
    }

    const groupTotal = group.members.reduce(
      (sum, m) => sum + m.progress,
      0
    );

    const percentage = Math.min(
      (groupTotal / group.targetValue) * 100,
      100
    );

    res.json({
      individualProgress: total,
      groupTotal,
      percentage
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Get Group Leaderboard
exports.getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("members.userId", "name");

    const leaderboard = group.members.map(m => ({
      name: m.userId.name,
      progress: m.progress
    })).sort((a, b) => b.progress - a.progress);

    const groupTotal = group.members.reduce(
      (sum, m) => sum + m.progress,
      0
    );

    res.json({
      group,
      leaderboard,
      groupTotal,
      percentage: Math.min(
        (groupTotal / group.targetValue) * 100,
        100
      )
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};