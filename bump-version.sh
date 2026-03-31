#!/bin/bash

# Version Bump Script
# Usage: ./bump-version.sh [major|minor|patch]
# Example: ./bump-version.sh minor

set -e

if [ $# -eq 0 ]; then
  echo "Usage: ./bump-version.sh [major|minor|patch]"
  echo ""
  echo "Examples:"
  echo "  ./bump-version.sh major  # 1.0.0 -> 2.0.0"
  echo "  ./bump-version.sh minor  # 1.0.0 -> 1.1.0"
  echo "  ./bump-version.sh patch  # 1.0.0 -> 1.0.1"
  exit 1
fi

TYPE=$1

# Get current version
CURRENT_VERSION=$(grep '"version"' package.json | head -1 | sed 's/.*"version": "\(.*\)".*/\1/')
echo "Current version: $CURRENT_VERSION"

# Parse version
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

# Calculate new version
case "$TYPE" in
  major)
    MAJOR=$((MAJOR + 1))
    MINOR=0
    PATCH=0
    ;;
  minor)
    MINOR=$((MINOR + 1))
    PATCH=0
    ;;
  patch)
    PATCH=$((PATCH + 1))
    ;;
  *)
    echo "Invalid version type: $TYPE (use major, minor, or patch)"
    exit 1
    ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"
echo "New version: $NEW_VERSION"
echo ""

# Update package.json
sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"$NEW_VERSION\"/" package.json

# Update client package.json
sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"$NEW_VERSION\"/" client/package.json

echo "✅ Version bumped to $NEW_VERSION"
echo ""
echo "Next steps:"
echo "1. Review changes:"
echo "   git diff"
echo ""
echo "2. Commit the version bump:"
echo "   git add package.json client/package.json"
echo "   git commit -m 'Bump version to $NEW_VERSION'"
echo ""
echo "3. Create a release tag:"
echo "   git tag -a v$NEW_VERSION -m 'Release version $NEW_VERSION'"
echo "   git push origin v$NEW_VERSION"
echo ""
echo "4. Or use the publish script:"
echo "   ./publish.sh $NEW_VERSION"
