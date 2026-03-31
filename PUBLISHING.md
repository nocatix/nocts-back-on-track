# Publishing to GitHub Container Registry (ghcr.io)

This guide explains how to publish your Docker images to GitHub Container Registry (ghcr.io).

## Quick Start

### Method 1: Automated Publishing (Recommended)

GitHub Actions will automatically build and publish your images when you:
- Push to the `main` branch
- Create a release tag (e.g., `v1.0.1`)
- Manually trigger the workflow

**No setup required!** The `publish-ghcr.yml` workflow handles everything automatically.

### Method 2: Manual Publishing via Script

Use the provided `publish.sh` script to publish from your local machine:

#### Prerequisites

1. **GitHub Personal Access Token**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select these scopes:
     - ✓ `write:packages` - Publish packages
     - ✓ `read:packages` - Download packages
     - ✓ `delete:packages` - Delete packages (optional)
   - Click "Generate token" and copy the token

2. **Make the script executable**
   ```bash
   chmod +x publish.sh
   ```

#### Running the Script

```bash
# Publish with version from package.json (1.0.0)
./publish.sh

# Publish with specific version
./publish.sh 1.0.1
```

The script will:
1. Ask for your GitHub username and personal access token
2. Authenticate with ghcr.io
3. Build both backend and frontend images with `version:latest` tags
4. Push images to ghcr.io

#### Published Images

After successful publication, your images will be available at:
- `ghcr.io/your-username/nocts-back-on-track-backend:1.0.1`
- `ghcr.io/your-username/nocts-back-on-track-backend:latest`
- `ghcr.io/your-username/nocts-back-on-track-frontend:1.0.1`
- `ghcr.io/your-username/nocts-back-on-track-frontend:latest`

## Using Published Images

### Option 1: Using `docker-compose-ghcr.yml`

```bash
docker compose -f docker-compose-ghcr.yml up
```

### Option 2: Pulling Specific Version

```bash
# Backend
docker pull ghcr.io/your-username/nocts-back-on-track-backend:1.0.1

# Frontend
docker pull ghcr.io/your-username/nocts-back-on-track-frontend:1.0.1
```

### Option 3: Using in Custom docker-compose.yml

Update your `docker-compose.yml`:

```yaml
services:
  backend:
    image: ghcr.io/your-username/nocts-back-on-track-backend:1.0.1
    # ... rest of config

  frontend:
    image: ghcr.io/your-username/nocts-back-on-track-frontend:1.0.1
    # ... rest of config
```

## Versioning Strategy

### Semantic Versioning

Update `package.json` version before publishing:

```json
{
  "version": "1.0.1"
}
```

### Version Tagging

**Patch (Bug fixes):** `1.0.1`
**Minor (New features):** `1.1.0`
**Major (Breaking changes):** `2.0.0`

## Making Images Public

By default, images are private. To make them public:

1. Go to your GitHub profile → Packages
2. Find the package (e.g., `nocts-back-on-track-backend`)
3. Click the package → Package settings
4. Change "Danger Zone" → "Make Public"

Others can then pull without authentication:

```bash
docker pull ghcr.io/your-username/nocts-back-on-track-backend:latest
```

## Troubleshooting

### Authentication Errors

```
Error response from daemon: unauthorized
```

**Solution:** Check your personal access token:
- Has `write:packages` scope?
- Not expired?
- Run `docker logout ghcr.io` then try again

### Token Issues

```bash
# Check if logged in
docker info | grep -i username

# To log out
docker logout ghcr.io

# To log in manually
docker login ghcr.io
```

### Build Issues

If `docker build` fails:

```bash
# Check Dockerfile syntax
docker build -f Dockerfile.server --dry-run .

# Build with verbose output
docker build -f Dockerfile.server --progress=plain .
```

## GitHub Actions Secrets

The workflows use `GITHUB_TOKEN` which is automatically provided by GitHub Actions. No manual secrets needed!

However, if you need additional environment variables:

1. Go to your repository Settings → Secrets and Variables → Actions
2. Click "New repository secret"
3. Add any custom secrets needed

## Cleanup

### Delete Old Images Locally

```bash
docker image rm ghcr.io/your-username/nocts-back-on-track-backend:1.0.0
```

### Delete Published Images

1. Go to your GitHub profile → Packages
2. Click the package
3. Package settings → Delete this version

## Next Steps

1. **Tag your release** (if you want versioned releases):
   ```bash
   git tag -a v1.0.1 -m "Release version 1.0.1"
   git push origin v1.0.1
   ```

2. **Update package.json** for next development version:
   ```json
   {
     "version": "1.0.2-dev"
   }
   ```

3. **Monitor GitHub Actions** for build status at `Actions` tab in your repo

## References

- [GitHub Container Registry Docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Docker Publishing Guide](https://docs.docker.com/build/pushing/multi-platform/)
- [Semantic Versioning](https://semver.org/)
