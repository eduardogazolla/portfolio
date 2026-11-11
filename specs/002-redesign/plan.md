# Implementation Plan: Redesign do portfólio

**Branch**: uma por parte (ver abaixo), cada uma com PR para `dev` | **Date**: 2026-11-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-redesign/spec.md`

## Summary

Levar o portfólio para a direção aprovada no Figma: editorial e minimalista, um accent (Cobalto),
Bricolage Grotesque + Geist, o contorno de inspeção como assinatura, formulário com estados inline
e motion com propósito e fallback para reduzir movimento. A abordagem é incremental, em 7 partes
mergeadas uma a uma em `dev`:

- a Parte 0 atualiza a base (React 19, Motion, ESLint 9 flat);
- as Partes 1–2 criam tokens e componentes;
- as Partes 3–5 refazem as telas;
- a Parte 6 fecha motion e a suíte E2E.

O conteúdo continua vindo do Hygraph. Entram `Project.context` e `Social.name` nas queries, e o
`slug` passa a ir como variável.

## Technical Context

**Language/Version**: TypeScript 5 (strict) em Node ≥ 20.9

**Primary Dependencies**:
- Next.js 16 (App Router; sobe para a última 16.x);
- React 19 (Parte 0);
- Tailwind CSS 3.4;
- `motion` ^14 (substitui `framer-motion` 10);
- react-hook-form 7.9x + `@hookform/resolvers` 5 + zod 3;
- `next/font` (Bricolage Grotesque, Geist, IBM Plex Mono).

**Storage**: N/A. Conteúdo no Hygraph (GraphQL, revalidação de 24 h); preferência de idioma no
`localStorage`; flag da entrada do hero no `sessionStorage`.

**Testing**: Jest 30 + Testing Library (unitários e componentes, em `tests/`); `@playwright/test` +
`@axe-core/playwright` (E2E em `e2e/`, a partir da Parte 6); Playwright MCP para verificação
visual por parte.

**Target Platform**: navegadores modernos (Chrome, Safari, Firefox, Edge), desktop e mobile;
deploy na Vercel.

**Project Type**: aplicação web (Next.js full-stack, uma rota de API).

**Performance Goals**: Lighthouse mobile com Performance ≥ 90 e Acessibilidade 100; LCP < 2,5 s;
CLS < 0,1; animações a 60 fps (só `transform`/`opacity`).

**Constraints**: WCAG 2.2 AA; reduzir movimento em toda animação; sem rolagem horizontal de
360 a 1920 px; só campos existentes no Hygraph; strings de interface em PT/EN.

**Scale/Scope**: 4 rotas (Home, `/projects`, `/projects/[slug]`, 404), cerca de 12 componentes
de UI novos ou refeitos, 1 projeto e 3 experiências no CMS hoje.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Como o plano cumpre | Status |
|-----------|---------------------|--------|
| I. Conteúdo vem do Hygraph | Tudo vem das queries do [contrato](./contracts/hygraph-queries.graphql). `context` foi criado no CMS antes de entrar no design. Strings de interface ficam em `app/utils/translations.ts`. Fallback PT por campo. | ✅ |
| II. Renderização e performance | Server components buscam dados com revalidação de 24 h; `next/font` e `next/image`; metas de performance no quickstart V14. | ✅ |
| III. Contenção editorial | Tokens só em `globals.css` + `tailwind.config.js`; accent por alias; um momento cinematográfico por página (hero, destaque, imagem do detalhe, 404). | ✅ |
| IV. Acessibilidade | Focus ring global, skip link, `aria-live` no form, `aria-hidden` nos decorativos, sanfona e menu com ARIA; axe no E2E. | ✅ |
| V. Motion com propósito | Tabela do board 12:21 com coluna "menos movimento"; só `transform`/`opacity`; corrige header e back-to-top que animam `top`/`right`. | ✅ |
| VI. Testes | TDD nas regras do data-model §2; teste de componente para cada interativo; Playwright nas jornadas da constitution. | ✅ |
| VII. Arquitetura e TS | Páginas buscam dados; componentes em `app/componentes/`; tipos em `app/types/` sem `any` (hoje há 4 ocorrências, que saem). | ✅ |
| VIII. Segurança | `slug` vira variável GraphQL; mesmo schema zod no cliente e no servidor; respostas genéricas ([contrato](./contracts/contact-api.md)). | ✅ |
| Restrições técnicas | ESLint 9 flat, Tailwind 3, npm único (`yarn.lock` sai). | ✅ |
| Gates de PR | lint, test e build em todo PR; E2E a partir da Parte 6 (ver Complexity Tracking). | ⚠️ justificado |

**Re-check pós-design (Phase 1)**: data-model, contratos e quickstart não introduzem violações
novas. As queries do contrato foram executadas com sucesso contra o Hygraph em 2026-11-11.

## Partes de implementação

Cada parte = uma branch a partir de `dev` atualizado, um PR para `dev` e merge antes da próxima.
Toda parte termina com os gates do [quickstart](./quickstart.md), revisão (`/code-review` +
`frontend-reviewer` quando há UI) e verificação visual.

| # | Branch | Escopo | Principais arquivos |
|---|--------|--------|---------------------|
| 0 | `chore/react-19` | React 19 + tipos; `framer-motion` → `motion` (imports `motion/react`); Next última 16.x; ESLint 9 flat sem Rocketseat (`eslint.config.mjs`, `"lint": "eslint ."`); `@hookform/resolvers` 5; remover `yarn.lock`; corrigir erros de tipo e de lint. Sem mudança visual. | `package.json`, `eslint.config.mjs`, `.eslintrc.json` (sai), 14 arquivos com `framer-motion` |
| 1 | `feat/redesign-tokens` | CSS vars e mapeamento no Tailwind (data-model §1); fontes via `next/font`; tokens de motion em `app/lib/motion.ts`; focus ring global; scrollbar e seleção no tema novo. | `app/globals.css`, `tailwind.config.js`, `app/layout.tsx`, `app/lib/motion.ts` |
| 2 | `feat/redesign-components` | InspectOutline (estático, hover, tracejado, focus), Button (primary/secondary/loading, press 0,97), Link com seta, NavItem, LanguageSwitch (pílula com spring), Input/Textarea (label, helper, erro), SectionTitle (112/64 com `clamp`), TechBadge, BackToTop (só transform/opacity), SkipLink. Testes de componente para cada um. | `app/componentes/*` |
| 3 | `feat/redesign-home` | Header + menu mobile; Hero com a entrada orquestrada (uma vez por sessão); Stack; Projetos em destaque; Experiência (atual + sanfona); Footer; regras do data-model §2 com TDD; queries com `Social.name`, `context` e `orderBy`. | `app/page.tsx`, `app/componentes/header/*`, `app/componentes/pages/home/*`, `app/utils/*` |
| 4 | `feat/redesign-projects` | `/projects` (destaque e lista 4+ com filtros/contador/prévia do cursor); detalhe (contexto, links, seções, "único projeto"); 404 tracejado; `fetchHygraphQuery` com `variables` e tratamento de `errors`; faixa "Vamos conversar?" nas páginas internas. | `app/projects/**`, `app/not-found.tsx`, `app/utils/fetch-hygraph-query.ts`, `app/componentes/pages/project*/*` |
| 5 | `feat/redesign-contact-form` | Form com a máquina de estados do data-model §3; `app/lib/contact-schema.ts` compartilhado; rota com as respostas do contrato; remover `react-hot-toast` e `app/componentes/toaster`. | `app/componentes/contact-form/*`, `app/api/contact/route.ts`, `app/layout.tsx` |
| 6 | `feat/redesign-motion` | Completar a tabela do board 12:21 (troca de página, destaque ligado à rolagem, imagem do detalhe, ponto pulsante); revisão de reduzir movimento; Playwright + axe nas jornadas (quickstart V1–V15); script `test:e2e`. | `e2e/*`, `playwright.config.ts`, componentes com motion |

## Project Structure

### Documentation (this feature)

```text
specs/002-redesign/
├── plan.md              # este arquivo
├── research.md          # Phase 0
├── data-model.md        # Phase 1: tokens, CMS, estados de UI
├── quickstart.md        # Phase 1: cenários de validação
├── contracts/
│   ├── hygraph-queries.graphql
│   └── contact-api.md
├── checklists/requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
app/
├── layout.tsx                      # fontes, providers, skip link, header/footer
├── globals.css                     # tokens (CSS vars), focus ring, base
├── page.tsx                        # Home: query + HomeClient
├── not-found.tsx                   # 404 tracejado
├── api/contact/route.ts            # POST /api/contact (contrato)
├── projects/
│   ├── page.tsx                    # lista: destaque ou 4+
│   └── [slug]/page.tsx             # detalhe (slug como variável)
├── componentes/
│   ├── inspect-outline/            # novo: assinatura + focus ring
│   ├── button/ link/ tech-badge/ section-title/ back-to-top/   # refeitos
│   ├── skip-link/                  # novo
│   ├── form/                       # novo: Input, Textarea
│   ├── header/                     # nav, language switch, menu mobile
│   ├── footer/
│   ├── contact-form/               # estados inline
│   ├── contact-band/               # novo: "Vamos conversar?" nas páginas internas
│   └── pages/{home,projects,project}/
├── lib/
│   ├── motion.ts                   # novo: tokens de motion em TS
│   ├── contact-schema.ts           # novo: zod compartilhado
│   └── utils.ts                    # cn (clsx + tailwind-merge)
├── types/                          # + context, Social.name
└── utils/
    ├── fetch-hygraph-query.ts      # + variables, tratamento de errors
    ├── translations.ts             # strings PT/EN novas
    ├── experience.ts               # novo: getCurrentExperience, formatDuration, formatPeriod
    ├── projects-layout.ts          # novo: getProjectsLayout, filterProjectsByTech
    └── socials.ts                  # novo: getSocialLabel

tests/                              # Jest (unitários + componentes)
e2e/                                # Playwright (Parte 6)
```

**Structure Decision**: mantém o App Router atual e as pastas da constitution (`app/componentes`,
`app/types`, `app/utils`, `app/lib`, `tests/`), acrescentando só `e2e/` e os componentes novos.
Os componentes que perdem o uso (`divider`, `cms-icon`, `toaster`, `react-icons` onde houver
setas próprias) são removidos na parte em que ficarem órfãos.

## Riscos

- **Upgrade de motion (10 → 14)** com animações existentes: mitigado porque a Parte 0 não muda
  o visual e verifica as telas atuais.
- **Fidelidade do hero no mobile** (nome em 64 px + foto): checar em 360 px já na Parte 3.
- **Dados do CMS**: as 3 socials estão sem `name` (o fallback cobre) e o título do projeto no CMS
  é "Hour Sync - Controle Ponto" (o design mostra "Hour Sync"). Ajuste de conteúdo fica com o
  Eduardo.
- **Token com permissão de schema no `.env`**: o mesmo token de leitura do site altera o schema.
  Recomendação: separar um token só de leitura para o site (ação do Eduardo no Hygraph).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Gate "E2E verdes" não se aplica às Partes 0–5 | A suíte E2E cobre as telas novas e só fica estável quando todas existem (Parte 6) | Escrever E2E sobre telas que serão refeitas na parte seguinte geraria retrabalho; até lá, a verificação é manual via Playwright MCP e fica registrada no PR |
