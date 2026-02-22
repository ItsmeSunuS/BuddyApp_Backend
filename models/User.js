const mongoose=require("mongoose");
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },

  age: Number,
  gender: String,
  height: Number,
  weight: Number,
  targetWeight: Number,
  location: String,
  fitnessGoals: [String],
  preferredWorkouts: [String],
  buddies: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);