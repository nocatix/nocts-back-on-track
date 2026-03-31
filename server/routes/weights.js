const express = require('express');
const router = express.Router();
const Weight = require('../models/Weight');
const auth = require('../middleware/auth');

// Log weight
router.post('/', auth, async (req, res) => {
  try {
    const { weight, unit, date } = req.body;

    if (!weight || !unit || !date) {
      return res.status(400).json({ message: 'Weight, unit, and date are required' });
    }

    const weightEntry = new Weight({
      userId: req.user.userId,
      weight,
      unit,
      date: new Date(date)
    });

    await weightEntry.save();
    res.status(201).json(weightEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging weight' });
  }
});

// Get all weights for user
router.get('/', auth, async (req, res) => {
  try {
    const weights = await Weight.find({ userId: req.user.userId })
      .sort({ date: -1 });

    res.json(weights);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching weights' });
  }
});

// Get weights for date range
router.get('/range/:startDate/:endDate', auth, async (req, res) => {
  try {
    const start = new Date(req.params.startDate);
    const end = new Date(req.params.endDate);
    end.setHours(23, 59, 59, 999);

    const weights = await Weight.find({
      userId: req.user.userId,
      date: { $gte: start, $lte: end }
    }).sort({ date: -1 });

    res.json(weights);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching weights' });
  }
});

// Get weights for month
router.get('/month/:year/:month', auth, async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    end.setHours(23, 59, 59, 999);

    const weights = await Weight.find({
      userId: req.user.userId,
      date: { $gte: start, $lte: end }
    }).sort({ date: -1 });

    res.json(weights);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching weights' });
  }
});

// Delete weight entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const weight = await Weight.findById(req.params.id);
    
    if (!weight || weight.userId.toString() !== req.user.userId.toString()) {
      return res.status(404).json({ message: 'Weight entry not found' });
    }

    await Weight.deleteOne({ _id: req.params.id });
    res.json({ message: 'Weight entry deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting weight' });
  }
});

module.exports = router;
