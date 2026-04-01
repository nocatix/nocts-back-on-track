# Nocts: Back on Track - Mobile App

A fully-featured React Native mobile application for iOS and Android built with Expo. Helps users track their addictions, monitor withdrawal symptoms, log moods, write diary entries, and practice mindfulness.

## 🚀 Features

### Authentication
- User registration and login
- Secure token-based authentication
- Auto-logout on invalid token
- Session persistence

### Dashboard
- View all tracked addictions
- Statistics overview (total addictions, active trackers)
- Quick add new addiction button
- Real-time progress tracking

### Addiction Tracking
- Track multiple addiction types (nicotine, alcohol, cannabis, etc.)
- Automatic withdrawal timeline calculation
- Phase tracking (severe → moderate → mild → recovery → recovered)
- Progress visualization with percentage complete
- Withdrawal symptoms display
- Log cravings
- View detailed addiction information

### Mood Tracking
- 5-level mood logging system (Very Bad to Excellent)
- Add optional notes to moods
- Visual mood history
- Recent moods display

### Diary
- Write and save diary entries
- View all diary entries with dates
- Organized by most recent first
- Search and filter capabilities

### Meditation
- 4 guided meditation sessions (5-20 minutes)
- Breathing animation during meditation
- Timer with pause/resume functionality
- Benefits information
- Meditation tips

