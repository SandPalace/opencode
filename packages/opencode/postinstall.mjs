#!/usr/bin/env node
import { createRequire } from "module"
import { fileURLToPath } from "url"

const require = createRequire(import.meta.url)
const fs = require("fs")
const path = require("path")
const https = require("https")
const { execSync } = require("child_process")

if (process.platform !== "win32") process.exit(0)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pkgJson = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf8"))
const version = pkgJson.version

const targetDir = path.join(__dirname, "dist", "pixicode-windows-x64", "bin")
const targetPath = path.join(targetDir, "pixi.exe")

if (fs.existsSync(targetPath)) process.exit(0)

const url = `https://github.com/sandpalace/opencode/releases/download/pixi-v${version}/pixicode-windows-x64.exe`

console.log(`Downloading pixicode Windows binary v${version}...`)

fs.mkdirSync(targetDir, { recursive: true })

function download(url, dest, redirects = 0) {
  if (redirects > 5) {
    throw new Error("Too many redirects")
  }
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        fs.unlinkSync(dest)
        return download(res.headers.location, dest, redirects + 1).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        file.close()
        fs.unlinkSync(dest)
        return reject(new Error(`HTTP ${res.statusCode}`))
      }
      res.pipe(file)
      file.on("finish", () => file.close(resolve))
      file.on("error", (err) => {
        fs.unlinkSync(dest)
        reject(err)
      })
    }).on("error", reject)
  })
}

try {
  await download(url, targetPath)
  console.log(`pixicode Windows binary installed at ${targetPath}`)
} catch (err) {
  console.warn(`Warning: Could not download pixicode Windows binary: ${err.message}`)
  console.warn(`You can manually download it from: ${url}`)
  console.warn(`And place it at: ${targetPath}`)
}
