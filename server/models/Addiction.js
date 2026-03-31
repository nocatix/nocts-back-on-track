const mongoose = require('mongoose');

const addictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  stopDate: {
    type: Date,
    required: true
  },
  frequencyPerDay: {
    type: Number,
    required: true
  },
  moneySpentPerDay: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate total money saved
addictionSchema.methods.getTotalMoneySaved = function() {
  const daysStopped = Math.floor((Date.now() - this.stopDate) / (1000 * 60 * 60 * 24));
  return daysStopped * this.moneySpentPerDay;
};

// Calculate days since stopping
addictionSchema.methods.getDaysStopped = function() {
  return Math.floor((Date.now() - this.stopDate) / (1000 * 60 * 60 * 24));
};

module.exports = mongoose.model('Addiction', addictionSchema);
