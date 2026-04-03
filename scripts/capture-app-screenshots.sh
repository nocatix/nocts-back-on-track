#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
START_STACK="false"

usage() {
  cat <<'EOF'
Usage: bash scripts/capture-app-screenshots.sh [--start-stack]

Options:
  --start-stack  Start backend and frontend dev servers automatically.

Environment variables:
  BASE_URL         Default: http://localhost:3000
  SCREENSHOT_DIR   Default: docs/screenshots/auto
  SCREENSHOT_VIEWPORT_WIDTH   Default: 1800
  SCREENSHOT_VIEWPORT_HEIGHT  Default: 1200
  SCREENSHOT_SCALE_FACTOR     Default: 2
  SCREENSHOT_UI_SCALE         Default: 1.35
  SCREENSHOT_FULL_PAGE        Default: false
  SCREENSHOT_THEME            Default: dark (dark|light|system)
  APP_USERNAME     Optional existing user for login flow
  APP_PASSWORD     Optional existing user password for login flow
  HEADLESS         Default: true (set to false for visible browser)
  PAGE_WAIT_MS     Default: 1100
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --start-stack)
      START_STACK="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]]; then
    kill "$BACKEND_PID" >/dev/null 2>&1 || true
  fi
  if [[ -n "${FRONTEND_PID:-}" ]]; then
    kill "$FRONTEND_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

if [[ "$START_STACK" == "true" ]]; then
  echo "[screenshots] starting backend and frontend"
  (
    cd "$ROOT_DIR"
    npm run dev > /tmp/nocts-backend.log 2>&1
  ) &
  BACKEND_PID=$!

  (
    cd "$ROOT_DIR"
    npm run client > /tmp/nocts-frontend.log 2>&1
  ) &
  FRONTEND_PID=$!
fi

BASE_URL="${BASE_URL:-http://localhost:3000}"
LOGIN_URL="${BASE_URL%/}/login"

for _ in $(seq 1 120); do
  if curl -sf "$LOGIN_URL" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

if ! curl -sf "$LOGIN_URL" >/dev/null 2>&1; then
  echo "[screenshots] app is not reachable at $LOGIN_URL" >&2
  echo "[screenshots] start the app manually or rerun with --start-stack" >&2
  exit 1
fi

cd "$ROOT_DIR/client"
npm run playwright:install
npm run screenshots:capture

echo "[screenshots] completed"
