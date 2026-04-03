const mongoose = require('mongoose');
const { createLogger, redact } = require('../utils/logger');

const logger = createLogger({ name: 'backend:db' });

mongoose.set('debug', (collectionName, methodName, ...methodArgs) => {
  logger.verbose('MongoDB query', {
    collectionName,
    methodName,
    args: redact(methodArgs),
  });
});

mongoose.connection.on('connected', () => {
  logger.info('MongoDB connected');
});

mongoose.connection.on('error', (error) => {
  logger.error('MongoDB connection error', { message: error.message, stack: error.stack });
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.critical('MongoDB connection failed', {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

module.exports = connectDB;
