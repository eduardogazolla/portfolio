# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

General engineering guidelines and the development flow live in `~/.claude/CLAUDE.md`.
This file holds only what is specific to this project.

Bilingual (PT-BR / EN) personal portfolio, live at eduardogazolla.dev. Content comes from Hygraph; the contact form posts to a Discord webhook.

## Stack
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 3 (PostCSS/Autoprefixer), `motion` (Framer Motion's successor package)
- Hygraph (GraphCMS) as content source, PT-BR / EN locales
- react-hook-form + Zod
- Jest + Testing Library (unit), Playwright + axe-core (E2E)

## Commands
- `npm run dev`: dev server (needs `.env` with `HYGRAPH_URL`, `HYGRAPH_TOKEN`, `WEBHOOK_URL`, see `.env.example`)
- `npm run build`: production build (also fetches the CMS, since `generateStaticParams` runs)
- `npm run lint`: ESLint
- `npm test`: Jest. Single file: `npx jest tests/utils/locale.test.ts`; single test: `npx jest -t "name"`
- `npm run test:e2e`: Playwright. It builds and starts the app on port 3200 (`E2E_PORT`), with `desktop` and `mobile` projects. Single spec: `npx playwright test e2e/home.spec.ts --project=desktop`
- `npm run cv:build`: regenerates the CV PDFs (requires Node 22.18+)

## Architecture

### Content and locales
- Pages (`app/page.tsx`, `app/projects/...`) are async server components. They fetch the **PT and EN versions in one query** (aliased fields such as `ptPages` / `enPages`, with `locales: [pt_BR, en]` / `[en, pt_BR]`) and pass both to a `*-client.tsx` component.
- The active locale is client-only state (`app/componentes/context/language-context.tsx`, kept in localStorage via `useSyncExternalStore`). Switching language never refetches. Client components pick content with `pickLocale(pt, en, locale)` (`app/utils/locale.ts`): EN falls back to PT field by field, while arrays and rich text (`{ raw }`) are replaced whole.
- UI strings live only in `app/utils/translations.ts`, never in the CMS or inline in components. E2E specs assert against these dictionaries (`e2e/strings.ts`), never against CMS copy, and default to `pt-BR`.
- Only show fields that exist in the Hygraph schema. A new field on screen requires an explicit CMS change proposal first.
- All Hygraph access goes through `fetchHygraphQuery` (`app/utils/fetch-hygraph-query.ts`). Pass dynamic values as GraphQL `variables`, never by interpolation. Use 24 h `revalidate`. Inline queries must stay in sync with `specs/002-redesign/contracts/hygraph-queries.graphql`. Per-caller error handling is documented in `docs/architecture/cms-data-fetching.md`: pages throw, the layout's socials degrade, `generateStaticParams` fails the build.

### Other pieces worth knowing
- `app/componentes/` (Portuguese spelling, keep it) holds shared components plus `pages/<route>/` for route-specific ones. The `@/` alias maps to the repo root.
- `app/api/contact/route.ts` re-validates input with the same Zod schema as the client (`app/lib/contact-schema.ts`), caps the body size, rejects cross-origin requests and returns `{ ok, error }` codes.
- Hero intro: an inline boot script sets `html[data-intro="play"]` before first paint. Don't swap it for `next/script` (see `docs/architecture/hero-intro.md`).
- CVs: `cv/source/content.ts` is the single source, rendered by `scripts/build-cv.mjs`. The designed PDFs in `public/cv` are **generated and committed**, so rerun `npm run cv:build` after editing the sources. ATS PDFs (`cv/ats`) are private and gitignored. `tests/cv/cv.test.ts` guards against leaking the employer's client name, phone numbers and similar data. Sources import each other with `.ts` extensions on purpose. See `docs/architecture/cv-generation.md`.

## Design and specs
- Spec Kit is set up (`.specify/`, `specs/NNN-*`). The active feature is in `.specify/feature.json`. The project rules are in `.specify/memory/constitution.md` (PT). Key rules:
  - Design tokens only: no loose hex, font size or duration values in components.
  - A single accent colour.
  - At most one cinematic moment per page.
  - WCAG 2.2 AA, with a visible focus ring at all times.
  - Animate only `transform`/`opacity`, respect `prefers-reduced-motion`, and keep hover motion behind `(hover: hover) and (pointer: fine)`.
- Architecture decisions go in `docs/architecture/`.
