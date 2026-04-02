const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/encryption');

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
  plannedStopDate: {
    type: Date,
    default: null
  },
  frequencyPerDay: {
    type: Number,
    required: true
  },
  moneySpentPerDay: {
    type: Number,
    required: true
  },
  notes: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt notes before saving
addictionSchema.pre('save', function(next) {
  if (this.isModified('notes') && typeof this.notes === 'string' && this.notes) {
    const encrypted = encrypt(this.notes);
    this.notes = encrypted;
  }
  next();
});

// Decrypt notes after retrieving
addictionSchema.post('findOne', function(doc) {
  if (doc && doc.notes && doc.notes.encrypted) {
    doc.notes = decrypt(doc.notes);
  }
});

addictionSchema.post('find', function(docs) {
  docs.forEach(doc => {
    if (doc.notes && doc.notes.encrypted) {
      doc.notes = decrypt(doc.notes);
    }
  });
});

// Decrypt notes after saving (so response includes decrypted data)
addictionSchema.post('save', function(doc) {
  if (doc && doc.notes) {
    // If notes is an object with encrypted property, decrypt it
    if (doc.notes.encrypted) {
      doc.notes = decrypt(doc.notes);
    }
    // If notes is a string, leave it as is (wasn't encrypted because it was empty/falsy)
  }
});

// Calculate total money saved
addictionSchema.methods.getTotalMoneySaved = function() {
  const daysStopped = Math.floor((Date.now() - this.stopDate) / (1000 * 60 * 60 * 24));
  return daysStopped * this.moneySpentPerDay;
};

// Calculate days since stopping
addictionSchema.methods.getDaysStopped = function() {
  const daysStopped = Math.floor((Date.now() - this.stopDate) / (1000 * 60 * 60 * 24));
  const msElapsed = Date.now() - this.stopDate;
  const hoursElapsed = msElapsed / (1000 * 60 * 60);
  console.log(`[getDaysStopped] stopDate: ${this.stopDate}, now: ${new Date()}, msElapsed: ${msElapsed}, hoursElapsed: ${hoursElapsed.toFixed(2)}, daysStopped: ${daysStopped}`);
  return daysStopped;
};

// Calculate days remaining until planned stop date
addictionSchema.methods.getDaysUntilPlannedStop = function() {
  if (!this.plannedStopDate) return null;
  
  // Get the current date at midnight UTC
  const now = new Date();
  const utcMidnightToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
  
  // Get the planned stop date at midnight UTC
  const plannedStop = new Date(this.plannedStopDate);
  const utcMidnightStop = new Date(Date.UTC(plannedStop.getUTCFullYear(), plannedStop.getUTCMonth(), plannedStop.getUTCDate(), 0, 0, 0, 0));
  
  const msRemaining = utcMidnightStop - utcMidnightToday;
  if (msRemaining <= 0) return 0; // Already past the date
  
  const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));
  return daysRemaining;
};

// Check if there's an active planned stop date in the future
addictionSchema.methods.hasActivePlannedStop = function() {
  if (!this.plannedStopDate) return false;
  return new Date() < this.plannedStopDate;
};

module.exports = mongoose.model('Addiction', addictionSchema);
