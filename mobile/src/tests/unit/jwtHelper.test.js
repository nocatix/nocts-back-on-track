import {
  createToken,
  verifyToken,
  saveToken,
  getToken,
  removeToken,
  isTokenValid,
} from '../../utils/jwtHelper';

// Provide lightweight stubs for the SecureStore-backed wrappers so the tests
// run in a pure Node environment without any native modules.
jest.mock('../../utils/encryption', () => {
  let store = {};
  return {
    saveSecure: jest.fn(async (key, value) => { store[key] = value; }),
    getSecure: jest.fn(async (key) => store[key] ?? null),
    removeSecure: jest.fn(async (key) => { delete store[key]; }),
    // reset helper exposed only for test setup
    __resetStore: () => { store = {}; },
  };
});

import { saveSecure, getSecure, removeSecure } from '../../utils/encryption';

describe('createToken', () => {
  it('returns a non-empty JWT string', () => {
    const token = createToken(1, 'alice');
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3); // header.payload.signature
  });

  it('embeds userId and username in the payload', () => {
    const token = createToken(42, 'bob');
    const decoded = verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded.userId).toBe(42);
    expect(decoded.username).toBe('bob');
  });
});

describe('verifyToken', () => {
  it('returns the decoded payload for a valid token', () => {
    const token = createToken(7, 'carol');
    const decoded = verifyToken(token);
    expect(decoded).toMatchObject({ userId: 7, username: 'carol' });
  });

  it('returns null for an invalid token string', () => {
    expect(verifyToken('not.a.valid.token')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(verifyToken('')).toBeNull();
  });

  it('returns null for a tampered token', () => {
    const token = createToken(1, 'alice');
    const tampered = token.slice(0, -3) + 'xxx';
    expect(verifyToken(tampered)).toBeNull();
  });
});

describe('saveToken / getToken / removeToken', () => {
  beforeEach(() => jest.clearAllMocks());

  it('saveToken calls saveSecure with "authToken" key', async () => {
    await saveToken('my-jwt');
    expect(saveSecure).toHaveBeenCalledWith('authToken', 'my-jwt');
  });

  it('getToken calls getSecure with "authToken" key', async () => {
    await getToken();
    expect(getSecure).toHaveBeenCalledWith('authToken');
  });

  it('removeToken calls removeSecure with "authToken" key', async () => {
    await removeToken();
    expect(removeSecure).toHaveBeenCalledWith('authToken');
  });
});

describe('isTokenValid', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns false when no token is stored', async () => {
    getSecure.mockResolvedValue(null);
    expect(await isTokenValid()).toBe(false);
  });

  it('returns true when a valid token is stored', async () => {
    const validToken = createToken(1, 'alice');
    getSecure.mockResolvedValue(validToken);
    expect(await isTokenValid()).toBe(true);
  });

  it('returns false when an invalid token is stored', async () => {
    getSecure.mockResolvedValue('completely.invalid.token');
    expect(await isTokenValid()).toBe(false);
  });
});
