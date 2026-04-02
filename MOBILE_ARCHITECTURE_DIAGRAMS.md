# Mobile App Architecture - Quick Reference Diagrams

## 1. Provider Tree & Initialization Order

```
App.js (Root)
│
├─ Phase 1 (Loads Immediately)
│  └─ ModeProvider
│     └─ [bootstrapMode in useEffect]
│        └─ Read AsyncStorage for appMode & serverUrl
│        └─ Set modeConfigured=true when done
│
├─ Phase 2 (After modeConfigured=true)
│  ├─ DarkModeProvider
│  ├─ BiometricProvider
│  └─ AuthProvider
│     └─ [bootstrapAsync in useEffect, depends on modeConfigured]
│        └─ initializeDatabase()  ← DATABASE CREATED HERE
│        └─ Check current user / auto-auth guest
│        └─ Set userToken & user state
│
├─ Phase 3 (After userToken set)
│  ├─ AddictionProvider → fetchAddictions() [PARALLEL]
│  ├─ WeightProvider → loadWeights() [PARALLEL]
│  ├─ MemoryProvider → loadMemories() [PARALLEL]
│  ├─ AchievementProvider → loadAchievements() + loadTrophies() [PARALLEL]
│  ├─ TrophyProvider → loadTrophies() [PARALLEL]
│  ├─ PreparationProvider → loadPreparations() [PARALLEL]
│  └─ SelfAssessmentProvider → loadAssessments() [PARALLEL]
│
└─ RootNavigator
   └─ Waits for: modeLoading=F, authLoading=F
   └─ Shows: ModeSelection → ServerConfig → AuthStack/AppStack
```

---

## 2. Initialization Waterfall

```
Timeline (milliseconds)
│
0ms  ┌─ App() mounts
     │
     ├─ ModeProvider mount
     │  └─ useEffect() → bootstrapMode() [async]
     │
5ms  │  → AsyncStorage.getItem('appMode')
     │  → AsyncStorage.getItem('serverUrl')
     │  → setModeConfigured(true)
     │
50ms ├─ modeConfigured = true triggers AuthProvider useEffect
     │
     ├─ AuthProvider.useEffect fires
     │  └─ if (modeConfigured) → bootstrapAsync() [async]
     │
55ms │  → initializeDatabase() [BLOCKING]
     │
100ms│  → SQLite.openDatabaseAsync('noctsDB.db')
     │  → execAsync(CREATE TABLE statements)
     │  → dbInitialized = true
     │
200ms├─ authService.getCurrentUser() [async]
     │
300ms├─ Auth bootstrap complete
     │  └─ setLoading(false)
     │  └─ setUserToken('authenticated')
     │  └─ setUser(currentUser)
     │
310ms├─ RootNavigator checks: (NOT loading)
     │  ├─ If mode=null → ModeSelectionScreen
     │  ├─ Elif mode='connected' && no serverUrl → ServerConfigScreen
     │  └─ Else → AuthStack or AppStack
     │
315ms├─ AppStack renders (if logged in)
     │  └─ All data Providers mount SIMULTANEOUSLY
     │     ├─ AddictionProvider useEffect → fetchAddictions()
     │     ├─ WeightProvider useEffect → loadWeights()
     │     ├─ MemoryProvider useEffect → loadMemories()
     │     ├─ AchievementProvider useEffect → loadAchievements()
     │     ├─ TrophyProvider useEffect → loadTrophies()
     │     ├─ PreparationProvider useEffect → loadPreparations()
     │     └─ SelfAssessmentProvider useEffect → loadAssessments()
     │
360ms│  All services start → trophyService.getTrophies() etc
     │  → Mode detection: getActiveMode()
     │  → Route to local or remote service
     │  → Local: getDatabase() → db.getAllAsync(SQL query)
     │  → Remote: axios.get(server_url)
     │
500ms├─ First data returned (fastest queries)
     │
800ms├─ Most data returned
     │
1000ms└─ All async operations complete
       └─ UI fully populated with data
```

---

## 3. Database Initialization Detail

