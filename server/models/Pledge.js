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
  // Get the current date at midnight UTC (not local timezone)
  const now = new Date();
  const utcMidnightToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
  
  // Get the stop date at midnight UTC
  const stopDate = new Date(this.plannedStopDate);
  const utcMidnightStop = new Date(Date.UTC(stopDate.getUTCFullYear(), stopDate.getUTCMonth(), stopDate.getUTCDate(), 0, 0, 0, 0));
  
  const diffTime = utcMidnightStop - utcMidnightToday;
  const daysUntilStop = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Debug logging
  console.log('🔍 [Pledge.getDaysUntilStop]', {
    pledge: this.what,
    storedDate: this.plannedStopDate,
    utcMidnightToday: utcMidnightToday.toISOString(),
    utcMidnightStop: utcMidnightStop.toISOString(),
    diffTime: diffTime,
    diffHours: diffTime / (1000 * 60 * 60),
    daysUntilStop: daysUntilStop
  });
  
  return daysUntilStop;
};

module.exports = mongoose.model('Pledge', pledgeSchema);
