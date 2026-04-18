import { For, type JSX } from "solid-js"
import { logo, logoGradient } from "@/cli/logo"

function lerp(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ]
}

function gradientHex(t: number): string {
  const stops = logoGradient
  const scaled = t * (stops.length - 1)
  const i = Math.min(Math.floor(scaled), stops.length - 2)
  const [r, g, b] = lerp(stops[i], stops[i + 1], scaled - i)
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}

export function Logo() {
  const maxLen = Math.max(...logo.map((l) => l.length))

  const renderLine = (line: string): JSX.Element[] => {
    const elements: JSX.Element[] = []
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === " ") {
        elements.push(<text selectable={false}>{" "}</text>)
      } else {
        const fg = gradientHex(i / maxLen)
        elements.push(
          <text fg={fg} selectable={false}>
            {char}
          </text>,
        )
      }
    }
    return elements
  }

  return (
    <box>
      <For each={logo}>
        {(line) => <box flexDirection="row">{renderLine(line)}</box>}
      </For>
    </box>
  )
}

// Compat alias — upstream opencode references GoLogo.
export { Logo as GoLogo }
