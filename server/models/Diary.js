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
  content: mongoose.Schema.Types.Mixed,
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

// Decrypt content after saving (so response includes decrypted data)
DiarySchema.post('save', function(doc) {
  if (doc && doc.content) {
    // If content is an object with encrypted property, decrypt it
    if (doc.content.encrypted) {
      doc.content = decrypt(doc.content);
    }
    // If content is a string, leave it as is (wasn't encrypted because it was empty/falsy)
  }
});

// Index for faster queries
DiarySchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('Diary', DiarySchema);
