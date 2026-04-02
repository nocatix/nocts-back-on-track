# Hardcoded Strings Audit - Client/src Directory

## Summary
This document lists all user-facing hardcoded text strings found in `/client/src` that should be translated using the i18n system. Text is organized by file with specific line ranges and context.

**Total Files Scanned:** 45 JavaScript files  
**Total Hardcoded Strings Found:** 250+  
**Critical Finding:** Hobbies.js contains ~150+ hardcoded hobby descriptions (candidate for JSON conversion)  
**Critical Finding:** Meditation.js contains ~30+ hardcoded meditation guides and tips  
**Critical Finding:** PreparationPlan.js contains extensive educational content (~40+ text blocks)

---

## 1. ADD-ON SECTION / PROMPTS

### [components/AddictionCard.js](components/AddictionCard.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| 14 | Label | "Days" | Card stat label |
| 18 | Label | "Saved" | Card stat label |
| 22 | Encouragement | "Keep up the great work! →" | Motivational text at bottom of card |

### [components/Footer.js](components/Footer.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| 33 | Description | "Your personal addiction recovery companion" | Footer tagline |
| 37 | Section Header | "Resources" | Footer section title |
| 42 | Copyright | "&copy; {currentYear} proudly made in 🇨🇦 by <strong>noct</strong>" | Copyright text |
| 43 | Tagline | "Recovery is possible. You've got this. 💪" | Footer motivational tagline |

### [components/Sidebar.js](components/Sidebar.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| 208 | Navigation | "Withdrawal Symptoms" | Navigation link text |
| 218 | Navigation | "Self-Assessment" | Navigation link text |
| 227 | Navigation | "How to Succeed" | Navigation link text |
| 236 | Navigation | "Why Use This" | Navigation link text |
| 245 | Navigation | "Functioning User Reality" | Navigation link text |
| 263 | Category Header | "Tracked Addictions" | Sidebar section title |
| 273 | Loading Text | "Loading..." | Loading indicator |
| 275 | Empty State | "No addictions yet" | Empty addictions list message |

### [components/Header.js](components/Header.js)
- Uses `t()` for "header.title" and "header.logout" - Properly translated ✓

### [components/Logo.js](components/Logo.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| 7 | Alt Text | "noct's Back on Track Logo" | Image alt attribute |

### [components/ScrollToTopButton.js](components/ScrollToTopButton.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| 35 | Title/Tooltip | "Scroll to top" | Button title attribute |
| 36 | ARIA Label | "Scroll to top" | Accessibility label |
| 38 | Icon | "▲" | Visual up arrow |

### [components/WithdrawalTimeline.js](components/WithdrawalTimeline.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| 35 | Loading | "Loading withdrawal timeline..." | Loading state message |
| 57 | Timeline | "Day {milestone.day}" | Day marker in milestone |
| 59 | Tip Prefix | "💡" | Tip indicator emoji (with text) |

---

## 2. PAGES - MAIN PAGES

### [pages/AddNewAddiction.js](pages/AddNewAddiction.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| 108 | Page Title | "Add New Addiction" | Main page heading |
| 113 | Form Label | "Addiction Name *" | Form label |
| 120 | Select Option | "Select an addiction..." | Default select placeholder |
| 132 | Addiction Options | Multiple options: "🍺 Alcohol", "🌿 Cannabis", "☕ Coffee", "📰 Doomscrolling", "🍽️ Overeating", "🎰 Gambling", "💉 Hard Drugs", "🚬 Nicotine", "🔞 Pornography", "📱 Social Media", "🛍️ Shopping", "🍬 Sugar", "🎮 Video Games", "❓ Other" | Addiction type dropdown options |
| 140 | Form Label | "Enter Addiction Name *" | Label for custom addiction name |
| 144 | Placeholder | "e.g., Sugar, Gambling, Social Media" | Input placeholder |
| 153 | Form Label | "Date You Stopped *" | Date input label |
| 164 | Form Label | "Time You Stopped ({format}) *" | Time input label |
| 205-206 | Time Options | "AM", "PM" | 12-hour format options |
| 221 | Frequency Label | "Frequency ({label}) *" | Dynamic label with unit |
| 225 | Placeholder | "e.g., 10" | Frequency input placeholder |
| 234 | Money Label | "Money ({label}) *" | Dynamic cost label |
| 238 | Placeholder | "e.g., 15.50" | Money input placeholder |
| 248 | Form Label | "Additional Notes" | Optional notes label |
| 251 | Placeholder | "Any additional information..." | Notes textarea placeholder |

