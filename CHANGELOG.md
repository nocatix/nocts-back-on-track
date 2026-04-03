# Changelog

All notable changes to this project will be documented in this file.

## [1.4.11] - 2026-04-03

### 🔧 Build & Infrastructure

#### **Local APK Builds**
- **One-command local APK script**: Added `mobile/scripts/build-local-apk.sh` for building debug or release APKs entirely on-device without EAS Cloud
- **Android SDK auto-detection**: Script now automatically discovers the Android SDK from `ANDROID_HOME`, `ANDROID_SDK_ROOT`, and common install paths
- **Gradle 8.13 requirement**: Updated Gradle wrapper to 8.13 to satisfy Android Gradle Plugin autolinking compile requirements
- **Java home cleanup**: Removed empty `org.gradle.java.home` override that caused Gradle parse errors
- **Build reliability**: Improved `build-local-apk.sh` robustness with better error handling and fallback detection logic

## [1.4.10] - 2026-04-03

### 🐛 Fixed

#### **GHCR Frontend Image**
- **Runtime API URL**: Stopped baking `localhost` API URL into the GHCR frontend image at build time; the URL is now derived at runtime from the browser's host

## [1.4.9] - 2026-04-03

### ✨ Features

#### **Dynamic Frontend API Host**
- **Browser-derived API host**: Frontend now reads the API base URL from `window.location.hostname` at runtime instead of a hardcoded value, making the GHCR image work on any host

#### **Structured Logging**
- **Frontend & backend logging**: Implemented consistent structured logging across all frontend components and backend services using levelled log output

## [1.4.8] - 2026-04-03

### 🐛 Fixed

#### **CORS / Security Headers**
- **Helmet CORP fix**: Configured Helmet to allow cross-origin API responses, resolving browser-blocked requests when frontend and backend run on different ports or hosts

## [1.4.7] - 2026-04-03

### ✨ Features

#### **IPv6 Network Support**
- **IPv6 whitelist**: Extended IP whitelist utility to recognise IPv6 loopback (`::1`) and mapped addresses, preventing auth failures on IPv6-only or dual-stack networks

## [1.4.6] - 2026-04-03

### 🐛 Fixed

#### **Infrastructure**
- **Frontend API URL**: Fixed incorrect API base URL used by the frontend when running inside Docker
- **MongoDB initialisation**: Corrected `mongo-init.js` to properly seed the database on first run

## [1.4.5] - 2026-04-03

### 🐛 Fixed

#### **Privacy**
- **Remove fullName field**: Removed `fullName` from the registration form and user model, reducing unnecessary personal data collection

## [1.4.4] - 2026-04-02

### 🐛 Fixed

#### **Android Build**
- **Gradle 8.7 + Kotlin compatibility**: Resolved Kotlin compilation errors triggered by Gradle 8.7 by explicitly setting `sourceCompatibility` and `targetCompatibility` to Java 17

## [1.4.3] - 2026-04-02

### 🧹 Chores

- Removed outdated offline implementation progress documentation files that were superseded by the stable offline-first architecture

## [1.4.2] - 2026-04-02

### 🐛 Fixed

#### **CI/CD**
- **build-apk workflow trigger**: Restored the `main` branch push trigger for the build-apk GitHub Actions workflow that was accidentally removed
- **Branch coverage**: Extended the build-apk workflow to trigger on all branches so feature-branch APKs are built automatically

## [1.4.1] - 2026-04-02

### 🐛 Fixed

#### **TypeScript / Dependencies**
- **TypeScript 5.0 for i18next 26**: Upgraded TypeScript to 5.0 to resolve type-incompatibility with i18next 26
- **TypeScript pin in client**: Pinned `typescript` to `^4.9.5` in `client/package.json` to prevent peer-dependency conflicts with `react-scripts`

#### **Docker**
- **Dockerfile.client COPY fix**: Corrected `COPY` directives in `Dockerfile.client` to avoid creating a nested `client/client` directory inside the image
- **Root package.json version sync**: Synced the root `package.json` version to `1.4.0` to ensure consistent Docker build labelling

## [1.4.0] - 2026-04-02

### ✨ Features

#### **100% Mobile-Web Feature Parity**
- **PrivacyPolicyScreen**: Comprehensive privacy policy with 8 expandable sections covering data collection, storage, protection, and user rights
- **FunctioningUserScreen**: Educational content on the dangers of functional addiction with 8 in-depth sections and recovery guidance
- **Enhanced Therapy Page**: Added medication partnership content to explain how therapy and medication work together in recovery
- **Updated Resources Hub**: Integrated new educational pages into the resources navigation

### 🎨 UI/UX

#### **Dark Mode Enhancements**
- Full dark mode support on all 26 core pages (100% parity achieved)
- Consistent theme.colors.* integration across all new screens
- Fixed scroll clipping with proper bottom padding (+40px) on educational screens

### 🐛 Fixed

#### **Component & Build Fixes**
- **Slider Import**: Fixed React Native Slider component import - moved from `react-native` to `@react-native-community/slider`
- **JSX Syntax**: Fixed missing closing tag in CravingGameScreen recoveryText
- **Dependencies**: Added `@react-native-community/slider` to package.json dependencies
- **MoodScreen**: Updated to use community slider package with proper theme integration

### 📱 Mobile App

