const mongoose = require('mongoose');

const trophySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true
  },
  day: {
    type: Number
  },
  week: {
    type: Number
  },
  month: {
    type: Number
  },
  year: {
    type: Number,
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

module.exports = mongoose.model('Trophy', trophySchema);
