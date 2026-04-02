# Mobile App Mode Implementation Plan
## Standalone vs Connected Architecture

**Date**: April 2, 2026  
**Current State**: Fully offline with local SQLite  
**Target State**: Dual-mode (Standalone + Connected to External Server)

---

## Executive Summary

Transform the mobile app from fully offline to support two operational modes:
1. **Standalone Mode**: Single-user, no server required, no login (default)
2. **Connected Mode**: Multi-user, connects to external server, requires registration/login

The architecture uses an **abstraction layer** to switch between local SQLite and remote API without changing component code.

---

## System Architecture

### Current Architecture (Offline Only)
```
┌─────────────────────────────┐
│    React Native UI          │
└────────────┬────────────────┘
             │
      ┌──────▼───────┐
      │ Auth Context │
      └──────┬───────┘
             │
    ┌────────▼────────┐
    │  Services Layer │  (addictionService, moodService, etc.)
    └────────┬────────┘
             │
    ┌────────▼────────┐
    │ Local Services  │  (localAddictionService, etc.)
    └────────┬────────┘
             │
      ┌──────▼──────┐
      │   SQLite DB │
      └─────────────┘
```

### Proposed Architecture (Dual-Mode)
```
┌──────────────────────────────────┐
│      React Native UI             │
└────────────┬─────────────────────┘
             │
    ┌────────▼─────────┐
    │   Mode Context   │  (Tracks: standalone vs connected)
    └────────┬─────────┘
             │
      ┌──────▼───────┐
      │ Auth Context │
      └──────┬───────┘
             │
    ┌────────▼──────────────┐
    │ Services Layer        │  (Abstraction)
    │ (addictionService)    │
    └────────┬──────────────┘
             │
        ┌────┴────┐
        │          │
   ┌────▼────┐  ┌─▼───────────┐
   │ Local   │  │ Remote      │
   │Services │  │ API Adapter │
   │(SQLite) │  │(Axios)      │
   └────┬────┘  └─┬───────────┘
        │         │
   ┌────▼────┐  ┌─▼──────┐
   │ SQLite  │  │ Server │
   │Database │  │  API   │
   └─────────┘  └────────┘
```

---

## New File Structure

### 1. Mode Management
```
mobile/src/
├── context/
│   ├── ModeContext.js             [NEW] Mode selection & state
│   └── AuthContext.js             [MODIFIED] Mode-aware auth
├── services/
│   ├── modeService.js             [NEW] Get/set active mode
│   └── (existing local services)  [NO CHANGE]
├── api/
│   ├── remoteAdapter.js           [NEW] Remote API abstraction
│   ├── axiosConfig.js             [MODIFIED] Support server URLs
│   └── (existing services)        [MODIFIED] Support dual-mode
```

### 2. New Components
```
mobile/src/pages/
├── ModeSelectionScreen.js         [NEW] First-launch mode picker
├── ServerConfigScreen.js          [NEW] Server URL entry (connected mode)
└── SettingsScreen.js              [MODIFIED] Add mode switching
```

### 3. Remote Services (Mirror of Local)
```
mobile/src/services/
├── remoteAddictionService.js      [NEW]
├── remoteMoodService.js           [NEW]
├── remoteDiaryService.js          [NEW]
├── remoteWeightService.js         [NEW]
├── remoteMemoryService.js         [NEW]
├── remoteAchievementService.js    [NEW]
└── remoteTrophyService.js         [NEW]
```

---

## Implementation Steps

### Phase 1: Mode Infrastructure (Foundation)
**Files to Create/Modify**:

#### 1.1 Create `ModeContext.js`
```javascript
// Manages which mode app is running in
// States: 'standalone' | 'connected' | 'not-set'
// Persists to AsyncStorage

Exports:
- useMode() hook
- isModeSet() check
- switchMode(newMode) function
- getModeConfig() object
```

#### 1.2 Create `modeService.js`
```javascript
// Utility functions for mode operations

Functions:
- getActiveMode() -> 'standalone' | 'connected'
- setActiveMode(mode) -> void
- getServerUrl() -> string
- setServerUrl(url) -> void
- clearModeData() -> void (wipe when switching modes)
- isModeConfigured() -> boolean
```

