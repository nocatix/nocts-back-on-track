# CI/CD Setup Guide - Automated APK Builds

## Overview

The repository now includes automated GitHub Actions pipelines to build and publish your mobile app:

- **build-apk.yml** - Builds APK and publishes to GitHub Releases
- **publish-ghcr.yml** - Builds and publishes Docker images (backend/frontend)

## Quick Setup

### 1. Create Expo Account (Required for APK builds)

```bash
# Sign up at https://expo.dev
# Then log in locally
eas login
```

### 2. Generate Expo Token

```bash
# Go to https://expo.dev/settings/personal-access-tokens
# Create a new token (save it securely)
```

### 3. Add Secrets to GitHub

Go to: **Settings → Secrets and Variables → Actions**

Add these secrets:

| Secret Name | Value | Required |
|-------------|-------|----------|
| `EXPO_TOKEN` | Your Expo personal access token | ✅ Yes |
| `GOOGLE_PLAY_JSON_KEY_BASE64` | Google Play service account (base64) | ❌ Optional |
| `SLACK_WEBHOOK` | Slack webhook for notifications | ❌ Optional |

### 4. One-time Mobile App Configuration

```bash
cd mobile

# Initialize EAS Build configuration
eas build:configure

# This creates eas.json with build profiles
```

## How It Works

### Automatic Builds (No Manual Action Needed)

#### Option 1: Push to Main (Development)
```bash
git push origin main
```
→ Builds APK automatically  
→ APK available in EAS dashboard

#### Option 2: Create Release Tag (Production)
```bash
git tag v1.1.0
git push origin v1.1.0
```
→ Builds APK  
→ Creates GitHub Release  
→ APK downloadable from Releases page

### Manual Trigger

Click "Run workflow" in GitHub Actions:
- Go to Actions tab
- Select "Build and Publish Mobile APK"
- Click "Run workflow"

## File: .github/workflows/build-apk.yml

### What It Does
1. ✅ Checks out your code
2. ✅ Sets up Node.js environment
3. ✅ Installs dependencies
4. ✅ Updates app version
5. ✅ Builds APK using EAS Build
6. ✅ Publishes to GitHub Releases (for tags)
7. ✅ Posts build status

### Triggers
- **Push to main** - If `mobile/` files changed
- **Git tags** (v*) - Full release build
- **Manual** - Via GitHub Actions UI

## Getting Your APK

### From GitHub Releases
1. Go to **Releases** tab in your repo
2. Download the APK from the latest release
3. Transfer to your Android phone
4. Install (allow unknown sources)

### From EAS Dashboard
1. Go to https://expo.dev/projects
2. Select your project
3. View recent builds
4. Download APK directly

### From CI Logs
1. Go to **Actions** tab
2. Click the completed workflow
3. Check logs for build status

## Advanced Setup (Optional)

### Publish to Google Play Store

To automatically publish to Google Play Store:

1. Create Google Play service account:
   - Go to Google Play Console
   - Create service account with Editor role
   - Download JSON key file

2. Encode key in base64:
   ```bash
   base64 -i service-account-key.json -o key-base64.txt
   ```

3. Add to GitHub Secrets as `GOOGLE_PLAY_JSON_KEY_BASE64`

4. Uncomment in build-apk.yml:
   ```yaml
   - name: Publish to Google Play Store (Optional)
     working-directory: ./mobile
     run: |
       echo ${{ secrets.GOOGLE_PLAY_JSON_KEY_BASE64 }} | base64 -d > ./google-play-key.json
       npx fastlane android deploy
   ```

5. Create `mobile/fastlane/Fastfile`:
   ```ruby
   default_platform(:android)

   platform :android do
     desc "Deploy a new version to the Google Play"
     lane :deploy do
       build_android_app(...)
       upload_to_play_store(...)
     end
   end
   ```

### Slack Notifications

1. Create Slack webhook:
   - Go to Slack workspace settings
   - Create incoming webhook for your channel

2. Add to GitHub Secrets as `SLACK_WEBHOOK`

3. Build notifications sent to Slack automatically

## Troubleshooting

### "Build failed: Expo token invalid"
```bash
# Regenerate Expo token
# Go to https://expo.dev/settings/personal-access-tokens
# Create new token
# Update EXPO_TOKEN in GitHub Secrets
```

### "Build timed out"
- EAS builds usually take 5-15 minutes
- Wait for GitHub Actions to complete
- Check EAS dashboard for detailed logs

### "APK not found"
- Verify EAS_TOKEN is set correctly
- Check that `mobile/` directory has valid app config
- Run locally first: `eas build --platform android`

### "Module not found errors"
```bash
# Update mobile/package.json
cd mobile
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

## Version Management

### Automatic Version Bumping
The pipeline automatically bumps the patch version:
- `1.0.0` → `1.0.1` → `1.0.2` ...

### Manual Version Override
Edit `version.txt`:
```bash
echo "1.1.0" > version.txt
git commit -m "Bump version to 1.1.0"
git push
```

### Tag-based Release
```bash
git tag v1.1.0
git push origin v1.1.0
# Uses tag version as-is
```

## Monitoring Builds

### GitHub Actions Dashboard
- **Actions** tab shows all workflow runs
- Click any run to see detailed logs
- Check status badge in README

### EAS Dashboard
- https://expo.dev/builds
- Live build progress
- Direct download links
- Build history

## CI/CD Architecture

```
GitHub Push
    ↓
GitHub Actions Triggered
    ↓
    ├→ build-apk.yml
    │   ├→ Install dependencies
    │   ├→ Build with EAS
    │   └→ Publish to GitHub Releases (on tag)
    │
    └→ publish-ghcr.yml
        ├→ Build backend Docker
        └→ Build frontend Docker
```

## Workflow Files

### 1. build-apk.yml (Mobile)
- **Triggers**: Push to main, tags
- **Output**: APK file
- **Publishes**: GitHub Releases, EAS
- **Status**: Slack notifications (optional)

### 2. publish-ghcr.yml (Backend/Frontend)
- **Triggers**: Push to main, tags
- **Output**: Docker images
- **Publishes**: GitHub Container Registry
- **Status**: Built-in logging

## Tips & Best Practices

1. **Always test locally first**
   ```bash
   cd mobile
   npm install
   eas build --local --platform android
   ```

2. **Monitor the first few runs**
   - Check GitHub Actions logs
   - Verify APK works on test device

3. **Use semantic versioning**
   - v1.0.0 (initial release)
   - v1.0.1 (patch)
   - v1.1.0 (minor)
   - v2.0.0 (major)

4. **Keep team updated**
   - Enable Slack notifications
   - Share GitHub Releases link
   - Document each release

5. **Backup APKs**
   - Download from GitHub Releases
   - Keep them on Google Drive as backup

## Support

### Common Commands

```bash
# Rebuild specific platform
eas build --platform android --non-interactive

# Check build status
eas build:list

# View build logs
eas build:view <build_id>

# Clean cache (if issues)
eas build:cache:clean
```

### Useful Links
- [EAS Documentation](https://docs.expo.dev/eas/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Expo Mobile Setup](https://docs.expo.dev/build/setup/)

---

**Status**: ✅ Automated builds ready  
**Next Step**: Add `EXPO_TOKEN` secret to GitHub  
**Questions**: See workflow files in `.github/workflows/`
