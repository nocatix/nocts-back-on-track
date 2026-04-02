# Mobile Feature Parity Implementation Plan

**Document Created:** 2 April 2026  
**Objective:** Bridge the gap between web and mobile versions to achieve feature parity  
**Timeline Estimate:** 8-12 weeks (depending on priority and parallel development)  
**Status:** Draft - Ready for Review & Implementation

---

## Executive Summary

The mobile version currently implements **11 core features** while the web version has **25+ features**. This plan outlines a phased approach to implement missing features in the mobile app, organized by priority and technical complexity.

### Current State
- **Mobile Gaps:** 14 major missing features
- **Core Features Implemented:** Addiction tracking, Mood tracking, Diary, Meditation, Dark mode
- **Mobile Advantages:** Biometric auth, Offline capability, Dual-mode architecture (Standalone/Connected)

### Target Outcome
Mobile version will support all web features plus maintain unique offline/biometric capabilities.

---

## Feature Gap Analysis

### Missing in Mobile (14 Features)

#### **Educational & Resources (5 features)**
- [ ] Withdrawal Symptoms guide
- [ ] Crisis support hotlines (Global, USA, UK, Australia, etc.)
- [ ] Therapy information
- [ ] "How to Succeed" guide
- [ ] "Why Use This" educational content

#### **Engagement & Entertainment (3 features)**
- [ ] Craving Game (Wordle-like word puzzle)
- [ ] Exercise routines
- [ ] Hobbies recommendations

#### **Tracking & Monitoring (3 features)**
- [ ] Weight tracking with charts
- [ ] Memories section
- [ ] Achievements/Trophies gamification system

#### **User Setup & Preparation (2 features)**
- [ ] Preparation Plan questionnaire
- [ ] Self-assessment tools

#### **Localization (1 feature)**
- [ ] Multi-language support (i18n)

---

## Implementation Phases

### Phase 1: Core Tracking Features (Weeks 1-3)
**Priority: CRITICAL** | **Estimated Effort:** 40 hours  
*Extend core tracking capabilities to match web version*

#### 1.1 Weight Tracking
- **Components Needed:**
  - WeightTracker screen (add/view/chart)
  - WeightService (local + remote)
  - Weight model/database schema
- **UI Elements:** Line chart visualization, weight history list, add weight form
- **Backend Dependencies:** GET/POST /weights endpoints (if not existing)
- **Effort:** 12 hours
- **Checklist:**
  - [ ] Create mobile/src/pages/WeightTracker.js
  - [ ] Add WeightService (standalone + connected)
  - [ ] Create chart component (react-native-chart-kit)
  - [ ] Add WheightTracker context
  - [ ] Add tab navigation entry
  - [ ] Connect to server API in connected mode
  - [ ] Add local SQLite schema

#### 1.2 Memories Section
- **Components Needed:**
  - MemoriesScreen (add/view/list)
  - MemoriesService (local + remote)
  - Memories model/database schema
- **UI Elements:** Memory list with timestamps, detail view, add memory form
- **Backend Dependencies:** GET/POST /memories endpoints
- **Effort:** 10 hours
- **Checklist:**
  - [ ] Create mobile/src/pages/MemoriesScreen.js
  - [ ] Add MemoriesService (standalone + connected)
  - [ ] Create memory list component
  - [ ] Add MemoriesContext
  - [ ] Connect to server API
  - [ ] Add local SQLite schema

#### 1.3 Achievements & Trophies System
- **Components Needed:**
  - AchievementsScreen (view/unlock logic)
  - TrophiesScreen (view trophies)
  - AchievementService (track unlocks)
  - Trophy model/database schema
- **Definition of "achievement":** Fixed milestones (7 days sober, 30 days sober, etc.)
- **Effort:** 18 hours
- **Checklist:**
  - [ ] Create mobile/src/pages/AchievementsScreen.js
  - [ ] Create mobile/src/pages/TrophiesScreen.js
  - [ ] Add AchievementService with unlock logic
  - [ ] Add TrophyService (standalone + connected)
  - [ ] Create achievement/trophy UI components
  - [ ] Add contexts for both
  - [ ] Implement unlock notifications
  - [ ] Add local SQLite schemas
  - [ ] Connect to server API

**Subtask Interdependencies:** Weight → Achievements (weight-based achievements)

---

### Phase 2: Educational Resources (Weeks 4-6)
**Priority: HIGH** | **Estimated Effort:** 35 hours  
*Add educational content and crisis support resources*