#### 1.3 Modify `AuthContext.js`
```javascript
// Add mode awareness to bootstrap & auth flows

Changes:
- Access ModeContext in bootstrap
- Different user check logic per mode:
  * Standalone: Check localAuthService + AsyncStorage
  * Connected: Check remote auth endpoint + AsyncStorage
- Register/login logic routes to correct service
- No auto-login to standalone (single user mode)
```

---

### Phase 2: Service Abstraction Layer
**Files to Modify**: All service files in `mobile/src/api/`

#### 2.1 Pattern for Service Abstraction
**Current Pattern**:
```javascript
// addictionService.js
export const addictionService = {
  async getAddictions() {
    const user = storage.getUser();
    return localAddictionService.getAddictions(user.id);
  }
}
```

**New Pattern** (Dual-Mode):
```javascript
// addictionService.js (with mode awareness)
import { useMode } from '../context/ModeContext';

export const getAddictionService = (mode) => {
  if (mode === 'standalone') {
    return localAddictionService;
  } else if (mode === 'connected') {
    return remoteAddictionService;
  }
};

export const addictionService = {
  async getAddictions() {
    const { mode } = useMode(); // OR get from context in hook
    const service = getAddictionService(mode);
    const user = await storage.getUser();
    return service.getAddictions(user.id);
  }
}
```

#### 2.2 Services to Modify
- `addictionService.js`
- `moodService.js`
- `diaryService.js`
- `weightService.js`
- `memoryService.js` (if exists)
- `achievementService.js`
- `authService.js` (special handling)

---

### Phase 3: Remote Services
**Files to Create**: New remote service files

#### 3.1 Create `remoteAddictionService.js`
```javascript
// Mirrors localAddictionService but calls server API

Pattern:
- Same function signatures as local version
- Use axios with bearer token
- Handle auth errors (401 -> refresh/logout)
- Transform response data to match local format

Functions:
- getAddictions(userId)
- getAddiction(userId, id)
- createAddiction(userId, data)
- updateAddiction(userId, id, data)
- deleteAddiction(userId, id)
- getCravings(addictionId)
```

#### 3.2 Repeat for All Services
- `remoteMoodService.js` (moods CRUD)
- `remoteDiaryService.js` (diary CRUD)
- `remoteWeightService.js` (weight CRUD)
- `remoteMemoryService.js` (memory CRUD)
- `remoteAchievementService.js` (achievements fetch)
- `remoteTrophyService.js` (trophies fetch)

---

### Phase 4: Authentication Refactor
**File**: `authService.js`, `axiosConfig.js`

#### 4.1 `authService.js` Changes
```javascript
// Mode-aware auth service

Functions (per mode):

STANDALONE:
  - login(username, password) → localAuthService
  - register(username, fullName, password) → localAuthService
  - NO logout flow (single user persists)

CONNECTED:
  - login(username, password) → Remote API
  - register(username, fullName, password) → Remote API
  - logout() → Clear token + redirect to login
  - refreshToken() → Renew JWT if expired

SHARED:
  - getCurrentUser()
  - verifyToken()
  - updatePreferences()
```

#### 4.2 `axiosConfig.js` Changes
```javascript
// Support switching server URLs

Changes:
- Read API_BASE_URL from ModeContext
- Add interceptor to refresh tokens
- Handle 401 → Re-login flow for connected mode
- Continue to work for local dev in standalone
```

---

### Phase 5: Navigation & UI
**Files**: `App.js`, new screens

#### 5.1 Create `ModeSelectionScreen.js`
**Triggered**: First app launch (mode not set)
```javascript
// Two buttons:
// 1. "Use Locally (Standalone)" 
//    - Set mode to 'standalone'
//    - Skip login
//    - Auto-create default user OR show user setup
// 2. "Connect to Server"
//    - Set mode to 'connected'
//    - Go to ServerConfigScreen
```

#### 5.2 Create `ServerConfigScreen.js`
**Triggered**: First launch in connected mode
```javascript
// Input fields:
// - Server URL (http://192.168.1.100:5000)
// - Test Connection button
// - Validate URL format
// - Show API status
// - Proceed to Login when configured
```

#### 5.3 Modify Navigation in `App.js`
```javascript
function RootNavigator() {
  const { modeSet, mode, loading: modeLoading } = useMode();
  const { userToken, loading: authLoading } = useAuth();

  // Loading state
  if (modeLoading || authLoading) return <Loader />;

  // Mode not set -> show ModeSelectionScreen
  if (!modeSet) return <ModeSelectionScreen />;

  // Mode set but not configured -> show config
  if (mode === 'connected' && !isServerConfigured()) {
    return <ServerConfigScreen />;
  }

  // Mode set + user authenticated -> show app
  if (userToken) return <AppStack />;

  // Mode set but no user -> show auth
  return <AuthStack />;
}
```

