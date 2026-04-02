const mongoose = require('mongoose');const { encrypt, decrypt } = require('../utils/encryption');
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
  notes: mongoose.Schema.Types.Mixed,
  triggers: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt notes before saving
moodSchema.pre('save', function(next) {
  if (this.isModified('notes') && typeof this.notes === 'string' && this.notes) {
    const encrypted = encrypt(this.notes);
    this.notes = encrypted;
  }
  next();
});

// Decrypt notes after retrieving
moodSchema.post('findOne', function(doc) {
  if (doc && doc.notes && doc.notes.encrypted) {
    doc.notes = decrypt(doc.notes);
  }
});

moodSchema.post('find', function(docs) {
  docs.forEach(doc => {
    if (doc.notes && doc.notes.encrypted) {
      doc.notes = decrypt(doc.notes);
    }
  });
});

// Decrypt notes after saving (so response includes decrypted data)
moodSchema.post('save', function(doc) {
  if (doc && doc.notes) {
    // If notes is an object with encrypted property, decrypt it
    if (doc.notes.encrypted) {
      doc.notes = decrypt(doc.notes);
    }
    // If notes is a string, leave it as is (wasn't encrypted because it was empty/falsy)
  }
});

// Index for efficient querying by user and date
moodSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('Mood', moodSchema);
