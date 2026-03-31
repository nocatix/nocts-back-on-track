const mongoose = require('mongoose');

const weightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    enum: ['lbs', 'kg'],
    default: 'lbs'
  },
  date: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
weightSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Weight', weightSchema);