#### 5.4 Modify `LoginScreen.js` for Mode
```javascript
// Changes:
// - Show mode indicator ("Connected to server" / "Standalone")
// - No login needed in standalone (auto-authenticate)
// - Show server URL in connected mode
// - Add "Switch Mode" button in menu
```

#### 5.5 Create/Modify `SettingsScreen.js`
```javascript
// New options:
// - Current Mode (display)
// - Server URL (if connected, editable)
// - Switch Mode button (requires data migration warning)
// - Clear Local Data
// - Logout
```

---

### Phase 6: Data Migration & Mode Switching
**File**: `modeService.js`, migration utilities

#### 6.1 Mode Switching Handler
```javascript
async function switchMode(newMode) {
  // 1. Show warning about data loss
  // 2. Ask for confirmation
  // 3. Export current data (optional backup) - FUTURE
  // 4. Clear old mode data
  // 5. Keep user auth preference for new mode
  // 6. Restart app or navigate to mode setup
}
```

#### 6.2 Data Backup/Export - OPTIONAL (v2)
```javascript
// Export current data as JSON for backup
// Useful when switching from standalone to connected
// Store export file in Documents folder
```

---

## Modified Configuration Files

### 1. `.env` / `.env.local`
```env
# Keep existing for development
EXPO_PUBLIC_API_URL=http://localhost:5000/api
EXPO_PUBLIC_DEBUG_MODE=true

# New variables
EXPO_PUBLIC_DEFAULT_MODE=standalone
# Options: 'standalone', 'connected', 'user-choice'
```

### 2. `app.json` (Expo config)
No changes needed. Mode is runtime-determined.

---

## Data Flow Examples

### Standalone Mode: Get Addictions
```
Component (MainMenuScreen)
  ↓
addictionService.getAddictions()
  ↓ Mode Context says "standalone"
  ↓
localAddictionService.getAddictions(userId)
  ↓
SQLite Query: SELECT * FROM addictions WHERE userId = ?
  ↓
Return decrypted data
```

### Connected Mode: Get Addictions
```
Component (MainMenuScreen)
  ↓
addictionService.getAddictions()
  ↓ Mode Context says "connected"
  ↓
remoteAddictionService.getAddictions(userId)
  ↓
axios.get('/api/addictions', {
  headers: { Authorization: 'Bearer ' + token }
})
  ↓
Server validates token → queries MongoDB
  ↓
Return data
```

### First Launch Flow
```
App starts
  ↓
ModeContext checks AsyncStorage
  ↓
Mode not set? → Show ModeSelectionScreen
  ↓
User selects option
  ↓
If Standalone:
  - Set mode to 'standalone'
  - Check if user exists locally
  - If not, create default user or show setup
  - Skip login, go to MainMenu
  ↓
If Connected:
  - Set mode to 'connected'
  - Show ServerConfigScreen
  - Validate server URL
  - Show LoginScreen
```

---

## Error Handling & Offline Scenarios

### Standalone Mode
- No network checks needed
- All operations local
- No sync/offline queue needed

### Connected Mode - Network Failures
```javascript
// Strategy 1: Queue operations (v2)
// - Store failed requests in queue
// - Retry when connection returns

// Strategy 2: Graceful degradation (v1)
// - Show offline banner
// - Disable sync operations
// - Allow read-only access
// - Queue for sync when online

// Strategy 3: Switch to local fallback? (NO)
// - Do NOT auto-switch to standalone
// - Keep clear separation
```

### Server Connection Issues
```javascript
// In ServerConfigScreen or settings
- Test connection before saving URL
- Show connection status indicator
- Allow retry/manual config

// In remoteAdapterService
- Detect 401 → Redirect to login
- Detect CORS → Show error to user
- Detect timeout → Show retry button
```

---

## Testing Strategy

### Unit Tests
```
✓ ModeContext redux/state management
✓ modeService get/set operations
✓ Service abstraction layer switching
✓ Auth flow for each mode
✓ Data format consistency
```

### Integration Tests
```
✓ Mode switching flow
✓ First launch → Mode selection
✓ Auth → App transition
✓ Server config validation
✓ API error handling
```

