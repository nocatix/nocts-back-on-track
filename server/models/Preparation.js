const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/encryption');

const PreparationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  responses: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt responses before saving
PreparationSchema.pre('save', function(next) {
  console.log(`[Preparation Model] Pre-save hook, _responsesData:`, this._responsesData);
  
  // If _responsesData exists (set via setResponses method), encrypt it
  if (this._responsesData) {
    try {
      const encrypted = encrypt(JSON.stringify(this._responsesData));
      console.log(`[Preparation Model] Encrypted successfully:`, encrypted);
      this.responses = encrypted;
    } catch (e) {
      console.error(`[Preparation Model] Encryption error:`, e);
      return next(e);
    }
  }
  next();
});

// Method to set responses data
PreparationSchema.methods.setResponsesData = function(data) {
  this._responsesData = data;
};

// Decrypt responses after retrieving - DISABLED, handled in routes instead
// PreparationSchema.post('findOne', function(doc) {
//   if (doc && doc.responses && doc.responses.encrypted) {
//     try {
//       const decrypted = decrypt(doc.responses);
//       console.log(`[Preparation Model] Decrypted successfully:`, JSON.parse(decrypted));
//       doc.responses = JSON.parse(decrypted);
//     } catch (e) {
//       console.error('[Preparation Model] Error decrypting responses:', e);
//       doc.responses = {};
//     }
//   } else if (doc) {
//     console.log(`[Preparation Model] No encrypted responses found, using default`);
//     doc.responses = doc.responses || {};
//   }
// });

PreparationSchema.post('find', function(docs) {
  console.log(`[Preparation Model] Post-find, docs count:`, docs?.length);
  
  docs.forEach((doc, idx) => {
    console.log(`[Preparation Model] Processing doc ${idx}, responses:`, doc.responses);
    
    if (doc && doc.responses && doc.responses.encrypted) {
      try {
        const decrypted = decrypt(doc.responses);
        console.log(`[Preparation Model] Decrypted doc ${idx} successfully:`, JSON.parse(decrypted));
        doc.responses = JSON.parse(decrypted);
      } catch (e) {
        console.error(`[Preparation Model] Error decrypting doc ${idx}:`, e);
        doc.responses = {};
      }
    } else if (doc) {
      console.log(`[Preparation Model] No encrypted responses in doc ${idx}, using default`);
      doc.responses = doc.responses || {};
    }
  });
});

// Decrypt responses after saving (so response includes decrypted data)
PreparationSchema.post('save', function(doc) {
  console.log(`[Preparation Model] Post-save, responses:`, doc.responses);
  
  if (doc && doc.responses && doc.responses.encrypted) {
    try {
      const decrypted = decrypt(doc.responses);
      console.log(`[Preparation Model] Decrypted after save:`, JSON.parse(decrypted));
      doc.responses = JSON.parse(decrypted);
    } catch (e) {
      console.error(`[Preparation Model] Error decrypting after save:`, e);
      doc.responses = {};
    }
  } else if (doc) {
    doc.responses = doc.responses || {};
  }
});

PreparationSchema.index({ userId: 1 });

module.exports = mongoose.model('Preparation', PreparationSchema);
