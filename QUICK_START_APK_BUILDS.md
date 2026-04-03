# Quick Start: Automated APK Builds

## 🚀 One-Time Setup (5 minutes)

### Step 1: Create Expo Account & Token

```bash
# 1. Sign up at https://expo.dev
# 2. Go to https://expo.dev/settings/personal-access-tokens
# 3. Create a token (save it!)
```

### Step 2: Add to GitHub Secrets

1. Go to your GitHub repo
2. **Settings → Secrets and variables → Actions**
3. Click **New repository secret**
4. **Name**: `EXPO_TOKEN`
5. **Value**: Paste your Expo token
6. Click **Add secret**

### Step 3: Initialize EAS (One time)

```bash
cd mobile
eas build:configure
```

This creates `eas.json` with build configuration.

## 📱 Building APKs

### Option A: Create a Release (Recommended for Production)

```bash
# Update version
cd mobile
npm run update-version -- 1.2.0

# Commit and tag
git add -A
git commit -m "Release v1.2.0"
git tag v1.2.0
git push origin main v1.2.0
```

✅ GitHub Actions automatically:
- Builds APK
- Creates GitHub Release
- Uploads APK for download

### Option B: Push to Main (Development)

```bash
git commit -m "Update mobile app"
git push origin main
```

✅ GitHub Actions automatically:
- Builds APK
- Available in EAS dashboard

### Option C: Manual Trigger

1. Go to **Actions** tab in GitHub
2. Select **Build and Publish Mobile APK**
3. Click **Run workflow**
4. Monitor the build

### Option D: Local Build (No Internet / No EAS Account)

Build the APK entirely on your machine without any cloud service:

```bash
# Release APK (default)
bash mobile/scripts/build-local-apk.sh release

# Debug APK
bash mobile/scripts/build-local-apk.sh debug
```

✅ Output APK is written to:
`mobile/android/app/build/outputs/apk/<mode>/app-<mode>.apk`

> **Requirements**: Android SDK, Java 17 or 21, Node.js.
> The script auto-detects `ANDROID_HOME` / `ANDROID_SDK_ROOT` and common SDK paths.

## 📥 Getting Your APK

### From GitHub Releases (Easiest)

1. Go to **Releases** tab on GitHub
2. Download APK from latest release
3. Transfer to Android phone
4. Install (tap file)

### From EAS Dashboard

1. Visit https://expo.dev/builds
2. Find your build
3. Download APK directly

## 🔹 Common Tasks

### Build Manually (Without Git)

```bash
cd mobile
npm run eas:prod
```

### Update Version Manually

```bash
cd mobile
npm run update-version -- 1.2.0
```

### Check Build Status

Visit: https://expo.dev/builds

### View Build Logs

```bash
# List recent builds
eas build:list

# View specific build
eas build:view <build-id>
```

## 📊 What Gets Built

| When | Trigger | Output |
|------|---------|--------|
| Every push to main | Git push | APK in EAS (quick test) |
| Every tag v* | Git tag | APK + GitHub Release (production) |
| Manual click | GitHub Actions UI | APK (instant) |

## ✅ Troubleshooting

### "Token not found / auth failed"
```bash
# Update EXPO_TOKEN secret in GitHub:
# Settings → Secrets → EXPO_TOKEN
# (Make sure it's a valid token)
```

### "Build stuck / slow"
- EAS builds take 5-15 minutes
- Check https://expo.dev/builds for progress
- Look for errors in build logs

### "Version update failed"
```bash
# Manual update:
# Edit mobile/app.json
# Edit mobile/package.json
# Edit version.txt
```

## 🎯 Recommended Workflow

### For Development
```bash
# Make changes in mobile/
git push origin main
# Wait ~10 minutes for APK
# Download from EAS dashboard
# Test on phone
```

### For Releases
```bash
# Make changes
# Update version
npm run update-version -- X.Y.Z

# Test locally
npm start

# Create release
git commit -am "Release vX.Y.Z"
git tag vX.Y.Z
git push origin main vX.Y.Z

# GitHub Actions builds automatically
# Download from GitHub Releases
```

## 📚 More Info

- Full setup guide: `CI-CD-SETUP.md`
- Workflow file: `.github/workflows/build-apk.yml`
- Expo docs: https://docs.expo.dev/eas/
- EAS dashboard: https://expo.dev/builds

---

**Status**: ✅ Ready to build  
**Next**: Add `EXPO_TOKEN` to GitHub secrets, then everything works automatically!
