/**
 * Authentication Routes
 * Handles user registration, login, profile management, and account deletion
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const auth = require('../middleware/auth');
const Addiction = require('../models/Addiction');
const Achievement = require('../models/Achievement');
const Trophy = require('../models/Trophy');
const Diary = require('../models/Diary');
const Memory = require('../models/Memory');
const Mood = require('../models/Mood');
const Weight = require('../models/Weight');
const { createLogger } = require('../utils/logger');

const router = express.Router();
const logger = createLogger({ name: 'backend:auth' });

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts. Please try again later.' },
});

/**
 * @route   POST /api/auth/register
 * @desc    Create a new user account
 * @param   {string} username - Unique user identifier
 * @param   {string} fullName - User's full name
 * @param   {string} password - User's password (will be hashed)
 * @returns {Object} JWT token and user info
 */
router.post('/register', authRateLimit, async (req, res) => {
  try {
    const { username, password } = req.body;
    logger.verbose('Registration attempt', {
      username,
      hasPassword: Boolean(password),
      origin: req.get('origin'),
      ip: req.ip,
    });
    
    // Validate all required fields are provided
    if (!username || !password) {
      logger.warn('Registration rejected due to missing fields', { username });
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      logger.info('Registration rejected because username already exists', { username });
      return res.status(409).json({ message: 'Username already taken' });
    }
    
    // Create new user (password will be hashed by User model pre-save middleware)
    const user = new User({ username, password });
    await user.save();
    logger.info('Registration successful', { userId: user._id, username: user.username });
    
    // Generate JWT token for immediate login
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, username: user.username }
    });
  } catch (error) {
    logger.error('Registration failed', {
      message: error.message,
      stack: error.stack,
      username: req.body?.username,
    });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT token
 * @param   {string} username - User's username
 * @param   {string} password - User's password
 * @returns {Object} JWT token and user info
 */
router.post('/login', authRateLimit, async (req, res) => {
  try {
    const { username, password } = req.body;
    logger.verbose('Login attempt', {
      username,
      hasPassword: Boolean(password),
      origin: req.get('origin'),
      ip: req.ip,
    });
    
    // Validate required fields
    if (!username || !password) {
      logger.warn('Login rejected due to missing fields', { username });
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      logger.info('Login rejected because user was not found', { username });
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      logger.info('Login rejected because password was invalid', { username, userId: user._id });
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, fullName: user.fullName }
    });
  } catch (error) {
    logger.error('Login failed', {
      message: error.message,
      stack: error.stack,
      username: req.body?.username,
    });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user's information
 * @access  Private (requires JWT token)
 * @returns {Object} User info including unit preference
 */
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      user: { id: user._id, username: user.username, fullName: user.fullName, unitPreference: user.unitPreference, language: user.language }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update Profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { fullName } = req.body;
    
    if (!fullName) {
      return res.status(400).json({ message: 'Full name is required' });
    }
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.fullName = fullName;
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: { id: user._id, username: user.username, fullName: user.fullName, unitPreference: user.unitPreference, language: user.language }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Change Password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    if (!/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return res.status(400).json({ message: 'Password must contain at least one uppercase letter and one number' });
    }
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update Unit Preference
router.put('/unit-preference', auth, async (req, res) => {
  try {
    const { unitPreference } = req.body;
    
    if (!unitPreference || !['imperial', 'metric'].includes(unitPreference)) {
      return res.status(400).json({ message: 'Invalid unit preference' });
    }
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.unitPreference = unitPreference;
    await user.save();
    
    res.json({
      message: 'Unit preference updated successfully',
      unitPreference: user.unitPreference
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update Language Preference
router.put('/language', auth, async (req, res) => {
  try {
    const { language } = req.body;
    const validLanguages = ['en', 'en-simple', 'de', 'es', 'fr', 'ru', 'zh', 'ja', 'ar'];
    
    if (!language || !validLanguages.includes(language)) {
      return res.status(400).json({ message: 'Invalid language preference' });
    }
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.language = language;
    await user.save();
    
    res.json({
      message: 'Language preference updated successfully',
      language: user.language
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reset all user progress data but keep account
router.post('/reset-progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await Promise.all([
      Addiction.deleteMany({ userId: req.user.userId }),
      Achievement.deleteMany({ userId: req.user.userId }),
      Trophy.deleteMany({ userId: req.user.userId }),
      Diary.deleteMany({ userId: req.user.userId }),
      Memory.deleteMany({ userId: req.user.userId }),
      Mood.deleteMany({ userId: req.user.userId }),
      Weight.deleteMany({ userId: req.user.userId })
    ]);

    // Restart account-age based progress systems (e.g. trophies)
    user.createdAt = new Date();
    await user.save();

    res.json({ message: 'All progress has been reset. You can start fresh now.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete Account
router.delete('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
