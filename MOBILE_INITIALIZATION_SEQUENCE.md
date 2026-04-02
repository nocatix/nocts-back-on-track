# Mobile App Initialization & Data Fetching Architecture

## Overview
The mobile app uses a hierarchical context/provider pattern with mode-aware services. Initialization follows a strict sequence: Mode → Auth → Database → Data Contexts.

---

## 1. Provider Nesting Order (App.js - Root)

```javascript
// /mobile/App.js - Lines 543-559
export default function App() {
  return (
    <ModeProvider>                        // Level 1: Determines standalone/connected mode
      <DarkModeProvider>                 // Level 2: Theme
        <BiometricProvider>              // Level 3: Security
          <AuthProvider>                 // Level 4: User authentication + DB init
            <AddictionProvider>          // Level 5: Data contexts (order flexible)
              <WeightProvider>
                <MemoryProvider>
                  <AchievementProvider>
                    <TrophyProvider>
                      <PreparationProvider>
                        <SelfAssessmentProvider>
                          <RootNavigator />
                        </SelfAssessmentProvider>
                      </PreparationProvider>
                    </TrophyProvider>
                  </AchievementProvider>
                </MemoryProvider>
              </WeightProvider>
            </AddictionProvider>
          </AuthProvider>
        </BiometricProvider>
      </DarkModeProvider>
    </ModeProvider>
  );
}
```

---

## 2. Initialization Sequence Timeline

### Phase 1: ModeContext Bootstrap (Earliest)
**File:** [mobile/src/context/ModeContext.js](mobile/src/context/ModeContext.js)
**Trigger:** On app mount
**Duration:** Synchronous (mounts immediately)

```javascript
// Lines 10-34: useEffect with no dependencies
useEffect(() => {
  bootstrapMode();
}, []);

const bootstrapMode = async () => {
  try {
    console.log('[ModeContext] Starting bootstrap');
    
    // Get stored mode from AsyncStorage
    const storedMode = await AsyncStorage.getItem('appMode');
    const storedServerUrl = await AsyncStorage.getItem('serverUrl');
    
    if (storedMode) {
      setMode(storedMode);  // 'standalone' | 'connected'
      if (storedMode === 'connected' && storedServerUrl) {
        setServerUrl(storedServerUrl);
      }
    }
    
    // Mark configuration complete - either has mode or user needs to select
    setModeConfigured(true);
  } catch (err) {
    console.error('[ModeContext] Error during bootstrap:', err);
  } finally {
    setLoading(false);
  }
};
```

**State Variables Set:**
- `mode`: 'standalone' | 'connected' | null
- `serverUrl`: Server URL (if connected mode)
- `modeConfigured`: True once mode is loaded
- `loading`: False once bootstrap completes

**Output:** RootNavigator waits for `modeConfigured && !modeLoading` before proceeding

---

### Phase 2: AuthContext Bootstrap (After ModeContext Ready)
**File:** [mobile/src/context/AuthContext.js](mobile/src/context/AuthContext.js)
**Trigger:** When `modeConfigured == true` (dependency watch)
**Duration:** Async (can take 1-3 seconds)

```javascript
// Lines 12-20: Dependency on modeConfigured
useEffect(() => {
  if (modeConfigured) {
    bootstrapAsync();
  }
}, [modeConfigured, mode]);

const bootstrapAsync = async () => {
  try {
    console.log('[Auth] Starting bootstrap. Mode:', mode);
    
    // CRITICAL: Database initialization happens HERE
    try {
      await initializeDatabase();
      console.log('[Auth] Database initialized successfully');
    } catch (dbError) {
      console.error('[Auth] Error initializing database:', dbError);
    }
    
    // Check for existing user session
    const currentUser = await authService.getCurrentUser();
    
    if (currentUser) {
      setUser(currentUser);
      setUserToken('authenticated');
    } else if (mode === 'standalone') {
      // Auto-auth guest user in standalone mode
      try {
        const result = await authService.login('guest', 'guest');
        setUser(result.user);
        setUserToken('authenticated');
      } catch (guestError) {
        // Fallback: auto-register guest
        const result = await authService.register('guest', 'Guest User', 'guest');
        setUser(result.user);
        setUserToken('authenticated');
      }
    }
  } catch (err) {
    console.error('[Auth] Error during bootstrap:', err);
  } finally {
    setLoading(false);
  }
};
```

