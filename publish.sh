#!/bin/bash

# Docker Image Publishing Script for ghcr.io
# Usage: ./publish.sh [version]
# Example: ./publish.sh 1.0.1

set -e

# Get version from argument or package.json
VERSION=${1:-$(grep '"version"' package.json | head -1 | sed 's/.*"version": "\(.*\)".*/\1/')}
REGISTRY="ghcr.io"
OWNER="marcel"  # Change this to your GitHub username
PROJECT="nocts-back-on-track"

echo "📦 Publishing $PROJECT version $VERSION to $REGISTRY"
echo "Registry: $REGISTRY/$OWNER/$PROJECT"
echo ""

# Ensure we're logged in to ghcr.io
echo "🔐 Checking GitHub Container Registry authentication..."
echo "Note: You need a GitHub personal access token with 'write:packages' permission"
echo "Create one at: https://github.com/settings/tokens"
echo ""
read -p "GitHub username: " GITHUB_USER
read -sp "GitHub personal access token: " GITHUB_TOKEN
echo ""

# Login to ghcr.io
echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_USER" --password-stdin

# Build backend image
echo ""
echo "🔨 Building backend image..."
docker build -f Dockerfile.server \
  -t "$REGISTRY/$OWNER/$PROJECT-backend:$VERSION" \
  -t "$REGISTRY/$OWNER/$PROJECT-backend:latest" \
  .

# Build frontend image
echo ""
echo "🔨 Building frontend image..."
docker build -f Dockerfile.client \
  -t "$REGISTRY/$OWNER/$PROJECT-frontend:$VERSION" \
  -t "$REGISTRY/$OWNER/$PROJECT-frontend:latest" \
  .

# Push backend image
echo ""
echo "📤 Pushing backend image..."
docker push "$REGISTRY/$OWNER/$PROJECT-backend:$VERSION"
docker push "$REGISTRY/$OWNER/$PROJECT-backend:latest"

# Push frontend image
echo ""
echo "📤 Pushing frontend image..."
docker push "$REGISTRY/$OWNER/$PROJECT-frontend:$VERSION"
docker push "$REGISTRY/$OWNER/$PROJECT-frontend:latest"

echo ""
echo "✅ Successfully published to ghcr.io!"
echo ""
echo "Backend image: $REGISTRY/$OWNER/$PROJECT-backend:$VERSION"
echo "Frontend image: $REGISTRY/$OWNER/$PROJECT-frontend:$VERSION"
echo ""
echo "To use these images, update your docker-compose.yml:"
echo "  backend:"
echo "    image: $REGISTRY/$OWNER/$PROJECT-backend:$VERSION"
echo "  frontend:"
echo "    image: $REGISTRY/$OWNER/$PROJECT-frontend:$VERSION"