```
initializeDatabase() [Called from AuthContext.bootstrapAsync]
│
├─ Guard: if (dbInitialized && db) return
│
├─ SQLite.openDatabaseAsync('noctsDB.db')
│  └─ If file doesn't exist → Create new DB
│  └─ If exists → Open existing DB
│
├─ db.execAsync() with SQL schema:
│  │
│  ├─ PRAGMA foreign_keys = ON
│  │
│  ├─ CREATE TABLE users
│  │  └─ id, username, fullName, password, unitPreference, createdAt
│  │
│  ├─ CREATE TABLE addictions
│  │  └─ id, userId, name, stopDate, frequencyPerDay, moneySpentPerDay, notes[encrypted]
│  │
│  ├─ CREATE TABLE moods
│  │  └─ id, userId, date, primaryMood, secondaryMood, intensity, notes[encrypted], triggers
│  │
│  ├─ CREATE TABLE diaries
│  │  └─ id, userId, date, title, content[encrypted], mood
│  │
│  ├─ CREATE TABLE memories
│  │  └─ id, userId, date, title, description[encrypted], type
│  │
│  ├─ CREATE TABLE weights
│  │  └─ id, userId, date, weight, unit, notes[encrypted]
│  │
│  ├─ CREATE TABLE achievements
│  │  └─ id, userId, title, description, type, unlockedDate, isUnlocked
│  │
│  ├─ CREATE TABLE trophies
│  │  └─ id, userId, title, description, earnedDate
│  │
│  └─ CREATE TABLE preparation_plans
│     └─ id, userId, addictionId, assessFrequency[encrypted], ...
│
├─ db = reference to opened database
├─ dbInitialized = true
│
└─ Export getDatabase() → Returns singleton db instance
```

---

## 4. Service Architecture (Mode-Based Delegation)

```
┌─ USER COMPONENT
│  Uses: useAddiction() hook or trophyService.getTrophies()
│
├─ API SERVICE LAYER (Routers)
│  addictionService.getAddictions()
│  │
│  ├─ Get user from AsyncStorage
│  ├─ getAddictionService() → Check mode
│  │  │
│  │  ├─ If mode='connected'
│  │  │  └─ return remoteAddictionService
│  │  │
│  │  └─ Else (standalone)
│  │     └─ return localAddictionService
│  │
│  └─ Call service.getAddictions(userId)
│
├─ IMPLEMENTATION LAYER
│  │
│  ├─ LOCAL SERVICE (Standalone Mode)
│  │  localAddictionService.getAddictions(userId)
│  │  │
│  │  ├─ getDatabase() → Get SQLite instance
│  │  ├─ db.getAllAsync("SELECT * FROM addictions WHERE userId=?", [userId])
│  │  ├─ Decrypt encrypted fields
│  │  └─ Return array of addictions
│  │
│  └─ REMOTE SERVICE (Connected Mode)
│     remoteAddictionService.getAddictions(userId)
│     │
│     ├─ getServerUrl() → Get server from AsyncStorage
│     ├─ axios.get(`${serverUrl}/api/addictions`)
│     ├─ Include auth token in headers
│     └─ Return response.data
│
└─ DATA STORAGE
   ├─ SQLite Database (Local)
   │  └─ /data/user/0/com.company.app/databases/noctsDB.db
   │
   └─ Remote Server (Connected)
      └─ MongoDB at serverUrl/api/addictions
```

---

## 5. Trophy Data Fetch Flow (Detailed)

