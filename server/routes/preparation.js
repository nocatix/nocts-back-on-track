const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Preparation = require('../models/Preparation');
const { decrypt } = require('../utils/encryption');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Helper to get decrypted responses
const getDecryptedResponses = (responses) => {
  if (!responses) return {};
  if (responses.encrypted && responses.iv && responses.authTag) {
    try {
      const decrypted = decrypt(responses);
      console.log('[Preparation Helper] Decrypted responses:', decrypted);
      return JSON.parse(decrypted);
    } catch (e) {
      console.error('[Preparation Helper] Error decrypting:', e);
      return {};
    }
  }
  return responses;
};

// Get preparation data for user
router.get('/', verifyToken, async (req, res) => {
  try {
    console.log(`[Preparation GET] Fetching for user ${req.userId}`);
    let prep = await Preparation.findOne({ userId: req.userId });
    
    let responses = {};
    if (prep && prep.responses) {
      responses = getDecryptedResponses(prep.responses);
    }
    
    console.log(`[Preparation GET] Returning responses:`, responses);
    res.json({ responses });
  } catch (error) {
    console.error('[Preparation GET] Error fetching preparation:', error);
    res.status(500).json({ error: 'Failed to fetch preparation data' });
  }
});

// Update a specific preparation response
router.put('/:fieldId', verifyToken, async (req, res) => {
  try {
    const { fieldId } = req.params;
    const { text } = req.body;
    
    console.log(`[Preparation PUT] Updating field ${fieldId} for user ${req.userId}:`, text);

    let prep = await Preparation.findOne({ userId: req.userId });

    if (!prep) {
      console.log(`[Preparation PUT] Creating new preparation record`);
      prep = new Preparation({
        userId: req.userId,
        responses: {}
      });
    }

    // Get decrypted responses
    const decryptedResponses = getDecryptedResponses(prep.responses);
    console.log(`[Preparation PUT] Current decrypted responses:`, decryptedResponses);
    
    // Create a NEW object with the updated field
    const updatedResponses = {
      ...decryptedResponses,
      [fieldId]: text
    };
    console.log(`[Preparation PUT] Updated responses:`, updatedResponses);
    
    prep.setResponsesData(updatedResponses);
    prep.updatedAt = new Date();

    const saved = await prep.save();
    console.log(`[Preparation PUT] Saved successfully`);
    
    // Return the updated responses
    res.json({ responses: updatedResponses });
  } catch (error) {
    console.error('[Preparation PUT] Error updating preparation:', error);
    res.status(500).json({ error: 'Failed to update preparation data', details: error.message });
  }
});

// Bulk update all preparation responses
router.post('/', verifyToken, async (req, res) => {
  try {
    const { responses } = req.body;
    console.log(`[Preparation POST] Bulk update for user ${req.userId}:`, responses);

    let prep = await Preparation.findOne({ userId: req.userId });

    if (!prep) {
      console.log(`[Preparation POST] Creating new preparation record`);
      prep = new Preparation({
        userId: req.userId,
        responses: {}
      });
    }

    prep.setResponsesData(responses || {});
    prep.updatedAt = new Date();
    const saved = await prep.save();
    console.log(`[Preparation POST] Saved successfully`);
    
    res.json({ responses: responses || {} });
  } catch (error) {
    console.error('[Preparation POST] Error saving preparation:', error);
    res.status(500).json({ error: 'Failed to save preparation data', details: error.message });
  }
});

module.exports = router;
