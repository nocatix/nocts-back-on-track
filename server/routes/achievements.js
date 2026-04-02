const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Achievement = require('../models/Achievement');
const Addiction = require('../models/Addiction');

const router = express.Router();

// Async error handling wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

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
router.get('/', auth, asyncHandler(async (req, res) => {
  // Keep achievements in sync with addiction data.
  const addictions = await Addiction.find({ userId: req.user.userId });
  if (addictions.length === 0) {
    await Achievement.deleteMany({ userId: req.user.userId });
    return res.json([]);
  }

  let achievements = await Achievement.find({ userId: req.user.userId })
    .populate('addictionId', 'name')
    .sort({ unreadAt: -1 });
  
  console.log(`[Get Achievements] Found ${achievements.length} achievements:`);
  achievements.forEach(a => {
    console.log(`  - ${a.milestoneDays}d: ${a.name} (addictionId: ${a.addictionId?._id} type: ${typeof a.addictionId?._id}) (raw: ${JSON.stringify(a.addictionId)})`);
  });
  
  // Validate achievements - only return those where daysStopped >= milestoneDays
  achievements = achievements.filter(achievement => {
    const addiction = addictions.find(a => {
      // Handle both ObjectId and string comparison
      const addictionIdStr = a._id.toString();
      const achievementAddictionIdStr = achievement.addictionId?._id?.toString();
      return addictionIdStr === achievementAddictionIdStr;
    });
    
    if (!addiction) {
      return false; // Addiction not found, filter out this achievement
    }
    
    const daysStopped = addiction.getDaysStopped();
    const isValid = daysStopped >= achievement.milestoneDays;
    console.log(`  - Validating ${achievement.milestoneDays}d: daysStopped=${daysStopped}, required=${achievement.milestoneDays}, valid=${isValid}`);
    return isValid;
  });
  
  // Deduplicate achievements (in case of duplicates from before unique index was added)
  const seen = new Set();
  achievements = achievements.filter(achievement => {
    const key = `${achievement.milestoneDays}-${achievement.addictionId?._id || 'null'}`;
    if (seen.has(key)) {
      return false; // Filter out duplicate
    }
    seen.add(key);
    return true;
  });
  
  res.json(achievements);
}));

// Get unread achievements
router.get('/unread', auth, asyncHandler(async (req, res) => {
  const addictions = await Addiction.find({ userId: req.user.userId });
  if (addictions.length === 0) {
    await Achievement.deleteMany({ userId: req.user.userId });
    return res.json([]);
  }

  let achievements = await Achievement.find({ userId: req.user.userId, readAt: null })
    .populate('addictionId', 'name')
    .sort({ unreadAt: -1 });
  
  // Validate achievements - only return those where daysStopped >= milestoneDays
  achievements = achievements.filter(achievement => {
    const addiction = addictions.find(a => {
      // Handle both ObjectId and string comparison
      const addictionIdStr = a._id.toString();
      const achievementAddictionIdStr = achievement.addictionId?._id?.toString();
      return addictionIdStr === achievementAddictionIdStr;
    });
    
    if (!addiction) {
      return false; // Addiction not found, filter out this achievement
    }
    
    const daysStopped = addiction.getDaysStopped();
    return daysStopped >= achievement.milestoneDays;
  });
  
  // Deduplicate achievements (in case of duplicates from before unique index was added)
  const seen = new Set();
  achievements = achievements.filter(achievement => {
    const key = `${achievement.milestoneDays}-${achievement.addictionId?._id || 'null'}`;
    if (seen.has(key)) {
      return false; // Filter out duplicate
    }
    seen.add(key);
    return true;
  });
  
  res.json(achievements);
}));

// Mark achievement as read
router.put('/:id/read', auth, asyncHandler(async (req, res) => {
  const achievement = await Achievement.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    { readAt: Date.now() },
    { new: true }
  );
  if (!achievement) {
    return res.status(404).json({ message: 'Achievement not found' });
  }
  res.json(achievement);
}));

// Check and create achievements for an addiction
router.post('/check/:addictionId', auth, asyncHandler(async (req, res) => {
  const addiction = await Addiction.findOne({
    _id: req.params.addictionId,
    userId: req.user.userId
  });

  if (!addiction) {
    return res.status(404).json({ message: 'Addiction not found' });
  }

  const daysStopped = addiction.getDaysStopped();
  console.log(`[Achievement Check] addictionId: ${req.params.addictionId}, daysStopped: ${daysStopped}`);
  
  // First, remove any achievements for milestones not yet reached
  const allMilestoneDays = Object.keys(MILESTONES).map(Number);
  const invalidMilestones = allMilestoneDays.filter(days => days > daysStopped);
  
  console.log(`[Achievement Check] invalidMilestones: ${invalidMilestones.join(', ')}`);
  
  if (invalidMilestones.length > 0) {
    const deleteResult = await Achievement.deleteMany({
      userId: req.user.userId,
      addictionId: new mongoose.Types.ObjectId(req.params.addictionId),
      milestoneDays: { $in: invalidMilestones }
    });
    console.log(`[Achievement Check] Deleted ${deleteResult.deletedCount} invalid achievements`);
  }

  const newAchievements = [];
  const addictionObjectId = new mongoose.Types.ObjectId(req.params.addictionId);

  // Check each milestone and create/update atomically
  for (const [days, milestone] of Object.entries(MILESTONES)) {
    const daysNum = parseInt(days);
    if (daysStopped >= daysNum) {
      // Use findOneAndUpdate with upsert to prevent duplicates
      const achievement = await Achievement.findOneAndUpdate(
        {
          userId: req.user.userId,
          milestoneDays: daysNum,
          addictionId: addictionObjectId
        },
        {
          userId: req.user.userId,
          name: milestone.name,
          description: milestone.description,
          icon: milestone.icon,
          milestoneDays: daysNum,
          addictionId: addictionObjectId,
          unreadAt: new Date()
        },
        { upsert: true, new: true }
      );
      
      // Only add to newAchievements if it was just created (createdAt is very recent)
      const isNewlyCreated = Date.now() - new Date(achievement.createdAt).getTime() < 1000;
      if (isNewlyCreated) {
        newAchievements.push(achievement);
      }
    }
  }

  res.json(newAchievements);
}));

module.exports = router;
