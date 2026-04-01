#!/bin/bash

# Update version script for mobile app
# Usage: ./scripts/update-version.sh 1.1.0

VERSION=$1

if [ -z "$VERSION" ]; then
    echo "Usage: ./scripts/update-version.sh <version>"
    echo "Example: ./scripts/update-version.sh 1.1.0"
    exit 1
fi

# Validate version format
if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Version must be in format X.Y.Z (e.g., 1.1.0)"
    exit 1
fi

MOBILE_DIR="./mobile"

# Update app.json
if [ -f "$MOBILE_DIR/app.json" ]; then
    echo "Updating version in app.json to $VERSION..."
    
    # Use jq if available, otherwise sed
    if command -v jq &> /dev/null; then
        jq ".expo.version = \"$VERSION\" | .expo.android.versionCode = $(echo $VERSION | cut -d. -f1)$(echo $VERSION | cut -d. -f2)$(echo $VERSION | cut -d. -f3)" "$MOBILE_DIR/app.json" > "$MOBILE_DIR/app.json.tmp"
        mv "$MOBILE_DIR/app.json.tmp" "$MOBILE_DIR/app.json"
    else
        # Fallback to sed
        sed -i.bak "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" "$MOBILE_DIR/app.json"
        rm -f "$MOBILE_DIR/app.json.bak"
    fi
    
    echo "✅ app.json updated"
else
    echo "⚠️  app.json not found"
fi

# Update package.json
if [ -f "$MOBILE_DIR/package.json" ]; then
    echo "Updating version in package.json to $VERSION..."
    
    if command -v jq &> /dev/null; then
        jq ".version = \"$VERSION\"" "$MOBILE_DIR/package.json" > "$MOBILE_DIR/package.json.tmp"
        mv "$MOBILE_DIR/package.json.tmp" "$MOBILE_DIR/package.json"
    else
        sed -i.bak "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" "$MOBILE_DIR/package.json"
        rm -f "$MOBILE_DIR/package.json.bak"
    fi
    
    echo "✅ package.json updated"
else
    echo "⚠️  package.json not found"
fi

# Update root version.txt
echo "$VERSION" > version.txt
echo "✅ version.txt updated"

echo ""
echo "📦 Version updated to: $VERSION"
echo ""
echo "Next steps:"
echo "1. Test the app: cd mobile && npm start"
echo "2. Commit changes: git add -A && git commit -m 'Bump version to $VERSION'"
echo "3. Create tag: git tag v$VERSION"
echo "4. Push changes: git push origin main v$VERSION"
