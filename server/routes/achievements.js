const express = require('express');
const auth = require('../middleware/auth');
const Achievement = require('../models/Achievement');
const Addiction = require('../models/Addiction');

const router = express.Router();

// Define milestone achievements
const MILESTONES = {
  1: { name: '24 Hours', icon: '⏰', description: 'Made it through your first day!' },
  3: { name: '3 Days', icon: '🌟', description: 'Three days sober! The hardest part is here.' },
  7: { name: '1 Week', icon: '📅', description: 'One week! You\'re past the peak withdrawal.' },
  14: { name: '2 Weeks', icon: '💪', description: 'Two weeks strong! Keep the momentum!' },
  30: { name: '1 Month', icon: '🎉', description: 'ONE MONTH! Major milestone achieved!' },
  60: { name: '2 Months', icon: '🚀', description: 'Two months! Your body is healing!' },
  90: { name: '3 Months', icon: '👑', description: 'THREE MONTHS! You\'re crushing it!' },
  180: { name: '6 Months', icon: '🌈', description: 'SIX MONTHS! You\'re unstoppable!' },
  365: { name: '1 Year', icon: '🏆', description: 'ONE YEAR FREE! You did it! Complete transformation!' }
};

// Get all achievements for user
router.get('/', auth, async (req, res) => {
  try {
    const achievements = await Achievement.find({ userId: req.user.userId }).sort({ unreadAt: -1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get unread achievements
router.get('/unread', auth, async (req, res) => {
  try {
    const achievements = await Achievement.find({ userId: req.user.userId, readAt: null }).sort({ unreadAt: -1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark achievement as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const achievement = await Achievement.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { readAt: Date.now() },
      { new: true }
    );
    res.json(achievement);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check and create achievements for an addiction
router.post('/check/:addictionId', auth, async (req, res) => {
  try {
    const addiction = await Addiction.findOne({
      _id: req.params.addictionId,
      userId: req.user.userId
    });

    if (!addiction) {
      return res.status(404).json({ message: 'Addiction not found' });
    }

    const daysStopped = addiction.getDaysStopped();
    const newAchievements = [];

    // Check each milestone
    for (const [days, milestone] of Object.entries(MILESTONES)) {
      const daysNum = parseInt(days);
      if (daysStopped >= daysNum) {
        // Check if achievement already exists
        const existingAchievement = await Achievement.findOne({
          userId: req.user.userId,
          milestoneDays: daysNum,
          addictionId: req.params.addictionId
        });

        if (!existingAchievement) {
          const newAchievement = new Achievement({
            userId: req.user.userId,
            name: milestone.name,
            description: milestone.description,
            icon: milestone.icon,
            milestoneDays: daysNum,
            addictionId: req.params.addictionId
          });
          await newAchievement.save();
          newAchievements.push(newAchievement);
        }
      }
    }

    res.json(newAchievements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
