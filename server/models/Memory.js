const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String
  },
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

memorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Memory', memorySchema);
