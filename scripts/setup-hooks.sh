#!/bin/bash
# Setup script to install git hooks for branch protection

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GIT_DIR="$(git rev-parse --git-dir)"
HOOKS_DIR="$GIT_DIR/hooks"

echo "🔧 Setting up git hooks for branch protection..."

# Copy hooks to git hooks directory
if [ -f "$SCRIPT_DIR/git-hooks/pre-commit" ]; then
    cp "$SCRIPT_DIR/git-hooks/pre-commit" "$HOOKS_DIR/pre-commit"
    chmod +x "$HOOKS_DIR/pre-commit"
    echo "✅ Installed pre-commit hook"
else
    echo "❌ Error: pre-commit hook not found"
    exit 1
fi

if [ -f "$SCRIPT_DIR/git-hooks/pre-push" ]; then
    cp "$SCRIPT_DIR/git-hooks/pre-push" "$HOOKS_DIR/pre-push"
    chmod +x "$HOOKS_DIR/pre-push"
    echo "✅ Installed pre-push hook"
else
    echo "❌ Error: pre-push hook not found"
    exit 1
fi

echo ""
echo "✨ Git hooks installed successfully!"
echo ""
echo "📋 Branch Protection Rules:"
echo "   • No direct commits to the 'main' branch"
echo "   • No direct pushes to the 'main' branch"
echo "   • All changes must come through pull requests"
echo ""
echo "📖 For more info, see: BRANCH_PROTECTION.md"
