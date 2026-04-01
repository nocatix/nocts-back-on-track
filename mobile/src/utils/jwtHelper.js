import jwt from 'jsonwebtoken';
import { saveSecure, getSecure, removeSecure } from './encryption';

const JWT_SECRET = 'noctsBackOnTrackLocalSecret123!@#'; // Local secret for offline use

export const createToken = (userId, username) => {
  const token = jwt.sign(
    { userId, username },
    JWT_SECRET,
    { expiresIn: '365d' } // Long expiry for offline use
  );
  return token;
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

export const saveToken = async (token) => {
  await saveSecure('authToken', token);
};

export const getToken = async () => {
  return await getSecure('authToken');
};

export const removeToken = async () => {
  await removeSecure('authToken');
};

export const isTokenValid = async () => {
  const token = await getToken();
  if (!token) return false;
  
  const decoded = verifyToken(token);
  return decoded !== null;
};
