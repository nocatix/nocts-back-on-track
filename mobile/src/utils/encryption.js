import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    // Fallback to AsyncStorage if SecureStore fails
    console.warn('SecureStore failed, using AsyncStorage:', error);
    await AsyncStorage.setItem(key, value);
  }
};

export const getSecure = async (key) => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.warn('SecureStore failed, using AsyncStorage:', error);
    return await AsyncStorage.getItem(key);
  }
};

export const removeSecure = async (key) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.warn('SecureStore deletion failed, using AsyncStorage:', error);
    await AsyncStorage.removeItem(key);
  }
};
