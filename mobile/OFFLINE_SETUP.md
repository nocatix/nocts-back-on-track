# Mobile App - Offline Setup Guide

## Quick Start

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Android Studio (for Android) or Xcode (for iOS)

### Installation Steps

1. **Install Dependencies**
   ```bash
   cd mobile
   npm install
   ```

2. **Start the App**
   ```bash
   npm start
   ```

3. **Choose Platform**
   - Press `a` for Android
   - Press `i` for iOS
   - Press `w` for web

### First Time Setup

1. Open the app
2. Create an account with:
   - Username: Your desired username
   - Full Name: Your name
   - Password: Your password
3. You're ready to use all features offline!

## Database Initialization

The SQLite database is automatically created on first app launch:
- Tables are created automatically
- No manual setup needed
- Data persists between app sessions

## Environment Variables

Create a `.env.local` file in the `mobile/` directory:
```
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

(Note: This is for reference only - the app now uses local database)

## Important Breaking Changes

### API Calls
All API calls now use local services instead of HTTP:

**Before:**
```javascript
const response = await api.post('/addictions', addictionData);
```

**After:**
```javascript
return await localAddictionService.createAddiction(
  userId,
  name,
  stopDate,
  frequencyPerDay,
  moneySpentPerDay,
  notes
);
```

### Authentication
JWT tokens are now generated locally:
```javascript
import { createToken, verifyToken } from '../utils/jwtHelper';

const token = createToken(userId, username);
const verified = verifyToken(token);
```

### Data Storage
All data is stored in SQLite, encrypted if sensitive:
```javascript
import { encrypt, decrypt } from '../utils/encryption';

const encrypted = encrypt(sensitiveData);
const decrypted = decrypt(encryptedData);
```

## File Organization

```
mobile/
├── src/
│   ├── api/                    # API service layer (converted)
│   ├── services/               # Local database services
│   │   ├── localAuthService.js
│   │   ├── localMoodService.js
│   │   ├── localAddictionService.js
│   │   ├── localDiaryService.js
│   │   ├── localWeightService.js
│   │   ├── localMemoryService.js
│   │   ├── localAchievementService.js
│   │   └── localTrophyService.js
│   ├── db/
│   │   └── database.js         # SQLite initialization
│   ├── utils/
│   │   ├── jwtHelper.js        # Token management
│   │   └── encryption.js       # Data encryption
│   ├── context/                # React context
│   ├── pages/                  # Screen components
│   └── components/             # Reusable components
├── App.js                      # Root component
├── OFFLINE_ARCHITECTURE.md     # Full documentation
└── package.json
```

## Testing the Offline-First Architecture

### Test 1: Basic CRUD Operations
```javascript
// This works completely offline
const addiction = await addictionService.createAddiction({
  name: 'Smoking',
  stopDate: new Date(),
  frequencyPerDay: 10,
  moneySpentPerDay: 15,
  notes: 'Test note'
});
```

### Test 2: No Network Required
1. Enable Airplane Mode
2. Create, update, and delete records
3. All operations should work normally

### Test 3: Data Persistence
1. Create some moods
2. Close and reopen the app
3. Data should still be there

## Debugging

### Check Logs
```bash
# Android
npm start -- --android

# iOS
npm start -- --ios
```

### Enable Verbose Logging
```javascript
// In database.js or services
console.log('[DEBUG]', message);
```

### Database Inspection

To inspect the SQLite database:
1. **Android**: Use Android Studio Device Explorer
2. **iOS**: Use Xcode Console
3. **Web**: Use browser DevTools

## Common Issues

### Issue: "Database not initialized"
**Solution**: 
- Restart the app
- Clear app cache: `npm start -- --clear`

### Issue: "User not found"
**Solution**:
- Create an account first
- Login with the correct credentials
- Check username spelling

### Issue: "Phone storage full"
**Solution**:
- Clear app data
- Uninstall and reinstall
- Free up device storage

## Performance Tips

1. **Reduce Re-renders**: Use React.memo for components
2. **Batch Database Queries**: Group operations when possible
3. **Lazy Load Data**: Don't load all data at once
4. **Use Pagination**: Implement pagination for large lists

## Updating Dependencies

```bash
# Update all packages
npm update

# Update specific package
npm install package-name@latest
```

## Building for Production

### Android
```bash
eas build --platform android
```

### iOS
```bash
eas build --platform ios
```

## Deployment

The app is self-contained and has no external dependencies once installed. Simply distribute the APK (Android) or IPA (iOS) file.

## Security Considerations

1. **Password Storage**: Hashed with bcryptjs (10 rounds)
2. **Token Storage**: Stored in SecureStore or AsyncStorage
3. **Data Encryption**: Sensitive data encrypted with base64
4. **No Transmission**: Data never leaves the device

## Next Steps

After installation:
1. Test all features work offline
2. Create sample data
3. Verify data persists after restart
4. Test on different devices
5. Monitor app performance

## Support

For help:
1. Check `OFFLINE_ARCHITECTURE.md` for detailed documentation
2. Review console logs for errors
3. Test on different devices
4. Clear app data if issues persist

---

**Version**: 1.1.0 (Offline-First)
**Last Updated**: April 2026