**Key Action: DATABASE INITIALIZATION**
- Calls `initializeDatabase()` from [mobile/src/db/database.js](mobile/src/db/database.js)
- Creates all tables (users, addictions, moods, diaries, memories, weights, achievements, trophies, preparation_plans)
- Only runs once per app session (guard: `dbInitialized` flag)

**After Database Ready:**
- Fetches current user from storage
- In standalone mode: auto-auths as 'guest' user
- In connected mode: checks for existing session token

---

### Phase 3: Data Context Bootstrap (After Auth Ready)
**Files:** All data contexts in [mobile/src/context/](mobile/src/context/)
**Trigger:** Each context mounts (component tree renders)
**No explicit dependency chain** - they mount in parallel after AuthProvider

Each data context has identical pattern:

```javascript
// TrophyContext, AchievementContext, MemoryContext, WeightContext, AddictionContext
export function TrophyProvider({ children }) {
  const [trophies, setTrophies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTrophies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trophyService.getTrophies();
      setTrophies(data || []);
    } catch (err) {
      console.error('Error loading trophies:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // AUTOMATIC FETCH ON MOUNT
  useEffect(() => {
    loadTrophies();
  }, [loadTrophies]);

  return (
    <TrophyContext.Provider value={{ trophies, loading, error, loadTrophies }}>
      {children}
    </TrophyContext.Provider>
  );
}
```

**Trigger Order (all mounted when RootNavigator renders):**
1. AddictionProvider
2. WeightProvider
3. MemoryProvider
4. AchievementProvider
5. TrophyProvider
6. PreparationProvider
7. SelfAssessmentProvider

**No explicit waiting** - they load data in parallel (may show loading spinners in UI)

---

## 3. Database Initialization

**File:** [mobile/src/db/database.js](mobile/src/db/database.js)
**Function:** `initializeDatabase()`
**Trigger:** Called from AuthContext.bootstrapAsync() (Phase 2)

```javascript
export const initializeDatabase = async () => {
  if (dbInitialized && db) {
    console.log('Database already initialized');
    return;
  }

  try {
    // Opens SQLite database
    db = await SQLite.openDatabaseAsync('noctsDB.db');
    console.log('Database opened successfully');
    
    // Creates all tables with PRAGMA foreign_keys enabled
    await db.execAsync(`
      PRAGMA foreign_keys = ON;
      
      CREATE TABLE IF NOT EXISTS users (...);
      CREATE TABLE IF NOT EXISTS addictions (...);
      CREATE TABLE IF NOT EXISTS moods (...);
      CREATE TABLE IF NOT EXISTS diaries (...);
      CREATE TABLE IF NOT EXISTS memories (...);
      CREATE TABLE IF NOT EXISTS weights (...);
      CREATE TABLE IF NOT EXISTS achievements (...);
      CREATE TABLE IF NOT EXISTS trophies (...);
      CREATE TABLE IF NOT EXISTS preparation_plans (...);
    `);
    
    dbInitialized = true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};
```

**Export:** `getDatabase()` - Returns singleton database instance
```javascript
export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
};
```

---

## 4. Service Architecture (Mode-Based Delegation)

### Pattern: Adapter Pattern with Mode Detection

Each API service delegates to local or remote service based on current app mode.

**Example: addictionService** [mobile/src/api/addictionService.js](mobile/src/api/addictionService.js)

```javascript
import { localAddictionService } from '../services/localAddictionService';
import remoteAddictionService from '../services/remoteAddictionService';
import modeService from '../services/modeService';

// Get appropriate service based on current mode
const getAddictionService = async () => {
  const mode = await modeService.getActiveMode();
  if (mode === 'connected') {
    return remoteAddictionService;
  }
  return localAddictionService;
};

export const addictionService = {
  async getAddictions() {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      // Delegates to local or remote based on mode
      const service = await getAddictionService();
      return await service.getAddictions(user.id);
    } catch (error) {
      console.error('Error fetching addictions:', error);
      throw error;
    }
  },
  // ... other methods follow same pattern
};
```

### Services by Data Type

| Data Type | API Service | Local Service | Remote Service |
|-----------|-------------|---------------|----------------|
| Addictions | addictionService | localAddictionService | remoteAddictionService |
| Achievements | achievementService | localAchievementService | remoteAchievementService |
| Trophies | trophyService | localTrophyService | remoteTrophyService |
| Memories | memoryService | localMemoryService | remoteMemoryService |
| Weights | weightService | localWeightService | remoteWeightService |
| Mood | moodService | localMoodService | remoteMoodService |
| Diary | diaryService | localDiaryService | remoteDiaryService |
| Preparation | preparationService | localPreparationService | remotePreparationService |