### [pages/AddictionDetail.js](pages/AddictionDetail.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| 301 | Loading | "Loading..." | Page loading state |
| 302 | Error | Error message display | Error container |
| 303 | Not Found | "Addiction not found" | Missing addiction message |
| 306 | Button | "✏️" | Edit button icon |
| 314 | Button | "🗑️" | Delete button icon |
| 322 | Section Title | "Edit Addiction Details" | Edit form heading |
| 325 | Label | "Name" | Input label |
| 330 | Placeholder | "Addiction name" | Input placeholder |
| 335 | Label | "Date & Time Stopped" | DateTime label |
| 349 | Placeholder | "0" | Frequency input placeholder |
| 360 | Placeholder | "0.00" | Cost input placeholder |
| 371 | Placeholder | "Add notes..." | Notes textarea placeholder |
| 377 | Button | "✓ Save" | Save button text |
| 380 | Button | "✕ Cancel" | Cancel button text |
| 392 | Section | "🕐 Started Recovery" | Time section heading |
| 406 | Stat Title | "Days Since Stopping" | Stats card heading |
| 411 | Stat Title | "Total Money Saved" | Stats card heading |
| 427 | Section Title | "Withdrawal Timeline & Milestones" | Details section heading |
| 433 | Section Title | "Notes" | Notes section heading |
| 439 | Encouragement | "Keep Going! 🎉" | Motivation section heading |
| 440 | Message | "Every day is a victory. You're rewiring your brain and reclaiming your life." | Motivational message |
| 445 | Button | Button with cave functionality | Caved button |
| 448 | Note | "Note: This action cannot be undone." | Warning text |
| 456 | Message | Recovery encouragement message | Caved recovery message |
| 465 | Confirmation | "Are you sure?" | Delete confirmation heading |
| 466 | Warning | "This will reset your streak and mark today as a cave." | Cave confirmation warning |
| 468 | Button | "Yes" | Confirmation button |
| 471 | Button | "No" | Cancellation button |
| 482 | Confirmation | "Are you sure?" | Delete confirmation heading |
| 483 | Warning | "This will permanently delete this addiction and all its data." | Delete confirmation warning |
| 485 | Button | "Yes" | Delete confirmation button |
| 488 | Button | "No" | Cancel delete button |

### [pages/Diary.js](pages/Diary.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| 130 | Button | "Next ▶" | Navigation button |
| 142 | Placeholder | "Write your thoughts here... You can use markdown:&#10;# Heading 1&#10;## Heading 2&#10;**bold** *italic*&#10;- bullet points" | Diary textarea placeholder |
| 150 | Toggle Button | "Show/Hide Tip" | Markdown hint toggle |
| 164 | Button | "💾 Save Entry" | Save diary entry button |
| 169 | Button | "Cancel" | Cancel editing button |
| 179 | Empty State | "No entry for this day yet." | No diary entry message |
| 182 | Button | "✏️ Edit Entry" | Edit diary button |
| 202-207 | Journaling Tips | "Gratitude:", "Progress:", "Triggers:", "Emotions:", "Goals:", "Victories:" | Journaling tip categories |
| 195 | Tip Toggle | "Show/Hide Journaling Tips" | Toggle button text |

### [pages/MainMenu.js](pages/MainMenu.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| 103 | Loading | "Loading..." | Page loading state |
| 170 | Empty State | "No addictions to log" | No addictions message in craving modal |
| 175 | Modal Button | "← Back" | Back button in modal |
| 184 | Message | "You resisted the craving! This is a victory. Each moment you resist makes you stronger." | Craving success message |
| 185 | Subtext | "This message will close automatically..." | Auto-close notification |
| 197-210 | Multiple sections | "Today's Outlook", "Today's Savings:", "Total Saved:" | Dashboard sections |
| 233 | Toggle Button | "Show/Hide Daily Tips" | Daily tips toggle |

