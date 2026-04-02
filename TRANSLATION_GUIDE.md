# Translation Infrastructure Guide

## Overview

The nocts Back on Track application now supports 9 languages with automatic translation management:

- **English (en)** - Primary development language
- **Simple English (en-simple)** - Simplified vocabulary for easier reading
- **German (de)** - Deutsch
- **Spanish (es)** - Español
- **French (fr)** - Français
- **Russian (ru)** - Русский
- **Chinese (zh)** - 中文 (Simplified)
- **Japanese (ja)** - 日本語
- **Arabic (ar)** - العربية

## Architecture

### Translation Files Structure

```
client/
├── public/
│   └── locales/
│       ├── en/
│       ├── en-simple/
│       ├── de/
│       ├── es/
│       ├── fr/
│       ├── ru/
│       ├── zh/
│       ├── ja/
│       └── ar/
│           └── common.json
├── src/
│   ├── i18n/
│   │   └── config.js          # i18next initialization
│   ├── context/
│   │   └── LanguageContext.js # Language state management
│   └── components/
│       └── LanguageSelector.js # Language selector UI
```

### Key Components

1. **i18n/config.js** - Initializes i18next with HTTP backend loader
2. **LanguageContext.js** - Manages language state, persists to localStorage, syncs with backend
3. **LanguageSelector.js** - UI component for language selection
4. **Locales** - JSON translation files organized by language code

## How to Add Translations to New Features

### Step 1: Add English Text to Translation File

When adding new content to the app, add it to `/client/public/locales/en/common.json`:

```json
{
  "myFeature": {
    "title": "My Feature Title",
    "description": "My feature description",
    "button": "Click me"
  }
}
```

### Step 2: Use Translations in React Components

Import the `useTranslation` hook and use the `t` function:

```javascript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('myFeature.title')}</h1>
      <p>{t('myFeature.description')}</p>
      <button>{t('myFeature.button')}</button>
    </div>
  );
}
```

### Step 3: Add Translations to All Language Files

Update each language file with the translation:

**German (de):**
```json
{
  "myFeature": {
    "title": "Mein Feature-Titel",
    "description": "Meine Feature-Beschreibung",
    "button": "Klick mich"
  }
}
```

**Simple English (en-simple):**
```json
{
  "myFeature": {
    "title": "My Feature",
    "description": "Click my button",
    "button": "Click"
  }
}
```

Follow this pattern for all 9 languages.

## Backend Language Preference API

### Endpoint

- **Route:** `PUT /api/auth/language`
- **Auth:** Required (JWT token)
- **Body:** `{ "language": "en" }`

Valid language codes:
```
en, en-simple, de, es, fr, ru, zh, ja, ar
```

### Response

```json
{
  "message": "Language preference updated successfully",
  "language": "de"
}
```

## User Language Preferences

### Storage

Languages are stored in three places:

1. **localStorage** - Client-side persistence for quick access
   ```javascript
   localStorage.getItem('language') // returns current language code
   ```

2. **Database** - User model stores language preference
   ```javascript
   user.language // stored in MongoDB
   ```

3. **i18n** - Current language state in i18next
   ```javascript
   i18n.language // current active language
   ```

### Flow

1. User loads the app
2. LanguageContext initializes i18n with stored language
3. If user is authenticated, user's database language preference is used
4. User selects new language in Profile > Language Selector
5. LanguageContext updates i18n, localStorage, and sends API request
6. Backend updates user.language in database

## Translation Keys Organization

### Namespace: common.json

The translation file is organized by feature/section:

```json
{
  "common": { ... },           // Generic UI elements
  "header": { ... },           // Header component
  "footer": { ... },           // Footer component
  "navigation": { ... },       // Navigation & sidebar
  "auth": { ... },             // Login/Register
  "profile": { ... },          // Profile settings
  "addictions": { ... },       // Addiction tracking
  "meditation": { ... },       // Meditation page
  "diary": { ... },            // Diary page
  "achievements": { ... },     // Achievements
  "mood": { ... },             // Mood tracking
  "weight": { ... },           // Weight tracking
  "crisis": { ... },           // Crisis support
  "validation": { ... },       // Form validation messages
  "messages": { ... }          // Generic messages
}
```

