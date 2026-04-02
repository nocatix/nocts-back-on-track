# Dual-Mode Implementation - Complete Reference

## Overview

The mobile app now supports two operating modes:
1. **Standalone Mode**: Device-only, no server required, no login needed
2. **Connected Mode**: Server-based, requires configuration, authentication required

## Architecture Components

### 1. Mode Management

**ModeContext** (`src/context/ModeContext.js`)
- Central state management for mode and server configuration
- Bootstraps from AsyncStorage on app start
- Provides mode selection, server URL updates, and mode switching

**Key Functions:**
- `selectMode(mode)` - Initial mode selection (shown at first launch)
- `updateServerUrl(url)` - Configure server URL in connected mode
- `switchMode(newMode)` - Change between modes (clears data)
- `clearModeData()` - Reset all mode-related data

### 2. Navigation Flow

**App.js Entry Point**
```
1. ModeProvider loads mode from AsyncStorage
2. If mode not configured → ModeSelectionScreen
3. If connected mode but server not configured → ServerConfigScreen
4. If mode + server ready → Proceed to Auth or App screens
```

### 3. Data Services

**Service Abstraction Pattern**
All API services (addiction, mood, diary, weight, memory, achievement, trophy) use the same pattern:

```javascript
const getService = async () => {
  const mode = await modeService.getActiveMode();
  return mode === 'connected' ? remoteService : localService;
};

export const addItem = async (item) => {
  const service = await getService();
  return service.addItem(item);
};
```

This means components never change - they always call the same methods regardless of mode.

### 4. Local Mode Services

**Storage**: SQLite via react-native-sql-storage
**Authentication**: JWT tokens (no registration required)
**Services Available**:
- localAddictionService
- localMoodService
- localDiaryService
- localWeightService
- localMemoryService
- localAchievementService
- localTrophyService

**Key Feature**: Data persists locally. No server needed.

### 5. Connected Mode Services

**Storage**: Remote server database
**Authentication**: Bearer tokens (requires registration + login)
**Services Available** (remote variants):
- remoteAddictionService
- remoteMoodService
- remoteDiaryService
- remoteWeightService
- remoteMemoryService
- remoteAchievementService
- remoteTrophyService

**Axios Configuration**: Dynamic baseURL from server URL via axiosConfig.js

### 6. Authentication Flow

**Standalone Mode** (localAuthService)
- No registration required
- Creates local user automatically
- Uses local JWT tokens
- Data stored in device SQLite

**Connected Mode** (remote auth via axios)
- Registration required
- Email/password based
- Server validates credentials
- Bearer token used for all API calls
- Data stored on server

**Auth Switching**: SettingsScreen allows switching authentication without losing data

### 7. Offline Detection

**Network Status** (`src/utils/networkStatus.js`)
- `useNetworkStatus()` - Hook returning `{isConnected, isLoading}`
- `checkNetworkConnection()` - Direct function to check connectivity
- `getNetworkInfo()` - Detailed network state

**OfflineIndicator** (`src/components/OfflineIndicator.js`)
- Shows red banner when device is offline (only in connected mode)
- Animated slide-in/out
- Stops blocking other UI
- Auto-hides when connectivity restored

**Connection Retry** (`src/utils/connectionRetry.js`)
- `retryWithBackoff()` - Exponential backoff retry strategy
- `retryWithNetworkCheck()` - Wait for network before retrying
- `intelligentRetry()` - Smart retry (skips client errors like 401/403)
- `withTimeout()` - Promise with timeout wrapper

### 8. Settings & Configuration

**SettingsScreen** (`src/pages/SettingsScreen.js`)
Features:
- View current mode and server URL
- Test server connection with visual feedback
- Switch between modes (with data warning)
- View app version and info
- Logout button
- Clear all data button

### 9. Server Configuration

**ServerConfigScreen** (`src/pages/ServerConfigScreen.js`)
Features:
- Input server URL (validates format)
- Test connection with 5-second timeout
- Success/error feedback
- Detailed error messages for debugging

## Usage Flows

### First Launch
1. App starts → ModeProvider loads (checking AsyncStorage)
2. Mode not found → ModeSelectionScreen appears
3. User chooses "Standalone" or "Connect to Server"
4. If Connected:
   - ServerConfigScreen appears
   - User enters server URL
   - Connection verified
   - Returns to mode selection or proceeds to auth
5. AuthContext takes over → Shows auth/app screens

### Standalone Mode Usage
1. User logs in (creates local account)
2. All data operations use localXxxService
3. Data stored in device SQLite
4. No network required
5. Completely private to device

### Connected Mode Usage
1. User logs in with credentials
2. All data operations use remoteXxxService (via axios)
3. Data stored on server
4. Network required for all operations
5. Share access with other devices

### Mode Switching
1. SettingsScreen → "Switch Mode" button
2. Confirmation dialog explains data implications
3. Mode switched, data cleared, AuthContext resets
4. Back to mode/auth selection

## File Structure

