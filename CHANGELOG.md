# Changelog

All notable changes to this project will be documented in this file.

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

- **1.2.0** - 2026-04-01 - Modern UI redesign for 2026
- **1.1.25** - 2026-03-15 - Meditation page enhancements
- **1.1.0** - Earlier - Initial release with core features
