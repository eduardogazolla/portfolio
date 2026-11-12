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

## CSP

A future strict Content-Security-Policy must allow this script through a `sha256-...` hash of
`INTRO_BOOT_SCRIPT`, not `'unsafe-inline'`. Recompute the hash whenever the script changes.
