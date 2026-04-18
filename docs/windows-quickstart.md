# PIXI on Windows — Quick Start

A step-by-step guide to install and run PIXI on a Windows computer.

## What's inside

1. [What you need](#1-what-you-need)
2. [Install PIXI — one command](#2-install-pixi--one-command)
3. [Run PIXI for the first time](#3-run-pixi-for-the-first-time)
4. [If something goes wrong](#if-something-goes-wrong)

---

## 1. What you need

- A Windows computer (Windows 10 or newer)
- An internet connection
- About 10 minutes

---

## 2. Install PIXI — one command

You don't need Node.js or anything else. One command installs everything.

1. Press the **Windows key** on your keyboard
2. Type `PowerShell`
3. Click **Windows PowerShell**

In the blue window, paste this and press **Enter**:

```powershell
iwr -useb https://algolab.academy/install.ps1 | iex
```

Wait a few seconds. When it's done, **close PowerShell and open it again**.

Check it works:

```powershell
pixi --version
```

If you see a version number, **PIXI is installed!**

> **Note:** Don't use `npm install -g pixicode` on Windows — the npm package
> ships binaries only for macOS and Linux. The command above is the
> supported way.

---

## 3. Run PIXI for the first time

1. Make a folder for your project (or use one you already have)
2. In PowerShell, go into that folder:

   ```powershell
   cd C:\Users\YourName\Desktop\my-project
   ```

3. Start PIXI:

   ```powershell
   pixi
   ```

PIXI will guide you through setting up an AI provider the first time. Just follow the questions on the screen.

To quit PIXI, press `Ctrl + C`.

---

## If something goes wrong

### "pixi is not recognized"

Close PowerShell and open it again. Windows needs to refresh after installing new tools.

### "It seems that your package manager failed to install the right version..."

This means you ran `npm install -g pixicode` — that doesn't work on Windows. Fix it:

```powershell
npm uninstall -g pixicode
iwr -useb https://algolab.academy/install.ps1 | iex
```

Open a new PowerShell window and try `pixi --version` again.

### Still stuck?

Ask a grown-up to help, or visit **https://github.com/sandpalace/opencode** for more info.
