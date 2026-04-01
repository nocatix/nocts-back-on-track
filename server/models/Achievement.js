const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🏆'
  },
  milestoneDays: {
    type: Number,
    required: true
  },
  addictionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Addiction'
  },
  unreadAt: {
    type: Date,
    default: Date.now
  },
  readAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate achievements for the same milestone and addiction
achievementSchema.index({ userId: 1, milestoneDays: 1, addictionId: 1 }, { unique: true });

module.exports = mongoose.model('Achievement', achievementSchema);