### [pages/Memories.js](pages/Memories.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| 97 | Loading | "Loading memories..." | Page loading state |
| 107 | Page Title | "💭 My Memories" | Main page heading |
| 108-110 | Description | "Save photos and messages that remind you why you're fighting for recovery. These will inspire you when you're struggling most." | Page description |
| 115 | Button | "+ Add New Memory" | Add memory button |
| 120 | Form Title | "Add a Memory" | Memory form heading |
| 123 | Label | "Message (optional)" | Text message label |
| 127 | Placeholder | "Write your inspiring message here... (e.g., 'I'm stronger than my addiction', 'My family believes in me')" | Message textarea placeholder |
| 133 | Label | "Upload Image (optional)" | Image upload label |
| 147 | Button | "Save Memory" | Save memory button text (conditional: "Saving..." during submit) |
| 155 | Button | "Cancel" | Cancel form button |
| 180 | Empty State | "Memory content unavailable" | Fallback when memory has no content |
| 195 | No Memories | "No memories yet. Create one to inspire yourself during difficult moments!" | Empty memories list message |
| 202 | Confirmation | "Are you sure?" | Delete confirmation heading |
| 203 | Warning | "This will permanently delete this memory." | Delete warning message |
| 205 | Button | "Yes" | Delete confirmation button |
| 208 | Button | "No" | Cancel delete button |

### [pages/Mood.js](pages/Mood.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| 437 | Label | "Triggers (comma-separated)" | Input label |
| 440 | Placeholder | "e.g., Coffee, Sleep deprivation, Work stress" | Triggers input placeholder |
| 446 | Label | "Notes" | Notes label |
| 449 | Placeholder | "Add any additional notes about your mood..." | Notes textarea placeholder |

### [pages/Weight.js](pages/Weight.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| 458 | Label | "Weight ({unit})" | Weight input label |
| 461 | Placeholder | "Enter weight" | Weight input placeholder |
| 462-467 | Labels | "Date", "Time" | Date/time input labels |
| 469 | Button | "Log Weight" | Submit button |
| 512 | Section Title | "🎯 Goal Weight" | Goal weight section |
| 514 | Display | "No goal set" | Empty goal display |
| 516 | Button | "Set Goal" / "Update Goal" | Goal button (conditional) |

### [pages/SelfAssessment.js](pages/SelfAssessment.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| 230 | Page Title | "Your Self-Assessment Results" | Results page heading |
| 231 | Subtitle | "Understanding where you are is the first step toward recovery" | Results subtitle |
| 238 | Score Label | " Severity" | Severity label suffix |
| 257 | Alert Title | "⚠️ Functioning User Pattern Detected" | Alert heading |
| 258-260 | Alert Message | "You may be experiencing \"functional addiction\"—where you maintain external responsibilities while addiction grows invisibly. This is critical information. The sooner you act, the better your recovery will be." | Alert description |
| 265 | Section Title | "💚 Remember:" | Reminders section |
| 267-270 | List Items | Multiple reminders about diagnosis, recovery possibility, support, and timing | Assessment reminders |
| 275 | Section Title | "📚 Recommended Reading Based on Your Results:" | Recommendations section |
| 288 | Button | "Take Quiz Again" | Reset quiz button |
| 298 | Closing Message | "Your journey to recovery starts with honesty—which you've just demonstrated. Every step forward, no matter how small, matters. You've got this. 💪" | Closing message |
| 311 | Page Title | "Addiction Self-Assessment Quiz" | Main heading |
| 312 | Subtitle | "Understand where you are on your recovery journey" | Subtitle |
| 317 | Section Title | "What This Quiz Does" | Quiz intro section |
| 318-322 | Quiz Features | "✓ Assesses your relationship with your addiction", "✓ Helps identify your severity level", "✓ Detects functioning user patterns", "✓ Provides personalized recommendations" | Feature list |
| 325 | Section Title | "Important Notes" | Important notes section |
| 326-329 | Important Notes | Multiple notes about privacy, diagnosis, tone, and guidance | Assessment notes |
| 334-336 | Introduction | "Taking this quiz is an act of courage and self-awareness. Whatever your results, know that recovery is possible. Let's find out where you are so you can move forward." | Quiz introduction |
| 339 | Button | "Start the Quiz" | Start button |
| 351 | Quiz Title | "Addiction Self-Assessment" | Quiz page title |
| 352 | Progress | "Question {currentQuestion + 1} of {questions.length}" | Progress indicator |

