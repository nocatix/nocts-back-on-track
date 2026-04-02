/**
 * Addiction Routes
 * Handles CRUD operations for user addictions
 * All routes require authentication
 */

const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Addiction = require('../models/Addiction');
const Achievement = require('../models/Achievement');
const Trophy = require('../models/Trophy');

const router = express.Router();

/**
 * Helper function to extract addiction type from name
 * Removes emoji prefix and returns the addiction type name
 * @param {string} name - Full addiction name with emoji (e.g., "🍺 Alcohol")
 * @returns {string} Addiction type without emoji (e.g., "Alcohol")
 */
function extractAddictionType(name) {
  if (!name) return null;
  // Remove emoji and extra spaces: "🍺 Alcohol" -> "Alcohol"
  return name.replace(/^[^\w\s]+\s*/, '').trim();
}

/**
 * Helper function to enrich addiction data with calculated metrics
 * @param {Object} addiction - Mongoose addiction document
 * @returns {Object} Enriched addiction object with addiction type and calculated fields
 */
function enrichAddictionData(addiction) {
  const addictionData = addiction.toObject();
  addictionData.daysStopped = addiction.getDaysStopped();
  addictionData.totalMoneySaved = addiction.getTotalMoneySaved();
  addictionData.addictionType = extractAddictionType(addictionData.name);
  addictionData.daysUntilPlannedStop = addiction.getDaysUntilPlannedStop();
  addictionData.hasActivePlannedStop = addiction.hasActivePlannedStop();
  return addictionData;
}

/**
 * @route   GET /api/addictions
 * @desc    Get all addictions for the authenticated user
 * @access  Private (requires JWT token)
 * @returns {Array} Array of addiction objects with calculated days and money saved
 */
router.get('/', auth, async (req, res) => {
  try {
    // Fetch all addictions for this user
    const addictions = await Addiction.find({ userId: req.user.userId });
    
    // Enrich addiction data with calculated metrics and addiction type
    const addictionsWithData = addictions.map(addiction => enrichAddictionData(addiction));
    res.json(addictionsWithData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/addictions/:id
 * @desc    Get a single addiction by ID
 * @access  Private (requires JWT token)
 * @param   {string} id - Addiction MongoDB ID
 * @returns {Object} Single addiction object with calculated metrics
 */
router.get('/:id', auth, async (req, res) => {
  try {
    // Find addiction matching both ID and user ownership
    const addiction = await Addiction.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!addiction) {
      return res.status(404).json({ message: 'Addiction not found' });
    }
    
    // Add calculated metrics and addiction type to response
    res.json(enrichAddictionData(addiction));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   POST /api/addictions
 * @desc    Create a new addiction for the user
 * @access  Private (requires JWT token)
 * @param   {string} name - Addiction name with emoji (e.g., "🍺 Alcohol")
 * @param   {date} stopDate - Date when user quit the addiction
 * @param   {number} frequencyPerDay - How many times per day (addiction-specific unit)
 * @param   {number} moneySpentPerDay - Cost per frequency unit
 * @param   {string} notes - Optional user notes
 * @returns {Object} Created addiction object
 */
router.post('/', auth, async (req, res) => {
  try {
    const { name, stopDate, frequencyPerDay, moneySpentPerDay, notes } = req.body;
    
    // Validate all required fields
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
    res.status(201).json(enrichAddictionData(addiction));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   PUT /api/addictions/:id
 * @desc    Update an addiction
 * @access  Private (requires JWT token)
 * @param   {string} id - Addiction MongoDB ID
 * @returns {Object} Updated addiction object
 */
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
    
    // Recalculate achievements and trophies for this updated addiction
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

    const daysStopped = addiction.getDaysStopped();
    console.log(`[Edit Addiction] ID: ${req.params.id}, daysStopped: ${daysStopped}`);
    
    // Remove achievements for this addiction that are no longer valid (milestones beyond current days)
    const allMilestoneDays = Object.keys(MILESTONES).map(Number);
    const invalidMilestones = allMilestoneDays.filter(days => days > daysStopped);
    
    console.log(`[Edit Addiction] invalidMilestones: ${invalidMilestones.join(', ')}`);
    
    if (invalidMilestones.length > 0) {
      const deleteResult = await Achievement.deleteMany({
        userId: req.user.userId,
        addictionId: new mongoose.Types.ObjectId(req.params.id),
        milestoneDays: { $in: invalidMilestones }
      });
      console.log(`[Edit Addiction] Deleted ${deleteResult.deletedCount} invalid achievements`);
    }
    
    // Check each milestone and update achievements
    const addictionObjectId = new mongoose.Types.ObjectId(req.params.id);
    for (const [days, milestone] of Object.entries(MILESTONES)) {
      const daysNum = parseInt(days);
      if (daysStopped >= daysNum) {
        // Use findOneAndUpdate with upsert to create/update achievement
        await Achievement.findOneAndUpdate(
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
      }
    }
    
    // Clear all trophies for the user so they can be recalculated based on new addiction dates
    // This ensures trophy progress is accurate when addiction dates change
    const trophyDeleteResult = await Trophy.deleteMany({ userId: req.user.userId });
    console.log(`[Edit Addiction] Deleted ${trophyDeleteResult.deletedCount} trophies`);
    
    res.json(enrichAddictionData(addiction));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   PUT /api/addictions/:id/planned-stop-date
 * @desc    Set a planned stop date for an addiction
 * @access  Private (requires JWT token)
 * @param   {string} id - Addiction MongoDB ID
 * @param   {date} plannedStopDate - The date user plans to stop (or null to clear)
 * @returns {Object} Updated addiction object
 */
router.put('/:id/planned-stop-date', auth, async (req, res) => {
  try {
    const { plannedStopDate } = req.body;
    
    // Validate that plannedStopDate is either null or a valid future date
    if (plannedStopDate !== null) {
      const date = new Date(plannedStopDate);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
      // Optionally: ensure the date is in the future
      if (date <= new Date()) {
        return res.status(400).json({ message: 'Planned stop date must be in the future' });
      }
    }
    
    // Find the addiction and verify ownership
    const addiction = await Addiction.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!addiction) {
      return res.status(404).json({ message: 'Addiction not found' });
    }
    
    // Update the planned stop date
    addiction.plannedStopDate = plannedStopDate ? new Date(plannedStopDate) : null;
    addiction.updatedAt = new Date();
    await addiction.save();
    
    res.json(enrichAddictionData(addiction));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   PUT /api/addictions/:id/caved
 * @desc    Mark addiction as relapsed - resets stopDate to today and removes achievements
 * @access  Private (requires JWT token)
 * @returns {Object} Updated addiction object
 */
router.put('/:id/caved', auth, async (req, res) => {
  try {
    // Find the addiction and verify it belongs to the user
    const addiction = await Addiction.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!addiction) {
      return res.status(404).json({ message: 'Addiction not found' });
    }

    // Reset the stop date to today (timestamp when they caved)
    addiction.stopDate = new Date();
    addiction.updatedAt = new Date();
    await addiction.save();

    // Remove all achievements and trophies for this addiction
    await Promise.all([
      Achievement.deleteMany({
        userId: req.user.userId,
        addictionId: addiction._id
      }),
      Trophy.deleteMany({ userId: req.user.userId })
    ]);

    res.json(enrichAddictionData(addiction));
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

    // Remove records that should not remain after this addiction is deleted.
    await Promise.all([
      Achievement.deleteMany({
        userId: req.user.userId,
          addictionId: addiction._id
      }),
      Trophy.deleteMany({ userId: req.user.userId })
    ]);
    
    res.json({ message: 'Addiction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
