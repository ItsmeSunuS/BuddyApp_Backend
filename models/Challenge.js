const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
  title: String,
  description: String,

  goalType: {
    type: String,
    enum: ["distance", "calories", "duration"],
    required: true
  },

  targetValue: {
    type: Number,
    required: true
  },

  participants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      progress: { type: Number, default: 0 } // current value
    }
  ],

  startDate: Date,
  endDate: Date,

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }

}, { timestamps: true });

module.exports = mongoose.model("Challenge", challengeSchema);