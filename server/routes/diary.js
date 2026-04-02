const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Diary = require('../models/Diary');

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

// Get diary entry for a specific date
router.get('/:date', verifyToken, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const entry = await Diary.findOne({
      userId: req.userId,
      date: { $gte: startOfDay, $lt: endOfDay }
    });

    res.json(entry ? entry.toObject() : { content: '' });
  } catch (error) {
    console.error('Error fetching diary entry:', error);
    res.status(500).json({ error: 'Failed to fetch diary entry', details: error.message });
  }
});

// Get all diary entries for a user
router.get('/', verifyToken, async (req, res) => {
  try {
    const entries = await Diary.find({ userId: req.userId }).sort({ date: -1 });
    res.json(entries.map(entry => entry.toObject()));
  } catch (error) {
    console.error('Error fetching diary entries:', error);
    res.status(500).json({ error: 'Failed to fetch diary entries', details: error.message });
  }
});

// Create or update diary entry for a date
router.post('/:date', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    const date = new Date(req.params.date);
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    let entry = await Diary.findOne({
      userId: req.userId,
      date: { $gte: startOfDay, $lt: endOfDay }
    });

    if (entry) {
      entry.content = content;
      entry.updatedAt = new Date();
    } else {
      entry = new Diary({
        userId: req.userId,
        date: startOfDay,
        content
      });
    }

    await entry.save();
    res.json(entry.toObject());
  } catch (error) {
    console.error('Error saving diary entry:', error);
    res.status(500).json({ error: 'Failed to save diary entry', details: error.message });
  }
});

// Delete diary entry
router.delete('/:date', verifyToken, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    await Diary.findOneAndDelete({
      userId: req.userId,
      date: { $gte: startOfDay, $lt: endOfDay }
    });

    res.json({ message: 'Diary entry deleted' });
  } catch (error) {
    console.error('Error deleting diary entry:', error);
    res.status(500).json({ error: 'Failed to delete diary entry', details: error.message });
  }
});

module.exports = router;
