import z from "zod"
import { EOL } from "os"
import { NamedError } from "@opencode-ai/util/error"
import { logo as glyphs } from "./logo"

export namespace UI {
export const CancelledError = NamedError.create("UICancelledError", z.void())

  export const Style = {
    TEXT_HIGHLIGHT: "\x1b[96m",
    TEXT_HIGHLIGHT_BOLD: "\x1b[96m\x1b[1m",
    TEXT_DIM: "\x1b[90m",
    TEXT_DIM_BOLD: "\x1b[90m\x1b[1m",
    TEXT_NORMAL: "\x1b[0m",
    TEXT_NORMAL_BOLD: "\x1b[1m",
    TEXT_WARNING: "\x1b[93m",
    TEXT_WARNING_BOLD: "\x1b[93m\x1b[1m",
    TEXT_DANGER: "\x1b[91m",
    TEXT_DANGER_BOLD: "\x1b[91m\x1b[1m",
    TEXT_SUCCESS: "\x1b[92m",
    TEXT_SUCCESS_BOLD: "\x1b[92m\x1b[1m",
    TEXT_INFO: "\x1b[94m",
    TEXT_INFO_BOLD: "\x1b[94m\x1b[1m",
  }

  export function println(...message: string[]) {
    print(...message)
    process.stderr.write(EOL)
  }

  export function print(...message: string[]) {
    blank = false
    process.stderr.write(message.join(" "))
  }

  let blank = false
  export function empty() {
    if (blank) return
    println("" + Style.TEXT_NORMAL)
    blank = true
  }

  export function logo(pad?: string) {
    if (!process.stdout.isTTY && !process.stderr.isTTY) {
      const result = []
      for (const row of glyphs) {
        if (pad) result.push(pad)
        result.push(row)
        result.push(EOL)
      }
      return result.join("").trimEnd()
    }

    // Gradient: purple → violet → indigo → blue → cyan
    const gradientStops: Array<[number, number, number]> = [
      [168, 85, 247],
      [139, 92, 246],
      [99, 102, 241],
      [59, 130, 246],
      [6, 182, 212],
    ]

    const lerp = (a: [number, number, number], b: [number, number, number], t: number) => [
      Math.round(a[0] + (b[0] - a[0]) * t),
      Math.round(a[1] + (b[1] - a[1]) * t),
      Math.round(a[2] + (b[2] - a[2]) * t),
    ]

    const gradientColor = (t: number) => {
      const scaled = t * (gradientStops.length - 1)
      const i = Math.min(Math.floor(scaled), gradientStops.length - 2)
      const [r, g, b] = lerp(gradientStops[i], gradientStops[i + 1], scaled - i)
      return `\x1b[38;2;${r};${g};${b}m`
    }

    const reset = "\x1b[0m"
    const maxLen = Math.max(...glyphs.map((l) => l.length))
    const result: string[] = []

    for (const row of glyphs) {
      if (pad) result.push(pad)
      for (let i = 0; i < row.length; i++) {
        const char = row[i]
        if (char === " ") {
          result.push(" ")
        } else {
          result.push(gradientColor(i / maxLen), char, reset)
        }
      }
      result.push(EOL)
    }
    return result.join("").trimEnd()
  }

  export async function input(prompt: string): Promise<string> {
    const readline = require("readline")
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    return new Promise((resolve) => {
      rl.question(prompt, (answer: string) => {
        rl.close()
        resolve(answer.trim())
      })
    })
  }

  export function error(message: string) {
    if (message.startsWith("Error: ")) {
      message = message.slice("Error: ".length)
    }
    println(Style.TEXT_DANGER_BOLD + "Error: " + Style.TEXT_NORMAL + message)
  }

  export function markdown(text: string): string {
    return text
  }
}