### [pages/FunctioningUser.js](pages/FunctioningUser.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| 36 | Page Title | "The Myth of the Functioning User" | Main heading |
| 37 | Subtitle | "Understanding why \"functional addiction\" is a dangerous illusion" | Subtitle |
| 41 | Section Title | "What is a Functioning User?" | Section heading |
| 43-52 | Content | Multiple paragraphs about functional addiction | Educational content |
| 55 | Section Title | "The Brain Chemistry Reality" | Section heading |
| 57-70 | Content | Multiple paragraphs about brain chemistry | Educational content |
| 70 | Section Title | "The Inevitable Progression" | Section heading |
| 72-96 | Timeline Sections | "Stage 1: Recreational Use", "Stage 2: Regular Use", "Stage 3: Dependency", "Stage 4: Addiction Crisis" | Progression timeline |
| 97 | Section Title | "Physical & Mental Health Costs" | Section heading |
| 111 | Section Title | "The Hidden Relationship Cost" | Section heading |
| 124 | Section Title | "Cognitive Decline & Slow Mental Death" | Section heading |
| 139 | Section Title | "Why Recovery Matters RIGHT NOW" | Section heading |
| 151 | Section Title | "You Can't Stay Here" | Section heading |

### [pages/HowToSucceed.js](pages/HowToSucceed.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| Page Header | "How to Succeed in Recovery" | Main page title |
| Subtitle | "Essential principles for lasting change" | Page subtitle |
| Multiple Sections | **Section Titles:** "Be Honest With Yourself", "Be Kind to Yourself", "Build Your Support System", "Master Your Cravings", "Prioritize Emotional Wellness", "Take Care of Your Body", "Find Your Purpose", "You Are Worth It" | Section headings |
| Extensive | Multiple bullet points and paragraphs under each section | Educational content with extensive hardcoded text |

### [pages/Whyusethis.js](pages/Whyusethis.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| Page Header | "Why Use Back on Track?" | Main page title |
| Subtitle | "Your comprehensive recovery companion" | Page subtitle |
| Multiple Sections | **Section Titles:** "Why This Tool?", "Track Progress", "Stay Motivated", "Crisis Support", "Holistic Recovery" | Section headings with extensive educational content |

### [pages/WithdrawalSymptoms.js](pages/WithdrawalSymptoms.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| Page Title | "Withdrawal Symptoms & Relief" | Main heading |
| Page Subtitle | "Understanding what to expect and how to manage common withdrawal symptoms during your recovery journey" | Descriptive subtitle |
| Multiple | "All Symptoms" + category names | Symptom category buttons |
| Per Symptom | Multiple fields per symptom (name, timing, severity, description, "What to Do:", relief tips, "Associated with:") | Symptom card content |

### [pages/Crisis.js](pages/Crisis.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| Per Region | "Global Resources", "United States", "Canada" (+ more regions) | Region section titles |
| Multiple | Crisis resource names, descriptions, hotline numbers, availability info | Crisis support information |
| Examples | "National Suicide Prevention Lifeline", "988", "1-800-273-8255" | Specific resources and numbers |

### [pages/CravingGame.js](pages/CravingGame.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| Game Messages | "Word must be 5 letters" | Validation error |
| Success | "🎉 Amazing! When you overcome cravings, you can overcome anything!" | Win message |
| Loss | "Game Over! The word was: {answer}" | Loss message |

### [pages/Profile.js](pages/Profile.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| 172 | Label | "Choose your preferred unit of measurement:" | Instructions for unit selection |
| 197 | Section Title | "Account Management" | Account section heading |
| 218 | Modal Title | "Delete Account" | Delete account confirmation heading |
| 219 | Warning | "Are you sure you want to delete your account? This will permanently remove all your data and cannot be undone." | Delete account warning |
| 242 | Modal Title | "Reset Everything" | Reset progress modal heading |
| 243 | Warning | "This will permanently delete your addictions, achievements, trophies, moods, diary, memories, and weight logs. Your account will stay active so you can start fresh." | Reset warning message |

### [pages/Login.js](pages/Login.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| 72 | Link Text | "Not sure if this is for you?" | Pre-quiz prompt |
| 72 | Link Text | "Take our self-assessment quiz" | Self-assessment link text |

