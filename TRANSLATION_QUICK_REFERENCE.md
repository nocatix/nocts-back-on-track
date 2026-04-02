# Translation Quick Reference

## For Developers: Adding New Features with Translations

### 1️⃣ Add English Text
Edit `/client/public/locales/en/common.json`:
```json
{
  "myNewPage": {
    "title": "My New Page",
    "description": "Learn about this feature"
  }
}
```

### 2️⃣ Use in Component
```javascript
import { useTranslation } from 'react-i18next';

export default function MyNewPage() {
  const { t } = useTranslation();
  return <h1>{t('myNewPage.title')}</h1>;
}
```

### 3️⃣ Add to All Languages

**Simple English** (`en-simple/common.json`) - Use simple words
```json
{ "myNewPage": { "title": "New Page", "description": "Learn here" } }
```

**German** (`de/common.json`)
```json
{ "myNewPage": { "title": "Meine neue Seite", "description": "Erfahren Sie mehr" } }
```

**Spanish** (`es/common.json`)
```json
{ "myNewPage": { "title": "Mi Nueva Página", "description": "Aprende sobre esto" } }
```

And so on for French, Russian, Chinese, Japanese, Arabic...

## Supported Languages

| Code | Language | Script |
|------|----------|--------|
| en | English | LTR |
| en-simple | Simple English | LTR |
| de | Deutsch | LTR |
| es | Español | LTR |
| fr | Français | LTR |
| ru | Русский | LTR |
| zh | 中文 | LTR |
| ja | 日本語 | LTR |
| ar | العربية | RTL |

## File Locations

- **Backend**: `/server/models/User.js` (language field)
- **Frontend**: `/client/public/locales/{lang}/common.json`
- **Config**: `/client/src/i18n/config.js`
- **Context**: `/client/src/context/LanguageContext.js`
- **Component**: `/client/src/components/LanguageSelector.js`

## Common Patterns

### Simple Text
```javascript
const { t } = useTranslation();
return <p>{t('mySection.text')}</p>;
```

### With Variables
```json
{ "message": "Hello {{name}}, you have {{count}} items" }
```
```javascript
t('message', { name: 'John', count: 5 })
```

### Conditionals
```javascript
{error && <p>{t('messages.error')}</p>}
{success && <p>{t('messages.success')}</p>}
```

### Sections/Groups
Organize related keys together:
```json
{
  "form": {
    "labels": { "username": "...", "password": "..." },
    "placeholders": { "username": "...", "password": "..." },
    "errors": { "invalid": "...", "required": "..." }
  }
}
```

## Best Practices

✅ **DO:**
- Group related translations
- Use lowercase keys with dots for nesting
- Keep Simple English actually simple
- Test all 9 languages after adding content
- Update all languages in one commit

❌ **DON'T:**
- Hardcode text in JSX
- Use translation keys as values
- Translate professional/medical terms too literally
- Skip Simple English (it's separate, not automated)
- Add translations for one language at a time

## File Structure Example

```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "loading": "Loading..."
  },
  "auth": {
    "login": "Login",
    "register": "Register",
    "invalidCredentials": "Wrong username or password"
  },
  "myFeature": {
    "title": "Feature Title",
    "description": "Description text",
    "button": "Action Button"
  }
}
```

## Testing Your Changes

After adding translations:

```bash
# 1. Test English
# 2. Test Simple English (make sure it's actually simple)
# 3. Test 1-2 other languages to verify structure
# 4. Check Profile > Language Selector works
# 5. Toggle languages to verify text updates
# 6. Refresh page to verify persistence
```

## Need to Add a New Language?

1. Create `/client/public/locales/{code}/common.json`
2. Copy from `en/common.json` as template
3. Translate all entries
4. Add to `LanguageSelector.js`:
   ```javascript
   { code: 'pt', name: 'Português', nativeName: 'Português' }
   ```
5. Update User model enum
6. Update backend validation

## Translation File Path

```
/var/home/marcel/Repo/nocts-back-on-track/
├── client/
│   └── public/
│       └── locales/
│           ├── en/common.json
│           ├── en-simple/common.json
│           ├── de/common.json
│           ├── es/common.json
│           ├── fr/common.json
│           ├── ru/common.json
│           ├── zh/common.json
│           ├── ja/common.json
│           └── ar/common.json
└── TRANSLATION_GUIDE.md (full documentation)
```

## Quick Troubleshooting

**Text not translating?**
1. Check key path is correct: `t('section.key')`
2. Reload page (hard refresh)
3. Check browser console for errors
4. Verify file is valid JSON

**Language not saving?**
1. Check Network tab in DevTools
2. Verify API endpoint: `PUT /api/auth/language`
3. Check localStorage for 'language' key
4. Verify user is logged in

**Characters showing wrong?**
1. Ensure all JSON files are UTF-8 encoded
2. Check for BOM (byte order mark)
3. Verify encode in editor settings
