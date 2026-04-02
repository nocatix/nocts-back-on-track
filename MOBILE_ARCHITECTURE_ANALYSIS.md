# Mobile App Architecture Analysis

## 1. SERVICE ARCHITECTURE PATTERN

### Service File Organization
**Path:** `/mobile/src/services/` and `/mobile/src/api/`

**Structure:**
- **Local services** (SQLite-based): `local[Feature]Service.js`
- **Remote services** (API-based): `remote[Feature]Service.js`
- **API wrappers** (mode-agnostic): `/src/api/[feature]Service.js`
- **Mode selector**: `modeService.js`

### Service Files Present
| Feature | Local Service | Remote Service | API Wrapper |
|---------|---------------|----------------|-------------|
| Mood | `localMoodService.js` | `remoteMoodService.js` | `moodService.js` |
| Addiction | `localAddictionService.js` | `remoteAddictionService.js` | `addictionService.js` |
| Achievement | `localAchievementService.js` | `remoteAchievementService.js` | `achievementService.js` |
| Diary | `localDiaryService.js` | `remoteDiaryService.js` | `diaryService.js` |
| Memory | `localMemoryService.js` | `remoteMemoryService.js` | (API wrapper implicit) |
| Trophy | `localTrophyService.js` | `remoteTrophyService.js` | (API wrapper implicit) |
| Weight | `localWeightService.js` | `remoteWeightService.js` | `weightService.js` |
| Auth | `localAuthService.js` | `remoteAuthService.js` | `authService.js` |

### Mode Selection Pattern

**Location:** [/mobile/src/services/modeService.js](/mobile/src/services/modeService.js)

**How it works:**
1. Stores active mode in `AsyncStorage` as `'appMode'` ('standalone' or 'connected')
2. Stores server URL as `'serverUrl'` for connected mode
3. Provides methods: `getActiveMode()`, `setActiveMode()`, `getServerUrl()`, `setServerUrl()`

