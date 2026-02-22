const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },

  goalType: {
    type: String,
    enum: ["calories", "duration", "distance"],
    required: true
  },

  targetValue: {
    type: Number,
    required: true
  },

  members: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      progress: { type: Number, default: 0 }
    }
  ],

  startDate: Date,
  endDate: Date,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

module.exports = mongoose.model("Group", groupSchema);