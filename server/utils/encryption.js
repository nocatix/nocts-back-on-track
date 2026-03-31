const crypto = require('crypto');

// Use encryption key from environment or generate a default for development
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const ALGORITHM = 'aes-256-gcm';

/**
 * Encrypt sensitive data
 * @param {string} text - The text to encrypt
 * @returns {object} - Object containing encrypted data, iv, and authTag
 */
const encrypt = (text) => {
  if (!text) return null;

  const iv = crypto.randomBytes(16);
  const key = Buffer.from(ENCRYPTION_KEY, 'hex');
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  };
};

/**
 * Decrypt sensitive data
 * @param {object} data - Object containing encrypted data, iv, and authTag
 * @returns {string} - The decrypted text
 */
const decrypt = (data) => {
  if (!data || !data.encrypted) return null;

  const key = Buffer.from(ENCRYPTION_KEY, 'hex');
  const iv = Buffer.from(data.iv, 'hex');
  const authTag = Buffer.from(data.authTag, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(data.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

/**
 * Hash password using bcrypt
 * @param {string} password - The password to hash
 * @returns {string} - The hashed password
 */
const hashPassword = async (password) => {
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Compare password with hash
 * @param {string} password - The password to compare
 * @param {string} hash - The hashed password
 * @returns {boolean} - Whether passwords match
 */
const comparePassword = async (password, hash) => {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(password, hash);
};

module.exports = {
  encrypt,
  decrypt,
  hashPassword,
  comparePassword,
  ENCRYPTION_KEY,
};
