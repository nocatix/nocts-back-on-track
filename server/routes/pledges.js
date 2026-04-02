/**
 * Pledge Routes
 * Handles CRUD operations for user pledges (independent stop date commitments)
 * All routes require authentication
 */

const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Pledge = require('../models/Pledge');
const Addiction = require('../models/Addiction');

const router = express.Router();

/**
 * Helper function to extract addiction type from name
 */
function extractAddictionType(name) {
  if (!name) return null;
  // Remove emoji and extra spaces: "🍺 Alcohol" -> "Alcohol"
  return name.replace(/^[^\w\s]+\s*/, '').trim();
}

/**
 * Helper function to enrich addiction data
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
 * Helper function to enrich pledge data with calculated metrics
 * @param {Object} pledge - Mongoose pledge document
 * @returns {Object} Enriched pledge object with calculated fields
 */
function enrichPledgeData(pledge) {
  const pledgeData = pledge.toObject();
  pledgeData.daysUntilStop = pledge.getDaysUntilStop();
  return pledgeData;
}

/**
 * @route   GET /api/pledges
 * @desc    Get all pledges for the authenticated user
 * @access  Private (requires JWT token)
 * @returns {Array} Array of pledge objects with calculated days remaining
 */
router.get('/', auth, async (req, res) => {
  try {
    const pledges = await Pledge.find({ userId: req.user.userId });
    const pledgesWithData = pledges.map(pledge => enrichPledgeData(pledge));
    res.json(pledgesWithData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   POST /api/pledges
 * @desc    Create a new pledge
 * @access  Private (requires JWT token)
 * @body    {
 *   what: string (required) - What the user pledges to stop
 *   plannedStopDate: Date (required) - When they commit to stopping (must be future date)
 * }
 * @returns {Object} Created pledge with enriched data
 */
router.post('/', auth, async (req, res) => {
  try {
    const { what, plannedStopDate } = req.body;

    if (!what || !plannedStopDate) {
      return res.status(400).json({ message: 'Missing required fields: what, plannedStopDate' });
    }

    // Validate plannedStopDate is in the future
    const stopDate = new Date(plannedStopDate);
    const now = new Date();
    if (stopDate <= now) {
      return res.status(400).json({ message: 'Stop date must be in the future' });
    }

    const pledge = new Pledge({
      userId: req.user.userId,
      what: what.trim(),
      plannedStopDate: stopDate
    });

    await pledge.save();
    const enrichedPledge = enrichPledgeData(pledge);
    res.status(201).json(enrichedPledge);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   DELETE /api/pledges/:id
 * @desc    Delete a pledge
 * @access  Private (requires JWT token)
 * @params  id - Pledge ID
 * @returns {Object} Success message
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid pledge ID' });
    }

    const pledge = await Pledge.findById(id);
    if (!pledge) {
      return res.status(404).json({ message: 'Pledge not found' });
    }

    // Check authorization
    if (pledge.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this pledge' });
    }

    await Pledge.findByIdAndDelete(id);
    res.json({ message: 'Pledge deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   PUT /api/pledges/:id
 * @desc    Update a pledge's stop date
 * @access  Private (requires JWT token)
 * @params  id - Pledge ID
 * @body    {
 *   plannedStopDate: Date (required) - New stop date (must be future date)
 * }
 * @returns {Object} Updated pledge with enriched data
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { plannedStopDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid pledge ID' });
    }

    if (!plannedStopDate) {
      return res.status(400).json({ message: 'Missing required field: plannedStopDate' });
    }

    const pledge = await Pledge.findById(id);
    if (!pledge) {
      return res.status(404).json({ message: 'Pledge not found' });
    }

    // Check authorization
    if (pledge.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this pledge' });
    }

    // Validate plannedStopDate is in the future
    const stopDate = new Date(plannedStopDate);
    const now = new Date();
    if (stopDate <= now) {
      return res.status(400).json({ message: 'Stop date must be in the future' });
    }

    // Update pledge
    pledge.plannedStopDate = stopDate;
    await pledge.save();

    const enrichedPledge = enrichPledgeData(pledge);
    res.json(enrichedPledge);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @desc    Convert a pledge into an addiction record (when stop date arrives)
 * @access  Private (requires JWT token)
 * @params  id - Pledge ID
 * @body    (no required body)
 * @returns {Object} Created addiction with enriched data
 */
router.post('/:id/convert-to-addiction', auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid pledge ID' });
    }

    const pledge = await Pledge.findById(id);
    if (!pledge) {
      return res.status(404).json({ message: 'Pledge not found' });
    }

    // Check authorization
    if (pledge.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to convert this pledge' });
    }

    // Create addiction with stop date = today
    const addiction = new Addiction({
      userId: pledge.userId,
      name: pledge.what,
      stopDate: new Date(),
      frequencyPerDay: 1,
      moneySpentPerDay: 0,
      notes: `Converted from pledge on ${new Date().toLocaleDateString()}`
    });

    await addiction.save();

    // Delete the pledge
    await Pledge.findByIdAndDelete(id);

    // Return enriched addiction
    const enrichedAddiction = enrichAddictionData(addiction);
    res.status(201).json(enrichedAddiction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
