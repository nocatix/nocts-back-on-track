const express = require('express');
const router = express.Router();
const Memory = require('../models/Memory');
const auth = require('../middleware/auth');

// Create a new memory
router.post('/', auth, async (req, res) => {
  try {
    const { message, imageUrl } = req.body;

    if (!message && !imageUrl) {
      return res.status(400).json({ message: 'Please provide either a message or an image, or both' });
    }

    const memory = new Memory({
      userId: req.user.userId,
      message: message ? message : null,
      imageUrl: imageUrl ? imageUrl : null,
    });

    await memory.save();
    res.json(memory.toObject());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all memories for a user
router.get('/', auth, async (req, res) => {
  try {
    const memories = await Memory.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(memories.map(memory => memory.toObject()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a random memory for the user
router.get('/random', auth, async (req, res) => {
  try {
    const memories = await Memory.find({ userId: req.user.userId });
    
    if (memories.length === 0) {
      return res.json(null);
    }

    const randomMemory = memories[Math.floor(Math.random() * memories.length)];
    res.json(randomMemory.toObject());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a memory
router.delete('/:id', auth, async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    if (memory.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this memory' });
    }

    await Memory.deleteOne({ _id: req.params.id });
    res.json({ message: 'Memory deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