```
mobile/
├── App.js (main entry, navigation orchestration)
├── src/
│   ├── context/
│   │   ├── AuthContext.js (mode-aware auth)
│   │   ├── ModeContext.js (mode management)
│   │   └── DarkModeContext.js (theme)
│   ├── pages/
│   │   ├── ModeSelectionScreen.js (choose mode)
│   │   ├── ServerConfigScreen.js (server setup)
│   │   ├── SettingsScreen.js (user settings)
│   │   ├── LoginScreen.js (auth)
│   │   ├── RegisterScreen.js (auth)
│   │   └── ... (other screens)
│   ├── services/
│   │   ├── modeService.js (mode utilities)
│   │   ├── localXxxService.js (7 local services)
│   │   ├── remoteXxxService.js (7 remote services)
│   │   ├── addictionService.js (abstraction layer)
│   │   ├── moodService.js (abstraction layer)
│   │   ├── diaryService.js (abstraction layer)
│   │   ├── weightService.js (abstraction layer)
│   │   ├── memoryService.js (abstraction layer)
│   │   ├── achievementService.js (abstraction layer)
│   │   ├── trophyService.js (abstraction layer)
│   │   └── authService.js (mode-aware auth)
│   ├── components/
│   │   ├── OfflineIndicator.js (offline banner)
│   │   └── ... (other components)
│   ├── utils/
│   │   ├── networkStatus.js (connectivity detection)
│   │   ├── connectionRetry.js (retry logic)
│   │   └── axiosConfig.js (dynamic API setup)
│   └── api/
│       └── axiosConfig.js (HTTP client factory)
└── package.json (dependencies)
```

## Key Dependencies Added

- `@react-native-community/netinfo` - Network connectivity detection
- Already had: axios, AsyncStorage, expo-sqlite, react-native-sql-storage

## Testing Checklist

- [ ] Standalone Mode
  - [ ] First launch → mode selection screen
  - [ ] Select "Standalone"
  - [ ] Create local account and login
  - [ ] Add addictions and other data
  - [ ] Data persists across app restart
  - [ ] Offline - everything still works
  
- [ ] Connected Mode (if server available)
  - [ ] First launch → mode selection screen
  - [ ] Select "Connect to Server"
  - [ ] Enter server URL
  - [ ] Test connection succeeds
  - [ ] Register new account
  - [ ] Login
  - [ ] Add addictions and other data
  - [ ] Data appears on server
  - [ ] Disconnect network → OfflineIndicator appears
  - [ ] Reconnect → OfflineIndicator disappears
  
- [ ] Mode Switching
  - [ ] SettingsScreen → Switch Mode
  - [ ] Confirm data clear warning
  - [ ] Mode changes, back to selection
  - [ ] Select new mode successfully

- [ ] Error Scenarios
  - [ ] Invalid server URL → error message
  - [ ] Server unreachable → error message
  - [ ] Network lost → offline indicator, operations fail gracefully
  - [ ] Invalid login → error message
  - [ ] Logout → auth screen appears

## API Endpoints (Connected Mode)

Your server should provide:
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /health` - Health check (used by SettingsScreen)
- `GET/POST/PUT/DELETE /api/addictions/*` - Addiction endpoints
- `GET/POST/PUT/DELETE /api/moods/*` - Mood endpoints
- `GET/POST/PUT/DELETE /api/diary/*` - Diary endpoints
- `GET/POST/PUT/DELETE /api/weights/*` - Weight endpoints
- `GET/POST/PUT/DELETE /api/memories/*` - Memory endpoints
- `GET/POST/PUT/DELETE /api/achievements/*` - Achievement endpoints
- `GET/POST/PUT/DELETE /api/trophies/*` - Trophy endpoints

See remoteXxxService.js files for exact endpoint formats.

## Troubleshooting

### "Server connection failed"
- Check server URL format (should be HTTP/HTTPS URL)
- Verify server is running and accessible
- Check network connectivity
- See SettingsScreen connection test for details

### "Mode not loading"
- Check AsyncStorage permissions
- Verify ModeContext wrapper in App.js
- Check device storage space

### "Data not syncing to server"
- Verify Bearer token is present (check axiosConfig interceptor)
- Confirm server endpoints match remote service calls
- Check internet connection (OfflineIndicator should show)

### "Switching modes loses data"
- This is by design - modes have separate data stores
- Warning dialog appears before switching
- Switching standalone→connected requires re-entering data on server

## Performance Considerations

- Local mode: Very fast (SQLite is local)
- Connected mode: Depends on network and server
- Mode switch: Clears all data (by design)
- Memory: Both modes load incrementally (lazy loading)
- Network detection: Lightweight polling (~1 second)

## Security Notes

- Standalone mode: All data on device, encrypted storage recommended
- Connected mode: Uses Bearer tokens, HTTPS recommended
- Mode switching: Data cleared (prevents info leaks between modes)
- Local auth: Device-only JWT, no external validation
- Remote auth: Server-validated credentials, secure token handling

## Next Steps for Deployment

1. Build and test standalone mode thoroughly
2. If connecting to server:
   - Deploy/configure backend API
   - Update server URL in ServerConfigScreen or suggest URL in help
   - Test connected mode flows
   - Consider HTTPS for production
3. Test on multiple devices
4. Consider adding data export/import for mode switching
5. Monitor network detection performance
6. Gather user feedback on offline experience

---

**Implementation Status**: ✅ COMPLETE

All 8 phases implemented:
1. ✅ Mode Infrastructure
2. ✅ Remote Services  
3. ✅ Local Service Routing
4. ✅ Service Abstraction
5. ✅ Dynamic API Configuration
6. ✅ Settings UI
7. ✅ Navigation Integration
8. ✅ Offline Detection & Connection Retry

Ready for testing and deployment.
