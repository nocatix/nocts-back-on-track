const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/encryption');

const DiarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  content: {
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

// Encrypt content before saving
DiarySchema.pre('save', function(next) {
  if (this.isModified('content') && typeof this.content === 'string' && this.content) {
    const encrypted = encrypt(this.content);
    this.content = encrypted;
  }
  next();
});

// Decrypt content after retrieving
DiarySchema.post('findOne', function(doc) {
  if (doc && doc.content && doc.content.encrypted) {
    doc.content = decrypt(doc.content);
  }
});

DiarySchema.post('find', function(docs) {
  docs.forEach(doc => {
    if (doc.content && doc.content.encrypted) {
      doc.content = decrypt(doc.content);
    }
  });
});

// Index for faster queries
DiarySchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('Diary', DiarySchema);
