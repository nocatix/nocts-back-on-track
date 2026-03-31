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
  notes: {
    encrypted: String,
    iv: String,
    authTag: String
  },
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

// Index for efficient querying by user and date
moodSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('Mood', moodSchema);