#### 2.1 Withdrawal Symptoms Guide
- **Content Source:** Use existing web version content (client/src/pages/WithdrawalPage.js)
- **Implementation:** Static content screen with addiction-specific symptoms
- **UI Pattern:** Expandable sections by addiction type, symptom details, coping strategies
- **Effort:** 8 hours
- **Checklist:**
  - [ ] Create mobile/src/pages/WithdrawalGuideScreen.js
  - [ ] Create mobile/src/components/SymptomAccordion.js
  - [ ] Port content from web version
  - [ ] Add search/filter by addiction type
  - [ ] Add symptom timeline view

#### 2.2 Crisis Hotlines Directory
- **Content Source:** Use existing web version hotlines database
- **Implementation:** Searchable list by region/country with quick-dial functionality
- **UI Features:** Search, favorites, quick call button, SMS option
- **Effort:** 10 hours
- **Checklist:**
  - [ ] Create mobile/src/pages/CrisisHotlinesScreen.js
  - [ ] Create mobile/src/components/HotlineCard.js
  - [ ] Port hotline data from web version
  - [ ] Implement search functionality
  - [ ] Add quick-dial integration (Linking API)
  - [ ] Add favorites feature (context/local storage)
  - [ ] Add geolocation-based filtering

#### 2.3 Therapy Information
- **Content Source:** Use existing web version content
- **Implementation:** Information screens about therapy types, how to find therapist, insurance
- **UI Pattern:** Cards with expandable details, links to resources
- **Effort:** 8 hours
- **Checklist:**
  - [ ] Create mobile/src/pages/TherapyInfoScreen.js
  - [ ] Create therapy type cards
  - [ ] Port content from web version
  - [ ] Add links to external resources
  - [ ] Add filter by therapy type

#### 2.4 "How to Succeed" & "Why Use This" Guides
- **Content Source:** Use existing web pages
- **Implementation:** Guide screens with video/image support where applicable
- **Effort:** 9 hours
- **Checklist:**
  - [ ] Create mobile/src/pages/SuccessGuideScreen.js
  - [ ] Create mobile/src/pages/AboutAppScreen.js
  - [ ] Port web content
  - [ ] Add expandable sections
  - [ ] Link to videos if applicable

**Phase Interdependencies:** None - independent content additions

---

### Phase 3: Entertainment & Engagement (Weeks 7-8)
**Priority: HIGH** | **Estimated Effort:** 35 hours  
*Add gamification and distraction features*

#### 3.1 Craving Game (Wordle-like)
- **Game Logic:** Port from web version (CravingGame.js in web)
- **Features:** Daily word puzzle, hint system, scoring
- **Effort:** 16 hours
- **Checklist:**
  - [ ] Create mobile/src/pages/CravingGameScreen.js
  - [ ] Adapt game logic from web version
  - [ ] Create mobile UI components (keyboard, grid)
  - [ ] Implement daily reset logic
  - [ ] Add scoring/stats tracking
  - [ ] Add hint system
  - [ ] Add animations/feedback
  - [ ] Create GameService for storing stats

#### 3.2 Exercise Routines
- **Content Source:** Use existing web version content
- **Features:** Exercise library by intensity level, guided routines, timer
- **Effort:** 12 hours
- **Checklist:**
  - [ ] Create mobile/src/pages/ExerciseScreen.js
  - [ ] Create mobile/src/components/ExerciseRoutineCard.js
  - [ ] Port exercise data from web
  - [ ] Implement filter by intensity/duration
  - [ ] Add timer component
  - [ ] Add favorite/bookmark feature

#### 3.3 Hobbies Recommendations
- **Content Source:** Use existing web version content
- **Features:** Hobby suggestions by category, details, quick-start guides
- **Effort:** 7 hours
- **Checklist:**
  - [ ] Create mobile/src/pages/HobbiesScreen.js
  - [ ] Port hobby database from web
  - [ ] Create hobby cards with details
  - [ ] Add filter by category
  - [ ] Add favorites feature

---

### Phase 4: User Setup & Preparation (Weeks 9-10)
**Priority: MEDIUM** | **Estimated Effort:** 25 hours  
*Add pre-quit planning tools*

#### 4.1 Preparation Plan Questionnaire
- **Purpose:** Help users prepare before quitting
- **Implementation:** Multi-step form collecting goal setting, support system, triggers
- **Data Storage:** Save responses locally and sync with server
- **Effort:** 15 hours
- **Checklist:**
  - [ ] Create mobile/src/pages/PreparationPlanScreen.js
  - [ ] Create multi-step form component
  - [ ] Port questionnaire from web version
  - [ ] Add form validation
  - [ ] Create PreparationService (local + remote)
  - [ ] Add local SQLite schema
  - [ ] Add PreparationContext
  - [ ] Implement form progress tracking

