const Challenge = require("../models/Challenge");
const Workout = require("../models/Workout");

// Create challenge
exports.createChallenge = async (req, res) => {
  try {
    const { title, description, goalType, targetValue, startDate, endDate } = req.body;

    const challenge = await Challenge.create({
      title,
      description,
      goalType,
      targetValue,
      startDate,
      endDate,
      createdBy: req.user._id
    });

    res.status(201).json(challenge);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//join Challenge 

exports.joinChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    const alreadyJoined = challenge.participants.find(
      p => p.userId.toString() === req.user._id.toString()
    );

    if (alreadyJoined)
      return res.status(400).json({ message: "Already joined" });

    challenge.participants.push({
      userId: req.user._id,
      progress: 0
    });

    await challenge.save();

    res.json({ message: "Joined challenge successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//update challenge

exports.updateProgress = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    const workouts = await Workout.find({
      userId: req.user._id,
      date: {
        $gte: challenge.startDate,
        $lte: challenge.endDate
      }
    });

    let total = 0;

    if (challenge.goalType === "calories") {
      total = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
    }

    if (challenge.goalType === "duration") {
      total = workouts.reduce((sum, w) => sum + w.duration, 0);
    }

    if (challenge.goalType === "distance") {
      total = workouts.reduce((sum, w) => sum + (w.distance || 0), 0);
    }

    const participant = challenge.participants.find(
      p => p.userId.toString() === req.user._id.toString()
    );

    if (participant) {
      participant.progress = total;
      await challenge.save();
    }

    const percentage = Math.min(
      (total / challenge.targetValue) * 100,
      100
    );

    res.json({
      progress: total,
      percentage
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//get Challenge with leaderboard
exports.getChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate("participants.userId", "name");

    const leaderboard = challenge.participants.map(p => ({
      name: p.userId.name,
      progress: p.progress,
      percentage: Math.min(
        (p.progress / challenge.targetValue) * 100,
        100
      )
    })).sort((a, b) => b.progress - a.progress);

    res.json({
      challenge,
      leaderboard
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};