```
User Navigates to Achievements Screen
│
├─ AchievementsScreen component renders
│  └─ useTrophy() hook called
│  └─ Returns: { trophies, loading, error, loadTrophies }
│
├─ TrophyContext provides data
│  └─ From TrophyProvider state
│
├─ TrophyProvider (mounted once in tree)
│  │
│  ├─ useState([]) → trophies
│  ├─ useState(false) → loading
│  ├─ useState(null) → error
│  │
│  ├─ useEffect(() => {
│  │  loadTrophies()  ← Fires on mount
│  │ }, [loadTrophies])
│  │
│  └─ loadTrophies = useCallback(async () => {
│     try {
│       setLoading(true)
│       setError(null)
│       const data = await trophyService.getTrophies()
│       setTrophies(data || [])
│     } catch(err) {
│       setError(err.message)
│     } finally {
│       setLoading(false)
│     }
│    }, [])
│
├─ trophyService.getTrophies()
│  │
│  ├─ Get user from AsyncStorage
│  ├─ const service = await getServiceByMode()
│  │  └─ Check AsyncStorage 'appMode'
│  │  └─ Return localTrophyService or remoteTrophyService
│  │
│  └─ return await service.getTrophies(user.id)
│
├─ STANDALONE: localTrophyService.getTrophies(userId)
│  │
│  ├─ const db = getDatabase()
│  │  └─ Returns initialized SQLite instance
│  │
│  ├─ db.getAllAsync(
│  │   'SELECT * FROM trophies WHERE userId=? ORDER BY earnedDate DESC',
│  │   [userId]
│  │ )
│  │  └─ Query executes against local SQLite DB
│  │
│  └─ return trophies array (from DB)
│
├─ OR CONNECTED: remoteTrophyService.getTrophies(userId)
│  │
│  ├─ Get serverUrl from modeService/AsyncStorage
│  ├─ axios.get(`${serverUrl}/api/trophies`, {
│  │   headers: { Authorization: bearer token }
│  │ })
│  │  └─ HTTP request to remote server
│  │
│  └─ return response.data (from server)
│
├─ Response returned to TrophyProvider
│  └─ setTrophies(data) → Update state
│  └─ setLoading(false) → Stop spinner
│
└─ Component re-renders with trophy list
   └─ {trophies.map(t => <TrophyCard key={t.id} trophy={t} />)}
```

---

## 6. Achievement Initialization (New User)

```
User Registers
│
├─ AuthContext.register(email, password, fullName)
│  │
│  ├─ authService.register(email, password, fullName)
│  │  ├─ localAuthService.register()
│  │  │  ├─ getDatabase()
│  │  │  ├─ INSERT INTO users (username, fullName, password, ...)
│  │  │  └─ Saved to SQLite
│  │  │
│  │  └─ Return user object
│  │
│  ├─ setUser(result.user)
│  ├─ setUserToken('authenticated')
│  │
│  └─ await achievementService.initializeAchievements()
│     │
│     ├─ getAchievementService() → Check mode
│     │  └─ Return localAchievementService
│     │
│     └─ localAchievementService.initializeAchievements(userId)
│        │
│        ├─ getDatabase()
│        │
│        ├─ For each default achievement:
│        │  ├─ INSERT INTO achievements
│        │  │  (userId, title, description, type, isUnlocked=0)
│        │  │
│        │  ├─ 'First Step' - Add your first addiction
│        │  ├─ '7 Days Strong' - Go 7 days without relapse
│        │  ├─ '30 Days Strong' - Go 30 days without relapse
│        │  ├─ '90 Days Strong' - Go 90 days without relapse
│        │  └─ ... (7 total default achievements)
│        │
│        └─ All locked (isUnlocked=0) until criteria met
│
└─ User sees locked achievement cards on dashboard
```

---

## 7. Key State Variables & Their Purpose

```
GLOBAL STATE (App Level)
│
├─ ModeContext
│  ├─ mode: 'standalone' | 'connected' | null
│  ├─ modeConfigured: boolean (true when mode decision made)
│  ├─ serverUrl: string (only in connected mode)
│  └─ loading: boolean (true while reading mode from storage)
│
├─ AuthContext
│  ├─ user: { id, username, fullName, ... } | null
│  ├─ userToken: 'authenticated' | null
│  ├─ loading: boolean (true during bootstrap)
│  └─ error: string (error message if auth failed)
│
├─ DarkModeContext
│  ├─ isDarkMode: boolean
│  └─ loading: boolean
│
├─ BiometricContext
│  ├─ isBiometricEnabled: boolean
│  └─ isAuthenticated: boolean (checked on app backgrounding)
│
└─ DATA CONTEXTS (Similar Pattern)
   │
   ├─ TrophyContext
   │  ├─ trophies: Array<{ id, userId, title, description, earnedDate }>
   │  ├─ loading: boolean (true while fetching)
   │  └─ error: string (null if success)
   │
   ├─ AchievementContext
   │  ├─ achievements: Array<{ id, userId, title, description, type, isUnlocked, unlockedDate }>
   │  ├─ trophies: Array<{...}> (also loaded here)
   │  ├─ loading: boolean
   │  └─ error: string
   │
   ├─ MemoryContext
   │  ├─ memories: Array<{ id, userId, date, title, description, type }>
   │  ├─ loading: boolean
   │  └─ error: string
   │
   ├─ WeightContext
   │  ├─ weights: Array<{ id, userId, date, weight, unit, notes }>
   │  ├─ loading: boolean
   │  └─ error: string
   │
   └─ AddictionContext
      ├─ addictions: Array<{ id, userId, name, stopDate, frequencyPerDay, moneySpentPerDay, notes }>
      ├─ loading: boolean
      └─ error: string

EFFECT DEPENDENCIES
│
├─ ModeContext.useEffect()
│  └─ Dependencies: [] (Empty - runs once on mount)
│  └─ Action: Call bootstrapMode()
│
├─ AuthContext.useEffect()
│  └─ Dependencies: [modeConfigured, mode] (Runs when mode ready)
│  └─ Action: Call bootstrapAsync() when modeConfigured=true
│
└─ DataContext.useEffect()
   └─ Dependencies: [loadFunction] (Runs once)
   └─ Action: Call load function to fetch data
```

