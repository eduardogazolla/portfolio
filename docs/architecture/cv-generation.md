# CV generation

## Decision
The CVs are generated from code instead of being edited by hand in a design tool.

- `cv/source/content.ts` is the single source of truth. It holds the QA and Java CVs, in PT and EN, as typed data (`cv/source/types.ts`).
- There are two renderers for the same content:
  - `template.ts` renders the designed one-page CV, with the portfolio's fonts and colours.
  - `template-ats.ts` renders a plain ATS version: one column, Arial, standard headings, no images or letter-spacing.
- `scripts/build-cv.mjs` (`npm run cv:build`) prints the PDFs with Playwright's Chromium, which is already a dev dependency.
  - Node 22.18+ runs the `.ts` sources directly through type stripping, so there is no compile step. That is why imports between the sources use the `.ts` extension (`allowImportingTsExtensions` in tsconfig).

## Outputs
| Output | Where | Tracked |
|---|---|---|
| Designed CVs | `public/cv/eduardo-gazolla-cv-{qa,java}-{pt,en}.pdf` | Yes, served by the site |
| ATS CVs | `cv/ats/*-ats.pdf` | No (gitignored, private) |

`public/cv` holds **generated, committed artifacts**. After you edit `content.ts`, a template or `photo.jpg`, run `npm run cv:build` and commit the new PDFs.

The build checks each designed CV:
- **It fails** if a CV overflows one A4 page or the web fonts did not load. When that happens, the previous PDF is kept.
- **It never writes a broken render** to `public/cv`.

## Site integration
- `app/componentes/cv-download` builds its links with `cvFileName()` from `cv/source/html.ts`, so the file names live in a single place.
- It shows only the versions in the site's current language.

## Guards
`tests/cv/cv.test.ts`:
- **Leaks:** fails if any public CV contains the client or its brands (stored as SHA-256 hashes, so the public repo doesn't name them), internal jargon or a phone number.
- **Escaping:** checks that all content is HTML-escaped.
- **Links:** checks that only `https:` and `mailto:` links are allowed.
- **ATS output:** checks it has no images, tables or letter-spacing.