---

## 5. Data Fetch Chains

### Trophy Data Flow

**Component Tree:**
```
TrophyProvider (mounts)
  ├─ useEffect with [loadTrophies] dependency
  ├─ loadTrophies() calls trophyService.getTrophies()
  ├─ trophyService determines mode
  ├─ localTrophyService.getTrophies(userId) OR remoteService call
  ├─ Gets database instance: getDatabase()
  ├─ Queries: SELECT * FROM trophies WHERE userId = ? ORDER BY earnedDate DESC
  ├─ Returns trophy array
  └─ Sets state: setTrophies(data)
```

**Implementation:** [mobile/src/services/localTrophyService.js](mobile/src/services/localTrophyService.js)

```javascript
export const localTrophyService = {
  async getTrophies(userId) {
    const db = getDatabase();  // Gets initialized DB from Phase 2
    
    try {
      const trophies = await db.getAllAsync(
        'SELECT * FROM trophies WHERE userId = ? ORDER BY earnedDate DESC',
        [userId]
      );
      
      return trophies;
    } catch (error) {
      console.error('Error fetching trophies:', error);
      throw error;
    }
  }
};
```

### Achievement Data Flow

**Component Tree:**
```
AchievementProvider (mounts)
  ├─ useEffect runs loadAchievements() AND loadTrophies()
  ├─ Both call achievementService methods (mode-delegating)
  ├─ Queries achievements and trophies tables
  └─ Sets both achievements and trophies state
```

**Implementation:** [mobile/src/services/localAchievementService.js](mobile/src/services/localAchievementService.js)

```javascript
export const localAchievementService = {
  async initializeAchievements(userId) {
    const db = getDatabase();
    // Inserts default achievements (First Step, 7 Days Strong, etc.)
  },

  async getAchievements(userId) {
    const db = getDatabase();
    const achievements = await db.getAllAsync(
      'SELECT * FROM achievements WHERE userId = ? ORDER BY isUnlocked DESC, unlockedDate DESC',
      [userId]
    );
    return achievements;
  }
};
```

### Addiction Data Flow

**Component Tree:**
```
AddictionProvider (mounts) - First in data contexts
  ├─ useEffect with empty deps runs fetchAddictions()
  ├─ Calls addictionService.getAddictions()
  ├─ Determines mode from AsyncStorage
  ├─ Calls localAddictionService.getAddictions(userId)
  ├─ Decrypts notes (encryption.js utility)
  └─ Returns addictions array
```

**Implementation:** [mobile/src/services/localAddictionService.js](mobile/src/services/localAddictionService.js)

```javascript
export const localAddictionService = {
  async getAddictions(userId) {
    const db = getDatabase();
    
    try {
      const addictions = await db.getAllAsync(
        'SELECT * FROM addictions WHERE userId = ? ORDER BY stopDate DESC',
        [userId]
      );
      
      // Decrypt sensitive notes before returning
      return addictions.map(addiction => ({
        ...addiction,
        notes: addiction.notes ? decrypt(addiction.notes) : ''
      }));
    } catch (error) {
      console.error('Error fetching addictions:', error);
      throw error;
    }
  }
};
```

### Memory Context Data Flow

**File:** [mobile/src/context/MemoryContext.js](mobile/src/context/MemoryContext.js)

```javascript
export function MemoryProvider({ children }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMemories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await memoryService.getMemories();
      setMemories(data || []);
    } catch (err) {
      console.error('Error loading memories:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMemories();  // Fetches on mount
  }, [loadMemories]);

  // Also provides manual refetch
  return (
    <MemoryContext.Provider value={{ 
      memories, 
      loading, 
      error, 
      addMemory, 
      updateMemory, 
      deleteMemory,
      loadMemories  // Can be called manually
    }}>
      {children}
    </MemoryContext.Provider>
  );
}
```

### Weight Context Data Flow

**File:** [mobile/src/context/WeightContext.js](mobile/src/context/WeightContext.js)

Similar to MemoryContext:
- Mounts → useEffect fires → loadWeights() → weightService.getWeights() → mode-based delegation

---

## 6. User Registration Flow (New User Setup)

**File:** [mobile/src/context/AuthContext.js](mobile/src/context/AuthContext.js) - Lines 78-99