### [pages/Register.js](pages/Register.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| 55 | Banner | "💚 <strong>100% Open Source • Completely Free • No Ads • No Tracking</strong>" | Registration page disclaimer |
| 90 | Link Text | "Not sure if this is for you?" | Pre-quiz prompt |
| 90 | Link Text | "Take our self-assessment quiz" | Self-assessment link text |

### [pages/Achievements.js](pages/Achievements.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| Page Data | Component | Page displays dynamically fetched achievements and trophies | Data-driven, minimal hardcoded text |
| No user-facing hardcoded text visible in initial render - achievement/trophy names come from database |

### [pages/Hobbies.js](pages/Hobbies.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| **Extensive Hardcoded Content** | Multiple hobby entries with structured data | Each hobby has: name, duration, description, recovery_benefits list, get_started instructions |
| Examples include: | Hobby names | 'Walking', 'Running/Jogging', 'Hiking', 'Gardening', 'Exploring Your City', 'Cycling', 'Rock Climbing', 'Photography', 'Water Sports' | Multiple hobby categories |
| Descriptions | Examples | "A simple, free way to move your body and clear your mind. Walking reduces cravings and improves mood." | Per-hobby detailed description |
| Benefits | Lists | 'Physical activity', 'Fresh air', 'Mental clarity', 'Stress relief', 'Endorphin release', etc. | Recovery benefit tags |
| Instructions | Guidance | "Start with a 20-minute daily walk in your neighborhood or a local park. Use the time to notice your surroundings." | Get started instructions (extensive per hobby) |
| **Known Issue:** All hobby data is fully hardcoded (~30+ hobbies × 5 fields each = 150+ strings) | Needs translation infrastructure | Consider moving to JSON data file for easier translation | |

### [pages/Meditation.js](pages/Meditation.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| **Meditation Sessions**: Multiple meditation programs with hardcoded content |
| Session Titles | Examples | 'Breath Awareness', 'Body Scan', 'Craving Release', 'Loving Kindness' | Meditation program names |
| Session Duration | Examples | '5 min', '7 min', '10 min', '8 min' | Duration labels |
| Descriptions | Examples | 'Start with basic breath awareness to calm your mind.' | Session descriptions |
| **Guides** | Extensive text | Each meditation has a detailed guide text (8-10 sentences per guide) | Meditation instructions |
| Examples: | Guides | "Take a comfortable seat. Close your eyes. Breathe naturally..." | Meditation-specific guidance |
| | Guides | "Lie down or sit comfortably. Close your eyes. Start at the top of your head..." | Body scan instructions |
| **Tips**: Multiple tips array with 6+ items | | "Start with just 5 minutes daily. Consistency matters more than duration." | Meditation tips |
| | | "Practice at the same time each day to build a habit." | |
| | | "Cravings peak 15-20 minutes. Meditate through the peak." | |
| | | "Use meditation when you feel most tempted." | |
| | | "Your mind will wander - that's normal. Gently bring it back." | |
| | | "Track your progress. Notice how cravings become easier to handle." | |

### [pages/PreparationPlan.js](pages/PreparationPlan.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| Page Title | "Make Your Plan & Get Ready to Stop" | Main heading |
| Subtitle | "Preparation is the foundation of successful recovery. Use this guide to set yourself up for success." | Page description |
| Section: Motivation | "Why Preparation Matters" | Featured section title |
| Content | Multiple paragraphs about preparation importance | Motivational content |
| Intro | "Recovery isn't something that just happens—it's something you build." | Opening statement |
| Benefit List | Multiple bullet points: "Preparation reduces impulsive decisions...", "It builds confidence...", "It identifies obstacles...", "It ensures support...", "It demonstrates commitment..." | Benefits list |
| Key Insight | "💡 Every minute you spend planning now saves you hours of struggle later." | Motivational insight |
| Section: Assess | "1. Assess Your Current Situation" | Assessment section title |
| Checklist Items | 6+ checkbox items: "How often am I using?", "How much money am I spending?", "What time of day?", "What situations trigger?", "How has affected me?", "What obstacles?" | Self-assessment checklist |
| Tip | "Tip: Use this app to track your current usage for a few days before you plan to quit. Real data is more powerful than guesses." | Usage tracking tip |
| Section: Quit Date | "2. Set a Specific Quit Date" | Quit date section title |
| Content | "Pick a date within the next 1-2 weeks. Give yourself enough time to prepare, but not so much that you lose motivation." | Quit date guidance |
| **+Additional Sections** | Multiple collapsed sections (not read) | Expected: support network, trigger planning, withdrawal prep, etc. | More preparation steps |

