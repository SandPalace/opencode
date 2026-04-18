# PIXI on Windows — Quick Start

A step-by-step guide to install and run PIXI on a Windows computer.

## What's inside

1. [What you need](#1-what-you-need)
2. [Fastest way — one command](#2-fastest-way--one-command)
3. [Other way — Install Node.js first](#3-other-way--install-nodejs-first)
4. [Run PIXI for the first time](#4-run-pixi-for-the-first-time)
5. [If something goes wrong](#if-something-goes-wrong)

---

## 1. What you need

- A Windows computer (Windows 10 or newer)
- An internet connection
- About 10 minutes

---

## 2. Fastest way — one command

This is the easiest way. It doesn't need Node.js.

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

If you see a version number, **PIXI is installed!** Skip to [step 4](#4-run-pixi-for-the-first-time).

---

## 3. Other way — Install Node.js first

Use this only if step 2 didn't work.

### 3a. Install Node.js

1. Go to **https://nodejs.org**
2. Click the big green button that says **LTS**
3. Open the file you downloaded (ends in `.msi`)
4. Click **Next** until it finishes, then **Finish**

### 3b. Check it works

Open **PowerShell** and type:

```powershell
node --version
```

Then:

```powershell
npm --version
```

Both should show a version number.

### 3c. Install PIXI

```powershell
npm install -g pixicode
```

### 3d. Check PIXI works

```powershell
pixi --version
```

---

## 4. Run PIXI for the first time

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

### "npm is not recognized"

Node.js didn't install correctly. Go back to **Step 2** and run the installer again.

### Still stuck?

Ask a grown-up to help, or visit **https://github.com/sandpalace/opencode** for more info.
