const express = require('express');
const router = express.Router();
const Recommendation = require('../models/Recommendation');

// Example recommendation data
const recommendationData = {
  happy: {
    movie: ['Zindagi Na Milegi Dobara', 'Inside Out', 'The Secret Life of Walter Mitty'],
    book: ['The Happiness Advantage', 'Ikigai', 'The Alchemist'],
    music: ['Happy - Pharrell Williams', 'On Top of the World - Imagine Dragons', 'Good Life - OneRepublic']
  },
  sad: {
    movie: ['The Pursuit of Happyness', 'Inside Out', 'Dear Zindagi'],
    book: ['Man’s Search for Meaning', 'The Comfort Book', 'Tuesdays with Morrie'],
    music: ['Fix You - Coldplay', 'Let It Be - The Beatles', 'Someone Like You - Adele']
  },
  anxious: {
    movie: ['Soul', 'Good Will Hunting', 'A Beautiful Mind'],
    book: ['The Power of Now', 'Atomic Habits', 'The Gifts of Imperfection'],
    music: ['Weightless - Marconi Union', 'Lovely - Billie Eilish', 'Shallow - Lady Gaga']
  },
  angry: {
    movie: ['Kung Fu Panda', 'The Karate Kid', 'Peaceful Warrior'],
    book: ['The Art of Peace', 'Anger - Thich Nhat Hanh', 'The Tao of Pooh'],
    music: ['Let It Go - Idina Menzel', 'Demons - Imagine Dragons', 'Stronger - Kelly Clarkson']
  },
  stressed: {
    movie: ['Eat Pray Love', 'The Secret', 'The Hundred-Foot Journey'],
    book: ['Calm', 'Think Like a Monk', 'The Four Agreements'],
    music: ['Sunflower - Post Malone', 'Better Now - Post Malone', 'Photograph - Ed Sheeran']
  },
  tired: {
    movie: ['The Intern', 'Julie & Julia', 'Chef'],
    book: ['The Little Prince', 'You Are Here', 'Stillness is the Key'],
    music: ['Perfect - Ed Sheeran', 'Let Her Go - Passenger', 'Night Changes - One Direction']
  },
  neutral: {
    movie: ['Forrest Gump', 'Life of Pi', 'The Social Network'],
    book: ['The Subtle Art of Not Giving a F*ck', 'Deep Work', 'Can’t Hurt Me'],
    music: ['Believer - Imagine Dragons', 'Shake It Off - Taylor Swift', 'Counting Stars - OneRepublic']
  }
};

// Route to get recommendation
router.post('/getRecommendation', async (req, res) => {
  try {
    const { userId, mood, category } = req.body;
    const data = recommendationData[mood];

    if (!userId || !mood || !category) {
      return res.status(400).json({ message: 'Missing userId, mood, or category' });
    }

    if (!data || !data[category]) {
      return res.status(400).json({ message: 'Invalid mood or category' });
    }

    const recList = data[category];
    const randomRec = recList[Math.floor(Math.random() * recList.length)];

    // Check if user already has a recommendation document
    let userRec = await Recommendation.findOne({ userId });

    if (!userRec) {
      // Create a new document for the user
      userRec = new Recommendation({
        userId,
        recommendations: [{ mood, category, recommendation: randomRec }]
      });
    } else {
      // Push a new recommendation entry
      userRec.recommendations.push({ mood, category, recommendation: randomRec });
    }

    await userRec.save();

    res.status(200).json({
      message: 'Recommendation generated successfully',
      data: { mood, category, recommendation: randomRec }
    });

  } catch (err) {
    res.status(500).json({ message: 'Error generating recommendation', error: err.message });
  }
});

module.exports = router;
