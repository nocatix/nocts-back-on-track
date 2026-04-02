const mongoose = require('mongoose');

const pledgeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  what: {
    type: String,
    required: true
  },
  plannedStopDate: {
    type: Date,
    required: true
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

// Helper method to get days remaining until stop date
pledgeSchema.methods.getDaysUntilStop = function() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  const stopDate = new Date(this.plannedStopDate);
  stopDate.setHours(0, 0, 0, 0);
  
  const diffTime = stopDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

module.exports = mongoose.model('Pledge', pledgeSchema);
