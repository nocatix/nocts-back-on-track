# Implementation Reference - Offline-First Mobile App

## Quick Reference for Common Tasks

### 1. Initializing the App

**AuthContext.js** (Automatic on startup):
```javascript
const bootstrapAsync = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    console.log('[Auth] Database initialized successfully');
    
    // Check if user is logged in
    const currentUser = await authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setUserToken('authenticated');
    }
  } finally {
    setLoading(false);
  }
};
```

### 2. User Registration

**From**: `src/api/authService.js` → `src/services/localAuthService.js`

```javascript
// Using authService
const result = await authService.register(username, fullName, password);
// Returns: { token, user }

// Behind the scenes in localAuthService
export const localAuthService = {
  async register(username, fullName, password) {
    const db = getDatabase();
    
    // Check if user exists
    const existing = await db.getFirstAsync(
      'SELECT id FROM users WHERE username = ?',
      [username.toLowerCase()]
    );
    
    if (existing) throw new Error('Username already exists');
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const result = await db.runAsync(
      'INSERT INTO users (username, fullName, password) VALUES (?, ?, ?)',
      [username.toLowerCase(), fullName, hashedPassword]
    );
    
    // Generate token
    const token = createToken(result.lastInsertRowId, username);
    
    return { token, user: { id, username, fullName } };
  }
};
```

### 3. User Login

```javascript
// Using authService
const result = await authService.login(username, password);
// Returns: { token, user }

// Behind the scenes
export const localAuthService = {
  async login(username, password) {
    const db = getDatabase();
    
    // Find user
    const user = await db.getFirstAsync(
      'SELECT id, username, fullName, password FROM users WHERE username = ?',
      [username.toLowerCase()]
    );
    
    if (!user) throw new Error('User not found');
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error('Invalid password');
    
    // Generate token
    const token = createToken(user.id, user.username);
    
    return { token, user };
  }
};
```

### 4. Creating a Mood Entry

```javascript
// Using moodService
const mood = await moodService.createMood({
  date: '2026-04-01',
  primaryMood: '😊 Happy',
  secondaryMood: '😄 Joyful',
  intensity: 4,
  notes: 'Great day today!',
  triggers: ['Exercise', 'Friends']
});

// Behind the scenes in localMoodService
export const localMoodService = {
  async saveMood(userId, date, primaryMood, secondaryMood, intensity, notes, triggers) {
    const db = getDatabase();
    
    // Convert date to string
    const dateString = toLocalDateKey(date);
    
    // Check if exists
    const existing = await db.getFirstAsync(
      'SELECT id FROM moods WHERE userId = ? AND date = ?',
      [userId, dateString]
    );
    
    // Encrypt notes
    const encryptedNotes = notes ? encrypt(notes).encrypted : null;
    const triggersJson = JSON.stringify(triggers || []);
    
    if (existing) {
      // Update
      await db.runAsync(
        'UPDATE moods SET primaryMood = ?, secondaryMood = ?, intensity = ?, notes = ?, triggers = ? WHERE userId = ? AND date = ?',
        [primaryMood, secondaryMood, intensity, encryptedNotes, triggersJson, userId, dateString]
      );
    } else {
      // Insert
      await db.runAsync(
        'INSERT INTO moods (userId, date, primaryMood, secondaryMood, intensity, notes, triggers) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, dateString, primaryMood, secondaryMood, intensity, encryptedNotes, triggersJson]
      );
    }
    
    // Return saved mood
    return await this.getMoodForDate(userId, date);
  }
};
```

### 5. Getting Data

```javascript
// Get moods for a month
const moods = await moodService.getMoods(2026, 4); // April 2026

// Get all addictions
const addictions = await addictionService.getAddictions();

// Get diary entries
const entries = await diaryService.getDiaryEntries(50, 0); // 50 entries, offset 0

// Get achievements
const achievements = await achievementService.getAchievements();
```

### 6. Updating Data

```javascript
// Update mood
const updated = await moodService.updateMood(
  '2026-04-01',
  {
    primaryMood: '😌 Calm',
    secondaryMood: '😌 Relaxed',
    intensity: 5,
    notes: 'Updated note',
    triggers: ['Meditation']
  }
);

// Update addiction
const addiction = await addictionService.updateAddiction(addictionId, {
  frequencyPerDay: 5,
  moneySpentPerDay: 10
});
```

### 7. Deleting Data

```javascript
// Delete mood
await moodService.deleteMood('2026-04-01');

// Delete addiction
await addictionService.deleteAddiction(addictionId);

// Delete diary entry
await diaryService.deleteDiaryEntry(entryId);
```

### 8. Data Encryption

