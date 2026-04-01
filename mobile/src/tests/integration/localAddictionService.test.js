import { localAddictionService } from '../../services/localAddictionService';

// Mock the database.
const mockDb = {
  getFirstAsync: jest.fn(),
  runAsync: jest.fn(),
  getAllAsync: jest.fn(),
};

jest.mock('../../db/database', () => ({
  getDatabase: jest.fn(() => mockDb),
}));

// Mock encryption (imported as './encryption' relative to localAddictionService).
// encrypt(text).encrypted = text + '_enc'; decrypt(val) strips '_enc'.
jest.mock('../../services/encryption', () => ({
  encrypt: jest.fn((text) => ({ encrypted: text + '_enc', iv: '', authTag: '' })),
  decrypt: jest.fn((val) => {
    if (typeof val === 'string' && val.endsWith('_enc')) {
      return val.slice(0, -4);
    }
    return val;
  }),
}));

const baseAddiction = {
  id: 1,
  userId: 10,
  name: 'Smoking',
  stopDate: '2024-01-01',
  frequencyPerDay: 20,
  moneySpentPerDay: 5,
  notes: 'some notes_enc',
};

describe('localAddictionService.createAddiction', () => {
  beforeEach(() => jest.clearAllMocks());

  it('inserts an addiction with encrypted notes and returns decrypted record', async () => {
    mockDb.runAsync.mockResolvedValueOnce({ lastInsertRowId: 1 });
    mockDb.getFirstAsync.mockResolvedValueOnce({ ...baseAddiction });

    const result = await localAddictionService.createAddiction(
      10, 'Smoking', '2024-01-01', 20, 5, 'some notes'
    );

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO addictions'),
      expect.arrayContaining(['some notes_enc'])
    );
    expect(result.notes).toBe('some notes');
  });

  it('sets notes to null when none are provided', async () => {
    mockDb.runAsync.mockResolvedValueOnce({ lastInsertRowId: 2 });
    mockDb.getFirstAsync.mockResolvedValueOnce({ ...baseAddiction, notes: null });

    const result = await localAddictionService.createAddiction(
      10, 'Smoking', '2024-01-01', 20, 5, null
    );

    expect(result.notes).toBe('');
  });
});

describe('localAddictionService.getAddictions', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns a list of addictions with decrypted notes', async () => {
    mockDb.getAllAsync.mockResolvedValueOnce([
      { ...baseAddiction, notes: 'note1_enc' },
      { ...baseAddiction, id: 2, notes: null },
    ]);

    const results = await localAddictionService.getAddictions(10);

    expect(results).toHaveLength(2);
    expect(results[0].notes).toBe('note1');
    expect(results[1].notes).toBe('');
  });

  it('returns empty array when user has no addictions', async () => {
    mockDb.getAllAsync.mockResolvedValueOnce([]);
    const results = await localAddictionService.getAddictions(10);
    expect(results).toEqual([]);
  });
});

describe('localAddictionService.getAddiction', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns a single addiction with decrypted notes', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({ ...baseAddiction, notes: 'private_enc' });

    const result = await localAddictionService.getAddiction(10, 1);

    expect(result).not.toBeNull();
    expect(result.notes).toBe('private');
  });

  it('returns null when addiction is not found', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce(null);
    const result = await localAddictionService.getAddiction(10, 999);
    expect(result).toBeNull();
  });
});

describe('localAddictionService.updateAddiction', () => {
  beforeEach(() => jest.clearAllMocks());

  it('runs an UPDATE query and returns the updated record', async () => {
    mockDb.runAsync.mockResolvedValueOnce({ changes: 1 });
    // getAddiction is called internally after the update
    mockDb.getFirstAsync.mockResolvedValueOnce({
      ...baseAddiction,
      name: 'Updated Name',
      notes: 'updated_enc',
    });

    const result = await localAddictionService.updateAddiction(10, 1, {
      name: 'Updated Name',
      notes: 'updated',
    });

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE addictions'),
      expect.arrayContaining(['Updated Name', 'updated_enc'])
    );
    expect(result.notes).toBe('updated');
  });
});

describe('localAddictionService.deleteAddiction', () => {
  beforeEach(() => jest.clearAllMocks());

  it('runs a DELETE query and returns deletedCount', async () => {
    mockDb.runAsync.mockResolvedValueOnce({ changes: 1 });

    const result = await localAddictionService.deleteAddiction(10, 1);

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM addictions'),
      [1, 10]
    );
    expect(result).toEqual({ message: 'Addiction deleted', deletedCount: 1 });
  });

  it('returns deletedCount of 0 when the addiction did not exist', async () => {
    mockDb.runAsync.mockResolvedValueOnce({ changes: 0 });

    const result = await localAddictionService.deleteAddiction(10, 999);
    expect(result.deletedCount).toBe(0);
  });
});