---

## 8. Conditional Rendering Based on State

```
RootNavigator Logic
│
├─ IF (modeLoading OR authLoading OR themeLoading)
│  └─ RENDER: <ActivityIndicator /> (Loading screen)
│
├─ ELSE IF (mode === null)
│  └─ RENDER: <ModeSelectionScreen />
│     └─ User must choose "Standalone" or "Connected"
│
├─ ELSE IF (mode === 'connected' AND !serverUrl)
│  └─ RENDER: <ServerConfigScreen />
│     └─ User must enter server URL/IP:port
│
├─ ELSE IF (userToken === null)
│  └─ RENDER: <AuthStack />
│     ├─ <LoginScreen />
│     └─ <RegisterScreen />
│
└─ ELSE
   └─ RENDER: <AppStack />
      ├─ Bottom Tab Navigator
      ├─ All data contexts loaded
      └─ Trophies/achievements/memories/weights visible
```

---

## 9. Error Cascade Prevention

```
Error Scenarios & Fallbacks
│
├─ Mode Retrieval Fails
│  └─ Fallback: mode = null
│  └─ Show ModeSelectionScreen
│  └─ User can select mode manually
│
├─ Database Initialization Fails
│  └─ Caught in AuthContext.bootstrapAsync()
│  └─ console.error logged but doesn't block auth
│  └─ If mode='connected': User can still use server
│  └─ If mode='standalone': Data ops will fail later
│
├─ User Not Found After Bootstrap
│  └─ Fallback (standalone): Auto-create 'guest' user
│  └─ Fallback (connected): Show login screen
│
├─ Data Fetch Fails (e.g., getTrophies())
│  └─ Each context catches error
│  └─ Sets error state: { trophies: [], error: 'message', loading: false }
│  └─ Component can display error message
│  └─ loadTrophies() callable again for retry
│
├─ Biometric Lock Enabled
│  └─ Only in standalone mode
│  └─ User must authenticate with biometric/PIN
│  └─ Checked on app backgrounding
│
└─ Server Unreachable (Connected Mode)
   └─ Remote services timeout
   └─ Error state set
   └─ User sees error message
   └─ Can retry or switch to offline (if supported)
```

---

## 10. Critical Files Map

```
/mobile/
│
├─ App.js (ROOT - Provider tree, RootNavigator)
│
├─ /src/db/
│  └─ database.js (initializeDatabase, getDatabase)
│
├─ /src/context/ (7 context providers)
│  ├─ ModeContext.js
│  ├─ AuthContext.js
│  ├─ DarkModeContext.js
│  ├─ BiometricContext.js
│  ├─ TrophyContext.js
│  ├─ AchievementContext.js
│  ├─ MemoryContext.js
│  ├─ WeightContext.js
│  ├─ AddictionContext.js
│  ├─ PreparationContext.js
│  └─ SelfAssessmentContext.js
│
├─ /src/api/ (Service routers - mode-aware delegates)
│  ├─ authService.js
│  ├─ addictionService.js
│  ├─ achievementService.js
│  ├─ trophyService.js
│  ├─ memoryService.js
│  ├─ weightService.js
│  ├─ preparationService.js
│  └─ selfAssessmentService.js
│
├─ /src/services/
│  ├─ modeService.js (Mode state management)
│  ├─ localAuthService.js (SQLite - standalone mode)
│  ├─ remoteAuthService.js (HTTP - connected mode)
│  ├─ localAddictionService.js (SQLite)
│  ├─ remoteAddictionService.js (HTTP)
│  ├─ localTrophyService.js (SQLite)
│  ├─ remoteTrophyService.js (HTTP)
│  ├─ localAchievementService.js (SQLite)
│  ├─ remoteAchievementService.js (HTTP)
│  └─ ... (similar pattern for all other services)
│
├─ /src/utils/
│  ├─ encryption.js (Encrypt/decrypt sensitive fields)
│  ├─ jwtHelper.js (Auth token management)
│  └─ theme.js (Dark mode colors)
│
├─ /src/pages/ (Screen components)
│  └─ All screens use hooks: useTrophy(), useAchievement(), etc
│
└─ /src/i18n/ (Internationalization)
   └─ Initialized on app mount
```