**API Wrapper Pattern Example:**
[/mobile/src/api/moodService.js](/mobile/src/api/moodService.js#L1-L15)
```javascript
const getMoodService = async () => {
  const mode = await modeService.getActiveMode();
  if (mode === 'connected') {
    return remoteMoodService;
  }
  return localMoodService;
};

// All public methods delegate to the appropriate service
export const moodService = {
  async getMoods(year, month) {
    // 1. Get current user from AsyncStorage
    // 2. Determine active service via getMoodService()
    // 3. Call service with userId
  }
};
```

### Local Service Implementation Pattern
[/mobile/src/services/localMoodService.js](/mobile/src/services/localMoodService.js#L1-L50)

```javascript
export const localMoodService = {
  async getMoodForMonth(userId, year, month) {
    const db = getDatabase();
    // Query using expo-sqlite
    const moods = await db.getAllAsync(
      'SELECT * FROM moods WHERE userId = ? AND date >= ? AND date < ?',
      [userId, startISOString, endISOString]
    );
    // Decrypt sensitive fields
    return moods.map(mood => ({
      ...mood,
      notes: mood.notes ? decrypt(mood.notes) : '',
      triggers: mood.triggers ? JSON.parse(mood.triggers) : []
    }));
  }
};
```

**Key patterns:**
- Takes `userId` as first parameter
- Uses `getDatabase()` to access SQLite
- Decrypts sensitive note fields
- Parses JSON fields (e.g., triggers)
- Returns consistent data structure

### Remote Service Implementation Pattern
[/mobile/src/services/remoteMoodService.js](/mobile/src/services/remoteMoodService.js#L1-L50)

```javascript
const getApiClient = async () => {
  const serverUrl = await modeService.getServerUrl();
  return axios.create({
    baseURL: `${serverUrl}/api`,
    timeout: 10000
  });
};

export const remoteMoodService = {
  async createMood(userId, moodData) {
    const client = await getApiClient();
    const config = await addAuthToken({});
    const response = await client.post('/moods', moodData, config);
    return response.data;
  }
};
```

**Key patterns:**
- Creates axios client with server URL from `modeService`
- Injects auth token from `AsyncStorage` as Bearer token
- Calls corresponding backend routes at `/api/[endpoint]`
- Returns remote API response directly
- Same method signatures as local service for drop-in compatibility

### Service Export Pattern
**Pattern:** Export as named object, not default exports (mostly)
```javascript
export const moodService = { /* methods */ };
export const localMoodService = { /* methods */ };
export const remoteMoodService = { /* methods */ }; // Sometimes default
```

---

## 2. CONTEXT/STATE MANAGEMENT PATTERN

### Context Files Location
[/mobile/src/context/](/mobile/src/context/)

| Context | Purpose | State Variables |
|---------|---------|-----------------|
| `AuthContext.js` | User authentication & session | `user`, `userToken`, `loading`, `error` |
| `ModeContext.js` | App mode (standalone/connected) | `mode`, `serverUrl`, `loading`, `error`, `modeConfigured` |
| `DarkModeContext.js` | UI theme | `isDarkMode` |
| `BiometricContext.js` | Biometric authentication | `isBiometricAvailable`, `isEnabled`, `locked` |

### ModeContext Structure Example
[/mobile/src/context/ModeContext.js](/mobile/src/context/ModeContext.js#L1-L50)

```javascript
export const ModeContext = createContext();

export function ModeProvider({ children }) {
  const [mode, setMode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverUrl, setServerUrl] = useState(null);
  const [modeConfigured, setModeConfigured] = useState(false);

  // Bootstrap on mount - check AsyncStorage for stored mode
  useEffect(() => {
    bootstrapMode();
  }, []);

  const selectMode = async (selectedMode) => {
    // Validate and save to AsyncStorage
    await AsyncStorage.setItem('appMode', selectedMode);
    setMode(selectedMode);
    setModeConfigured(true);
  };

  const updateServerUrl = async (url) => {
    await AsyncStorage.setItem('serverUrl', url);
    setServerUrl(url);
  };

  const isServerConfigured = () => {
    return mode === 'standalone' || (mode === 'connected' && !!serverUrl);
  };

  return (
    <ModeContext.Provider
      value={{
        mode,
        loading,
        error,
        serverUrl,
        modeConfigured,
        selectMode,
        updateServerUrl,
        isServerConfigured,
        switchMode,
        clearModeData
      }}
    >
      {children}
    </ModeContext.Provider>
  );
}

// Hook for consuming context
export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) throw new Error('useMode must be used within ModeProvider');
  return context;
};
```

### AuthContext Structure Example
[/mobile/src/context/AuthContext.js](/mobile/src/context/AuthContext.js#L1-L60)

```javascript
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { mode, modeConfigured } = useMode(); // Depends on ModeContext

  // Bootstrap on app start - check for existing session
  useEffect(() => {
    if (modeConfigured) {
      bootstrapAsync();
    }
  }, [modeConfigured, mode]);

  const bootstrapAsync = async () => {
    // 1. Initialize database
    await initializeDatabase();
    
    // 2. Check if user already logged in
    const currentUser = await authService.getCurrentUser();
    
    if (currentUser) {
      setUser(currentUser);
      setUserToken('authenticated');
    } else if (mode === 'standalone') {
      // Auto-authenticate guest user in standalone mode
      const result = await authService.login('guest', 'guest');
      setUser(result.user);
      setUserToken('authenticated');
    }
  };

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    setUser(result.user);
    setUserToken('authenticated');
    return result;
  };

  const register = async (email, password, nameOnPhone) => {
    const result = await authService.register(email, password, nameOnPhone);
    setUser(result.user);
    setUserToken('authenticated');
    await achievementService.initializeAchievements();
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setUserToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userToken,
        loading,
        error,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

### Context Connection Pattern
**Hierarchy (bottom to top):**
1. `ModeProvider` - wraps everything (determines if app is online/offline)
2. `AuthProvider` - depends on ModeContext
3. `BiometricProvider` - independent
4. `DarkModeProvider` - independent

**Usage in components:**
```javascript
import { useMode } from '../context/ModeContext';
import { AuthContext } from '../context/AuthContext';

function MyComponent() {
  const { mode } = useMode();
  const { user } = useContext(AuthContext);
  // Component can now react to mode/auth changes
}
```

---

## 3. SCREEN/PAGE STRUCTURE

### Example: MoodScreen
[/mobile/src/pages/MoodScreen.js](/mobile/src/pages/MoodScreen.js#L1-L100)

**Screen Structure:**
```javascript
export default function MoodScreen() {
  // 1. HOOKS & STATE
  const insets = useSafeAreaInsets(); // Safe area insets for notched devices
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = getTheme(isDarkMode);
  const [selectedMood, setSelectedMood] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentMoods, setRecentMoods] = useState([]);
  const [error, setError] = useState('');

  // 2. FOCUS EFFECT (called every time screen is focused)
  useFocusEffect(
    React.useCallback(() => {
      fetchRecentMoods();
    }, [])
  );

  // 3. DATA FETCHING
  const fetchRecentMoods = async () => {
    setFetchingMoods(true);
    try {
      const now = new Date();
      // Service auto-selects local or remote based on mode
      const data = await moodService.getMoods(
        now.getFullYear(),
        now.getMonth() + 1
      );
      setRecentMoods(data);
    } catch (err) {
      console.error('Error fetching moods:', err);
    } finally {
      setFetchingMoods(false);
    }
  };

  // 4. SUBMIT HANDLER
  const handleSubmitMood = async () => {
    if (selectedMood === null) {
      setError('Please select a mood');
      return;
    }

    setLoading(true);
    try {
      await moodService.createMood({
        moodLevel: selectedMood,
        notes: notes,
      });
      setSelectedMood(null);
      setNotes('');
      await fetchRecentMoods();
    } catch (err) {
      setError(err.message || 'Failed to save mood');
    } finally {
      setLoading(false);
    }
  };

  // 5. RENDER
  return (
    <ScrollView style={[
      styles.container,
      { backgroundColor: theme.colors.background }
    ]}>
      {/* Content */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          How are you feeling?
        </Text>
        {/* Mood selection UI */}
        <View style={styles.moodGrid}>
          {MOOD_OPTIONS.map((mood) => (
            <TouchableOpacity
              key={mood.value}
              style={[
                styles.moodButton,
                selectedMood === mood.value && styles.moodButtonSelected
              ]}
              onPress={() => setSelectedMood(mood.value)}
            >
              <Text>{mood.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
```

### Typical Screen Pattern Summary
1. **Hooks Setup**: Safe area, theme, context values
2. **Local State**: Form inputs, loading states, errors
3. **Effect Hooks**: Data loading on focus via `useFocusEffect`
4. **Service Integration**: Call API/local services through context-aware wrappers
5. **Error Handling**: Try-catch with user-facing error messages
6. **Theme Support**: Apply theme colors to all components
7. **Safe Area**: Respect notches/safe areas

### Example: DiaryScreen  
[/mobile/src/pages/DiaryScreen.js](/mobile/src/pages/DiaryScreen.js#L1-L100)

**Key patterns:**
- Uses `diaryService` (mode-agnostic wrapper)
- `useFocusEffect` to reload on screen focus
- Loading/error states
- Form UI toggling (show/hide new entry form)
- Date formatting utilities
- Theme styling

---

## 4. DATABASE SCHEMA PATTERN

### Database Initialization
[/mobile/src/db/database.js](/mobile/src/db/database.js#L1-L80)

**Database Setup:**
```javascript
import * as SQLite from 'expo-sqlite';

let db = null;
let dbInitialized = false;

export const initializeDatabase = async () => {
  if (dbInitialized && db) return;

  db = await SQLite.openDatabaseAsync('noctsDB.db');
  
  // Enable foreign keys and create all tables
  await db.execAsync(`
    PRAGMA foreign_keys = ON;
    
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      fullName TEXT NOT NULL,
      password TEXT NOT NULL,
      unitPreference TEXT DEFAULT 'imperial',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    ...other tables...
  `);
};

export const getDatabase = () => {
  if (!db) throw new Error('Database not initialized');
  return db;
};
```

### Table Schemas

#### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  fullName TEXT NOT NULL,
  password TEXT NOT NULL,
  unitPreference TEXT DEFAULT 'imperial',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Moods Table
```sql
CREATE TABLE moods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  date DATETIME NOT NULL,
  primaryMood TEXT NOT NULL,
  secondaryMood TEXT,
  intensity INTEGER DEFAULT 3,
  notes TEXT,              -- Encrypted
  notesIv TEXT,           -- Encryption IV
  notesAuthTag TEXT,      -- Auth tag for GCM
  triggers TEXT,          -- JSON stringified
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(userId) REFERENCES users(id),
  UNIQUE(userId, date)    -- One mood per user per day
);
```

#### Addictions Table
```sql
CREATE TABLE addictions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  name TEXT NOT NULL,
  stopDate DATETIME NOT NULL,
  frequencyPerDay REAL NOT NULL,
  moneySpentPerDay REAL NOT NULL,
  notes TEXT,             -- Encrypted
  notesIv TEXT,
  notesAuthTag TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(userId) REFERENCES users(id)
);
```

#### Diaries Table
```sql
CREATE TABLE diaries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  date DATETIME NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,  -- Encrypted
  contentIv TEXT,
  contentAuthTag TEXT,
  mood TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(userId) REFERENCES users(id)
);
```

#### Weights Table
```sql
CREATE TABLE weights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  date DATETIME NOT NULL,
  weight REAL NOT NULL,
  unit TEXT DEFAULT 'lbs',
  notes TEXT,             -- Encrypted
  notesIv TEXT,
  notesAuthTag TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(userId) REFERENCES users(id)
);
```

#### Achievements & Trophies Tables
```sql
CREATE TABLE achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT,
  unlockedDate DATETIME,
  isUnlocked INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(userId) REFERENCES users(id)
);

CREATE TABLE trophies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  earnedDate DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(userId) REFERENCES users(id)
);
```

### Encryption Pattern
**Files involved:**
- [/mobile/src/utils/encryption.js](/mobile/src/utils/encryption.js)

**Pattern in local services:**
```javascript
// Before storing
const encryptedNotes = notes ? encrypt(notes).encrypted : null;

// When retrieving
return {
  ...mood,
  notes: mood.notes ? decrypt(mood.notes) : ''
};
```

**Sensitive fields always encrypted:**
- `notes` (encrypted + IV + auth tag)
- `content` in diaries (encrypted + IV + auth tag)
- Any free-text user input

### Query Patterns
[/mobile/src/services/localAddictionService.js](/mobile/src/services/localAddictionService.js#L1-L50)

```javascript
// SELECT ONE
const addiction = await db.getFirstAsync(
  'SELECT * FROM addictions WHERE id = ? AND userId = ?',
  [addictionId, userId]
);

// SELECT MANY
const addictions = await db.getAllAsync(
  'SELECT * FROM addictions WHERE userId = ? ORDER BY stopDate DESC',
  [userId]
);

// INSERT
const result = await db.runAsync(
  'INSERT INTO addictions (userId, name, stopDate, ...) VALUES (?, ?, ?, ...)',
  [userId, name, stopDate, ...]
);

// UPDATE
await db.runAsync(
  'UPDATE addictions SET name = ?, freq = ? WHERE id = ? AND userId = ?',
  [name, freq, id, userId]
);

// DELETE
await db.runAsync(
  'DELETE FROM addictions WHERE id = ? AND userId = ?',
  [id, userId]
);
```

### Unique Constraints
- **Moods**: `UNIQUE(userId, date)` - one mood entry per user per day
- **Users**: `username UNIQUE` - unique usernames
- **No duplicates** on migration/sync operations

---

## 5. NAVIGATION STRUCTURE

### App.js Navigation Setup
[/mobile/App.js](/mobile/App.js#L1-L100)

**Navigation Library:**
- `@react-navigation/native` - core navigation
- `@react-navigation/native-stack` - stack-based navigation (screens slide in/out)
- `@react-navigation/bottom-tabs` - tab-based navigation

**App Structure:**

```javascript
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// AUTH STACK (when not authenticated)
function AuthStack({ theme }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// APP STACK (when authenticated)
function AppStack({ theme }) {
  // Nested stack for home navigation
  const HomeStackNav = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="MainMenu"
        component={MainMenuScreen}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen
        name="AddictionDetail"
        component={AddictionDetailScreen}
        options={{ title: 'Details' }}
      />
      <Stack.Screen
        name="AddNewAddiction"
        component={AddNewAddictionScreen}
        options={{ title: 'New Addiction' }}
      />
    </Stack.Navigator>
  );

  // TAB NAVIGATOR (bottom tabs)
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
      }}
    >
      {/* Tab 1: Home */}
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNav}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="home"
              color={color}
              size={26}
            />
          ),
        }}
      />

      {/* Tab 2: Mood */}
      <Tab.Screen
        name="MoodTab"
        component={MoodScreen}
        options={{
          title: 'Mood',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="emoticon-happy"
              color={color}
              size={26}
            />
          ),
        }}
      />

      {/* Tab 3: Diary */}
      <Tab.Screen
        name="DiaryTab"
        component={DiaryScreen}
        options={{
          title: 'Diary',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="book"
              color={color}
              size={26}
            />
          ),
        }}
      />

      {/* Additional tabs... */}
    </Tab.Navigator>
  );
}

