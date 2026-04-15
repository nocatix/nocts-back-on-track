import * as SecureStore from 'expo-secure-store';
import { Buffer } from 'buffer';

/**
 * Simple encryption/decryption using base64 encoding
 * For production, consider using expo-crypto or similar
 */

export const encrypt = (text) => {
  try {
    const encoded = Buffer.from(text).toString('base64');
    return {
      encrypted: encoded,
      iv: '', // Placeholder for compatibility
      authTag: '' // Placeholder for compatibility
    };
  } catch (error) {
    console.error('Encryption error:', error);
    return { encrypted: text, iv: '', authTag: '' };
  }
};

export const decrypt = (encrypted) => {
  try {
    if (typeof encrypted === 'string') {
      return Buffer.from(encrypted, 'base64').toString('utf-8');
    }
    if (encrypted && encrypted.encrypted) {
      return Buffer.from(encrypted.encrypted, 'base64').toString('utf-8');
    }
    return encrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return encrypted;
  }
};

// For sensitive data like auth tokens
export const saveSecure = async (key, value) => {
  await SecureStore.setItemAsync(key, value);
};

export const getSecure = async (key) => {
  return await SecureStore.getItemAsync(key);
};

export const removeSecure = async (key) => {
  await SecureStore.deleteItemAsync(key);
};
