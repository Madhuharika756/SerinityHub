const mongoose = require("mongoose");

const MoodTrackerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  moods: [
    {
      mood: {
        type: String,
        enum: ["Happy", "Sad", "Stressed", "Calm", "Angry", "Tired"],
        required: true,
      },
      note: { type: String, default: "" },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("MoodTracker", MoodTrackerSchema);
