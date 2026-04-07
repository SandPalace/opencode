<h1 align="center">🧩 PIXI</h1>
<p align="center">AI-powered coding assistant for the terminal.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/pixicode"><img alt="npm version" src="https://img.shields.io/npm/v/pixicode?style=flat-square" /></a>
  <a href="https://github.com/sandpalace/opencode/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/sandpalace/opencode/ci.yml?style=flat-square&label=CI" /></a>
  <a href="https://github.com/sandpalace/opencode/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" /></a>
</p>

---

## Quick Start

```bash
# Run directly (no install needed)
npx pixicode

# Or install globally
npm install -g pixicode
pixicode
```

## What is PIXI?

PIXI is a terminal-based AI coding assistant that helps you write, debug, and refactor code directly from your command line. It supports multiple AI providers and gives you a rich TUI (terminal user interface) experience.

### Features

- **Multi-provider AI** — Works with Anthropic, OpenAI, AWS Bedrock, Google Gemini, and more
- **Rich terminal UI** — Interactive TUI with syntax highlighting, file diffs, and conversation history
- **Tool use** — AI can read/write files, run commands, search code, and more
- **Session management** — Save and resume coding sessions
- **MCP support** — Extensible via Model Context Protocol servers
- **Customizable** — Configure themes, keybindings, providers, and models

## Configuration

On first run, PIXI will guide you through setting up your AI provider. You can also configure it manually:

```bash
# Set your preferred provider
export ANTHROPIC_API_KEY="sk-..."
# or
export OPENAI_API_KEY="sk-..."
```

Run `pixicode` and select your provider and model from the settings menu.

## Attribution

PIXI is built on [OpenCode](https://github.com/anomalyco/opencode), an open-source AI coding agent. Licensed under MIT.

## License

[MIT](LICENSE) — Copyright (c) 2025 OpenCode, Copyright (c) 2026 SandPalace
