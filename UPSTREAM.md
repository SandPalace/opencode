# Upstream Relationship

PIXI (pixicode) is a fork of [OpenCode](https://github.com/anomalyco/opencode), an MIT-licensed open source AI coding agent.

## Repository Setup

| Remote     | URL                                          |
|------------|----------------------------------------------|
| `origin`   | git@github.com:SandPalace/opencode.git       |
| `upstream` | git@github.com:anomalyco/opencode.git        |

## One-time setup (per clone)

`.gitattributes` marks PIXI-owned files with `merge=ours`. For that to actually
take effect, you must register the `ours` merge driver in your local git config
once per clone:

```bash
git config merge.ours.driver true
```

Without this, merges will silently ignore the `merge=ours` attribute and you
will see conflicts in branding files.

## Manual Sync Instructions

```bash
# 1. Fetch latest upstream changes
git fetch upstream

# 2. Checkout your main branch
git checkout dev

# 3. Merge upstream (preferred for forks — rebase rewrites our commits)
git merge upstream/dev
# If you really want a rebase: git rebase upstream/dev

# 4. Resolve any conflicts. PIXI-owned files should auto-resolve via
#    .gitattributes (assuming you did the one-time setup above).

# 5. Push updated branch
git push origin dev
```

## Our Files vs Upstream

### Files we own (merge=ours via .gitattributes)
- `packages/opencode/package.json` — name, version, bin field customized for pixicode
- `packages/opencode/src/constants/branding.ts` — PIXI brand name, tagline, ASCII logo
- `packages/opencode/src/cli/cmd/tui/context/theme/pixi.json` — TUI theme
- `packages/ui/src/theme/themes/pixi.json` — web UI theme
- `packages/opencode/bin/pixi` — renamed launcher
- `packages/opencode/postinstall.mjs` — npm install helper
- `packages/opencode/.npmignore` — publish filter
- `.github/workflows/ci.yml`, `publish.yml`, `upstream-sync.yml` — fork CI
- `README.md`, `UPSTREAM.md` — fork docs

### Files we created (no upstream equivalent)
- `.gitattributes` — merge conflict protection
- `UPSTREAM.md` — this file

### Files we modified (not auto-protected — review conflicts manually)
- `LICENSE` — added SandPalace copyright line (original preserved)
- Root `package.json`, `install` script, various asset files — review upstream diffs case by case

## Conflict Resolution Strategy

1. **Branding files** (`package.json`, `branding.ts`, `themes/pixi.json`): Always keep ours. The `.gitattributes` `merge=ours` driver handles this automatically.
2. **LICENSE**: If upstream modifies the license, review manually. Our added copyright line should not conflict.
3. **Everything else**: Accept upstream changes. If conflicts arise in shared code, prefer upstream unless it breaks our customizations.

## Automated Sync

A GitHub Actions workflow (`.github/workflows/upstream-sync.yml`) runs weekly.
It fetches `upstream/dev`, attempts a merge into a fresh `chore/upstream-sync-<date>`
branch off our `dev`, and opens a PR:

- **Clean merges** → normal PR, review and merge.
- **Conflicts** → draft PR with a WIP commit containing conflict markers;
  follow the instructions in the PR body to resolve locally and force-push.

The workflow configures `merge.ours.driver = true` before merging, so files
marked `merge=ours` in `.gitattributes` keep our version automatically.
