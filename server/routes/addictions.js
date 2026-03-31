const express = require('express');
const auth = require('../middleware/auth');
const Addiction = require('../models/Addiction');

const router = express.Router();

// Get all addictions for user
router.get('/', auth, async (req, res) => {
  try {
    const addictions = await Addiction.find({ userId: req.user.userId });
    const addictionsWithDays = addictions.map(addiction => {
      const addictionData = addiction.toObject();
      addictionData.daysStopped = addiction.getDaysStopped();
      addictionData.totalMoneySaved = addiction.getTotalMoneySaved();
      return addictionData;
    });
    res.json(addictionsWithDays);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single addiction
router.get('/:id', auth, async (req, res) => {
  try {
    const addiction = await Addiction.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!addiction) {
      return res.status(404).json({ message: 'Addiction not found' });
    }
    
    const addictionData = addiction.toObject();
    addictionData.daysStopped = addiction.getDaysStopped();
    addictionData.totalMoneySaved = addiction.getTotalMoneySaved();
    
    res.json(addictionData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new addiction
router.post('/', auth, async (req, res) => {
  try {
    const { name, stopDate, frequencyPerDay, moneySpentPerDay, notes } = req.body;
    
    if (!name || !stopDate || frequencyPerDay === undefined || moneySpentPerDay === undefined) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    
    const addiction = new Addiction({
      userId: req.user.userId,
      name,
      stopDate: new Date(stopDate),
      frequencyPerDay,
      moneySpentPerDay,
      notes
    });
    
    await addiction.save();
    res.status(201).json(addiction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update addiction
router.put('/:id', auth, async (req, res) => {
  try {
    const addiction = await Addiction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!addiction) {
      return res.status(404).json({ message: 'Addiction not found' });
    }
    
    res.json(addiction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete addiction
router.delete('/:id', auth, async (req, res) => {
  try {
    const addiction = await Addiction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!addiction) {
      return res.status(404).json({ message: 'Addiction not found' });
    }
    
    res.json({ message: 'Addiction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
