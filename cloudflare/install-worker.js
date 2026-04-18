// PIXI install-script proxy — Cloudflare Worker
//
// Route: algolab.academy/install.ps1  (and /install for friendly fallback)
// Serves the current install.ps1 from the main branch of sandpalace/opencode
// as text/plain so `iwr -useb | iex` reads it cleanly.
//
// Deploy: see cloudflare/README.md

const RAW_SOURCE = 'https://raw.githubusercontent.com/sandpalace/opencode/dev/install.ps1'
const CACHE_SECONDS = 300

export default {
  async fetch(request) {
    const url = new URL(request.url)
    const wantsPowerShell = url.pathname === '/install.ps1' || url.pathname === '/install'

    if (!wantsPowerShell) {
      return new Response('Not found', { status: 404 })
    }

    try {
      const upstream = await fetch(RAW_SOURCE, {
        cf: { cacheTtl: CACHE_SECONDS, cacheEverything: true },
      })

      if (!upstream.ok) {
        return new Response(
          `Failed to fetch install.ps1 (upstream ${upstream.status}). See https://github.com/sandpalace/opencode\n`,
          { status: 502, headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
        )
      }

      const body = await upstream.text()
      return new Response(body, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': `public, max-age=60, s-maxage=${CACHE_SECONDS}`,
          'X-Content-Type-Options': 'nosniff',
        },
      })
    } catch (err) {
      return new Response(
        `Install script temporarily unavailable: ${err.message}\nSee https://github.com/sandpalace/opencode\n`,
        { status: 502, headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
      )
    }
  },
}
