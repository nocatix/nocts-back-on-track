import { localAuthService } from '../../services/localAuthService';

// Mock the database so no real SQLite is required.
const mockDb = {
  getFirstAsync: jest.fn(),
  runAsync: jest.fn(),
  getAllAsync: jest.fn(),
};

jest.mock('../../db/database', () => ({
  getDatabase: jest.fn(() => mockDb),
}));

// Mock native modules that expo-secure-store and async-storage depend on so that
// expo-modules-core (which uses ESM syntax) is never loaded in the Jest environment.
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  getItemAsync: jest.fn().mockResolvedValue(null),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn().mockResolvedValue(undefined),
  getItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

// Mock jwtHelper (imported as './jwtHelper' relative to localAuthService).
jest.mock('../../services/jwtHelper', () => ({
  createToken: jest.fn(() => 'mock-jwt-token'),
  verifyToken: jest.fn((token) => {
    if (token === 'mock-jwt-token') return { userId: 1, username: 'alice' };
    return null;
  }),
}));

describe('localAuthService.register', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates a new user and returns token + user object', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce(null); // no existing user
    mockDb.runAsync.mockResolvedValueOnce({ lastInsertRowId: 1 });

    const result = await localAuthService.register('Alice', 'Alice Smith', 'password123');

    expect(result).toHaveProperty('token', 'mock-jwt-token');
    expect(result.user).toMatchObject({
      id: 1,
      username: 'alice',
      fullName: 'Alice Smith',
      unitPreference: 'imperial',
    });
  });

  it('stores the username as lowercase', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce(null);
    mockDb.runAsync.mockResolvedValueOnce({ lastInsertRowId: 2 });

    const result = await localAuthService.register('BOB', 'Bob Jones', 'pass');
    expect(result.user.username).toBe('bob');
  });

  it('throws if the username already exists', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({ id: 99 }); // existing user

    await expect(
      localAuthService.register('Alice', 'Alice Smith', 'password123')
    ).rejects.toThrow('Username already exists');
  });
});

describe('localAuthService.login', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns token + user when credentials are valid', async () => {
    // Use require for bcrypt since dynamic import needs --experimental-vm-modules.
    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash('correctpass', 10);

    mockDb.getFirstAsync.mockResolvedValueOnce({
      id: 5,
      username: 'dave',
      fullName: 'Dave D',
      unitPreference: 'metric',
      password: hashed,
    });

    const result = await localAuthService.login('Dave', 'correctpass');
    expect(result.token).toBe('mock-jwt-token');
    expect(result.user.username).toBe('dave');
  });

  it('throws "User not found" when username does not exist', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce(null);

    await expect(localAuthService.login('nobody', 'pass')).rejects.toThrow('User not found');
  });

  it('throws "Invalid password" when password is wrong', async () => {
    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash('realpass', 10);

    mockDb.getFirstAsync.mockResolvedValueOnce({
      id: 6,
      username: 'eve',
      fullName: 'Eve E',
      unitPreference: 'imperial',
      password: hashed,
    });

    await expect(localAuthService.login('Eve', 'wrongpass')).rejects.toThrow('Invalid password');
  });
});

describe('localAuthService.getUserFromToken', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns the user record for a valid token', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({
      id: 1,
      username: 'alice',
      fullName: 'Alice Smith',
      unitPreference: 'imperial',
    });

    const user = await localAuthService.getUserFromToken('mock-jwt-token');
    expect(user).toMatchObject({ id: 1, username: 'alice' });
  });

  it('returns null for an invalid token', async () => {
    const user = await localAuthService.getUserFromToken('bad-token');
    expect(user).toBeNull();
  });
});

describe('localAuthService.updateUserPreferences', () => {
  beforeEach(() => jest.clearAllMocks());

  it('runs an UPDATE query and returns success', async () => {
    mockDb.runAsync.mockResolvedValueOnce({ changes: 1 });

    const result = await localAuthService.updateUserPreferences(1, 'metric');
    expect(result).toEqual({ success: true, message: 'Preferences updated' });
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE users'),
      ['metric', 1]
    );
  });
});
