const express = require('express');
const Mood = require('../models/Mood');
const auth = require('../middleware/auth');

const router = express.Router();

// Create or update mood for a specific date
router.post('/', auth, async (req, res) => {
  try {
    const { date, primaryMood, secondaryMood, intensity, notes, triggers } = req.body;

    if (!date || !primaryMood) {
      return res.status(400).json({ message: 'Date and primary mood are required' });
    }

    // Convert date to start of day (no time component)
    const moodDate = new Date(date);
    moodDate.setHours(0, 0, 0, 0);

    let mood = await Mood.findOne({
      userId: req.user.userId,
      date: moodDate
    });

    if (mood) {
      // Update existing mood
      mood.primaryMood = primaryMood;
      mood.secondaryMood = secondaryMood;
      mood.intensity = intensity;
      mood.notes = notes;
      mood.triggers = triggers;
    } else {
      // Create new mood
      mood = new Mood({
        userId: req.user.userId,
        date: moodDate,
        primaryMood,
        secondaryMood,
        intensity,
        notes,
        triggers
      });
    }

    await mood.save();
    res.json(mood);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving mood' });
  }
});

// Get moods for a specific month
router.get('/month/:year/:month', auth, async (req, res) => {
  try {
    const { year, month } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const moods = await Mood.find({
      userId: req.user.userId,
      date: { $gte: startDate, $lt: endDate }
    }).sort({ date: 1 });

    res.json(moods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching moods' });
  }
});

// Get mood for a specific date
router.get('/:date', auth, async (req, res) => {
  try {
    const moodDate = new Date(req.params.date);
    moodDate.setHours(0, 0, 0, 0);

    const mood = await Mood.findOne({
      userId: req.user.userId,
      date: moodDate
    });

    res.json(mood || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching mood' });
  }
});

// Delete mood for a specific date
router.delete('/:date', auth, async (req, res) => {
  try {
    const moodDate = new Date(req.params.date);
    moodDate.setHours(0, 0, 0, 0);

    const result = await Mood.deleteOne({
      userId: req.user.userId,
      date: moodDate
    });

    res.json({ message: 'Mood deleted', deletedCount: result.deletedCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting mood' });
  }
});

module.exports = router;