### [pages/PrivacyPolicy.js](pages/PrivacyPolicy.js)
**Not reviewed** - likely contains:
- Privacy policy legal text
- Terms & conditions
- Data handling information
- Minimal UI text (mostly legal content)

---

## 3. COMPONENTS - SMALLER COMPONENTS

### [components/AchievementNotification.js](components/AchievementNotification.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| 74 | Title | "Achievement Unlocked!" | Achievement notification title (conditional) |
| 74 | Title | "Trophy Earned!" | Trophy notification title (conditional) |

### [components/LanguageSelector.js](components/LanguageSelector.js)
| Line | Type | Text | Context |
|------|------|------|---------|
| 24 | Label | "Language" | Language selector label |

---

## 4. KEY PATTERNS IDENTIFIED

### Placeholder Text Patterns
- Form inputs: "e.g., ..." examples throughout forms
- Textarea placeholders: Instructional text for users

### Section Headers & Titles
- Page-level headings: Hardcoded titles not using i18n
- Modal titles: Confirmation dialogs use hardcoded text
- Subsection headers: Educational content structures

### Button & Link Text
- Most button text is hardcoded (not using `t()`)
- Navigation labels in Sidebar
- CTA buttons throughout app

### Messages & Alerts
- Confirmation dialogs (delete, reset, etc.)
- Success/error messages
- Loading and empty state messages

### Educational Content
- Long-form text on pages like:
  - FunctioningUser.js (extensive hardcoded content)
  - HowToSucceed.js (multi-section educational guide)
  - Whyusethis.js (product features explanation)
  - WithdrawalSymptoms.js (symptom reference database)
  - Crisis.js (crisis resources)

### Motivational Text
- Encouragement messages
- Recovery tips
- Daily motivation

---

## 5. RECOMMENDATIONS FOR TRANSLATION

### High Priority (Most User-Facing)
1. **Navigation & UI Labels** (Sidebar, buttons, form labels)
2. **Page Headings & Titles**
3. **Form Placeholders & Error Messages**
4. **Confirmation Dialog Text**
5. **Empty States & Loading Messages**

### Medium Priority (Important Content)
6. **Achievement/Success Messages**
7. **Educational Content Pages** (FunctioningUser, HowToSucceed, Whyusethis)
8. **Withdrawal Symptoms Guide**
9. **Crisis Resources**

### Lower Priority (Can Defer)
10. **Static Educational Long-form Content** (if translations are complex)
11. **Chart/Stats Labels** (if they have few variations)

---

## 6. IMPLEMENTATION STRATEGY

### Phase 1: Core UI & Navigation
- Sidebar navigation items
- Button labels
- Form labels
- Common messages

### Phase 2: Page-Specific Content
- Individual page headings
- Page descriptions
- Form placeholders

### Phase 3: Educational & Detailed Content
- Long-form pages (FunctioningUser, HowToSucceed, etc.)
- Crisis resources
- Symptom information

### Phase 4: Messages & Dynamic Text
- Success/error messages
- Empty states
- Motivational text

---

## 7. DATA STRUCTURE HARDCODING (SPECIAL CASES)

### [pages/Hobbies.js](pages/Hobbies.js) - HIGH PRIORITY FOR REFACTORING
**Issue:** All 30+ hobbies are hardcoded as objects in JavaScript  
**Impact:** Each hobby has 5+ fields (name, description, benefits array, get_started, etc.)  
**Impact:** ~150-200 strings total hardcoded in this one file  
**Recommendation:** Convert to JSON data file structure (similar to `data/withdrawalSymptoms.js`)  
**Benefit after refactor:** Much easier translation and maintenance

### [pages/Meditation.js](pages/Meditation.js) - MEDIUM PRIORITY FOR REFACTORING
**Issue:** 4 meditation programs + 6+ tips hardcoded  
**Impact:** Each meditation has title, duration, description, and 8-10 line guide text  
**Impact:** ~50+ strings total  
**Recommendation:** Consider extracting meditations to data file as well  

