import { encrypt, decrypt, saveSecure, getSecure, removeSecure } from '../../utils/encryption';

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  getItemAsync: jest.fn().mockResolvedValue('stored-value'),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn().mockResolvedValue(undefined),
  getItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

import * as SecureStore from 'expo-secure-store';

describe('encrypt / decrypt round-trip', () => {
  it('round-trips a simple ASCII string', () => {
    const { encrypted } = encrypt('hello world');
    expect(decrypt(encrypted)).toBe('hello world');
  });

  it('round-trips a string with special characters', () => {
    const original = 'I quit! 🎉 100%';
    const { encrypted } = encrypt(original);
    expect(decrypt(encrypted)).toBe(original);
  });

  it('round-trips a JSON-serialised object', () => {
    const obj = JSON.stringify({ userId: 42, token: 'abc' });
    const { encrypted } = encrypt(obj);
    expect(JSON.parse(decrypt(encrypted))).toEqual({ userId: 42, token: 'abc' });
  });

  it('returns an object with encrypted, iv, and authTag fields', () => {
    const result = encrypt('test');
    expect(result).toHaveProperty('encrypted');
    expect(result).toHaveProperty('iv');
    expect(result).toHaveProperty('authTag');
  });

  it('encrypted value is a non-empty base64 string', () => {
    const { encrypted } = encrypt('test');
    expect(typeof encrypted).toBe('string');
    expect(encrypted.length).toBeGreaterThan(0);
  });
});

describe('decrypt with different input shapes', () => {
  it('decrypts a plain base64 string', () => {
    const { encrypted } = encrypt('plain string');
    expect(decrypt(encrypted)).toBe('plain string');
  });

  it('decrypts an object with an .encrypted property', () => {
    const encObj = encrypt('object form');
    expect(decrypt(encObj)).toBe('object form');
  });

  it('returns the original value when given null/undefined', () => {
    expect(decrypt(null)).toBeNull();
    expect(decrypt(undefined)).toBeUndefined();
  });
});

describe('saveSecure', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls SecureStore.setItemAsync with key and value', async () => {
    await saveSecure('myKey', 'myValue');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('myKey', 'myValue');
  });
});

describe('getSecure', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls SecureStore.getItemAsync and returns the result', async () => {
    SecureStore.getItemAsync.mockResolvedValue('retrieved');
    const result = await getSecure('myKey');
    expect(SecureStore.getItemAsync).toHaveBeenCalledWith('myKey');
    expect(result).toBe('retrieved');
  });
});

describe('removeSecure', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls SecureStore.deleteItemAsync with the key', async () => {
    await removeSecure('myKey');
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('myKey');
  });
});
