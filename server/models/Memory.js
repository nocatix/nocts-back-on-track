const mongoose = require('mongoose');const { encrypt, decrypt } = require('../utils/encryption');
const memorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: mongoose.Schema.Types.Mixed,
  imageUrl: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  validate: {
    validator: function() {
      return this.message || this.imageUrl;
    },
    message: 'At least one of message or imageUrl is required'
  }
});

// Encrypt message before saving
memorySchema.pre('save', function(next) {
  if (this.isModified('message') && typeof this.message === 'string' && this.message) {
    const encrypted = encrypt(this.message);
    this.message = encrypted;
  }
  next();
});

// Decrypt message after retrieving
memorySchema.post('findOne', function(doc) {
  if (doc && doc.message && doc.message.encrypted) {
    doc.message = decrypt(doc.message);
  }
});

memorySchema.post('find', function(docs) {
  docs.forEach(doc => {
    if (doc.message && doc.message.encrypted) {
      doc.message = decrypt(doc.message);
    }
  });
});

// Decrypt message after saving (so response includes decrypted data)
memorySchema.post('save', function(doc) {
  if (doc && doc.message) {
    // If message is an object with encrypted property, decrypt it
    if (doc.message.encrypted) {
      doc.message = decrypt(doc.message);
    }
    // If message is a string, leave it as is (wasn't encrypted because it was empty/falsy)
  }
});

memorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Memory', memorySchema);