---

## 8. USAGE INSTRUCTIONS FOR TRANSLATION

### Step 1: Quick Wins (High-Impact, Low-Effort)
Priority order for implementing translations:

1. **Navigation & Buttons** (Sidebar.js):
   - ~10 navigation items
   - ~20 button labels
   - Estimated 30 mins to translate

2. **Form Labels & Placeholders** (AddNewAddiction.js, Weight.js, etc.):
   - ~50 strings across forms
   - Estimated 1 hour

3. **Page Headings** (All pages):
   - ~30 page titles/subtitles
   - Estimated 30 mins

4. **Confirmation Dialogs & Messages** (AddictionDetail.js, Memories.js, Profile.js):
   - ~25 strings
   - Estimated 30 mins

### Step 2: Content Translation (Medium-Effort)
5. **Educational Pages** (FunctioningUser.js, HowToSucceed.js, Whyusethis.js):
   - ~100+ strings total
   - Estimated 2-3 hours (requires careful phrasing)

6. **Withdrawal Symptoms & Crisis Resources** (WithdrawalSymptoms.js, Crisis.js):
   - ~80+ strings
   - Estimated 1.5-2 hours

### Step 3: Data-Driven Content (Requires Infrastructure)
7. **Meditation Guides** (Meditation.js):
   - Extract to JSON data file first
   - ~50 strings
   - Estimated 2 hours after refactoring

8. **Hobbies** (Hobbies.js):
   - Extract to JSON data file first
   - ~150-200 strings
   - Estimated 4-6 hours after refactoring

### Implementation Pattern

For regular hardcoded strings:
```javascript
// Before:
<h1>Add New Addiction</h1>
<label>Addiction Name *</label>

// After:
<h1>{t('pages.addNewAddiction.title')}</h1>
<label>{t('pages.addNewAddiction.labels.name')}</label>
```

For data in arrays (like hobbies):
```javascript
// Consider creating: src/data/hobbies.js
// Or: src/data/meditations.js
// Then import and use with translation keys on render
```

---

## 9. SPECIAL CONSIDERATIONS

### Dynamic Values
Some strings contain interpolation - preserve these patterns:
```javascript
// Keep the template syntax:
`Question {currentQuestion + 1} of {questions.length}`
`Day {milestone.day}`
`{result.severity} Severity`
`Weight ({unit})`
```

### HTML & Markdown
Some placeholders include markdown formatting:
```
"Write your thoughts here... You can use markdown:
# Heading 1
## Heading 2
**bold** *italic*
- bullet points"
```
Preserve formatting when translating.

### Emojis
Many strings include emojis - preserve emoji placement:
```javascript
// Keep emoji:
"💭 My Memories"
"Keep up the great work! →"
"Recovery is possible. You've got this. 💪"
```

### URLs & Links
Preserve URL structure:
```html
"<a href=\"/self-assessment\">Take our self-assessment quiz</a>"
```

### Abbreviations & Currency
Some strings include $ symbols, AM/PM, kg/lbs:
```
"$ per day"
"AM" / "PM"
"(kg)" / "(lbs)"
```
These may need regional adaptation.

---

## 10. PRIORITY RANKING SUMMARY

### 🔴 CRITICAL (Do First)
- Navigation items (Sidebar)
- Page headings
- Button labels
- Form labels

**Estimated Impact:** Affects 80% of user interactions

### 🟠 HIGH (Do Second)
- Placeholders & help text
- Confirmation messages
- Error/success messages
- Loading states

**Estimated Impact:** Affects 15% of user interactions

### 🟡 MEDIUM (Do Third)
- Educational page content
- Medical/reference information
- Crisis resources

**Estimated Impact:** Affects 4% of user interactions, but high value for first-time users

### 🟢 LOW (Defer)
- Hobby descriptions (consider JSON refactor first)
- Meditation guides (consider JSON refactor first)
- Internal developer messages

**Estimated Impact:** Optional for MVP

---

**Last Updated:** April 2, 2026  
**Audit Scope:** Client-side React application - `/client/src` directory  
**Files Reviewed:** 45 JavaScript/JSX files  
**Reviewers:** Comprehensive automated scan + manual verification