```javascript
const register = async (email, password, nameOnPhone) => {
  setLoading(true);
  setError(null);
  try {
    const result = await authService.register(email, password, nameOnPhone);
    setUser(result.user);
    setUserToken('authenticated');
    
    // Initialize achievements for new user
    try {
      await achievementService.initializeAchievements();
      console.log('[Auth] Achievements initialized for new user');
    } catch (achievementError) {
      console.error('[Auth] Error initializing achievements:', achievementError);
    }
    
    return result;
  } catch (err) {
    const errorMessage = err.message || 'Registration failed';
    setError(errorMessage);
    throw err;
  } finally {
    setLoading(false);
  }
};
```

**Sequence:**
1. User registers → AuthContext.register() called
2. authService.register() → localAuthService.register() (standalone mode)
3. Creates user record in DB
4. Then achievementService.initializeAchievements() creates default achievements
5. User stored in AuthContext and AsyncStorage

---

## 7. Navigation Sequencing (RootNavigator)

**File:** [mobile/App.js](mobile/App.js) - Lines 452-515

```javascript
function RootNavigator() {
  const { userToken, loading: authLoading } = React.useContext(AuthContext);
  const { mode, modeConfigured, loading: modeLoading, isServerConfigured } = useMode();
  const { isDarkMode, loading: themeLoading } = React.useContext(DarkModeContext);
  
  // Wait for all bootstrap phases
  if (modeLoading || authLoading || themeLoading) {
    return <ActivityIndicator />;  // Show splash/loading
  }

  // Step 1: Mode not configured
  if (mode === null) {
    return <ModeSelectionScreen />;  // Let user select standalone/connected
  }

  // Step 2: Connected mode without server URL
  if (mode === 'connected' && !isServerConfigured()) {
    return <ServerConfigScreen />;  // Let user enter server URL
  }

  // Step 3: All configured, proceed with auth flow
  return userToken == null ? <AuthStack /> : <AppStack />;
}
```

**Loading States Watched:**
1. `modeLoading` - ModeContext.loading
2. `authLoading` - AuthContext.loading  
3. `themeLoading` - DarkModeContext.loading

**Navigation Flow:**
1. If any loading → Show ActivityIndicator
2. If mode is null → Show ModeSelectionScreen (choose standalone/connected)
3. If connected & no server URL → Show ServerConfigScreen
4. If no userToken → Show AuthStack (Login/Register)
5. If userToken exists → Show AppStack (Main app) → Data contexts load in parallel

---

## 8. Complete Initialization Timeline (Milliseconds)

```
T+0ms:     App() renders
T+0ms:     ModeProvider mounts
T+5ms:     ModeContext.bootstrapMode() starts (async)
T+50ms:    ModeContext sets modeConfigured=true
T+50ms:    AuthProvider mounts, useEffect triggers
T+55ms:    AuthContext.bootstrapAsync() starts
T+100ms:   initializeDatabase() called
T+200ms:   SQLite DB opened, tables created
T+250ms:   authService.getCurrentUser() checks for user
T+300ms:   Auth bootstrap complete, userToken/user set
T+300ms:   RootNavigator renders AppStack (if logged in)
T+310ms:   All data Providers mount in parallel:
           - AddictionProvider → fetchAddictions() + trophyService.getTrophies()
           - WeightProvider → loadWeights()
           - MemoryProvider → loadMemories()
           - AchievementProvider → loadAchievements() + loadTrophies()
           - TrophyProvider → loadTrophies()
           - PreparationProvider → loadPreparations()
           - SelfAssessmentProvider → loadAssessments()
T+500ms:   Most data loaded, UI with trophies/achievements/etc visible
T+1000ms:  All async operations complete
```

---

## 9. Key Files Reference

### Core Initialization
- **Database:** [mobile/src/db/database.js](mobile/src/db/database.js)
- **ModeContext:** [mobile/src/context/ModeContext.js](mobile/src/context/ModeContext.js)
- **AuthContext:** [mobile/src/context/AuthContext.js](mobile/src/context/AuthContext.js)
- **Entry Point:** [mobile/App.js](mobile/App.js)