## Best Practices

### 1. **Always Use Translation Keys**
Never hardcode text in components. Always use `t('key.path')`.

### 2. **Use Nested Keys**
Group related translations in sections for better organization:
```json
{
  "myFeature": {
    "title": "...",
    "description": "..."
  }
}
```

### 3. **Keep Simple English Simple**
Simple English uses:
- Shorter sentences (5-10 words)
- Common words (avoid technical jargon)
- Active voice
- Present tense when possible

Examples:
- ❌ "Insufficient authorization for resource modification"
- ✅ "You can't do that"

### 4. **Handle Interpolation for Dynamic Content**
Use i18next interpolation syntax for variables:

**Translation file:**
```json
{
  "greeting": "Hello {{name}}, you have {{count}} messages"
}
```

**Component:**
```javascript
t('greeting', { name: 'John', count: 5 })
```

### 5. **Update All Languages Together**
When adding new translations, update all 9 language files in the same commit.

### 6. **Test Language Switching**
Before committing, test:
- Language selector works
- All text updates when changing language
- Language preference persists after refresh
- Database saves language preference

## Usage Examples

### Login Component
```javascript
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h2>{t('auth.login')}</h2>
      <input placeholder={t('auth.username')} />
      <input placeholder={t('auth.password')} />
      <button>{t('auth.login')}</button>
      <p>{t('auth.noAccount')} <a href="/register">{t('auth.register')}</a></p>
    </div>
  );
}
```

### Profile Component
```javascript
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

export default function Profile() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('profile.pageTitle')}</h1>
      <LanguageSelector className="profile-card" />
      <button>{t('profile.changePassword')}</button>
    </div>
  );
}
```

### Error Handling
```javascript
const handlePasswordChange = async (password) => {
  try {
    await apiClient.put('/api/auth/change-password', { password });
    setMessage(t('messages.saved'));
  } catch (err) {
    setError(err.response?.data?.message || t('messages.error'));
  }
};
```

## Managing New Languages in the Future

To add a new language:

1. Create new language directory in `/client/public/locales/{languageCode}/`
2. Copy `en/common.json` to new directory as template
3. Translate all entries
4. Add language option to `LanguageSelector.js`:
   ```javascript
   { code: 'it', name: 'Italiano', nativeName: 'Italiano' }
   ```
5. Add language to User model enum:
   ```javascript
   enum: ['en', 'en-simple', 'de', 'es', 'fr', 'ru', 'zh', 'ja', 'ar', 'it']
   ```
6. Update backend validation in `/api/auth/language` route

## Troubleshooting

### Language not persisting after page refresh
- Check if LanguageProvider wraps the app in index.js
- Check localStorage for 'language' key
- Verify user.language is set in database

### Missing translation keys
- Check key path matches JSON structure exactly
- Use browser console to debug: `i18n.t('path.to.key')`
- Ensure namespace is loaded (should be 'common' by default)

### Translation not updating when changing language
- Ensure component uses `useTranslation()` hook
- Don't cache `t` function between renders
- Component should re-render when language changes

## Language-Specific Considerations

### Right-to-Left Languages (Arabic)
- Arabic (ar) is RTL - handled by i18next by default
- Add `dir="rtl"` attribute to document element if needed
- Test RTL layout rendering

### Character Encodings
- All JSON files must be UTF-8 encoded
- Special characters (emojis, diacritics) are supported
- Verify file encoding if translations don't display

### Length Variations
- German tends to be 20-30% longer than English
- French and Spanish are ~10-20% longer
- Chinese is more compact
- Test layout with longest translations to prevent overflow
