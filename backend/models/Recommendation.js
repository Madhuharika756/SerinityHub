const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // one document per user
  },
  recommendations: [
    {
      mood: {
        type: String,
        required: true,
        enum: ['happy', 'sad', 'angry', 'anxious', 'stressed', 'tired', 'neutral'],
      },
      category: {
        type: String,
        required: true,
        enum: ['movie', 'book', 'music'],
      },
      recommendation: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Recommendation = mongoose.model('Recommendation', recommendationSchema);
module.exports = Recommendation;
