# Upstream Relationship

PIXI (pixicode) is a fork of [OpenCode](https://github.com/anomalyco/opencode), an MIT-licensed open source AI coding agent.

## Repository Setup

| Remote     | URL                                          |
|------------|----------------------------------------------|
| `origin`   | git@github.com:SandPalace/opencode.git       |
| `upstream` | git@github.com:anomalyco/opencode.git        |

## Manual Sync Instructions

```bash
# 1. Fetch latest upstream changes
git fetch upstream

# 2. Checkout your main branch
git checkout dev

# 3. Rebase onto upstream (preferred) or merge
git rebase upstream/dev
# OR: git merge upstream/dev

# 4. Resolve any conflicts (branding files should auto-resolve via .gitattributes)

# 5. Push updated branch
git push origin dev
```

## Our Files vs Upstream

### Files we own (merge=ours via .gitattributes)
- `package.json` — name, version, bin field customized for pixicode
- `src/constants/branding.ts` — PIXI brand name, tagline, ASCII logo
- `themes/pixi.json` — PIXI color theme

### Files we created (no upstream equivalent)
- `.gitattributes` — merge conflict protection
- `UPSTREAM.md` — this file
- `.github/workflows/ci.yml` — our CI pipeline
- `.github/workflows/publish.yml` — npm publish pipeline
- `.github/workflows/upstream-sync.yml` — automated sync check

### Files we modified
- `LICENSE` — added SandPalace copyright line (original preserved)

## Conflict Resolution Strategy

1. **Branding files** (`package.json`, `branding.ts`, `themes/pixi.json`): Always keep ours. The `.gitattributes` `merge=ours` driver handles this automatically.
2. **LICENSE**: If upstream modifies the license, review manually. Our added copyright line should not conflict.
3. **Everything else**: Accept upstream changes. If conflicts arise in shared code, prefer upstream unless it breaks our customizations.

## Automated Sync

A GitHub Actions workflow (`.github/workflows/upstream-sync.yml`) runs weekly to check for new upstream commits and opens a PR if the fork is behind.