### Data Contexts
- **Trophy:** [mobile/src/context/TrophyContext.js](mobile/src/context/TrophyContext.js)
- **Achievement:** [mobile/src/context/AchievementContext.js](mobile/src/context/AchievementContext.js)
- **Memory:** [mobile/src/context/MemoryContext.js](mobile/src/context/MemoryContext.js)
- **Weight:** [mobile/src/context/WeightContext.js](mobile/src/context/WeightContext.js)
- **Addiction:** [mobile/src/context/AddictionContext.js](mobile/src/context/AddictionContext.js)
- **Preparation:** [mobile/src/context/PreparationContext.js](mobile/src/context/PreparationContext.js)

### Services
- **API Layer (Routers):** [mobile/src/api/](mobile/src/api/)
  - addictionService, achievementService, trophyService, memoryService, weightService, etc.
- **Local Services:** [mobile/src/services/local*.js](mobile/src/services/)
- **Remote Services:** [mobile/src/services/remote*.js](mobile/src/services/)
- **Mode Service:** [mobile/src/services/modeService.js](mobile/src/services/modeService.js)
- **Auth Service:** [mobile/src/api/authService.js](mobile/src/api/authService.js)

### Utilities
- **Encryption:** [mobile/src/utils/encryption.js](mobile/src/utils/encryption.js)
- **JWT Helper:** [mobile/src/utils/jwtHelper.js](mobile/src/utils/jwtHelper.js)
- **i18n:** [mobile/src/i18n/](mobile/src/i18n/)

---

## 10. Critical Dependencies & Order

**STRICT ORDER (must not change):**
1. ✅ **ModeProvider** - Must be first (determines mode)
2. ✅ **DarkModeProvider** - Can be 2nd or 3rd
3. ✅ **BiometricProvider** - Can be 2nd or 3rd
4. ✅ **AuthProvider** - Must be 4th (depends on mode, initializes DB)
5. ⚠️ **Data Providers** - Can be any order (AddictionProvider, WeightProvider, MemoryProvider, AchievementProvider, TrophyProvider, PreparationProvider, SelfAssessmentProvider)

**Why Order Matters:**
- ModeProvider must be first because AuthProvider reads from it
- AuthProvider must initialize database before data contexts try to query
- Data contexts can load in parallel (no inter-dependencies)

**If Order Changed:**
- Moving AuthProvider before ModeProvider → "Mode not configured" error
- Moving data providers before AuthProvider → Database error (not initialized)

---

## 11. Error Handling & Fallbacks

### Database Initialization Failures
- AuthContext catches DB errors but continues bootstrap
- If DB fails, user can still auth in connected mode
- Local mode with failed DB will not work

### Missing Mode Configuration
- If no mode stored: RootNavigator shows ModeSelectionScreen
- User must explicitly select standalone or connected

### Missing User Session
- If no user after bootstrap: Shows auth stack (login screen)
- Standalone mode auto-creates guest user as fallback

### Data Loading Failures
- Each context individually catches errors
- Sets `error` state and shows `loading: false`
- Components using contexts should check for errors

---

## 12. Usage: Consuming Data in Components

### Example Component Using Trophy Data
```javascript
import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useTrophy } from '../context/TrophyContext';

function TrophiesScreen() {
  const { trophies, loading, error } = useTrophy();

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error}</Text>;
  
  return (
    <FlatList
      data={trophies}
      renderItem={({ item }) => <TrophyCard trophy={item} />}
      keyExtractor={item => item.id.toString()}
    />
  );
}
```

### Example: Manually Triggering Data Refresh
```javascript
import { useTrophy } from '../context/TrophyContext';
import { useMemory } from '../context/MemoryContext';

function MyScreen() {
  const { trophies, loadTrophies } = useTrophy();
  const { memories, loadMemories } = useMemory();

  const handleRefresh = async () => {
    await Promise.all([
      loadTrophies(),
      loadMemories()
    ]);
  };

  return (
    <Button title="Refresh" onPress={handleRefresh} />
  );
}
```

---

## Summary

**Initialization Happens in 3 Phases:**
1. **ModeContext** - Loads app mode (standalone/connected) from storage
2. **AuthContext** - Initializes database, authenticates user
3. **Data Contexts** - Load trophy/achievement/memory/weight/addiction data in parallel

**Service Architecture:**
- API services route to local or remote implementations based on mode
- Local services query SQLite database
- Remote services make HTTP requests to backend server

**Database:**
- Initialized only once per app session
- Tables created in AuthContext bootstrap
- All local services call `getDatabase()` to access it

**Auto-Loading:**
- Every data context automatically fetches data on mount via useEffect
- Manual `loadX()` functions available for refresh
- Loading/error states provided for UI feedback
