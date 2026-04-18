# PIXI on Mac — Quick Start

A step-by-step guide to install and run PIXI on a Mac computer.

## What's inside

1. [What you need](#1-what-you-need)
2. [Open Terminal](#2-open-terminal)
3. [Install Node.js](#3-install-nodejs)
4. [Check Node.js works](#4-check-nodejs-works)
5. [Install PIXI](#5-install-pixi)
6. [Check PIXI works](#6-check-pixi-works)
7. [Run PIXI for the first time](#7-run-pixi-for-the-first-time)
8. [If something goes wrong](#if-something-goes-wrong)

---

## 1. What you need

- A Mac computer (macOS 12 or newer)
- An internet connection
- About 10 minutes

---

## 2. Open Terminal

Terminal is the app where we type commands.

1. Press **Command (⌘) + Space** on your keyboard
2. Type `Terminal`
3. Press **Enter**

A small window with text will appear. That's Terminal!

---

## 3. Install Node.js

Node.js is the program that runs PIXI. We only need to install it once.

**Option A — Easy way (recommended for kids):**

1. Go to **https://nodejs.org**
2. Click the big green button that says **LTS**
3. Open the file you downloaded (it ends in `.pkg`)
4. Click **Continue** until the installer finishes
5. Click **Install**

**Option B — Use Homebrew (if you already have it):**

In Terminal, type:

```bash
brew install node
```

---

## 4. Check Node.js works

In Terminal, type this and press **Enter**:

```bash
node --version
```

You should see something like `v20.11.0`.

Next, check npm:

```bash
npm --version
```

You should see a number like `10.2.4`. If both work, you're ready!

---

## 5. Install PIXI

In Terminal, type this and press **Enter**:

```bash
npm install -g pixicode
```

Wait a minute while it downloads. Lots of text will scroll — that's normal.

If you see a **permission error**, try this instead:

```bash
sudo npm install -g pixicode
```

Terminal will ask for your Mac password. Type it (you won't see letters appear) and press **Enter**.

---

## 6. Check PIXI works

Type this and press **Enter**:

```bash
pixi --version
```

If you see a version number, **PIXI is installed!**

---

## 7. Run PIXI for the first time

1. Make a folder for your project (or use one you already have)
2. In Terminal, go into that folder:

   ```bash
   cd ~/Desktop/my-project
   ```

3. Start PIXI:

   ```bash
   pixi
   ```

PIXI will guide you through setting up an AI provider the first time. Just follow the questions on the screen.

To quit PIXI, press `Control + C`.

---

## If something goes wrong

### "command not found: pixi"

Close Terminal and open it again. Your Mac needs to refresh after installing new tools.

### "command not found: npm"

Node.js didn't install correctly. Go back to **Step 3** and run the installer again.

### "permission denied" during install

Use `sudo` in front of the command, like this:

```bash
sudo npm install -g pixicode
```

### Still stuck?

Ask a grown-up to help, or visit **https://github.com/sandpalace/opencode** for more info.
