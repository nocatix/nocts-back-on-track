#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const version = process.argv[2];

if (!version) {
  console.error('Usage: npm run update-version -- <version>');
  console.error('Example: npm run update-version -- 1.1.0');
  process.exit(1);
}

// Validate version format (X.Y.Z)
if (!/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('Error: Version must be in format X.Y.Z (e.g., 1.1.0)');
  process.exit(1);
}

const paths = {
  appJson: path.join(__dirname, '../app.json'),
  packageJson: path.join(__dirname, '../package.json'),
  versionTxt: path.join(__dirname, '../../version.txt'),
};

try {
  // Update app.json
  if (fs.existsSync(paths.appJson)) {
    const appJson = JSON.parse(fs.readFileSync(paths.appJson, 'utf8'));
    appJson.expo.version = version;
    
    // Calculate Android versionCode from semantic version
    const [major, minor, patch] = version.split('.').map(Number);
    appJson.expo.android.versionCode = major * 10000 + minor * 100 + patch;
    
    fs.writeFileSync(paths.appJson, JSON.stringify(appJson, null, 2) + '\n');
    console.log('✅ app.json updated');
  }

  // Update mobile package.json
  if (fs.existsSync(paths.packageJson)) {
    const packageJson = JSON.parse(fs.readFileSync(paths.packageJson, 'utf8'));
    packageJson.version = version;
    fs.writeFileSync(paths.packageJson, JSON.stringify(packageJson, null, 2) + '\n');
    console.log('✅ package.json updated');
  }

  // Update root version.txt
  fs.writeFileSync(paths.versionTxt, version + '\n');
  console.log('✅ version.txt updated');

  console.log('');
  console.log(`📦 Version updated to: ${version}`);
  console.log('');
  console.log('Next steps:');
  console.log('1. Test the app: npm start');
  console.log('2. Commit changes: git add -A && git commit -m "Bump version to ' + version + '"');
  console.log('3. Create tag: git tag v' + version);
  console.log('4. Push changes: git push origin main v' + version);
} catch (error) {
  console.error('Error updating version:', error.message);
  process.exit(1);
}