---

## 11. Performance Characteristics

```
INITIALIZATION TIME
│
├─ Phase 1 (Mode Context): 50ms
│  └─ Small AsyncStorage read
│
├─ Phase 2 (Auth Context): 300-500ms
│  ├─ Database init: 100-200ms
│  ├─ User fetch: 50-100ms
│  └─ Guest auto-auth: 50-200ms
│
└─ Phase 3 (Data Contexts): 200-300ms (parallel)
   ├─ Trophy fetch: 50-100ms
   ├─ Achievement fetch: 50-100ms
   ├─ Memory fetch: 50-100ms
   ├─ Weight fetch: 50-100ms
   └─ Addiction fetch: 50-100ms

TOTAL: ~600-800ms from app launch to full UI
       (Depending on device speed & DB size)


MEMORY USAGE
│
├─ Database: ~2-5MB (SQLite file)
├─ Context State: ~1-2MB (Loaded data in RAM)
├─ AsyncStorage: < 1MB
└─ Total: ~5-10MB typical

DATABASE SIZE
│
├─ Per Trophy: ~500 bytes
├─ Per Achievement: ~300 bytes
├─ Per Memory: ~1KB
├─ Per Addiction: ~2KB
├─ Per Weight: ~500 bytes
│
└─ 1000 entries per table ~= 5MB total DB

QUERY PERFORMANCE
│
├─ SELECT trophies: 50-100ms (1000 items)
├─ SELECT achievements: 50-100ms
├─ INSERT trophy: 10-20ms
├─ UPDATE achievement: 10-20ms
└─ DELETE memory: 10-20ms
```

---

## Quick Troubleshooting

| Symptom | Cause | Solution |
|---------|-------|----------|
| "Mode not configured" | ModeProvider missing or before root | Check App.js provider order |
| "Database not initialized" | AuthProvider missing or DB init failed | Check initializeDatabase() called |
| "User not found" | Auth bootstrap skipped in guest mode | Check modeConfigured watch in AuthContext |
| Empty trophy list | Query never ran | Check TrophyProvider mounted in tree |
| "useAddiction must be used within AddictionProvider" | AddictionProvider missing from tree | Wrap component tree with AddictionProvider |
| Trophies undefined in component | Component rendered before TrophyProvider | Check provider nesting in App.js |
| Data not persisting | Using connected mode but server down | Check serverUrl configured correctly |
| Slow initial load | Too much data or large DB | Implement pagination or lazy loading |
| "Database already initialized" | initializeDatabase called multiple times | Guard clause working correctly (expected) |

---

## Key Takeaways

✅ **Provider ordering is CRITICAL**
- ModeProvider → DarkMode/Biometric → AuthProvider → DataProviders

✅ **Database initialization happens in AuthContext**
- Not on app mount, but after mode is determined
- Guard prevents re-initialization

✅ **All data contexts auto-fetch on mount**
- useEffect with [loadFunction] dependency
- Fire in parallel, no blocking

✅ **Service layer handles mode delegation**
- Single API, two implementations (local SQLite / remote HTTP)
- Mode determined at fetch time

✅ **State flows one direction**
- Mode → Auth → User → Data Contexts → UI Components

✅ **Error handling is localized**
- Each context catches its own errors
- Prevents cascading failures

✅ **Standalone mode has fallbacks**
- Auto-creates guest user if needed
- Uses local SQLite exclusively

✅ **Connected mode is optional**
- User must explicitly configure
- Can switch between modes by clearing storage