// MAIN APP COMPONENT
function RootNavigator() {
  const { userToken, loading } = useContext(AuthContext);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <NavigationContainer>
      {userToken ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

// ROOT APP (with providers)
export default function App() {
  return (
    <ModeProvider>
      <AuthProvider>
        <DarkModeProvider>
          <BiometricProvider>
            <RootNavigator />
          </BiometricProvider>
        </DarkModeProvider>
      </AuthProvider>
    </ModeProvider>
  );
}
```

### Navigation Flow

```
App (Providers)
├── ModeProvider
├── AuthProvider (depends on Mode)
├── DarkModeProvider
└── BiometricProvider
    └── NavigationContainer
        ├── AuthStack (if no token)
        │   ├── Login
        │   └── Register
        └── AppStack (if authenticated)
            ├── HomeTab (Nested Stack)
            │   ├── MainMenu (Home)
            │   ├── AddictionDetail (modal/stack)
            │   └── AddNewAddiction (modal/stack)
            ├── MoodTab
            ├── DiaryTab
            ├── MeditationTab
            ├── SettingsTab
            └── [Other tabs...]
```

### Tab Configuration

**Tabs present:**
1. **Home** - Dashboard with main stats
2. **Mood** - Mood tracking for today
3. **Diary** - Daily diary entries
4. **Meditation** - Meditation/breathing exercises
5. **Settings** - App settings

**Special screens (not tabs):**
- `ModeSelectionScreen` - Choose standalone/connected mode
- `ServerConfigScreen` - Configure server URL
- `BiometricLockScreen` - Biometric authentication

### Screen Navigation Patterns

**Moving between tabs:**
```javascript
navigation.navigate('MoodTab'); // Jump to Mood tab from anywhere
```

**Stack navigation (within tabs):**
```javascript
navigation.push('AddictionDetail', { id: 123 }); // Add to stack
navigation.goBack(); // Remove from stack
```

**With parameters:**
```javascript
navigation.navigate('AddictionDetail', {
  addictionId: 123,
  name: 'Addiction Name'
});
```

---

## 6. KEY ARCHITECTURAL PATTERNS TO REPLICATE

### For Adding New Features:

#### 1. **Service Layer Pattern**
If adding a new feature (e.g., `JournalService`):

```javascript
// /src/services/localJournalService.js
export const localJournalService = {
  async createEntry(userId, data) { /* SQLite ops */ },
  async getEntries(userId) { /* ... */ }
};

// /src/services/remoteJournalService.js
export const remoteJournalService = {
  async createEntry(userId, data) { /* API calls */ },
  async getEntries(userId) { /* ... */ }
};

// /src/api/journalService.js
export const journalService = {
  async createEntry(data) {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    const service = await getJournalService(); // mode check
    return await service.createEntry(user.id, data);
  }
};
```

#### 2. **Context for Cross-Component State**
If you need state shared across multiple screens:

```javascript
// /src/context/JournalContext.js  
export const JournalContext = createContext();

export function JournalProvider({ children }) {
  const [entries, setEntries] = useState([]);
  // ... context implementation
}

// In App.js: wrap <JournalProvider> in provider hierarchy
```

#### 3. **Screen Pattern**
Create screens in [/mobile/src/pages/](/mobile/src/pages/):

```javascript
// /src/pages/JournalScreen.js
import journalService from '../api/journalService';
import { useFocusEffect } from '@react-navigation/native';

export default function JournalScreen() {
  const [entries, setEntries] = useState([]);
  
  useFocusEffect(
    React.useCallback(() => {
      fetchEntries();
    }, [])
  );
  
  const fetchEntries = async () => {
    try {
      const data = await journalService.getEntries();
      setEntries(data);
    } catch (err) {
      console.error('Error:', err);
    }
  };
  // ... render
}
```

#### 4. **Database Schema**
Add to [/mobile/src/db/database.js](/mobile/src/db/database.js) in the `execAsync()` call:

```sql
CREATE TABLE IF NOT EXISTS journals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  date DATETIME NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  contentIv TEXT,
  contentAuthTag TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(userId) REFERENCES users(id)
);
```

#### 5. **Navigation**
Add tab to [/mobile/App.js](/mobile/App.js):

```javascript
<Tab.Screen
  name="JournalTab"
  component={JournalScreen}
  options={{
    title: 'Journal',
    tabBarIcon: ({ color }) => (
      <MaterialCommunityIcons name="notebook" color={color} size={26} />
    ),
  }}
/>
```

#### 6. **Encryption**
Always encrypt sensitive notes:
```javascript
const encrypted = encrypt(content);
await db.runAsync(
  'INSERT INTO journals (content, contentIv, contentAuthTag, ...) VALUES (?, ?, ?, ...)',
  [encrypted.encrypted, encrypted.iv, encrypted.authTag, ...]
);
```

---

## 7. FILE REFERENCE QUICK INDEX

| Category | Path | Purpose |
|----------|------|---------|
| **Navigation** | [/mobile/App.js](/mobile/App.js) | Main app structure, tabs, stacks |
| **Services** | [/mobile/src/services/](/mobile/src/services/) | Local & remote implementations |
| **API Wrappers** | [/mobile/src/api/](/mobile/src/api/) | Mode-agnostic service interfaces |
| **Contexts** | [/mobile/src/context/](/mobile/src/context/) | State management providers |
| **Pages/Screens** | [/mobile/src/pages/](/mobile/src/pages/) | UI screens |
| **Database** | [/mobile/src/db/database.js](/mobile/src/db/database.js) | SQLite schema & initialization |
| **Utilities** | [/mobile/src/utils/](/mobile/src/utils/) | Encryption, theming, helpers |
| **Components** | [/mobile/src/components/](/mobile/src/components/) | Reusable UI components |

## 8. IMPORTANT IMPLEMENTATION DETAILS

### Mode Switching Logic
- Stored in AsyncStorage under keys: `appMode`, `serverUrl`
- **Standalone**: Uses local SQLite only
- **Connected**: Requires valid server URL, uses remote API via axios
- Switching modes clears auth tokens automatically

### Offline-First Architecture
- Local services use SQLite (always available)
- Remote services use device's current server URL
- API layer (`/src/api/`) determines which service to use at runtime
- No explicit sync code needed - services handle storage layer selection

### Encryption Pattern
- Uses `encrypt()` and `decrypt()` utilities
- Stores: `field`, `fieldIv`, `fieldAuthTag` (GCM mode)
- **Always encrypted fields:** notes, content, personal data
- Decryption happens on retrieval in service layer

### User Context Flow
1. Each service method gets `userId` from AsyncStorage
2. Database queries filter by `userId` (privacy)
3. Remote API calls pass auth token from AsyncStorage
4. User context available in `AuthContext.user`

---

## Summary

**Architectural Highlights:**
✓ **Dual-service pattern** - Seamless local/remote switching  
✓ **Context-based state** - Global auth, mode, theme, biometric  
✓ **Service abstraction layer** - Screens don't know storage backend  
✓ **Encrypted SQLite** - Sensitive data always encrypted locally  
✓ **Tab-based navigation** - 5+ main tabs with nested stacks  
✓ **Mode-aware** - Single codebase, two deployment modes  

**To add new features:** Follow the 6-step pattern above (Services → Context → Screen → Schema → Navigation → Encryption)
