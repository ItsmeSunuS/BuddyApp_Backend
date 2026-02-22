const User = require("../models/User");

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const {
      age,
      gender,
      height,
      weight,
      targetWeight,
      location,
      fitnessGoals,
      preferredWorkouts
    } = req.body;

    // Update fields
    user.age = age;
    user.gender = gender;
    user.height = height;
    user.weight = weight;
    user.targetWeight = targetWeight;
    user.location = location;
    user.fitnessGoals = fitnessGoals;
    user.preferredWorkouts = preferredWorkouts;

    // Check if required fields exist
    if (height && weight && targetWeight && location) {
      user.profileCompleted = true;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      profileCompleted: user.profileCompleted,
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// Find matching buddies
exports.findMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    const users = await User.find({
      _id: { $ne: currentUser._id }, // exclude self
      location: currentUser.location
    });

    // console.log("Current user:", currentUser); For testing purpose only
    // console.log("Other users:", users); For testing purpose only


    const matches = users.filter(user =>
      user.fitnessGoals.some(goal =>
        currentUser.fitnessGoals.includes(goal)
      ) &&
      user.preferredWorkouts.some(workout =>
        currentUser.preferredWorkouts.includes(workout)
      )
    );

    res.json(matches);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// add Buddy 
exports.addBuddy = async (req, res) => {
  try {
    const buddyId = req.params.id;

    const user = await User.findById(req.user._id);

    if (!user.buddies.includes(buddyId)) {
      user.buddies.push(buddyId);
      await user.save();
    }

    res.json({ message: "Buddy added successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


