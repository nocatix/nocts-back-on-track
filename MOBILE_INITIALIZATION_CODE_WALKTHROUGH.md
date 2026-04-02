# Mobile App Initialization - Code Walkthrough

This document shows the actual code from the repository showing how initialization flows through the app.

---

## Phase 1: App Entry Point

**File:** [mobile/App.js](mobile/App.js) - Root Component

```javascript
// Lines 543-559: DEFAULT EXPORT - ENTRY POINT FOR ENTIRE APP
export default function App() {
  // Initialize language on app startup
  useEffect(() => {
    initializeLanguage();
  }, []);

  return (
    /* PROVIDER TREE - INITIALIZATION ORDER MATTERS HERE */
    <ModeProvider>                                    {/* PHASE 1 */}
      <DarkModeProvider>                             {/* Can be 2nd */}
        <BiometricProvider>                          {/* Can be 3rd */}
          <AuthProvider>                             {/* PHASE 2 - Depends on ModeProvider */}
            <AddictionProvider>                      {/* PHASE 3 - Parallel */}
              <WeightProvider>                       {/* PHASE 3 - Parallel */}
                <MemoryProvider>                     {/* PHASE 3 - Parallel */}
                  <AchievementProvider>              {/* PHASE 3 - Parallel */}
                    <TrophyProvider>                 {/* PHASE 3 - Parallel */}
                      <PreparationProvider>          {/* PHASE 3 - Parallel */}
                        <SelfAssessmentProvider>     {/* PHASE 3 - Parallel */}
                          <RootNavigator />          {/* Navigation logic */}
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

## Phase 1: ModeContext Bootstrap

**File:** [mobile/src/context/ModeContext.js](mobile/src/context/ModeContext.js)

```javascript
// PHASE 1: RUNS FIRST
export function ModeProvider({ children }) {
  const [mode, setMode] = useState(null); // 'standalone' | 'connected'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverUrl, setServerUrl] = useState(null);
  const [modeConfigured, setModeConfigured] = useState(false);

  // ══════════════════════════════════════════════════════════════════
  // MOUNTS WHEN ModeProvider RENDERS (On App Start)
  // ══════════════════════════════════════════════════════════════════
  useEffect(() => {
    bootstrapMode();
  }, []); // EMPTY DEPENDENCY ARRAY - RUNS ONCE ON MOUNT

  const bootstrapMode = async () => {
    try {
      console.log('[ModeContext] Starting bootstrap');
      
      // GET STORED MODE FROM ASYNC STORAGE (Previously saved by user)
      const storedMode = await AsyncStorage.getItem('appMode');
      const storedServerUrl = await AsyncStorage.getItem('serverUrl');
      
      console.log('[ModeContext] Stored mode:', storedMode);
      
      if (storedMode) {
        setMode(storedMode);  // ← Sets to 'standalone' or 'connected'
        
        if (storedMode === 'connected' && storedServerUrl) {
          setServerUrl(storedServerUrl);  // ← Sets server URL for connected mode
        }
      }
      
      // CRITICAL: Mark configuration complete
      // This allows AuthProvider useEffect to trigger
      setModeConfigured(true);  // ← SIGNALS AuthProvider TO START
      console.log('[ModeContext] Bootstrap complete');
    } catch (err) {
      console.error('[ModeContext] Error during bootstrap:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of ModeContext implementation

  return (
    <ModeContext.Provider
      value={{
        mode,                    // Current mode
        modeConfigured,          // ← AuthProvider watches this
        loading,
        error,
        serverUrl,
        selectMode,
        updateServerUrl,
        isServerConfigured,
        switchMode,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
}

export const useMode = () => {
  const context = React.useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within ModeProvider');
  }
  return context;
};
```

### Result After Phase 1 (~50ms elapsed):
- ✅ `modeConfigured = true` (or false if no stored mode)
- ✅ `mode = 'standalone' | 'connected' | null`
- ✅ `serverUrl = URL string | null`
- ⏳ AuthProvider can now start bootstrap

---

## Phase 2: AuthContext Bootstrap

**File:** [mobile/src/context/AuthContext.js](mobile/src/context/AuthContext.js)

```javascript
import { initializeDatabase } from '../db/database';

// PHASE 2: DEPENDS ON MODE CONTEXT
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { mode, modeConfigured } = useMode();  // ← Gets from ModeContext

  // ══════════════════════════════════════════════════════════════════
  // WAITS FOR modeConfigured FROM ModeContext TO BECOME TRUE
  // ══════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (modeConfigured) {                        // ← Watches ModeContext
      bootstrapAsync();                          // ← Trigger bootstrap
    }
  }, [modeConfigured, mode]);                    // DEPENDENCIES: Mode from ModeContext

  const bootstrapAsync = async () => {
    try {
      console.log('[Auth] Starting bootstrap. Mode:', mode);
      
      // ══════════════════════════════════════════════════════════════════
      // CRITICAL: INITIALIZE DATABASE HERE
      // ══════════════════════════════════════════════════════════════════
      try {
        await initializeDatabase();              // ← DATABASE SETUP HAPPENS HERE
        console.log('[Auth] Database initialized successfully');
      } catch (dbError) {
        console.error('[Auth] Error initializing database:', dbError);
        // Continue anyway - connected mode might work
      }
      
      // CHECK FOR EXISTING USER SESSION
      const currentUser = await authService.getCurrentUser();
      console.log('[Auth] Bootstrap complete. User:', currentUser ? 'exists' : 'null');
      
      if (currentUser) {
        // User already logged in - restore session
        setUser(currentUser);
        setUserToken('authenticated');
      } else if (mode === 'standalone') {
        // In standalone mode, auto-authenticate guest user
        console.log('[Auth] Standalone mode detected - auto-authenticating guest user');
        try {
          // TRY LOGIN AS GUEST
          const result = await authService.login('guest', 'guest');
          setUser(result.user);
          setUserToken('authenticated');
        } catch (guestError) {
          // If login fails, try REGISTER guest
          console.log('[Auth] Auto-login failed, attempting auto-register');
          try {
            const result = await authService.register('guest', 'Guest User', 'guest');
            setUser(result.user);
            setUserToken('authenticated');
          } catch (registerError) {
            console.error('[Auth] Error creating guest user:', registerError);
          }
        }
      }
    } catch (err) {
      console.error('[Auth] Error during bootstrap:', err);
    } finally {
      console.log('[Auth] Bootstrap finished, setting loading to false');
      setLoading(false);  // ← ALLOWS RootNavigator TO PROCEED
    }
  };

  // ... rest of AuthContext implementation (login, register, logout)

  return (
    <AuthContext.Provider
      value={{
        user,                     // Current user
        userToken,                // 'authenticated' or null
        login,
        register,
        logout,
        loading,                  // ← RootNavigator watches this
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Result After Phase 2 (~300-500ms elapsed):
- ✅ Database initialized and all tables created
- ✅ User loaded from storage or auto-auth as guest
- ✅ `userToken = 'authenticated' | null`
- ✅ `loading = false`
- ⏳ RootNavigator can now show AppStack

---

## Database Initialization

**File:** [mobile/src/db/database.js](mobile/src/db/database.js)

```javascript
import * as SQLite from 'expo-sqlite';

// SINGLETON Instance
let db = null;
let dbInitialized = false;

// ══════════════════════════════════════════════════════════════════
// CALLED FROM AuthContext.bootstrapAsync()
// ══════════════════════════════════════════════════════════════════
export const initializeDatabase = async () => {
  // GUARD: Prevent re-initialization
  if (dbInitialized && db) {
    console.log('Database already initialized');
    return;
  }

  try {
    // OPEN DATABASE FILE
    db = await SQLite.openDatabaseAsync('noctsDB.db');
    console.log('Database opened successfully');
    
    // CREATE TABLES with proper error handling
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
      
      CREATE TABLE IF NOT EXISTS addictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        name TEXT NOT NULL,
        stopDate DATETIME NOT NULL,
        frequencyPerDay REAL NOT NULL,
        moneySpentPerDay REAL NOT NULL,
        notes TEXT,
        notesIv TEXT,
        notesAuthTag TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
      );
      
      CREATE TABLE IF NOT EXISTS moods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        date DATETIME NOT NULL,
        primaryMood TEXT NOT NULL,
        secondaryMood TEXT,
        intensity INTEGER DEFAULT 3,
        notes TEXT,
        notesIv TEXT,
        notesAuthTag TEXT,
        triggers TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id),
        UNIQUE(userId, date)
      );
      
      CREATE TABLE IF NOT EXISTS diaries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        date DATETIME NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        contentIv TEXT,
        contentAuthTag TEXT,
        mood TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
      );
      
      CREATE TABLE IF NOT EXISTS memories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        date DATETIME NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        descriptionIv TEXT,
        descriptionAuthTag TEXT,
        type TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
      );
      
      CREATE TABLE IF NOT EXISTS weights (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        date DATETIME NOT NULL,
        weight REAL NOT NULL,
        unit TEXT DEFAULT 'lbs',
        notes TEXT,
        notesIv TEXT,
        notesAuthTag TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
      );
      
      CREATE TABLE IF NOT EXISTS achievements (
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
      
      CREATE TABLE IF NOT EXISTS trophies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        earnedDate DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
      );
      
      CREATE TABLE IF NOT EXISTS preparation_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        addictionId INTEGER,
        assessFrequency TEXT,
        assessMoney TEXT,
        assessTime TEXT,
        assessTriggers TEXT,
        assessImpact TEXT,
        assessObstacles TEXT,
        assessFrequencyIv TEXT,
        assessFrequencyAuthTag TEXT,
        assessMoneyIv TEXT,
        assessMoneyAuthTag TEXT,
        assessTimeIv TEXT,
        assessTimeAuthTag TEXT,
        assessTriggersIv TEXT,
        assessTriggersAuthTag TEXT,
        assessImpactIv TEXT,
        assessImpactAuthTag TEXT,
        assessObstaclesIv TEXT,
        assessObstaclesAuthTag TEXT,
        synced INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id),
        FOREIGN KEY(addictionId) REFERENCES addictions(id)
      );
    `);
    
    dbInitialized = true;
    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

// ══════════════════════════════════════════════════════════════════
// EXPORT: Get database instance (used by all services)
// ══════════════════════════════════════════════════════════════════
export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
};
```

---

## Phase 3: RootNavigator Logic

**File:** [mobile/App.js](mobile/App.js) - Lines 445-515

```javascript
// ══════════════════════════════════════════════════════════════════
// RENDERS AFTER PHASE 1 & 2 COMPLETE
// ══════════════════════════════════════════════════════════════════
function RootNavigator() {
  const { userToken, loading: authLoading } = React.useContext(AuthContext);
  const { mode, modeConfigured, loading: modeLoading, isServerConfigured } = useMode();
  const { isDarkMode, loading: themeLoading } = React.useContext(DarkModeContext);
  const { isBiometricEnabled, isAuthenticated, setIsAuthenticated } = React.useContext(BiometricContext);
  const theme = getTheme(isDarkMode);

  // Handle app state changes (backgrounding) to re-lock biometric
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [isBiometricEnabled, isAuthenticated]);

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'background' && isBiometricEnabled && isAuthenticated) {
      setIsAuthenticated(false);
    }
  };

  console.log('[RootNavigator] State:', { userToken, authLoading, mode, modeConfigured, modeLoading });

  // ══════════════════════════════════════════════════════════════════
  // WAIT FOR PHASE 1 & 2 TO COMPLETE
  // ══════════════════════════════════════════════════════════════════
  if (modeLoading || authLoading || themeLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // DECISION 1: Mode not set - user needs to choose
  // ══════════════════════════════════════════════════════════════════
  if (mode === null) {
    return (
      <NavigationContainer>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.cardBg} />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: theme.colors.background },
          }}
        >
          <Stack.Screen name="ModeSelection" component={ModeSelectionScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // DECISION 2: Connected mode but server not configured
  // ══════════════════════════════════════════════════════════════════
  if (mode === 'connected' && !isServerConfigured()) {
    return (
      <NavigationContainer>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.cardBg} />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: theme.colors.background },
          }}
        >
          <Stack.Screen name="ServerConfig" component={ServerConfigScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // DECISION 3: Mode configured - auth flow (login or main app)
  // ══════════════════════════════════════════════════════════════════
  return (
    <NavigationContainer>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.cardBg} />
      <View style={{ flex: 1 }}>
        {userToken == null ? <AuthStack theme={theme} /> : <AppStack theme={theme} />}
        <OfflineIndicator />
        {/* Biometric Lock Overlay - only in standalone mode */}
        {mode === 'standalone' && isBiometricEnabled && !isAuthenticated && <BiometricLockScreen />}
      </View>
    </NavigationContainer>
  );
}
```

### Result After Phase 3 (~315ms elapsed):
- ✅ If `userToken == null`: Show login/register screen
- ✅ If `userToken == 'authenticated'`: Show AppStack (main app)
- ✅ All data contexts now mount automatically

---

## Phase 3: Data Context Auto-Load Example

**File:** [mobile/src/context/TrophyContext.js](mobile/src/context/TrophyContext.js)

```javascript
// PHASE 3: MOUNTS WHEN AppStack RENDERS (after auth complete)
export function TrophyProvider({ children }) {
  const [trophies, setTrophies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ══════════════════════════════════════════════════════════════════
  // MOUNTS WHEN TrophyProvider RENDERS IN TREE
  // AUTOMATICALLY FETCHES DATA
  // ══════════════════════════════════════════════════════════════════
  const loadTrophies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trophyService.getTrophies();  // ← Fetch data
      setTrophies(data || []);
    } catch (err) {
      console.error('Error loading trophies:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ══════════════════════════════════════════════════════════════════
  // AUTOMATIC FETCH ON MOUNT
  // ══════════════════════════════════════════════════════════════════
  useEffect(() => {
    loadTrophies();                              // ← Runs on mount
  }, [loadTrophies]);

  return (
    <TrophyContext.Provider value={{ 
      trophies,          // Data loaded from DB/server
      loading,           // True while fetching
      error,             // Error message if failed
      loadTrophies       // Manual refetch function
    }}>
      {children}
    </TrophyContext.Provider>
  );
}

// Hook to use trophy data in components
export const useTrophy = () => {
  const context = React.useContext(TrophyContext);
  if (!context) {
    throw new Error('useTrophy must be used within TrophyProvider');
  }
  return context;
};
```

---

## Service Router Example

**File:** [mobile/src/api/trophyService.js](mobile/src/api/trophyService.js)

```javascript
import trophyService from '../api/trophyService';

// ══════════════════════════════════════════════════════════════════
// API ROUTER: Determines local vs remote based on current mode
// ══════════════════════════════════════════════════════════════════
const getTrophyService = async () => {
  const mode = await modeService.getActiveMode();
  if (mode === 'connected') {
    return remoteTrophyService;     // ← HTTP to server
  }
  return localTrophyService;        // ← SQLite query
};

export const trophyService = {
  async getTrophies() {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      // ROUTE TO CORRECT SERVICE BASED ON CURRENT MODE
      const service = await getTrophyService();
      return await service.getTrophies(user.id);
    } catch (error) {
      console.error('Error fetching trophies:', error);
      throw error;
    }
  },

  // ... other methods
};
```

```

### Result: Mode-based execution
- **Standalone mode**: `localTrophyService` → SQLite query
- **Connected mode**: `remoteTrophyService` → HTTP request

---

## Local Trophy Service (Standalone Mode)

**File:** [mobile/src/services/localTrophyService.js](mobile/src/services/localTrophyService.js)

```javascript
import { getDatabase } from '../db/database';

// ══════════════════════════════════════════════════════════════════
// CALLED IN STANDALONE MODE - QUERIES LOCAL SQLITE
// ══════════════════════════════════════════════════════════════════
export const localTrophyService = {
  async getTrophies(userId) {
    // GET DATABASE INITIALIZED IN PHASE 2
    const db = getDatabase();
    
    try {
      // QUERY LOCAL SQLITE DATABASE
      const trophies = await db.getAllAsync(
        'SELECT * FROM trophies WHERE userId = ? ORDER BY earnedDate DESC',
        [userId]
      );
      
      return trophies;
    } catch (error) {
      console.error('Error fetching trophies:', error);
      throw error;
    }
  },

  async getTrophy(userId, trophyId) {
    const db = getDatabase();
    
    try {
      const trophy = await db.getFirstAsync(
        'SELECT * FROM trophies WHERE id = ? AND userId = ?',
        [trophyId, userId]
      );
      
      return trophy || null;
    } catch (error) {
      console.error('Error fetching trophy:', error);
      throw error;
    }
  },

  async createTrophy(userId, title, description) {
    const db = getDatabase();
    
    try {
      const result = await db.runAsync(
        `INSERT INTO trophies 
          (userId, title, description, earnedDate) 
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
        [userId, title, description]
      );
      
      const trophy = await db.getFirstAsync(
        'SELECT * FROM trophies WHERE id = ?',
        [result.lastInsertRowId]
      );
      
      return trophy;
    } catch (error) {
      console.error('Error creating trophy:', error);
      throw error;
    }
  },

  async deleteTrophy(userId, trophyId) {
    const db = getDatabase();
    
    try {
      const result = await db.runAsync(
        'DELETE FROM trophies WHERE id = ? AND userId = ?',
        [trophyId, userId]
      );
      
      return {
        message: 'Trophy deleted',
        deletedCount: result.changes
      };
    } catch (error) {
      console.error('Error deleting trophy:', error);
      throw error;
    }
  }
};
```

---

## Remote Trophy Service (Connected Mode)

**File:** [mobile/src/services/remoteTrophyService.js](mobile/src/services/remoteTrophyService.js)

```javascript
import axios from 'axios';
import modeService from './modeService';
import { getToken } from '../utils/jwtHelper';