#### 4.2 Self-Assessment Tools
- **Purpose:** Help users evaluate their relationship with addiction
- **Implementation:** Interactive questionnaire with scoring
- **Effort:** 10 hours
- **Checklist:**
  - [ ] Create mobile/src/pages/SelfAssessmentScreen.js
  - [ ] Port assessment logic from web
  - [ ] Create assessment components
  - [ ] Implement scoring algorithm
  - [ ] Add result interpretation
  - [ ] Create SelfAssessmentService
  - [ ] Store assessment history

---

### Phase 5: Profile & Localization (Weeks 11-12)
**Priority: MEDIUM** | **Estimated Effort:** 30 hours  
*Complete user experience enhancements*

#### 5.1 Profile Management
- **Features:** Edit name, email, addiction list, preferences
- **Effort:** 8 hours
- **Checklist:**
  - [ ] Create mobile/src/pages/ProfileScreen.js
  - [ ] Implement profile edit form
  - [ ] Add profile picture upload (optional)
  - [ ] Create UserService update methods
  - [ ] Add validation

#### 5.2 Multi-Language Support (i18n)
- **Approach:** Use existing web i18n infrastructure (likely react-i18next)
- **Supported Languages:** ar, de, en, en-simple, es, fr, it, ja, ko, pt, ru, zh
- **Implementation:** 
  - Set up react-i18next for mobile (React Native compatible)
  - Reuse translation files from client/public/locales/
  - Add language selector in settings
- **Effort:** 22 hours
- **Checklist:**
  - [ ] Install i18next and react-i18next for React Native
  - [ ] Migrate translation files from web
  - [ ] Wrap all UI strings in translation keys
  - [ ] Create language switcher UI
  - [ ] Add language selection to Settings
  - [ ] Test all languages
  - [ ] Save language preference to AsyncStorage

---

## Implementation Roadmap

```
Week  1-3   [PHASE 1] Core Tracking: Weight, Memories, Achievements/Trophies
      4-6   [PHASE 2] Educational: Withdrawal, Hotlines, Therapy, Guides
      7-8   [PHASE 3] Entertainment: Craving Game, Exercises, Hobbies
      9-10  [PHASE 4] Setup: Preparation Plan, Self-Assessment
      11-12 [PHASE 5] Profile & Localization
```

---

## Technical Implementation Strategy

### Database Schema Additions (for Standalone Mode)

```javascript
// New tables needed in SQLite
WEIGHT:
  - id (PRIMARY KEY)
  - date (DATETIME)
  - weight (DECIMAL)
  - unit (VARCHAR) // kg, lbs
  - notes (TEXT)
  - synced (BOOLEAN)

MEMORIES:
  - id (PRIMARY KEY)
  - date (DATETIME)
  - content (TEXT)
  - type (VARCHAR) // positive, challenge, etc.
  - synced (BOOLEAN)

ACHIEVEMENTS:
  - id (PRIMARY KEY)
  - name (VARCHAR)
  - description (TEXT)
  - icon (VARCHAR)
  - unlockedAt (DATETIME)
  - synced (BOOLEAN)

TROPHIES:
  - id (PRIMARY KEY)
  - name (VARCHAR)
  - type (VARCHAR)
  - earnedAt (DATETIME)
  - addiction_id (FOREIGN KEY)
  - synced (BOOLEAN)

PREPARATION_PLAN:
  - id (PRIMARY KEY)
  - addiction_id (FOREIGN KEY)
  - responses (JSON) // questionnaire responses
  - createdAt (DATETIME)
  - synced (BOOLEAN)

SELF_ASSESSMENT:
  - id (PRIMARY KEY)
  - addiction_id (FOREIGN KEY)
  - score (INT)
  - responses (JSON)
  - createdAt (DATETIME)
```

### Service Architecture Pattern (Follow Existing Pattern)

Each new feature should implement dual services:

```
// Example: WeightService
mobile/src/services/
  ├── weight/
  │   ├── WeightServiceLocal.js    // SQLite operations
  │   ├── WeightServiceRemote.js   // API calls
  │   └── index.js                 // Mode-aware factory
```

### Context Pattern

```javascript
// Example: WeightContext
mobile/src/context/
  └── WeightContext.js
      - useWeight hook
      - Provider component
      - Actions: ADD_WEIGHT, DELETE_WEIGHT, SET_WEIGHTS, etc.
```

### UI Navigation Updates

```javascript
// Add to mobile/src/App.js tab navigation:
// Phase 1:
<Tab.Screen name="Weight" component={WeightTracker} />
<Tab.Screen name="Achievements" component={AchievementsScreen} />

// Phase 2:
<Tab.Screen name="Resources" component={ResourcesHub} />

// Phase 3: (could be nested in Resources or separate tab)
<Tab.Screen name="Games" component={CravingGame} />
```

