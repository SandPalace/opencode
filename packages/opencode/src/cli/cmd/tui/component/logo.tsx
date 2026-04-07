import { type RGBA } from "@opentui/core"
import { For, type JSX } from "solid-js"
import { logo, logoGradient } from "@/cli/logo"

function lerpColor(a: [number, number, number], b: [number, number, number], t: number): RGBA {
  return {
    r: Math.round(a[0] + (b[0] - a[0]) * t),
    g: Math.round(a[1] + (b[1] - a[1]) * t),
    b: Math.round(a[2] + (b[2] - a[2]) * t),
    a: 255,
  }
}

function gradientColor(t: number): RGBA {
  const stops = logoGradient
  const scaled = t * (stops.length - 1)
  const i = Math.min(Math.floor(scaled), stops.length - 2)
  const localT = scaled - i
  return lerpColor(stops[i], stops[i + 1], localT)
}

export function Logo() {
  const maxLen = Math.max(...logo.map((l) => l.length))

  const renderLine = (line: string): JSX.Element[] => {
    const elements: JSX.Element[] = []
    for (let i = 0; i < line.length; i++) {
      const t = line[i] === " " ? i / maxLen : i / maxLen
      const fg = gradientColor(i / maxLen)
      elements.push(
        <text fg={fg} selectable={false}>
          {line[i]}
        </text>,
      )
    }
    return elements
  }

  return (
    <box>
      <For each={logo}>
        {(line) => (
          <box flexDirection="row">
            {renderLine(line)}
          </box>
        )}
      </For>
    </box>
  )
}
