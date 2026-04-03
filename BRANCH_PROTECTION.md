# Branch Protection Policy

## Overview

This repository enforces a protected `main` branch. **No direct commits or pushes to `main` are allowed.** All code changes must come through topic branches and pull requests.

## Why Branch Protection?

- ✅ Ensures code review for all changes
- ✅ Prevents accidental commits to main
- ✅ Maintains clear commit history
- ✅ Enables CI/CD checks before merging
- ✅ Tracks all changes through pull requests

## Workflow

### 1. Create a Topic Branch

```bash
# Create and checkout a new branch from main
git checkout -b feature/your-feature-name

# Examples:
git checkout -b feature/add-mood-insights
git checkout -b bugfix/fix-breathing-animation
git checkout -b docs/update-readme
```

### Branch Naming Conventions

- `feature/` - New features or enhancements
- `bugfix/` or `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `chore/` - Maintenance tasks
- `hotfix/` - Urgent production fixes

### 2. Make Your Changes

```bash
git add .
git commit -m "Clear commit message describing your changes"
```

### 3. Push Your Topic Branch

```bash
git push origin feature/your-feature-name
```

### 4. Create a Pull Request

- Go to GitHub and create a Pull Request from your topic branch to `main`
- Describe your changes clearly
- Link any related issues
- Wait for code review and CI checks to pass

### 5. Merge via GitHub

- Once approved, merge your Pull Request on GitHub
- This ensures the history is tracked correctly
- **Never merge locally and push to main**

## Local Protection

Two git hooks prevent direct commits/pushes to `main`:

- **`pre-commit`** - Blocks commits when on `main` branch
- **`pre-push`** - Blocks pushes to `main` from any branch

If you accidentally try to commit to main, you'll see:

```
❌ ERROR: You are trying to commit to the 'main' branch directly.

✅ Please follow this workflow instead:
   1. Create a topic branch: git checkout -b feature/your-feature-name
   2. Make your changes and commit to your topic branch
   3. Push your topic branch: git push origin feature/your-feature-name
   4. Create a Pull Request on GitHub
   5. After review, merge via Pull Request
```

## GitHub Branch Protection Rules

The following rules should be enforced on GitHub:

1. **Require pull request reviews before merging**
   - Keep PR workflow enabled
   - For solo-owner maintenance, do not require a numeric approval count (GitHub blocks self-approval)
   - Dismiss stale pull request approvals when new commits are pushed

2. **Require status checks to pass before merging**
   - Require branches to be up to date before merging
   - Require CI/CD workflows to pass
   - Require `Owner Approval Gate / owner-approval` to pass

3. **Require code review from code owners**
   - Enable only when at least one additional code owner can review

4. **Dismiss stale pull request approvals when new commits are pushed**
   - Ensures reviews are current

5. **Require latest commit to be up to date before merging**
   - Prevents merge conflicts

6. **Include administrators**
   - Even admins follow the workflow

## Owner-Only Merge and Release Policy

To enforce that only `@nocatix` can merge PRs into `main` and create/publish releases:

1. **Branch Ruleset for `main`**
   - Target: `refs/heads/main`
   - Require pull requests before merging
   - Do not set a required approval count for solo-owner repos
   - Disable required code owner review for solo-owner repos (or add another code owner)
   - Restrict who can push to matching branches: `nocatix` only
   - Disable bypass for administrators (or keep only `nocatix` as admin)

2. **CODEOWNERS enforcement**
   - `.github/CODEOWNERS` contains `* @nocatix`
   - Enable "Require review from Code Owners" only if you add another code owner who can review

3. **Owner approval status check**
   - `.github/workflows/owner-approval-gate.yml` enforces that PRs targeting `main` include an approval from `@nocatix` when the PR author is not `@nocatix`
   - Owner-authored PRs pass this gate automatically because GitHub does not allow self-approval
   - Add `Owner Approval Gate / owner-approval` to required status checks on `main`

4. **PR submissions remain open**
   - Contributors can still push branches and open PRs
   - They cannot merge to `main` without owner approval and required checks

5. **Release permissions**
   - Repository Settings -> Collaborators and Teams
   - Keep `Write/Maintain/Admin` access only for `nocatix` (or trusted maintainers that should also be allowed to create releases)
   - Note: GitHub release creation is tied to repository write-level permissions.

6. **Workflow-level release gate (already configured)**
   - Publish workflows run only when `github.actor == 'nocatix'`
   - This prevents non-owner release events from publishing artifacts/images

### Setting Up GitHub Rules

1. Go to repository **Settings**
2. Click **Branches** in the left sidebar
3. Under "Branch protection rules", click **Add rule**
4. For pattern, enter: `main`
5. Enable the following options:
   - ☑ Require a pull request before merging
   - ☐ Require approvals (leave disabled for solo-owner workflow)
   - ☐ Require review from Code Owners (enable only if another code owner can review)
   - ☑ Require status checks to pass before merging
   - ☑ Select required check: `Owner Approval Gate / owner-approval`
   - ☑ Require branches to be up to date before merging
   - ☑ Restrict who can push to matching branches (select appropriate teams)
   - ☑ Include administrators
6. Click **Create**

## Troubleshooting

### Error: "You are trying to commit to the 'main' branch directly"

**Solution:** Push a new topic branch first

```bash
# Stash your uncommitted changes
git stash

# Create a new topic branch
git checkout -b feature/my-feature

# Apply your changes back
git stash pop

# Now commit and push
git add .
git commit -m "Your message"
git push origin feature/my-feature
```

### Error: "Direct push to 'main' branch is not allowed"

**Solution:** Only push to your topic branch

```bash
# Make sure you're on your topic branch
git checkout feature/your-feature

# Push to your topic branch (NOT main)
git push origin feature/your-feature
```

### Cannot approve my own PR

**Cause:** GitHub does not allow pull request authors to approve their own PR.

**Solution for this repo policy:**

- Keep `Owner Approval Gate / owner-approval` as a required status check
- For `main` branch rules, disable required numeric approvals
- Disable required code owner review unless another code owner can approve
- Owner-authored PRs will pass the owner gate automatically

### I accidentally committed to main locally (before pushing)

**Solution:** Reset and create a new branch

```bash
# View your commits
git log --oneline -5

# Reset main to the remote version
git reset --hard origin/main

# Create a new topic branch
git checkout -b feature/your-feature

# Cherry-pick your commits if needed
git cherry-pick <commit-hash>

# Push to your topic branch
git push origin feature/your-feature
```

## Quick Reference

| Task | Command |
|------|---------|
| Create topic branch | `git checkout -b feature/name` |
| Switch to topic branch | `git checkout feature/name` |
| View all branches | `git branch -a` |
| Delete local branch | `git branch -d feature/name` |
| Delete remote branch | `git push origin --delete feature/name` |
| Sync with main | `git pull origin main` |
| Create PR from branch | Push branch, then click "Create PR" on GitHub |

## Questions?

If you encounter issues:
1. Check this document first
2. Review the git hook error messages
3. Consult with the team lead
4. See the troubleshooting section above

---

**Policy Effective:** April 1, 2026  
**Enforced By:** Pre-commit and pre-push git hooks + GitHub branch protection