### Manual Testing Scenarios
```
1. Fresh install → Standalone mode
   - Create user
   - Add addiction
   - Verify data persists

2. Fresh install → Connected mode
   - Config server URL
   - Register new account
   - Register fails → Show error
   - Login with creds
   - Verify server sync

3. Switch modes
   - Start in standalone
   - Go to settings
   - Switch to connected
   - Server config flow
   - Show data not transferred (as expected)

4. Network failures
   - Connected mode, server offline
   - Show offline indicator
   - Retry operations
   - No cached data fallback
```

---

## Backwards Compatibility

### Existing Standalone Users
- On first launch after update: Show ModeSelectionScreen
- Option: "Continue Offline" (keeps local data intact)
- No forced migration

### Preferences
- Language preference: Migrate/keep on mode switch
- Dark mode: Migrate to new mode
- Unit preference: Keep per user (separate per mode)

---

## Timeline & Priorities

### Week 1: Foundation
- [ ] ModeContext & modeService
- [ ] Mode selection screens
- [ ] Auth refactor for modes

### Week 2: Services
- [ ] Remote services skeleton
- [ ] Service abstraction in each API file
- [ ] Basic remote adapter

### Week 3: Integration & Testing
- [ ] Navigation updates
- [ ] Settings screen enhancements
- [ ] Comprehensive testing
- [ ] Bug fixes

### Week 4: Polish & Release
- [ ] Error handling refinement
- [ ] Offline detection
- [ ] Documentation updates
- [ ] Release v1.4.0

---

## Future Enhancements (v2+)

1. **Data Sync & Backup**
   - Export data from standalone to JSON
   - Migrate data to server account
   - Auto-sync in background when connected

2. **Offline Queue**
   - Connected mode can work offline temporarily
   - Queue operations to sync when online

3. **Account Switching**
   - Multiple user accounts in connected mode
   - Quick account switcher in UI

4. **Settings Sync**
   - Sync settings across devices in connected mode

5. **Advanced Server Config**
   - SSL certificate pinning
   - Custom auth headers
   - API version negotiation

---

## Files Summary

### To Create (11 files)
1. `src/context/ModeContext.js` - Mode management
2. `src/services/modeService.js` - Mode utilities
3. `src/pages/ModeSelectionScreen.js` - Mode picker
4. `src/pages/ServerConfigScreen.js` - Server setup
5. `src/services/remoteAddictionService.js`
6. `src/services/remoteMoodService.js`
7. `src/services/remoteDiaryService.js`
8. `src/services/remoteWeightService.js`
9. `src/services/remoteMemoryService.js`
10. `src/services/remoteAchievementService.js`
11. `src/services/remoteTrophyService.js`

### To Modify (9 files)
1. `src/context/AuthContext.js` - Mode-aware bootstrap
2. `src/api/authService.js` - Dual auth logic
3. `src/api/axiosConfig.js` - Dynamic server URL
4. `src/api/addictionService.js` - Service abstraction
5. `src/api/moodService.js` - Service abstraction
6. `src/api/diaryService.js` - Service abstraction
7. `src/api/weightService.js` - Service abstraction
8. `src/api/achievementService.js` - Service abstraction
9. `App.js` - Navigation logic

### Documentation (New)
1. `MOBILE_MODE_IMPLEMENTATION_PLAN.md` (this file)
2. `MOBILE_MODE_API_REFERENCE.md` - API endpoint specs
3. Updated `mobile/README.md` - Mode instructions

---

## Success Criteria

✅ User can select mode on first launch  
✅ Standalone mode works without server  
✅ Connected mode connects to server  
✅ No code duplication in components  
✅ Services abstract away mode logic  
✅ Mode switching available in settings  
✅ Auth flows differ correctly per mode  
✅ All existing features work in both modes  
✅ Error handling for network issues  
✅ Documentation complete  

---

## Questions for Review

1. **Data Migration**: Should we support migrating standalone data to server? (deferred to v2?)
2. **Default Mode**: Should app default to standalone or ask user? (recommend: ask on first launch)
3. **Server Validation**: How strict on server URL validation? (recommend: test connection)
4. **Offline Handling**: Connected mode offline - queue operations or fail gracefully? (recommend: fail gracefully, queue in v2)
5. **User Creation in Standalone**: Auto-create default user or show setup screen? (recommend: auto-create with username "local-user")
