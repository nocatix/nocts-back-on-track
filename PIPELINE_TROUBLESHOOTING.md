# APK Build Pipeline - FAQ & Troubleshooting

## ❓ Frequently Asked Questions

### Q: How long does a build take?
**A:** 5-15 minutes typically. First build is slower (~15 min), subsequent builds faster (~5-10 min).

### Q: Can I download the APK from GitHub Actions?
**A:** Not directly. The APK is:
1. Built by EAS (in the cloud)
2. Available from **Releases** (for tagged builds)
3. Available from **EAS dashboard** (all builds)

### Q: Do I need Android Studio installed?
**A:** No! EAS builds in the cloud. Your computer doesn't need Android SDK.

### Q: Can I build iOS IPA too?
**A:** Yes! Change workflow to also build iOS:
```yaml
eas build --platform ios
```
(Requires paid Apple Developer account for distribution)

### Q: What if my build fails?
**A:** Check these in order:
1. Workflow logs in GitHub Actions
2. EAS build logs (https://expo.dev/builds)
3. Mobile app dependencies: `npm install` in mobile/
4. Check version format is correct

### Q: How do I know when build is done?
**A:** Three ways to check:
1. GitHub Actions page shows ✅ or ❌
2. Email from Expo
3. EAS dashboard updates

### Q: Can multiple people trigger builds?
**A:** Yes! Anyone with push access to repo can:
- Push to main (starts build)
- Create tags (starts build + release)
- Manually trigger from Actions tab

---

## 🐛 Troubleshooting

### Build fails: "Expo token invalid"

**Error looks like:**
```
Error: Invalid token
401 Unauthorized
```

**Fix:**
1. Go to https://expo.dev/settings/personal-access-tokens
2. Create a new token
3. Update GitHub secret:
   - Settings → Secrets → `EXPO_TOKEN`
   - Delete old value
   - Paste new token
4. Retry build

---

### Build fails: "Module not found"

**Error looks like:**
```
Error: Cannot find module 'expo-sqlite'
```

**Fix:**
```bash
cd mobile
npm install
npm ci  # Clean install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

Then retry the build.

---

### Build fails: "Version validation failed"

**Error looks like:**
```
Version must be in format X.Y.Z
```

**Fix:**
- Check `version.txt` format: `1.2.0` (not `1.2` or `v1.2.0`)
- Check `app.json` has valid version
- Manually update if needed:
```bash
cd mobile
npm run update-version -- 1.2.0
```

---

### Build is stuck / taking too long

**Possible causes:**
- EAS service is slow (check https://status.expo.dev)
- First build always slower
- Large app size

**What to do:**
1. Wait 20+ minutes (builds can take time)
2. Check https://expo.dev/builds for progress
3. If still stuck after 30 minutes:
   - Cancel workflow in GitHub Actions
   - Check EAS dashboard for actual build status
   - Retry

---

### Can't find APK to download

**Where to look:**

1. **If tagged release (v1.x.x):**
   - Go to **Releases** tab on GitHub
   - Find tag, download APK from release

2. **If push to main (development):**
   - Go to https://expo.dev/builds
   - Find build, download from EAS

3. **Verify build completed:**
   - Go to **Actions** tab
   - Click workflow run
   - Check if ✅ (completed) or ⏳ (running)

---

### APK won't install on phone

**Error: "App not installed"**

**Possible causes:**
- Different Android version than app supports
- Phone storage full
- APK corrupt

**Fix:**
1. Check Android version required: `mobile/app.json` → `"minSdkVersion"`
2. Free up phone storage
3. Rebuild and retry
4. Try different phone to test

---

### Phone can't find APK file

**When transferring to phone:**

**Using USB:**
```bash
# Connect phone via USB
# Run:
adb push ~/Downloads/app-release.apk /sdcard/Download/
# Then navigate to Downloads on phone and tap
```

**Using file transfer:**
1. Email the APK to yourself
2. Download on phone
3. Tap to install

**Using cloud:**
1. Upload APK to Google Drive
2. Download on phone
3. Tap to install

---

## 🔧 Advanced Configuration

### Customize Build Profile

Edit `mobile/eas.json`:

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk"
      }
    },
    "development": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### Skip APK Build for Certain Commits

Add to commit message:
```
git commit -m "Docs update [skip ci]"
```

Workflow won't trigger.

### Manual Build Commands

```bash
# Build for testing
eas build --platform android

# Build for production
npm run eas:prod

# View builds
eas build:list

# View specific build
eas build:view <build-id>

# Clean cache
eas build:cache:clean
```

---

## 📋 Workflow Checklist

Before your first release:

- [ ] Expo account created
- [ ] Expo token generated
- [ ] `EXPO_TOKEN` added to GitHub secrets
- [ ] `eas build:configure` run in mobile/
- [ ] `eas.json` committed to repo
- [ ] App builds locally: `npm run eas:prod`
- [ ] Mobile app tested offline
- [ ] Version format is X.Y.Z

---

## 🎯 Common Workflows

### Daily Development Builds

```bash
# Make changes
vim mobile/src/pages/SomePage.js

# Push to main
git commit -am "Add feature xyz"
git push origin main

# Wait ~10 minutes
# Download from EAS dashboard
# Test on phone
```

### Monthly Release

```bash
# Update version
cd mobile
npm run update-version -- 2.0.0

# Test
npm start
# ... test app ...

# Create release
git commit -am "Release v2.0.0"
git tag v2.0.0
git push origin main v2.0.0

# GitHub automatically:
# - Builds APK
# - Creates release
# - Uploads APK

# Users download from GitHub Releases
```

### Emergency Hotfix

```bash
# Quick fix
git commit -am "Hotfix: crash on login"
git tag v1.1.1
git push origin main v1.1.1

# APK built and released in ~15 minutes
```

---

## 📞 Getting Help

### Resources
- [Expo Documentation](https://docs.expo.dev)
- [EAS Build Guide](https://docs.expo.dev/eas/build/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

### Check These First
1. Workflow logs in GitHub Actions
2. EAS build logs on https://expo.dev/builds
3. Mobile app package.json dependencies
4. Version format in version.txt

### Debug Steps
1. Try building locally: `npm run eas:prod`
2. Check Expo token validity
3. Check mobile/ directory structure
4. Run `npm install && npm ci`

---

## 🎓 Understanding the Pipeline

### What Happens When You Push

```
git push origin main
    ↓
GitHub detects push
    ↓
Checks if mobile/ files changed
    ↓
If YES → Starts build-apk.yml workflow
    ↓
- Installs dependencies
- Validates version
- Calls: eas build --platform android
    ↓
EAS Cloud builds APK (~10 min)
    ↓
APK available in EAS dashboard
    ↓
GitHub Actions posts status ✅
```

### What Happens When You Tag

```
git tag v1.2.0 && git push origin main v1.2.0
    ↓
GitHub detects tag matching v*
    ↓
Starts build-apk.yml workflow
    ↓
Same build process as above
    ↓
PLUS: Creates GitHub Release
    ↓
Uploads APK to release download
    ↓
Users can download from Releases page
```

---

**Still stuck?** Check:
1. Workflow logs: https://github.com/your-repo/actions
2. Build logs: https://expo.dev/builds
3. This file: You might find your issue above!