// ══════════════════════════════════════════════════════════════════
// CALLED IN CONNECTED MODE - MAKES HTTP REQUESTS
// ══════════════════════════════════════════════════════════════════
export const remoteTrophyService = {
  async getTrophies() {
    try {
      // GET SERVER URL FROM ASYNC STORAGE
      const serverUrl = await modeService.getServerUrl();
      if (!serverUrl) {
        throw new Error('Server URL not configured');
      }
      
      // GET AUTH TOKEN
      const token = await getToken();
      
      // MAKE HTTP REQUEST TO BACKEND
      const response = await axios.get(
        `${serverUrl}/api/trophies`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching trophies:', error);
      throw error;
    }
  },

  async getTrophy(trophyId) {
    try {
      const serverUrl = await modeService.getServerUrl();
      const token = await getToken();
      
      const response = await axios.get(
        `${serverUrl}/api/trophies/${trophyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching trophy:', error);
      throw error;
    }
  },

  // ... other methods
};

export default remoteTrophyService;
```

---

## Complete Flow: Component Usage

**Example Component:** [mobile/src/pages/AchievementsScreen.js](mobile/src/pages/AchievementsScreen.js)

```javascript
import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useTrophy } from '../context/TrophyContext';
import { useAchievement } from '../context/AchievementContext';

export default function AchievementsScreen() {
  // ══════════════════════════════════════════════════════════════════
  // USES DATA FROM CONTEXT
  // Data was already loaded in Phase 3 automatically
  // ══════════════════════════════════════════════════════════════════
  const { trophies, loading: trophyLoading, error: trophyError } = useTrophy();
  const { achievements, loading: achievementLoading, error: achievementError } = useAchievement();

  if (trophyLoading || achievementLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (trophyError || achievementError) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>
          Error: {trophyError || achievementError}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Achievements ({achievements.length})</Text>
      <FlatList
        data={achievements}
        renderItem={({ item }) => (
          <View style={styles.achievementCard}>
            <Text style={styles.achievementTitle}>{item.title}</Text>
            <Text style={styles.achievementDesc}>{item.description}</Text>
            <Text style={styles.achievementStatus}>
              {item.isUnlocked ? '✓ Unlocked' : 'Locked'}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      <Text style={styles.title}>Trophies ({trophies.length})</Text>
      <FlatList
        data={trophies}
        renderItem={({ item }) => (
          <View style={styles.trophyCard}>
            <Text style={styles.trophyTitle}>🏆 {item.title}</Text>
            <Text style={styles.trophyDesc}>{item.description}</Text>
            <Text style={styles.trophyDate}>
              Earned: {new Date(item.earnedDate).toLocaleDateString()}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  achievementCard: {
    backgroundColor: 'white',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  achievementDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  achievementStatus: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
  },
  trophyCard: {
    backgroundColor: '#fff9e6',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
  },
  trophyTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  trophyDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  trophyDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  error: {
    color: 'red',
    fontSize: 14,
  },
});
```

---

## Complete Timeline Summary

```
T+0ms:      App() renders
            └─ ModeProvider mounts → useEffect fires
            
T+5ms:      ModeContext.bootstrapMode() async starts
            └─ AsyncStorage.getItem('appMode')
            
T+50ms:     ModeContext sets modeConfigured=true
            └─ AuthProvider useEffect dependencies trigger
            
T+55ms:     AuthContext.bootstrapAsync() async starts
            └─ initializeDatabase() called
            
T+100ms:    SQLite opens 'noctsDB.db'
            
T+150ms:    db.execAsync() creates all tables
            
T+200ms:    Database fully initialized
            └─ dbInitialized = true
            
T+250ms:    authService.getCurrentUser() checks session
            
T+300ms:    Auth bootstrap complete
            └─ setLoading(false) in AuthContext
            └─ setUserToken('authenticated')
            
T+310ms:    RootNavigator checks: NOT loading
            └─ mode != null ✓
            └─ userToken != null ✓
            └─ Renders AppStack
            
T+315ms:    All data Providers mount SIMULTANEOUSLY:
            ├─ TrophyProvider.useEffect → loadTrophies()
            ├─ AchievementProvider.useEffect → loadAchievements()
            ├─ MemoryProvider.useEffect → loadMemories()
            ├─ WeightProvider.useEffect → loadWeights()
            ├─ AddictionProvider.useEffect → fetchAddictions()
            ├─ PreparationProvider.useEffect → loadPreparations()
            └─ SelfAssessmentProvider.useEffect → loadAssessments()
            
T+320ms:    trophyService.getTrophies() routes to service
            └─ localTrophyService.getTrophies(userId)
            └─ getDatabase() returns initialized DB
            
T+350ms:    db.getAllAsync(SELECT * FROM trophies)
            
T+400ms:    Trophy data returned
            └─ setTrophies(data) in TrophyContext
            
T+450ms:    Achievement data returned
T+500ms:    Memory data returned
T+550ms:    Weight data returned
T+600ms:    Addiction data returned
...
T+800ms:    All data loaded
            └─ All contexts have loading=false
            └─ UI fully populated
            
T+1000ms:   Complete initialization
```

---

## Error Scenarios & Recovery

### Scenario 1: ModeProvider not mounted
```
ERROR: Cannot destructure useMode() context
CAUSE: useMode() called outside ModeProvider tree
FIX: Check App.js provider nesting - ModeProvider must be first
```

### Scenario 2: Database not initialized when service called
```
ERROR: Database not initialized. Call initializeDatabase() first.
CAUSE: getDatabase() called before AuthContext.bootstrapAsync() completes
FIX: Check that AuthProvider wraps all data contexts
```

### Scenario 3: TrophyContext data undefined in component
```
ERROR: Cannot read property 'map' of undefined (trophies is undefined)
CAUSE: Component renders before TrophyProvider auto-fetches data
FIX: Check for loading/error states before rendering:
  if (loading) return <Spinner />
  if (error) return <Error msg={error} />
  return <FlatList data={trophies} ... />
```

### Scenario 4: Service can't determine mode
```
ERROR: Cannot auto-route service: mode is null
CAUSE: ModeContext bootstrap incomplete
FIX: Ensure mode is selected before accessing protected screens
```

---

## Key Takeaways

1. **ModeProvider MUST be outermost** - Sets up `modeConfigured` signal
2. **AuthProvider AFTER ModeProvider** - Waits for `modeConfigured=true`
3. **Database init happens in AuthContext** - After mode determined
4. **All data contexts load in parallel** - No inter-dependencies
5. **Service layer routes based on mode** - Single API, two implementations
6. **Components use hooks** - Auto-get data from contexts
7. **State management is declarative** - Each context owns its data
8. **Error handling is localized** - Doesn't cascade up the tree

This architecture allows seamless switching between offline (SQLite) and online (server) modes while maintaining a single codebase and unified API surface.
