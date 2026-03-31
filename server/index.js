require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const addictionRoutes = require('./routes/addictions');
const achievementRoutes = require('./routes/achievements');
const diaryRoutes = require('./routes/diary');
const moodRoutes = require('./routes/moods');
const weightRoutes = require('./routes/weights');
const memoryRoutes = require('./routes/memories');
const trophyRoutes = require('./routes/trophies');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/addictions', addictionRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/weights', weightRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/trophies', trophyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
