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
  frequencyPerDay: {
    type: Number,
    required: true
  },
  moneySpentPerDay: {
    type: Number,
    required: true
  },
  notes: {
    encrypted: String,
    iv: String,
    authTag: String
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
