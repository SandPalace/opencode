# Cloudflare — `algolab.academy/install.ps1`

This directory hosts the Cloudflare Worker that serves the PIXI Windows installer at
`https://algolab.academy/install.ps1`.

## What it does

`install-worker.js` fetches the current `install.ps1` from the `main` branch of
`sandpalace/opencode` and serves it with `Content-Type: text/plain; charset=utf-8`
so PowerShell's `iwr -useb | iex` reads it cleanly. It caches at the Cloudflare
edge for 5 minutes so release updates propagate quickly without hammering raw.githubusercontent.

## Deploy (one-time)

Option A — Cloudflare dashboard (no local tools):

1. Open **Workers & Pages** → **Create application**.
2. Under **Ship something new**, choose **Start with Hello World!** (this
   is the Worker path — the other options are for Pages/static sites).
3. Name it `pixi-install`, click **Deploy**.
4. On the success screen click **Edit code** (or **Continue to project**
   → **Edit code**).
5. Delete the `Hello World` starter, paste the full contents of
   `install-worker.js`, click **Deploy**.
6. Back on the Worker overview → **Settings** → **Domains & Routes** →
   **Add** → **Route**:
   - Zone: `algolab.academy`
   - Route: `algolab.academy/install.ps1*`
   - (Optional second route) `algolab.academy/install` as a friendly alias.
7. Pre-flight: confirm `algolab.academy` is added as a zone in the same
   Cloudflare account, and its DNS record is proxied (orange cloud).
   Without the orange cloud the route won't fire.

Option B — Wrangler (local):

```bash
cd cloudflare
npx wrangler deploy install-worker.js \
  --name pixi-install \
  --route 'algolab.academy/install.ps1*'
```

## Verify deploy

```bash
curl -sI https://algolab.academy/install.ps1 | head -5
```

Expect `HTTP/2 200` and `content-type: text/plain; charset=utf-8`. The body
should start with `# PIXI Windows Installer`.

## Windows smoke test

Run these after the Worker is live.

1. **Fresh Windows 11 x64, no Node.js installed.**
   Open PowerShell, paste:

   ```powershell
   iwr -useb https://algolab.academy/install.ps1 | iex
   ```

   Close PowerShell, open a new one, run `pixi --version`. Expect a version
   number.

2. **Re-run the one-liner** in the same VM. Confirm the user PATH still
   contains `%LOCALAPPDATA%\pixicode\bin` exactly once (check with
   `[Environment]::GetEnvironmentVariable('Path','User')`).

3. **`pixicode` alias.** Run `pixicode --version` — should match `pixi --version`.

4. **ARM64.** If an ARM64 VM is available, repeat step 1. Otherwise, manually
   confirm the asset URL resolves:

   ```powershell
   $env:PIXI_VERSION = '<known-version>'
   iwr -useb https://algolab.academy/install.ps1 | iex
   ```

   Check the printed `Source:` line references `pixicode-windows-arm64.exe`
   on an ARM host.

5. **SmartScreen.** First run of `pixi` may trigger "Windows protected your
   PC." Note whether this happens — if yes, the fix is an Authenticode
   code-signing certificate (tracked separately).

## Updating the installer

The Worker reads `install.ps1` from `dev` (this repo's default branch). Merging a change to `main` is
enough — edge cache flushes in ~5 minutes. To force an immediate refresh,
purge the Worker route in the Cloudflare dashboard: **Caching** → **Configuration**
→ **Purge by URL** → `https://algolab.academy/install.ps1`.
