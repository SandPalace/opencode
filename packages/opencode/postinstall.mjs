#!/usr/bin/env node
import { createRequire } from "module"
import { fileURLToPath } from "url"

const require = createRequire(import.meta.url)
const fs = require("fs")
const path = require("path")
const https = require("https")
const childProcess = require("child_process")
const os = require("os")

if (process.platform !== "win32") process.exit(0)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pkgJson = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf8"))
const version = pkgJson.version

const arch = os.arch() === "arm64" ? "arm64" : "x64"

function supportsAvx2() {
  if (arch !== "x64") return false
  const cmd =
    '(Add-Type -MemberDefinition "[DllImport(""kernel32.dll"")] public static extern bool IsProcessorFeaturePresent(int ProcessorFeature);" -Name Kernel32 -Namespace Win32 -PassThru)::IsProcessorFeaturePresent(40)'
  for (const exe of ["powershell.exe", "pwsh.exe", "pwsh", "powershell"]) {
    try {
      const result = childProcess.spawnSync(exe, ["-NoProfile", "-NonInteractive", "-Command", cmd], {
        encoding: "utf8",
        timeout: 3000,
        windowsHide: true,
      })
      if (result.status !== 0) continue
      const out = (result.stdout || "").trim().toLowerCase()
      if (out === "true" || out === "1") return true
      if (out === "false" || out === "0") return false
    } catch {
      continue
    }
  }
  return false
}

// Match the wrapper's preference order so the first successful download is the one it will pick up.
function candidateVariants() {
  if (arch === "arm64") return ["pixicode-windows-arm64"]
  return supportsAvx2()
    ? ["pixicode-windows-x64", "pixicode-windows-x64-baseline"]
    : ["pixicode-windows-x64-baseline", "pixicode-windows-x64"]
}

function download(url, dest, redirects = 0) {
  if (redirects > 5) return Promise.reject(new Error("Too many redirects"))
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https
      .get(url, { headers: { "User-Agent": "pixicode-postinstall" } }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close()
          fs.unlinkSync(dest)
          return download(res.headers.location, dest, redirects + 1).then(resolve).catch(reject)
        }
        if (res.statusCode !== 200) {
          file.close()
          try {
            fs.unlinkSync(dest)
          } catch {
            // ignore
          }
          return reject(new Error(`HTTP ${res.statusCode}`))
        }
        res.pipe(file)
        file.on("finish", () => file.close(resolve))
        file.on("error", (err) => {
          try {
            fs.unlinkSync(dest)
          } catch {
            // ignore
          }
          reject(err)
        })
      })
      .on("error", reject)
  })
}

const variants = candidateVariants()

// If any variant is already on disk, the wrapper will find it — nothing to do.
for (const name of variants) {
  const existing = path.join(__dirname, "dist", name, "bin", "pixi.exe")
  if (fs.existsSync(existing)) process.exit(0)
}

const errors = []
for (const name of variants) {
  const targetDir = path.join(__dirname, "dist", name, "bin")
  const targetPath = path.join(targetDir, "pixi.exe")
  const url = `https://github.com/sandpalace/opencode/releases/download/pixi-v${version}/${name}.exe`

  console.log(`Downloading ${name} v${version}...`)
  fs.mkdirSync(targetDir, { recursive: true })
  try {
    await download(url, targetPath)
    console.log(`pixicode Windows binary installed at ${targetPath}`)
    process.exit(0)
  } catch (err) {
    errors.push(`${name}: ${err.message}`)
    try {
      fs.unlinkSync(targetPath)
    } catch {
      // ignore
    }
  }
}

console.warn("")
console.warn("Could not download a pixicode Windows binary:")
for (const e of errors) console.warn(`  ${e}`)
console.warn("")
console.warn("Install PIXI with the native installer instead:")
console.warn("")
console.warn("  iwr -useb https://algolab.academy/install.ps1 | iex")
console.warn("")
console.warn("See https://github.com/sandpalace/opencode/blob/dev/docs/windows-quickstart.md")
// Exit 0 so npm install does not fail — the wrapper will print the same guidance at runtime.
process.exit(0)
