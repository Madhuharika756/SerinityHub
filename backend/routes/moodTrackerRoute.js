const express = require("express");
const router = express.Router();
const MoodTracker = require("../models/MoodTracker");

// Save a mood entry (array-based per day)
router.post("/", async (req, res) => {
  const { userId, mood, note } = req.body;
  if (!userId || !mood) {
    return res.status(400).json({ error: "userId and mood are required" });
  }

  try {
    // Get today's date (without time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if mood doc for today exists
    let moodDoc = await MoodTracker.findOne({ userId, date: today });

    if (!moodDoc) {
      // Create new document with the first mood
      moodDoc = await MoodTracker.create({
        userId,
        date: today,
        moods: [{ mood, note, timestamp: new Date() }],
      });
    } else {
      // Push new mood into array
      moodDoc.moods.push({ mood, note, timestamp: new Date() });
      await moodDoc.save();
    }

    res.status(201).json(moodDoc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save mood" });
  }
});

// Get mood history
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const moods = await MoodTracker.find({ userId }).sort({ date: 1 });
    res.json(moods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch mood history" });
  }
});

module.exports = router;
