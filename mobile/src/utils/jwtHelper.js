import jwtDecode from 'jwt-decode';
import { saveSecure, getSecure, removeSecure } from './encryption';

/**
 * Simple JWT creation for local use (offline mode)
 * Note: This creates JWT-like tokens but without cryptographic signing
 * (React Native doesn't have access to Node.js crypto module)
 * For offline use, this is sufficient since we control both creation and verification
 */
export const createToken = (userId, username) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const now = new Date();
  const expiryDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 365 days
  
  const payload = {
    userId,
    username,
    iat: Math.floor(now.getTime() / 1000),
    exp: Math.floor(expiryDate.getTime() / 1000)
  };
  
  // Create JWT-like structure (header.payload.signature)
  // For offline use, we don't cryptographically sign, just encode
  const headerEncoded = btoa(JSON.stringify(header));
  const payloadEncoded = btoa(JSON.stringify(payload));
  
  // Non-cryptographic local marker for offline mode token shape.
  const signatureBase = `${headerEncoded}.${payloadEncoded}`;
  const signature = btoa(`local:${userId}:${payload.iat}`);
  
  const token = `${signatureBase}.${signature}`;
  return token;
};

/**
 * Verify token by decoding and checking expiry
 */
export const verifyToken = (token) => {
  try {
    // Decode the token
    const decoded = jwtDecode(token);
    
    // Check if token has expired
    if (decoded.exp) {
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp < now) {
        console.warn('Token has expired');
        return null;
      }
    }
    
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error.message);
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