```javascript
import { encrypt, decrypt } from '../utils/encryption';

// Encrypt sensitive data
const encrypted = encrypt('My secret note');
// Returns: { encrypted: 'TXkgc2VjcmV0IG5vdGU=', iv: '', authTag: '' }

// Decrypt data
const decrypted = decrypt(encrypted.encrypted);
// Returns: 'My secret note'

// Or with object
const note = decrypt(encryptedRecord.notes);
```

### 9. Token Management

```javascript
import { createToken, verifyToken, saveToken, getToken } from '../utils/jwtHelper';

// Create token
const token = createToken(userId, username);

// Verify token
const decoded = verifyToken(token);
// Returns: { userId: 123, username: 'john', iat: 1234567, exp: 5234567 }

// Save token securely
await saveToken(token);

// Get token
const token = await getToken();

// Check if valid
const isValid = await isTokenValid();
```

### 10. Getting Current User

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get current user
const userJson = await AsyncStorage.getItem('user');
const user = userJson ? JSON.parse(userJson) : null;

// user will have: { id, username, fullName, unitPreference }
```

## Database Query Examples

### Direct Database Queries

```javascript
import { getDatabase } from '../db/database';

const db = getDatabase();

// SELECT query returning first result
const user = await db.getFirstAsync(
  'SELECT * FROM users WHERE id = ?',
  [userId]
);

// SELECT query returning all results
const allMoods = await db.getAllAsync(
  'SELECT * FROM moods WHERE userId = ? ORDER BY date DESC',
  [userId]
);

// INSERT query
const result = await db.runAsync(
  'INSERT INTO moods (userId, date, primaryMood) VALUES (?, ?, ?)',
  [userId, dateString, emotion]
);
// result.lastInsertRowId - get the ID of inserted row
// result.changes - number of rows affected

// UPDATE query
await db.runAsync(
  'UPDATE moods SET primaryMood = ? WHERE id = ? AND userId = ?',
  [newEmotion, moodId, userId]
);

// DELETE query
const result = await db.runAsync(
  'DELETE FROM moods WHERE id = ? AND userId = ?',
  [moodId, userId]
);
// result.changes - number of rows deleted
```

## Error Handling

```javascript
// Wrap calls in try-catch
try {
  const mood = await moodService.createMood(moodData);
  console.log('Success:', mood);
} catch (error) {
  console.error('Error creating mood:', error);
  // Handle error - show toast, alert, or retry
}

// Common errors
- "User not found" - User not logged in or data corrupted
- "Username already exists" - Try different username
- "Database not initialized" - Restart app
- "Invalid password" - Wrong password entered
```

## Performance Considerations

### Batch Operations
```javascript
// Good - get all data in one query
const moods = await moodService.getMoodForMonth(userId, 2026, 4);

// Avoid - multiple queries
for (let day = 1; day <= 30; day++) {
  const mood = await moodService.getMoodForDate(userId, new Date(2026, 3, day));
  // This is 30 database roundtrips!
}
```

### Pagination
```javascript
// Get first 50 entries
const entries = await diaryService.getDiaryEntries(50, 0);

// Get next 50 entries
const moreEntries = await diaryService.getDiaryEntries(50, 50);
```

### Indexing
Database is optimized for:
- Queries by `userId`
- Queries by date ranges
- Unique constraints on `users.username`
- Foreign key relationships

## Testing Offline Functionality

```javascript
// 1. Enable Airplane Mode on device
// 2. Create/update/delete records - should all work
// 3. Close and reopen app - data should persist
// 4. Disable Airplane Mode - nothing should change

// Verify offline works:
- Create mood ✓
- Add addiction ✓
- Write diary entry ✓
- Update weight ✓
- Everything persists ✓
```

## Debugging Database

```javascript
// Log operations
console.log('[DB] Creating mood:', { userId, date, primaryMood });

// Check database state
try {
  const count = await db.getFirstAsync(
    'SELECT COUNT(*) as count FROM moods WHERE userId = ?',
    [userId]
  );
  console.log('[DB] Total moods:', count.count);
} catch (error) {
  console.error('[DB] Query failed:', error);
}

// Clear database (for testing)
// - Stop app
// - Uninstall app
// - Reinstall app
// - Database will be recreated
```

## Migration Path for Existing Data

If migrating from server backend:

```javascript
// Export data as JSON
const exportData = async (userId) => {
  const moods = await moodService.getMoods(2026, 1); // All months
  const addictions = await addictionService.getAddictions();
  const entries = await diaryService.getDiaryEntries(1000, 0);
  
  return {
    moods,
    addictions,
    entries
  };
};

// Import data into local database
const importData = async (userId, data) => {
  for (const mood of data.moods) {
    await moodService.updateMood(mood.date, mood);
  }
  
  for (const addiction of data.addictions) {
    await addictionService.createAddiction(addiction);
  }
  // ... etc
};
```

---

**Last Updated**: April 2026
**For Questions**: See OFFLINE_ARCHITECTURE.md
