# Mobile App Code Locations - Quick Index

## Database & Core

| File | Location | Purpose |
|------|----------|---------|
| **Database Initialization** | [mobile/src/db/database.js](mobile/src/db/database.js#L1-L50) | `initializeDatabase()` - Creates SQLite DB and all tables |
| **Database Accessor** | [mobile/src/db/database.js](mobile/src/db/database.js#L180-L190) | `getDatabase()` - Returns singleton DB instance |
| **Database Guard Flag** | [mobile/src/db/database.js](mobile/src/db/database.js#L2-L3) | `dbInitialized` flag prevents re-init |

---

## Context Bootstrap (Initialization Order)

### 1. ModeContext - Mode Selection
| File | Location | Key Functions |
|------|----------|---|
| **ModeContext** | [mobile/src/context/ModeContext.js](mobile/src/context/ModeContext.js#L1-L50) | Provider, useMode hook |
| **Bootstrap** | [mobile/src/context/ModeContext.js](mobile/src/context/ModeContext.js#L11-L34) | `bootstrapMode()` - Runs on mount (Phase 1) |
| **Mode Selection** | [mobile/src/context/ModeContext.js](mobile/src/context/ModeContext.js#L35-L60) | `selectMode()` - User can change mode |
| **Server Config** | [mobile/src/context/ModeContext.js](mobile/src/context/ModeContext.js#L60-L80) | `updateServerUrl()` - Set remote server |

### 2. AuthContext - User Authentication & DB Init
| File | Location | Key Functions |
|------|----------|---|
| **AuthContext** | [mobile/src/context/AuthContext.js](mobile/src/context/AuthContext.js#L1-L50) | Provider, useAuth pattern |
| **Auth Bootstrap** | [mobile/src/context/AuthContext.js](mobile/src/context/AuthContext.js#L12-L20) | `bootstrapAsync()` - Runs after mode ready (Phase 2) |
| **DB Initialization** | [mobile/src/context/AuthContext.js](mobile/src/context/AuthContext.js#L25-L35) | Calls `initializeDatabase()` HERE |
| **Login Function** | [mobile/src/context/AuthContext.js](mobile/src/context/AuthContext.js#L65-L80) | `login()` - Manual login |
| **Register Function** | [mobile/src/context/AuthContext.js](mobile/src/context/AuthContext.js#L82-L110) | `register()` + achievement init |
| **Logout Function** | [mobile/src/context/AuthContext.js](mobile/src/context/AuthContext.js#L112-L125) | `logout()` - Clear user session |

---

## Data Context Providers (Load in Parallel - Phase 3)

### Trophy Context
| File | Location | Key Functions |
|------|----------|---|
| **TrophyContext** | [mobile/src/context/TrophyContext.js](mobile/src/context/TrophyContext.js#L1-L40) | Provider |
| **useTrophy Hook** | [mobile/src/context/TrophyContext.js](mobile/src/context/TrophyContext.js#L36-L45) | Hook to use trophy data |
| **Load Trophies** | [mobile/src/context/TrophyContext.js](mobile/src/context/TrophyContext.js#L21-L30) | `loadTrophies()` - Fetch data |
| **Auto-fetch** | [mobile/src/context/TrophyContext.js](mobile/src/context/TrophyContext.js#L31-L34) | useEffect fires on mount |

### Achievement Context
| File | Location | Key Functions |
|------|----------|---|
| **AchievementContext** | [mobile/src/context/AchievementContext.js](mobile/src/context/AchievementContext.js#L1-L50) | Provider |
| **useAchievement Hook** | [mobile/src/context/AchievementContext.js](mobile/src/context/AchievementContext.js#L80-L90) | Hook to use achievement data |
| **Load Achievements** | [mobile/src/context/AchievementContext.js](mobile/src/context/AchievementContext.js#L15-L30) | `loadAchievements()` |
| **Load Trophies** | [mobile/src/context/AchievementContext.js](mobile/src/context/AchievementContext.js#L32-L47) | `loadTrophies()` - Also in achievement context |
| **Check/Unlock** | [mobile/src/context/AchievementContext.js](mobile/src/context/AchievementContext.js#L49-L75) | `checkAchievements()`, `initializeAchievements()` |

### Memory Context
| File | Location | Key Functions |
|------|----------|---|
| **MemoryContext** | [mobile/src/context/MemoryContext.js](mobile/src/context/MemoryContext.js#L1-L50) | Provider |
| **useMemory Hook** | [mobile/src/context/MemoryContext.js](mobile/src/context/MemoryContext.js#L70-L80) | Hook |
| **Load Memories** | [mobile/src/context/MemoryContext.js](mobile/src/context/MemoryContext.js#L15-L30) | `loadMemories()` |
| **CRUD Operations** | [mobile/src/context/MemoryContext.js](mobile/src/context/MemoryContext.js#L32-L65) | Add, update, delete |

### Weight Context
| File | Location | Key Functions |
|------|----------|---|
| **WeightContext** | [mobile/src/context/WeightContext.js](mobile/src/context/WeightContext.js#L1-L50) | Provider |
| **useWeight Hook** | [mobile/src/context/WeightContext.js](mobile/src/context/WeightContext.js#L70-L80) | Hook |
| **Load Weights** | [mobile/src/context/WeightContext.js](mobile/src/context/WeightContext.js#L15-L30) | `loadWeights()` |
| **CRUD Operations** | [mobile/src/context/WeightContext.js](mobile/src/context/WeightContext.js#L32-L65) | Add, update, delete |

### Addiction Context
| File | Location | Key Functions |
|------|----------|---|
| **AddictionContext** | [mobile/src/context/AddictionContext.js](mobile/src/context/AddictionContext.js#L1-L40) | Provider |
| **useAddiction Hook** | [mobile/src/context/AddictionContext.js](mobile/src/context/AddictionContext.js#L55-L65) | Hook |
| **Fetch Addictions** | [mobile/src/context/AddictionContext.js](mobile/src/context/AddictionContext.js#L10-L30) | `fetchAddictions()` |
| **CRUD Operations** | [mobile/src/context/AddictionContext.js](mobile/src/context/AddictionContext.js#L32-L55) | Add, update, delete |

---

## API Service Layer (Mode-Aware Delegation)

### Addiction Service
| File | Location | Purpose |
|------|----------|---------|
| **API Router** | [mobile/src/api/addictionService.js](mobile/src/api/addictionService.js#L1-L110) | Determines local vs remote at call time |
| **Mode Detection** | [mobile/src/api/addictionService.js](mobile/src/api/addictionService.js#L8-L17) | `getAddictionService()` checks mode |
| **Get Addictions** | [mobile/src/api/addictionService.js](mobile/src/api/addictionService.js#L18-L30) | Routes to local/remote `getAddictions()` |
| **Create Addiction** | [mobile/src/api/addictionService.js](mobile/src/api/addictionService.js#L44-L70) | Create new addiction entry |
| **Update Addiction** | [mobile/src/api/addictionService.js](mobile/src/api/addictionService.js#L72-L85) | Update existing addiction |
| **Delete Addiction** | [mobile/src/api/addictionService.js](mobile/src/api/addictionService.js#L87-L100) | Delete addiction record |

### Trophy Service
| File | Location | Purpose |
|------|----------|---------|
| **API Router** | [mobile/src/api/trophyService.js](mobile/src/api/trophyService.js) | Mode-aware delegation |

### Achievement Service
| File | Location | Purpose |
|------|----------|---------|
| **API Router** | [mobile/src/api/achievementService.js](mobile/src/api/achievementService.js) | Mode-aware delegation |
| **Initialize** | [mobile/src/api/achievementService.js](mobile/src/api/achievementService.js) | `initializeAchievements()` called on register |

### Auth Service
| File | Location | Purpose |
|------|----------|---------|
| **API Router** | [mobile/src/api/authService.js](mobile/src/api/authService.js#L1-L120) | Mode-aware auth |
| **Remote Client** | [mobile/src/api/authService.js](mobile/src/api/authService.js#L9-L20) | `getRemoteClient()` - axios instance |
| **Login** | [mobile/src/api/authService.js](mobile/src/api/authService.js#L22-L60) | Routes to local or remote login |
| **Register** | [mobile/src/api/authService.js](mobile/src/api/authService.js) | Routes to local or remote register |
| **Get Current User** | [mobile/src/api/authService.js](mobile/src/api/authService.js) | Check existing session |

---

## Local Services (Standalone Mode - SQLite)

### Local Achievement Service
| File | Location | Key Functions |
|------|----------|---|
| **Initialize** | [mobile/src/services/localAchievementService.js](mobile/src/services/localAchievementService.js#L1-L50) | `initializeAchievements()` - Insert 7 default achievements |
| **Get Achievements** | [mobile/src/services/localAchievementService.js](mobile/src/services/localAchievementService.js#L50-L70) | Query all achievements for user |
| **Unlock Achievement** | [mobile/src/services/localAchievementService.js](mobile/src/services/localAchievementService.js#L70-L90) | Mark achievement unlocked |
| **Get Unlocked** | [mobile/src/services/localAchievementService.js](mobile/src/services/localAchievementService.js#L90-L110) | Get only unlocked achievements |

### Local Trophy Service
| File | Location | Key Functions |
|------|----------|---|
| **Create Trophy** | [mobile/src/services/localTrophyService.js](mobile/src/services/localTrophyService.js#L1-L30) | `createTrophy()` - Insert trophy |
| **Get Trophies** | [mobile/src/services/localTrophyService.js](mobile/src/services/localTrophyService.js#L30-L50) | `getTrophies(userId)` - Query with ordering |
| **Get Single** | [mobile/src/services/localTrophyService.js](mobile/src/services/localTrophyService.js#L50-L70) | `getTrophy()` - Single record |
| **Delete** | [mobile/src/services/localTrophyService.js](mobile/src/services/localTrophyService.js#L70-L90) | `deleteTrophy()` |

### Local Addiction Service
| File | Location | Key Functions |
|------|----------|---|
| **Create** | [mobile/src/services/localAddictionService.js](mobile/src/services/localAddictionService.js#L1-L40) | Encrypts sensitive data before save |
| **Get All** | [mobile/src/services/localAddictionService.js](mobile/src/services/localAddictionService.js#L40-L70) | Query all, decrypt notes |
| **Get Single** | [mobile/src/services/localAddictionService.js](mobile/src/services/localAddictionService.js#L70-L100) | Single record with decryption |
| **Update** | [mobile/src/services/localAddictionService.js](mobile/src/services/localAddictionService.js#L100-L140) | Update with encryption |
| **Delete** | [mobile/src/services/localAddictionService.js](mobile/src/services/localAddictionService.js#L140-L160) | Remove record |

### Local Memory Service
| File | Location | Key Functions |
|------|----------|---|
| **Create Memory** | [mobile/src/services/localMemoryService.js](mobile/src/services/localMemoryService.js) | Create with encryption |
| **Get Memories** | [mobile/src/services/localMemoryService.js](mobile/src/services/localMemoryService.js) | Query all, decrypt |
| **Update Memory** | [mobile/src/services/localMemoryService.js](mobile/src/services/localMemoryService.js) | Update with encryption |
| **Delete Memory** | [mobile/src/services/localMemoryService.js](mobile/src/services/localMemoryService.js) | Remove record |

### Local Weight Service
| File | Location | Key Functions |
|------|----------|---|
| **Create Weight** | [mobile/src/services/localWeightService.js](mobile/src/services/localWeightService.js) | Insert weight entry |
| **Get Weights** | [mobile/src/services/localWeightService.js](mobile/src/services/localWeightService.js) | Query all by date |
| **Update Weight** | [mobile/src/services/localWeightService.js](mobile/src/services/localWeightService.js) | Modify weight |
| **Delete Weight** | [mobile/src/services/localWeightService.js](mobile/src/services/localWeightService.js) | Remove entry |

### Local Auth Service
| File | Location | Key Functions |
|------|----------|---|
| **Login** | [mobile/src/services/localAuthService.js](mobile/src/services/localAuthService.js) | Verify credentials against DB |
| **Register** | [mobile/src/services/localAuthService.js](mobile/src/services/localAuthService.js) | Create user in DB |
| **Get Current** | [mobile/src/services/localAuthService.js](mobile/src/services/localAuthService.js) | Check logged-in user |

---

## Remote Services (Connected Mode - HTTP)

### Remote Achievement Service
| File | Location | Purpose |
|------|----------|---------|
| **Remote Impl** | [mobile/src/services/remoteAchievementService.js](mobile/src/services/remoteAchievementService.js) | HTTP calls to `/api/achievements` |

### Remote Trophy Service
| File | Location | Purpose |
|------|----------|---------|
| **Remote Impl** | [mobile/src/services/remoteTrophyService.js](mobile/src/services/remoteTrophyService.js) | HTTP calls to `/api/trophies` |

### Remote Addiction Service
| File | Location | Purpose |
|------|----------|---------|
| **Remote Impl** | [mobile/src/services/remoteAddictionService.js](mobile/src/services/remoteAddictionService.js) | HTTP calls to `/api/addictions` |

### Remote Memory Service
| File | Location | Purpose |
|------|----------|---------|
| **Remote Impl** | [mobile/src/services/remoteMemoryService.js](mobile/src/services/remoteMemoryService.js) | HTTP calls to `/api/memories` |

### Remote Weight Service
| File | Location | Purpose |
|------|----------|---------|
| **Remote Impl** | [mobile/src/services/remoteWeightService.js](mobile/src/services/remoteWeightService.js) | HTTP calls to `/api/weights` |

---

## Utility Services

| File | Location | Purpose |
|------|----------|---------|
| **Mode Service** | [mobile/src/services/modeService.js](mobile/src/services/modeService.js) | Get/set mode and server URL in AsyncStorage |
| **JWT Helper** | [mobile/src/utils/jwtHelper.js](mobile/src/utils/jwtHelper.js) | Auth token management |
| **Encryption** | [mobile/src/utils/encryption.js](mobile/src/utils/encryption.js) | Encrypt/decrypt sensitive fields |
| **Theme** | [mobile/src/utils/theme.js](mobile/src/utils/theme.js) | Dark mode color schemes |

---

## App Navigation & Root

| File | Location | Purpose |
|------|----------|---------|
| **App.js (Root)** | [mobile/App.js](mobile/App.js#L1-L50) | Provider tree setup |
| **Provider Nesting** | [mobile/App.js](mobile/App.js#L543-L559) | All contexts nested here |
| **Root Navigator** | [mobile/App.js](mobile/App.js#L445-L515) | Logic: loading → mode selection → server config → auth → app |
| **Auth Stack** | [mobile/App.js](mobile/App.js#L69-L85) | Login & Register screens |
| **App Stack** | [mobile/App.js](mobile/App.js#L87-L440) | Main navigation with tabs |

---

## Page/Screen Components Using Contexts

| Component | Uses Context | Location |
|-----------|--------------|----------|
| **Achievements Screen** | useAchievement | [mobile/src/pages/AchievementsScreen.js](mobile/src/pages/AchievementsScreen.js) |
| **Memories Screen** | useMemory | [mobile/src/pages/MemoriesScreen.js](mobile/src/pages/MemoriesScreen.js) |
| **Weight Screen** | useWeight | [mobile/src/pages/WeightScreen.js](mobile/src/pages/WeightScreen.js) |
| **Addiction Detail** | useAddiction | [mobile/src/pages/AddictionDetailScreen.js](mobile/src/pages/AddictionDetailScreen.js) |
| **Add Addiction** | useAddiction | [mobile/src/pages/AddNewAddictionScreen.js](mobile/src/pages/AddNewAddictionScreen.js) |
| **Settings** | useAuth, useMode | [mobile/src/pages/SettingsScreen.js](mobile/src/pages/SettingsScreen.js) |
| **Profile** | useAuth | [mobile/src/pages/ProfileScreen.js](mobile/src/pages/ProfileScreen.js) |

---

## Key Constants & Configuration

| Item | Location | Values |
|------|----------|--------|
| **Database Name** | [mobile/src/db/database.js](mobile/src/db/database.js#L5) | `'noctsDB.db'` |
| **Default Achievements** | [mobile/src/services/localAchievementService.js](mobile/src/services/localAchievementService.js#L10-L20) | 7 achievements (First Step, 7/30/90 Days Strong, etc) |
| **Async Storage Keys** | [mobile/src/context/ModeContext.js](mobile/src/context/ModeContext.js#L20) | `'appMode'`, `'serverUrl'`, `'userToken'`, `'user'` |
| **Modes** | [mobile/src/context/ModeContext.js](mobile/src/context/ModeContext.js#L35) | `'standalone'` or `'connected'` |

---

## Initialization Checklist

When checking initialization order:

- [ ] **ModeProvider** at top level in App.js
- [ ] **ModeContext.bootstrapMode()** runs on mount
- [ ] **AuthProvider** after ModeProvider
- [ ] **AuthContext.bootstrapAsync()** watches modeConfigured
- [ ] **initializeDatabase()** called in auth bootstrap
- [ ] **Data providers** (Addiction, Weight, Memory, Achievement, Trophy) mounted after auth
- [ ] **RootNavigator** waits for modeLoading & authLoading before rendering
- [ ] All data contexts have useEffect that calls loadX() on mount
- [ ] Database.js exports getDatabase() and initializeDatabase()

---

## Quick File Search Commands

Find all contexts:
```bash
find mobile/src/context -name "*.js"
```

Find all services:
```bash
find mobile/src/services -name "*.js"
```

Find all local services:
```bash
find mobile/src/services -name "local*.js"
```

Find all remote services:
```bash
find mobile/src/services -name "remote*.js"
```

Find database references:
```bash
grep -r "getDatabase()" mobile/src/services
grep -r "initializeDatabase()" mobile/src/context
```

Find context hooks:
```bash
grep -r "useContext" mobile/src --include="*.js" | grep "export const use"
```
