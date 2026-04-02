require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/auth');
const addictionRoutes = require('./routes/addictions');
const achievementRoutes = require('./routes/achievements');
const diaryRoutes = require('./routes/diary');
const moodRoutes = require('./routes/moods');
const weightRoutes = require('./routes/weights');
const memoryRoutes = require('./routes/memories');
const trophyRoutes = require('./routes/trophies');
const pledgeRoutes = require('./routes/pledges');
const preparationRoutes = require('./routes/preparation');
const { createIPWhitelistMiddleware } = require('./utils/ipWhitelist');

const app = express();

// Security Middleware
app.use(helmet());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS configuration
const getAllowedOrigins = () => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const allowedOrigins = [clientUrl];

  allowedOrigins.push(
    'http://localhost:3000',
    'http://localhost:5000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5000',
    /^http:\/\/192\.168\..*/,
    /^http:\/\/10\..*/,
    /^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\..*/,
    'http://host.docker.internal:3000'
  );

  return {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
};

app.use(cors(getAllowedOrigins()));

// IP Whitelist Middleware
const ipWhitelist = process.env.IP_WHITELIST || '127.0.0.0/8,192.168.2.0/24,10.0.0.0/8';
app.use(createIPWhitelistMiddleware(ipWhitelist));

// Force HTTPS redirect (with exceptions for local network)
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure && req.get('x-forwarded-proto') !== 'https') {
    const host = req.get('host') || '';
    const isLocalConnection =
      host.includes('localhost') ||
      host.includes('127.0.0.1') ||
      host.match(/^192\.168/) ||
      host.match(/^10\./) ||
      host.match(/^172\.(1[6-9]|2[0-9]|3[0-1])/) ||
      host === 'host.docker.internal';

    if (!isLocalConnection) {
      return res.redirect('https://' + host + req.url);
    }
  }
  next();
});

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  if (req.path.startsWith('/api')) {
    res.setHeader('Content-Type', 'application/json');
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/addictions', addictionRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/weights', weightRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/trophies', trophyRoutes);
app.use('/api/pledges', pledgeRoutes);
app.use('/api/preparation', preparationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  res.setHeader('Content-Type', 'application/json');

  const status = err.status || res.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    message,
    error: process.env.NODE_ENV === 'production' ? {} : { stack: err.stack }
  });
});

module.exports = app;
