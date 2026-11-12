# Hero intro: boot script and one-time playback

## Decision

The hero intro animation starts hidden-then-revealed without a flash of visible content. An inline
boot script in `<head>` (`INTRO_BOOT_SCRIPT`, `app/componentes/pages/home/hero-section/intro-flag.ts`)
sets `html[data-intro="play"]` before first paint. The hidden initial states in `globals.css` apply
only under that attribute, so content stays visible without JS.

## Rules

- Plays once per browser session: the flag lives in `sessionStorage` (`portfolio-gazolla:intro`).
- Skipped under `prefers-reduced-motion: reduce`: the script does not set the attribute.
- A 4 s timer removes the attribute as a last resort, so content can never stay hidden.
- The script is a constant string with no interpolated data.

## Why not `next/script` `beforeInteractive`

In the App Router, `<Script strategy="beforeInteractive">` does not emit the code inline. It
renders a tiny script that pushes the payload onto `self.__next_s`, and Next's client bootstrap
(`app-bootstrap`) injects and runs it after the main bundle loads, just before hydration. That can
be after first paint, so the hidden initial state would flash. A plain inline `<script>` in
`<head>` runs while the parser reaches it, before paint, so it stays (Next 16.4.6). The
`suppressHydrationWarning` on `<html>` stays too, because the script sets `data-intro`.

The script is rendered through `InlineScript` (`app/componentes/inline-script`), Next's documented
pattern for inline head scripts: `type="text/javascript"` on the server (it runs from the HTML) and
`type="text/plain"` when React renders the layout on the client, which silences React's dev warning
"Encountered a script tag while rendering React component" (seen on the 404 page).

## CSP

A future strict Content-Security-Policy must allow this script through a `sha256-...` hash of
`INTRO_BOOT_SCRIPT`, not `'unsafe-inline'`. Recompute the hash whenever the script changes.