### Additional Features
- Logout functionality
- Error handling and user feedback
- Loading states for API calls
- Responsive design for all screen sizes
- Clean, modern UI with accent color (#6366f1)

## 📱 Project Structure

```
mobile/
├── App.js                           # Main app entry point with navigation
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── babel.config.js                 # Babel configuration
├── jest.config.js                  # Testing configuration
├── jest.setup.js                   # Jest setup
├── src/
│   ├── api/                        # API services
│   │   ├── axiosConfig.js          # Axios instance with auth interceptor
│   │   ├── authService.js          # Authentication endpoints
│   │   ├── addictionService.js     # Addiction CRUD operations
│   │   ├── moodService.js          # Mood tracking endpoints
│   │   ├── diaryService.js         # Diary entry endpoints
│   │   ├── achievementService.js   # Achievement endpoints
│   │   └── weightService.js        # Weight tracking endpoints
│   ├── components/                 # Reusable components
│   │   ├── FormInput.js            # Text input field
│   │   ├── Button.js               # Primary button
│   │   ├── ErrorMessage.js         # Error display component
│   │   ├── AddictionCard.js        # Addiction display card
│   │   └── StatCard.js             # Statistics card
│   ├── context/                    # React contexts
│   │   ├── AuthContext.js          # Auth state management
│   │   └── DarkModeContext.js      # Dark mode state management
│   ├── pages/                      # App screens
│   │   ├── LoginScreen.js          # Login page
│   │   ├── RegisterScreen.js       # Registration page
│   │   ├── MainMenuScreen.js       # Dashboard/home page
│   │   ├── AddNewAddictionScreen.js # Add addiction form
│   │   ├── AddictionDetailScreen.js # Addiction details view
│   │   ├── MoodScreen.js           # Mood tracker
│   │   ├── DiaryScreen.js          # Diary entries
│   │   └── MeditationScreen.js     # Meditation sessions
│   └── utils/                      # Utility functions
│       └── withdrawalHelper.js     # Withdrawal phase calculations
└── assets/                         # App icons and images (for setup)
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode (for iOS development/building)
- Android: Android Studio and Android SDK (for Android development)
- Expo Go app on iOS or Android device (for testing)

### Install Dependencies

```bash
cd mobile
npm install
```

### Configure Environment

Create a `.env` file in the mobile directory:

```
EXPO_PUBLIC_API_URL=http://192.168.1.X:5000/api
```

Replace `192.168.1.X` with your backend server's IP address (use `localhost` only if running on the same machine).

## 🎯 Running the App

### Start Expo Development Server
```bash
npm start
```

This opens the Expo CLI menu. You can then:

### Option 1: Run on Expo Go (Fastest for Testing)
- Press `i` for iOS or `a` for Android
- Or scan QR code with Expo Go app on your device

### Option 2: Build for Android Emulator
```bash
npm run android
```
Requires Android Studio and Android emulator setup.

### Option 3: Build for iOS Simulator
```bash
npm run ios
```
Requires Xcode and running on macOS.

### Option 4: Test on Web
```bash
npm run web
```

## 🔐 Authentication & API Integration

### Login/Register Flow
1. User enters credentials on auth screens
2. Credentials sent to backend `/auth/login` or `/auth/register`
3. Backend returns JWT token and user data
4. Token stored in AsyncStorage for persistence
5. Token automatically added to all API requests via Axios interceptor

### Token Management
- Tokens automatically included in all requests via `axiosConfig.js`
- Invalid/expired tokens trigger logout and redirect to login
- Logout clears token from AsyncStorage

## 📊 Data Models

### Addiction
```javascript
{
  _id: string,
  name: string,
  type: enum[nicotine|alcohol|cannabis|hardDrugs|coffee|sugar|socialMedia|videoGames|gambling|pornography|shopping|overeating|doomscrolling|other],
  description: string,
  startDate: ISO8601 date,
  status: enum[active|paused|completed],
  createdAt: ISO8601 date,
  updatedAt: ISO8601 date
}
```

### Mood
```javascript
{
  _id: string,
  moodLevel: number (1-5),
  notes: string,
  timestamp: ISO8601 date,
  createdAt: ISO8601 date
}
```

### Diary Entry
```javascript
{
  _id: string,
  content: string,
  date: ISO8601 date,
  createdAt: ISO8601 date,
  updatedAt: ISO8601 date
}
```

## 🧮 Withdrawal Timeline Calculations

The `withdrawalHelper.js` provides utilities for withdrawal tracking:

### Withdrawal Phases by Addiction Type
- **Severe**: Most intense symptoms (3-10 days depending on type)
- **Moderate**: Symptoms improving (7-21 days)
- **Mild**: Light symptoms (14-45 days)
- **Recovery**: Significant improvement (30-180 days)
- **Recovered**: Completion (90+ days)

### Methods
- `getTimeline(addictionType)` - Get phase timeline
- `calculateDaysSinceStart(startDate)` - Calculate days elapsed
- `getPhaseByDays(addictionType, days)` - Get current phase
- `calculatePercentageComplete(addictionType, startDate)` - Get progress %
- `getMotivationalMessage(phase, days)` - Get encouragement message
- `getSymptoms(addictionType)` - Get common symptoms

## 🎨 Styling & Design System

### Color Palette
- **Primary**: `#6366f1` (Indigo)
- **Success**: `#22c55e` (Green)
- **Warning**: `#eab308` (Yellow)
- **Alert**: `#ef4444` (Red)
- **Background**: `#f9fafb` (Light Gray)

### Withdrawal Phase Colors
- Severe: `#ef4444` (Red)
- Moderate: `#f97316` (Orange)
- Mild: `#eab308` (Yellow)
- Recovery: `#84cc16` (Lime)
- Recovered: `#22c55e` (Green)

## 🔄 State Management

### AuthContext
Manages global authentication state:
- `user` - Current user object
- `userToken` - JWT token
- `loading` - Loading state
- `error` - Error messages
- `login()` - Authenticate user
- `register()` - Create new account
- `logout()` - Clear session

### DarkModeContext
Manages dark mode preference:
- `isDarkMode` - Current mode
- `toggleDarkMode()` - Toggle mode

## 📡 Error Handling

All API calls include error handling:
- Network errors trigger user-friendly messages
- Invalid credentials show specific error messages
- Failed requests show retry options
- Loading states prevent double submissions
- Error messages automatically clear on retry

## 🧪 Testing

Run tests with:
```bash
npm test
```

Currently configured for basic Jest setup. Expand with React Native testing library.

## 📦 Building for Production

### Android Build
```bash
npm run eas
# Or using Expo's build service:
eas build --platform android
```

### iOS Build
```bash
eas build --platform ios
```

See [EAS Build documentation](https://docs.expo.dev/build/introduction/) for detailed instructions.

## 🤝 Integration with Web Client

This mobile app shares the same backend API as the web client in `../client/`. The API service layer abstracts backend calls, making it easy to:
- Sync data between mobile and web
- Maintain consistent business logic
- Share API response formats
- Coordinate authentication

## 📝 Development Guidelines

### Adding New Screens
1. Create new file in `src/pages/ScreenName.js`
2. Add route to `App.js` navigation
3. Import any needed services
4. Use existing components when possible

### Adding API Endpoints
1. Create service file in `src/api/serviceNameService.js`
2. Use `axiosConfig` instance for requests
3. Handle errors consistently
4. Export named functions for each endpoint

### Creating Reusable Components
1. Add to `src/components/` directory
2. Use StyleSheet for styling
3. Accept props for customization
4. Document component props

## 🐛 Troubleshooting

### App won't start
- Clear Expo cache: `expo r -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node version: `node --version` (should be 18+)

### API requests failing
- Verify backend is running
- Check API URL in `.env`
- Ensure device/emulator can reach backend (not `localhost`)
- Check Axios interceptor logs

### Navigation not working
- Verify screen names match exactly in App.js
- Check navigation params are properly passed
- Ensure screens are registered in navigator

## 📚 Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Axios Documentation](https://axios-http.com/)

## 📄 License

This project is part of Nocts: Back on Track and follows the same license as the main project.
