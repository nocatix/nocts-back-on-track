/**
 * Addiction Routes
 * Handles CRUD operations for user addictions
 * All routes require authentication
 */

const express = require('express');
const auth = require('../middleware/auth');
const Addiction = require('../models/Addiction');

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
    
    res.json({ message: 'Addiction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