#### **Feature Completeness**
- All 26 core pages now available on mobile (matches web exactly)
- Educational resources fully accessible from Resources Hub
- Complete dark mode coverage across all screens

## [1.3.0] - 2026-04-02

### 🐛 Fixed

#### **Pledge Date Calculation Issue**
- **Timezone-aware Date Calculations**: Fixed off-by-one error in pledge day calculations caused by mixing UTC and local timezone conversions
- **UTC-based Midnight Computation**: Modified `getDaysUntilStop()` in Pledge model and `getDaysUntilPlannedStop()` in Addiction model to use consistent UTC midnight calculations
- **Pledge Display Logic**: Pledges set for tomorrow now correctly show `daysUntilStop = 1` instead of 0, preventing premature "Time to Stop" alerts
- **Consistent Date Handling**: All date boundary calculations now use UTC to avoid timezone-related bugs across different server locations

## [1.2.0] - 2026-04-01

### ✨ Enhanced

#### **UI/UX Modernization (2026 Design)**
- **Modern Design System**: Replaced dated purple gradient with clean, minimal light backgrounds
- **Glassmorphism Effects**: Added backdrop blur effects throughout the interface for depth and sophistication
- **Improved Typography**: Upgraded to system fonts (`-apple-system, BlinkMacSystemFont, 'Segoe UI'`) for better rendering and performance
- **Enhanced Dark Mode**: Better contrast and subtle gradient improvements for comfortable viewing
- **Responsive Mobile Navigation**: 
  - Transforms sidebar to bottom navigation drawer on mobile devices (more intuitive thumb reach)
  - Touch-friendly spacing and optimal tap targets
  - Smart grid layout that adapts from list to card grid on smaller screens
  
#### **Micro-interactions & Animation**
- **Smooth Transitions**: Implemented cubic-bezier easing (`0.4, 0, 0.2, 1`) for professional feel
- **Active State Indicators**: Left accent bar now indicates active navigation items
- **Hover Effects**: Improved visual feedback with safe scale and translate animations
- **Better Spacing**: Increased padding and gaps throughout for improved breathing room

#### **Meditation Page**
- **Fixed Breathing Circle Animation**: Resolved rendering artifacts during hold phase
- **Simplified Animation**: Cleaner opacity-based animations for better performance
- **Emergency Calm Button**: Now properly displays the full breathing guide UI when activated
- **Responsive Breathing Guide**: Works seamlessly on both desktop and mobile layouts

#### **Footer**
- **Version Display**: Added v1.2.0 badge in footer showing current software version

### 🐛 Fixed

- Emergency Calm meditation button now properly shows the breathing guide UI
- Stop Breathing Guide button now uses dedicated CSS class to prevent form submission interference
- Breathing circle animation no longer shows rendering artifacts during hold phase
- Button click handlers now reliably respond on all devices

### 📦 Updated

- Updated License to PolyForm Non-Commercial 1.0.0 (replaces MIT)
- Enhanced responsive breakpoints for better mobile support
- Improved CSS variable usage throughout application

### 🎨 Design Changes

- **Color Palette**: 
  - Light mode: Clean `#f5f7fa` backgrounds
  - Dark mode: Deep `#0f0f0f` to `#1a1a1a` gradients
- **Border Radius**: Increased to 8px for softer, more modern appearance
- **Shadows**: Subtle box-shadows for better depth perception
- **Typography**: Better font hierarchy and improved readability

### 📱 Mobile Improvements

- Sidebar transforms into bottom navigation drawer on screens < 768px
- Collapsible header with slide-up animation
- Touch-optimized navigation grid (4-column on mobile, 5+ on desktop)
- Proper padding adjustments for smaller screens
- Hamburger menu functionality for navigation

## [1.1.25] - 2026-03-15

### ✨ Features

- Sidebar reorganization with collapsible categories
- Meditation page enhancements with Emergency Calm button
- Session timer with full controls (play/pause/resume/reset)
- Guided breathing exercises with visual animations
- Progress tracking and session history
- Posture tips guide

---

## Version History

- **1.4.11** - 2026-04-03 - Local APK builds, Android SDK auto-detection, Gradle 8.13
- **1.4.10** - 2026-04-03 - Stop baking localhost API URL into GHCR frontend image
- **1.4.9** - 2026-04-03 - Dynamic frontend API host, structured logging
- **1.4.8** - 2026-04-03 - Helmet CORS/CORP fix for cross-origin API responses
- **1.4.7** - 2026-04-03 - IPv6 whitelist support
- **1.4.6** - 2026-04-03 - Frontend API URL and MongoDB initialisation fixes
- **1.4.5** - 2026-04-03 - Remove fullName field from registration
- **1.4.4** - 2026-04-02 - Gradle 8.7 + Kotlin Java 17 compatibility fix
- **1.4.3** - 2026-04-02 - Remove outdated documentation files
- **1.4.2** - 2026-04-02 - Restore build-apk CI/CD workflow triggers
- **1.4.1** - 2026-04-02 - TypeScript/i18next and Dockerfile.client fixes
- **1.4.0** - 2026-04-02 - Full mobile-web feature parity, dark mode, dual-mode support
- **1.3.0** - 2026-04-02 - Pledge timezone calculation fix
- **1.2.0** - 2026-04-01 - Modern UI redesign for 2026
- **1.1.25** - 2026-03-15 - Meditation page enhancements
- **1.1.0** - Earlier - Initial release with core features
