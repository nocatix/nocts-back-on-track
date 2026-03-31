const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  primaryMood: {
    type: String,
    enum: ['😊 Happy', '😢 Sad', '😠 Angry', '😰 Anxious', '😌 Calm', '⚡ Energetic', '😴 Tired', '😐 Neutral'],
    required: true
  },
  secondaryMood: String,
  intensity: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  notes: String,
  triggers: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying by user and date
moodSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('Mood', moodSchema);
