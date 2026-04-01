const { encrypt, decrypt, hashPassword, comparePassword } = require('../../../utils/encryption');

describe('encryption utils', () => {
  describe('encrypt / decrypt', () => {
    it('returns null for falsy input', () => {
      expect(encrypt(null)).toBeNull();
      expect(encrypt('')).toBeNull();
      expect(encrypt(undefined)).toBeNull();
    });

    it('encrypts a string and returns an object with encrypted, iv, and authTag', () => {
      const result = encrypt('hello world');
      expect(result).toHaveProperty('encrypted');
      expect(result).toHaveProperty('iv');
      expect(result).toHaveProperty('authTag');
      expect(typeof result.encrypted).toBe('string');
    });

    it('produces different ciphertext each call (random IV)', () => {
      const a = encrypt('same text');
      const b = encrypt('same text');
      expect(a.encrypted).not.toBe(b.encrypted);
      expect(a.iv).not.toBe(b.iv);
    });

    it('decrypts back to the original plaintext', () => {
      const plaintext = 'my secret diary entry';
      const encrypted = encrypt(plaintext);
      expect(decrypt(encrypted)).toBe(plaintext);
    });

    it('handles strings with special characters', () => {
      const plaintext = 'café résumé 日本語 🔒';
      expect(decrypt(encrypt(plaintext))).toBe(plaintext);
    });
  });

  describe('decrypt', () => {
    it('returns null for null input', () => {
      expect(decrypt(null)).toBeNull();
    });

    it('returns null when encrypted field is missing', () => {
      expect(decrypt({})).toBeNull();
      expect(decrypt({ iv: 'aabb', authTag: 'ccdd' })).toBeNull();
    });
  });

  describe('hashPassword / comparePassword', () => {
    it('hashes a password and compares it successfully', async () => {
      const password = 'MySecureP@ss1';
      const hash = await hashPassword(password);
      expect(hash).not.toBe(password);
      expect(await comparePassword(password, hash)).toBe(true);
    });

    it('rejects a wrong password', async () => {
      const hash = await hashPassword('correctPassword');
      expect(await comparePassword('wrongPassword', hash)).toBe(false);
    });
  });
});