---

## Dependencies & Prerequisites

### Required Libraries (if not already installed)

```json
{
  "react-native-chart-kit": "^6.x",  // For weight charts
  "react-native-vector-icons": "^x.x", // For icons
  "react-i18next": "^11.x",  // For localization
  "i18next": "^20.x",
  "react-native-sqlite-storage": "^x.x" // Already likely in use
}
```

### API Endpoint Verification

Ensure server has these endpoints (if not already implemented):

```
GET /weights
POST /weights
DELETE /weights/:id

GET /memories
POST /memories
DELETE /memories/:id

GET /achievements
GET /achievements/:id/unlock

GET /trophies
POST /trophies

GET /preparation
POST /preparation

POST /self-assessment
GET /self-assessment/history
```

---

## Risk Assessment & Mitigation

| Risk | Level | Mitigation |
|------|-------|-----------|
| **Offline sync conflicts** (Weight, Memories) | MEDIUM | Implement conflict resolution (server wins), add last-modified tracking |
| **Data model misalignment** | LOW | Verify schema matches web version in server/models/ |
| **Performance with large datasets** | MEDIUM | Implement pagination, lazy loading for achievements/memories |
| **i18n string coverage** | LOW | Parse entire codebase, automated completeness checks |
| **Game porting complexity** | MEDIUM | Start with game logic verification on web, then port step by step |
| **Mobile-specific UX issues** | LOW | Thorough QA testing on various device sizes |

---

## Testing Strategy

### Unit Tests Required

- Weight calculation/validation
- Achievement unlock logic
- Game scoring
- Offline sync conflict resolution
- i18n fallback behavior

### Integration Tests Required

- Offline → Online sync (all features)
- Feature flow: Addiction → Achievements → Trends
- Multi-language UI rendering
- Database schema migrations

### QA Checklist

- [ ] Test on iOS and Android devices
- [ ] Test offline mode thoroughly
- [ ] Test sync when returning online
- [ ] Test all languages render correctly
- [ ] Test old data migration/import
- [ ] Performance testing with large datasets

---

## Approval Checklist

- [ ] Review phase priorities with product team
- [ ] Verify API endpoints exist on server
- [ ] Confirm design/UX alignment with web version
- [ ] Validate database schema compatibility
- [ ] Check for any breaking changes needed in shared models
- [ ] Resource allocation confirmed

---

## Success Metrics

After implementation, mobile version should have:
- ✅ 100% feature parity with web version (minus web-exclusive features if any)
- ✅ All tracking features: Addiction, Mood, Diary, Weight, Memories
- ✅ Gamification: Achievements, Trophies, Craving Game
- ✅ Resources: Educational guides, hotlines, therapy info
- ✅ Preparation tools: Questionnaire, self-assessment
- ✅ Multi-language support (11+ languages)
- ✅ Unique mobile advantages maintained: Biometric auth, Offline mode, Dual-mode sync

---

## Document History

| Date | Version | Changes |
|------|---------|---------|
| 2 April 2026 | 1.0 | Initial comprehensive plan drafted |

---

## Appendix: Feature Checklist Template

Use this for implementation tracking:

```markdown
## [Feature Name] Implementation Checklist

**Phase:** [Phase X]
**Priority:** [CRITICAL/HIGH/MEDIUM/LOW]
**Estimated Hours:** [X]
**Assignee:** [Name]
**Start Date:** [Date]
**Target Completion:** [Date]

### Backend/API
- [ ] Endpoint exists: [Endpoint]
- [ ] Schema verified
- [ ] Response format documented

### Frontend - Components
- [ ] Screen component created
- [ ] Subcomponents created
- [ ] Props documented

### State Management
- [ ] Service created (Local + Remote)
- [ ] Context created
- [ ] Actions defined

### Database (for local mode)
- [ ] Schema created
- [ ] Migrations defined

### UI/UX
- [ ] Screen design matches web
- [ ] Mobile-specific adjustments done
- [ ] Accessibility tested

### Data Sync
- [ ] Offline storage works
- [ ] Online sync works
- [ ] Conflict resolution tested

### Testing
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] Manual QA completed

### Documentation
- [ ] Code comments added
- [ ] User guide updated (if user-facing)
```

---

## Next Steps

1. **Review Phase:** Share this plan with team for feedback
2. **Prioritization:** Confirm which features are highest priority for business
3. **Resource Planning:** Assign developers to phases
4. **Sprint Planning:** Break phases into 2-week sprints
5. **Implementation Start:** Begin Phase 1 (Core Tracking Features)
6. **Continuous Sync:** Keep mobile and web versions aligned during development
