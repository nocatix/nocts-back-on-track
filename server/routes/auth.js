const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, fullName, password } = req.body;
    
    if (!username || !fullName || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already taken' });
    }
    
    const user = new User({ username, fullName, password });
    await user.save();
    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, username: user.username, fullName: user.fullName }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Current User
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      user: { id: user._id, username: user.username, fullName: user.fullName, unitPreference: user.unitPreference }
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
      user: { id: user._id, username: user.username, fullName: user.fullName, unitPreference: user.unitPreference }
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
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
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
