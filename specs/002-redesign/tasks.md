---
description: "Tasks do redesign do portfólio (002)"
---

# Tasks: Redesign do portfólio

**Input**: Documentos de design em `specs/002-redesign/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: obrigatórios pela constitution (VI). Regras de negócio são feitas com TDD: o teste é
escrito e **falha** antes da implementação. Todo componente interativo tem teste com Testing
Library, consultando por papel e nome acessível. E2E com Playwright entram na fase final.

**Organization**: as fases seguem as **partes/branches** do plano. Cada parte vira um PR para
`dev` e é mergeada antes da próxima. Dentro de cada parte, as tarefas levam o rótulo da user story
que atendem.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependência pendente)
- **[Story]**: user story do spec (US1–US8)
- Caminhos relativos à raiz do repositório

## Mapa parte → fase → stories

| Parte / branch | Fase | Stories |
|----------------|------|---------|
| 0 `chore/react-19` | 1 Setup | — |
| 1 `feat/redesign-tokens` + 2 `feat/redesign-components` | 2 Foundational | base de US1–US8 (focus ring e skip link de US8) |
| 3 `feat/redesign-home` | 3, 4, 5 | US1, US6, US3 (+ US5 na Home) |
| 4 `feat/redesign-projects` | 6, 7 | US4, US7 |
| 5 `feat/redesign-contact-form` | 8 | US2 |
| 6 `feat/redesign-motion` | 9 Polish | US8 completo, E2E de tudo |

---

## Phase 1: Setup — Parte 0 `chore/react-19` (sem mudança visual)

**Purpose**: alinhar a base (React 19, Motion, ESLint 9 flat) antes de qualquer tela.

- [ ] T001 Criar a branch `chore/react-19` a partir de `dev` atualizado e registrar o estado atual: rodar `npm test` e `npm run build` e anotar o resultado no PR (o `npm run lint` falha hoje porque o Next 16 removeu o `next lint`)
- [ ] T002 Atualizar `react` e `react-dom` para ^19.3, `@types/react` e `@types/react-dom` para ^19.3 e `next` para a última 16.x com `npm install` (o `package.json` e o `package-lock.json` mudam juntos)
- [ ] T003 Trocar `framer-motion` por `motion` ^14 (`npm uninstall framer-motion && npm install motion`) e substituir `from "framer-motion"` por `from "motion/react"` nos 14 arquivos de `app/` e `tests/` que o importam (`grep -rl framer-motion app tests`)
- [ ] T004 Atualizar `react-hook-form` para ^7.92 e `@hookform/resolvers` para ^5 em `package.json`; conferir que `zodResolver` continua importado de `@hookform/resolvers/zod` em `app/componentes/contact-form/index.tsx`
- [ ] T005 Migrar o lint: instalar `eslint@^9` e `eslint-config-next` na mesma versão do `next`; criar `eslint.config.mjs` com `defineConfig([...nextVitals, ...nextTs, globalIgnores(['.next/**','out/**','build/**','next-env.d.ts','.specify/**','coverage/**'])])`; remover `.eslintrc.json` e `@rocketseat/eslint-config`; trocar o script para `"lint": "eslint ."` em `package.json`
- [ ] T006 Mover `eslint`, `@types/*`, `typescript`, `autoprefixer`, `postcss` e `tailwindcss` para `devDependencies` em `package.json`, e atualizar `tailwindcss` para a última 3.4.x (continua na v3)
- [ ] T007 Remover `yarn.lock` do repositório (npm é o único gerenciador, pela constitution)
- [ ] T008 Corrigir os erros de tipo do React 19 (`JSX` global → `React.JSX`, `useRef` sem argumento, `ref` em props) rodando `npx tsc --noEmit` até zerar, sem usar `any`
- [ ] T009 Corrigir os erros e warnings do novo lint (`npm run lint`) em `app/` e `tests/`, incluindo as 4 ocorrências de `any`/`eslint-disable` em `app/` (tipar as respostas do Hygraph em `app/page.tsx` com os tipos de `app/types/page-info.ts`)
- [ ] T010 Verificar a Parte 0: `npm run lint`, `npm test` e `npm run build` verdes; `npm ls react react-dom` sem erro de peer; smoke via Playwright MCP em `/`, `/projects`, `/projects/hour-sync` e troca PT/EN, com aparência igual à de antes e console sem erros. Abrir o PR para `dev`

**Checkpoint**: base atualizada, lint funcionando, visual inalterado.

---

## Phase 2: Foundational — Partes 1 e 2

**Purpose**: tokens, fontes e componentes base que todas as telas usam.

**⚠️ CRITICAL**: nenhuma tela nova começa antes desta fase.

### Parte 1 `feat/redesign-tokens`

- [x] T011 Ler no Figma o valor exato da cor de erro no componente Input / State=Error (nó `5:101`, fileKey `nuxSe49ViC40aYOcI0nImY`) e confirmar contraste ≥ 4,5:1 sobre `#050505`; registrar em `specs/002-redesign/data-model.md` §1 (token `danger`)
- [x] T012 Declarar os tokens como CSS vars em `:root` de `app/globals.css`: `--color-bg #050505`, `--color-surface #111113`, `--color-line #232327`, `--color-text #F2F2EF`, `--color-text-muted #8B8B92`, `--accent-cobalto #5B6BFF`, `--accent-laranja #FF5A1F`, `--accent-lima #C8FF2E`, `--color-accent var(--accent-cobalto)`, `--color-on-accent #050505`, `--color-danger` (T011); motion `--duration-fast 140ms`, `--duration-base 220ms`, `--duration-slow 700ms`, `--ease-out cubic-bezier(0.22, 1, 0.36, 1)`, `--ease-in-out cubic-bezier(0.65, 0, 0.35, 1)`; `body` com `bg`/`text`; seleção de texto e scrollbar no tema novo
- [x] T013 Mapear os tokens em `tailwind.config.js`:
  - cores (`bg`, `surface`, `line`, `text`, `text-muted`, `accent`, `on-accent`, `danger` via `var()`);
  - `fontFamily` (`display`, `sans`, `mono`);
  - `fontSize` `display-xl` (176/0.88/-4px), `display-l` (112/0.92/-3px), `h1` (64/1/-2px), `h2` (40/1.1/-1px), `h3` (24/1.25/-0.5px), `body-l` (20/1.5), `body-m` (16/1.6), `label-m` (14/1.4, 500), `mono-s` (13/1.4);
  - `borderRadius` `sm 6px`, `md 14px`;
  - `transitionDuration` e `transitionTimingFunction` com as CSS vars;
  - `spacing.40 = 160px`;
  - `maxWidth.content = 1200px`;
  - remover `hero-image` e `shadow-button`.
- [x] T014 Trocar as fontes em `app/layout.tsx`: remover `Inter`; adicionar `Bricolage_Grotesque` (pesos 600/700/800, `axes: ['opsz']` se exigido pelo tipo, `variable: '--font-display'`), `Geist` (400/500, `--font-sans`) e manter `IBM_Plex_Mono` (400, `--font-mono`), todas com `display: 'swap'`
- [x] T015 [P] Criar `app/lib/motion.ts` exportando `duration = { fast: 0.14, base: 0.22, slow: 0.7 }`, `ease = { out: [0.22, 1, 0.36, 1], inOut: [0.65, 0, 0.35, 1] }`, `spring = { ui: { type: 'spring', stiffness: 500, damping: 35 }, cursor: { type: 'spring', stiffness: 300, damping: 30 } }`, e substituir `app/lib/animations.ts` (que anima a partir de `scale: 0`) por variantes com opacity + `y` 8→0 usando esses tokens
- [x] T016 Adicionar o focus ring global em `app/globals.css`: `:focus-visible` com `outline: 1px solid var(--color-accent)` e `outline-offset: 4px` (o inspect outline sem etiqueta; os cantos ficam com o componente da T019); `:focus:not(:focus-visible)` sem anel; proibir `outline: none` sem substituto
- [x] T017 Verificar a Parte 1: gates verdes; as páginas atuais renderizam com as fontes e cores novas sem quebrar layout (Playwright MCP em 1440 e 390); abrir o PR

### Parte 2 `feat/redesign-components`

Cada componente tem o teste escrito antes, em `tests/components/<nome>.test.tsx`, e a implementação em `app/componentes/<nome>/index.tsx`. As classes vêm de `cn()` (`app/lib/utils.ts`).

- [x] T018 [P] Teste do InspectOutline em `tests/components/inspect-outline.test.tsx`: variantes `static` (etiqueta com texto recebido), `dashed` (etiqueta "elemento não encontrado") e `hover`; raiz decorativa com `aria-hidden="true"`; sem etiqueta quando `label` é omitido
- [x] T019 Implementar InspectOutline em `app/componentes/inspect-outline/index.tsx`: caixa com borda 1 px `accent` (tracejada na variante `dashed`), 4 alças 8×8 nos cantos e etiqueta `font-mono text-mono-s` com fundo `accent` e texto `on-accent`; prop `measure` que, quando ligada, lê `getBoundingClientRect` do alvo e escreve "seletor L × A" (depende de T018)
- [x] T020 [P] Teste e implementação do Button em `tests/components/button.test.tsx` e `app/componentes/button/index.tsx`: variantes `primary` (bg `accent`, texto `on-accent`) e `secondary` (borda `line`); `loading` desabilita, define `aria-busy` e mostra spinner com texto; `:active` com `scale(0.97)` via transform em `duration-fast`; renderiza como link quando recebe `href`
- [x] T021 [P] Teste e implementação do Link com seta em `tests/components/link.test.tsx` e `app/componentes/link/index.tsx`: seta ↗ decorativa com `aria-hidden`; link externo com `target="_blank"`, `rel="noopener noreferrer"` e texto acessível "(abre em nova aba)" / "(opens in a new tab)"; a seta anda 2 px na diagonal no hover, só com `(hover: hover) and (pointer: fine)`
- [x] T022 [P] Teste e implementação do NavItem em `tests/components/nav-item.test.tsx` e `app/componentes/header/nav-item.tsx`: item atual com o ponto `accent` decorativo e `aria-current="page"`
- [x] T023 [P] Teste e implementação do LanguageSwitch em `tests/components/language-selector.test.tsx` (atualizar o existente) e `app/componentes/header/language-selector.tsx`: grupo com dois botões PT/EN e `aria-pressed`; a pílula ativa desliza com `spring.ui` (com reduzir movimento, troca direta); clicar chama `setLocale` do contexto
- [x] T024 Ajustar `app/componentes/context/language-context.tsx`: expor `setLocale(locale)` além de `toggleLocale`, e sincronizar `document.documentElement.lang` (`pt-BR` | `en`) a cada troca (US5); cobrir em `tests/components/language-context.test.tsx`
- [x] T025 [P] Teste e implementação de Input e Textarea em `tests/components/form-fields.test.tsx`, `app/componentes/form/input.tsx` e `app/componentes/form/textarea.tsx`: `label` visível ligado por `htmlFor`; `helper` e `error` ligados por `aria-describedby`; `aria-invalid` quando há erro; linha inferior `line` que vira `accent` no foco (cresce da esquerda via `scaleX`) e `danger` no erro; `forwardRef`/`ref` compatível com react-hook-form
- [x] T026 [P] Teste e implementação do SectionTitle em `tests/components/section-title.test.tsx` e `app/componentes/section-title/index.tsx`: heading com nível configurável; tamanho `clamp(64px, 8vw + 1rem, 112px)` em `font-display`; subtítulo opcional `text-muted`; InspectOutline `hover` com medida real só com mouse
- [x] T027 [P] Teste e implementação do TechBadge em `tests/components/tech-badge.test.tsx` e `app/componentes/tech-badge/index.tsx`: pílula com borda `line`, `label-m`, sem animação de entrada a partir de `scale(0)`
- [x] T028 [P] Teste e implementação do BackToTop em `tests/components/back-to-top.test.tsx` e `app/componentes/back-to-top/index.tsx`: aparece depois de 1,5 × a altura da viewport; entra com opacity e `y` 8→0 (sem animar `top`/`right`); ao ativar, rola para o topo (instantâneo com reduzir movimento) e move o foco para `#main`; botão com nome acessível "Voltar ao topo" / "Back to top"
- [x] T029 [P] Teste e implementação do SkipLink em `tests/components/skip-link.test.tsx` e `app/componentes/skip-link/index.tsx`: primeiro elemento focável, visível só no foco, aponta para `#main`; inserir em `app/layout.tsx` com `<main id="main" tabIndex={-1}>`
- [x] T030 Adicionar a `app/utils/translations.ts` (PT e EN, no mesmo formato de dicionário) todas as strings novas da interface: papel do hero, subtítulos de seção, voz do contato (FR-007, FR-013, US2), menu, 404, "desde", "atual", rótulos de acessibilidade; manter o tipo `TranslationDictionary` exaustivo
- [x] T031 Verificar a Parte 2: gates verdes; uma página de verificação local (não versionada) ou Storybook-like via teste mostrando cada componente; Playwright MCP comparando com o board Componentes `4:3`; abrir o PR

**Checkpoint**: fundação pronta; as telas podem começar.

---

## Phase 3: User Story 1 — Entender quem é o Eduardo em segundos (P1) 🎯 MVP · Parte 3 `feat/redesign-home`

**Goal**: topo da Home com o momento cinematográfico, apresentação, emprego atual e contato.

**Independent Test**: abrir `/` em 1440 e 390 e conferir a primeira tela (quickstart V1–V3).

### Tests (escrever primeiro e ver falhar)

- [x] T032 [P] [US1] Teste de `getCurrentExperience` em `tests/utils/experience.test.ts`: retorna a experiência sem `endDate` de `startDate` mais recente; com duas atuais, a mais recente; sem nenhuma, `null`
- [x] T033 [P] [US1] Teste de `getSocialLabel` em `tests/utils/socials.test.ts`: usa `name` aparado; sem `name`, mapeia `github.com` → "GitHub", `linkedin.com` → "LinkedIn", `api.whatsapp.com` e `wa.me` → "WhatsApp"; host desconhecido → domínio sem `www.`/`api.`
- [x] T034 [P] [US1] Teste de `pickLocale` em `tests/utils/locale.test.ts`: com EN ativo, campos EN vazios ou `null` caem para o valor PT, campo a campo
- [ ] T035 [P] [US1] Teste do Hero em `tests/components/hero.test.tsx`: renderiza papel, nome em `h1`, apresentação, "Agora: <cargo> na <empresa>" só quando há experiência atual, sociais com rótulos, "Vamos conversar" e "Ver projetos"; com `sessionStorage` marcado, não anima

### Implementation

- [x] T036 [P] [US1] Implementar `getCurrentExperience` em `app/utils/experience.ts` (faz a T032 passar)
- [x] T037 [P] [US1] Implementar `getSocialLabel` em `app/utils/socials.ts` (faz a T033 passar)
- [x] T038 [P] [US1] Implementar `pickLocale` em `app/utils/locale.ts` (faz a T034 passar) e usá-lo em `app/componentes/pages/home/home-client.tsx` no lugar do fallback atual
- [x] T039 [US1] Ajustar a query da Home em `app/page.tsx` ao contrato `HomePage` de `specs/002-redesign/contracts/hygraph-queries.graphql`: incluir `Social.name`, `Project.context` e `workExperiences(orderBy: startDate_DESC)`; remover `technologies`, `iconSvg` e `companyLogo`; atualizar `app/types/page-info.ts`, `app/types/projects.ts` (`context?: string`) e `app/types/work-experience.ts`
- [ ] T040 [US1] Refazer o Hero em `app/componentes/pages/home/hero-section/index.tsx` conforme o Figma `6:21` / mobile `8:29`:
  - papel (`label-m`, `text-muted`);
  - nome em duas linhas `display-xl` (`clamp` até 64 px no mobile);
  - apresentação em rich text `body-l`;
  - botões "Vamos conversar" (primary, rola até `#contact` e foca o 1º campo) e "Ver projetos" (secondary);
  - foto via `next/image` com `priority` e `alt` descritivo;
  - linha "Agora: …" com ponto decorativo;
  - sociais com Link externo.
- [ ] T041 [US1] Implementar a entrada orquestrada do hero em `app/componentes/pages/home/hero-section/hero-intro.tsx`, seguindo a linha do tempo do board `12:21`:
  - "Eduardo" e "Gazolla" sobem por máscara (0–700 ms, com 90 ms de atraso no segundo);
  - a foto revela de baixo com `clip-path` (250–1000 ms);
  - bio e botões entram com opacity + `y` 12→0 (600–1000 ms);
  - o InspectOutline com `measure` desenha (800–1400 ms), a etiqueta digita as medidas (1400–1750 ms), e etiqueta e contorno somem em 2400–2600 ms;
  - roda só se `sessionStorage['portfolio-gazolla:intro']` não existir, e grava a flag;
  - nunca bloqueia clique;
  - com `useReducedMotion`, só um fade de 140 ms e sem contorno;
  - conteúdo visível sem JS (estado inicial via classe adicionada no cliente).
- [ ] T042 [US1] Atualizar `app/componentes/footer/index.tsx`: "© <ano atual> Eduardo Gazolla", sociais do CMS via `getSocialLabel` e BackToTop; buscar as sociais com a query `SiteSocials` em `app/layout.tsx` (server component) e passar por props

**Checkpoint**: US1 funcional na Home (quickstart V1–V3).

---

## Phase 4: User Story 6 — Navegar no celular (P2) · Parte 3 `feat/redesign-home`

**Goal**: cabeçalho responsivo e menu em tela cheia acessível.

**Independent Test**: em 390 px, abrir e fechar o menu e navegar só com teclado (quickstart V10).

- [ ] T043 [P] [US6] Teste do Header em `tests/header.test.tsx` (atualizar o existente): nome com link para `/`; nav desktop com Home, Projetos e Contato e `aria-current` no atual; LanguageSwitch; abaixo de 768 px, botão "Menu" com `aria-expanded` e `aria-controls`
- [ ] T044 [P] [US6] Teste do MobileMenu em `tests/components/mobile-menu.test.tsx`: abre com "Menu", mostra Home, Projetos, Experiência e Contato, sociais e "Vamos conversar"; prende o foco; Esc, "Fechar" e clique em link fecham; ao fechar, o foco volta para "Menu"; o `body` não rola enquanto o menu está aberto
- [ ] T045 [US6] Refazer `app/componentes/header/index.tsx` conforme o Figma `6:21` / `8:29`: fundo `bg`, sem animar `top`; Contato aponta para `/#contact`
- [ ] T046 [US6] Criar `app/componentes/header/mobile-menu.tsx` conforme o Figma `8:228`:
  - links em `display` grandes, com ponto no atual;
  - abre em círculo a partir do botão (`clip-path: circle()` via transform/opacity);
  - links sobem com 40 ms entre eles; fecha em 180 ms;
  - com reduzir movimento, fade de 140 ms;
  - `role="dialog"` com `aria-modal="true"` e rótulo.

**Checkpoint**: navegação mobile completa.

---

## Phase 5: User Story 3 — Avaliar a stack e a experiência (P2) · Parte 3 `feat/redesign-home`

**Goal**: seções Stack e Experiência da Home.

**Independent Test**: conferir stack e experiências contra o CMS e operar a sanfona (quickstart V6).

### Tests (primeiro)

- [x] T047 [P] [US3] Teste de `formatDuration` e `formatPeriod` em `tests/utils/experience.test.ts`:
  - PT: "1 ano e 9 meses", "2 anos e 1 mês", "1 ano", mínimo "1 mês";
  - EN: "1 year and 9 months";
  - meses arredondados para baixo, `end` ausente = hoje (com relógio fixo);
  - período "fev 2025 – atual" / "Feb 2025 – present".
- [ ] T048 [P] [US3] Teste do KnownTechs em `tests/components/known-techs.test.tsx`: só nome e "desde <ano>", ordenados por `startDate` crescente, sem ícone
- [ ] T049 [P] [US3] Teste do WorkExperience em `tests/components/work-experience.test.tsx`: a atual mostra período, duração, cargo, empresa com link, descrição e badges; as anteriores mostram uma linha e um botão "+" com `aria-expanded` que abre e fecha com clique, Enter e Espaço; sem descrição e sem tecnologias, não há "+"

### Implementation

- [x] T050 [US3] Implementar `formatDuration` e `formatPeriod` em `app/utils/experience.ts` com `date-fns` (já é dependência), usando os locales `ptBR` e `enUS` (faz a T047 passar); remover `app/utils/get-relative-time.tsx` se ficar sem uso
- [ ] T051 [US3] Refazer a Stack em `app/componentes/pages/home/known-techs/index.tsx` e `known-tech.tsx` conforme o Figma: SectionTitle "Stack" com o subtítulo "Tecnologias que uso no dia a dia."; duas colunas com divisores `line` no desktop e uma no mobile; lista estática, sem animação
- [ ] T052 [US3] Refazer a Experiência em `app/componentes/pages/home/work-experiences/index.tsx` e `experience-item.tsx` conforme o Figma:
  - SectionTitle com o subtítulo "Do suporte de TI à qualidade de software: …";
  - item atual completo com o ponto pulsante (escala 1→2,2, loop de 2 s; parado com reduzir movimento; `aria-hidden`);
  - anteriores compactos em sanfona (`grid-template-rows 0fr → 1fr`, `duration-base`, `ease-in-out`; "+" gira 45° e vira "×"; abre sem animação com reduzir movimento).
- [ ] T053 [US3] Refazer o destaque de projetos da Home em `app/componentes/pages/home/highlighted-projects/index.tsx` e `project-card/index.tsx`:
  - SectionTitle "Projetos" com "Ver todos os projetos";
  - imagem `next/image` com `alt` do título;
  - rótulo `context` só se preenchido; título `h2`; descrição curta; badges; "Ver projeto";
  - linha "Mais projetos chegando…" com o link GitHub vindo das sociais;
  - a seção some se não houver projeto em destaque.
- [ ] T054 [US3] Montar a Home em `app/componentes/pages/home/home-client.tsx` na ordem do Figma (Hero, Stack, Projetos, Experiência, Contato `#contact`) e verificar a Parte 3: gates verdes, Playwright MCP com Home e menu em 1440/390 contra `6:21`, `8:29` e `8:228`, teclado e PT/EN. Abrir o PR

**Checkpoint**: Home completa (exceto os estados do form, que ficam na Parte 5).

---

## Phase 6: User Story 4 — Conhecer os projetos (P2) · Parte 4 `feat/redesign-projects`

**Goal**: página Projetos (destaque e lista 4+) e detalhe.

**Independent Test**: Home → Projetos → Detalhe com o CMS real; layout 4+ com fixtures (quickstart V7–V8).

### Tests (primeiro)

- [ ] T055 [P] [US4] Teste de `fetchHygraphQuery` em `tests/utils/fetch-hygraph-query.test.ts` (usar `jest.requireActual`, porque `jest.setup.js` mocka o módulo):
  - envia `{ query, variables }`;
  - repassa `revalidate` em `next`;
  - resposta com `errors` lança um erro com o nome da operação;
  - resposta não-OK lança erro.
- [ ] T056 [P] [US4] Teste de `getProjectsLayout` e `filterProjectsByTech` em `tests/utils/projects-layout.test.ts`: `count < 4` → `"featured"`, `count ≥ 4` → `"list"`; filtro `"all"` devolve tudo; filtro por tecnologia devolve só quem a tem, com o contador correto; techs únicas ordenadas alfabeticamente
- [ ] T057 [P] [US4] Teste da página Projetos em `tests/components/projects-list.test.tsx`: com 1 projeto, bloco de destaque sem filtros nem contador, com "Mais projetos chegando…"; com 4 fixtures, contador "4 projetos", filtros começando em "Todos" (botões com `aria-pressed`), filtrar atualiza a lista e o contador e mostra "Nenhum projeto com <tech>" com opção de limpar quando vazio
- [ ] T058 [P] [US4] Teste do detalhe em `tests/components/project-detail.test.tsx`:
  - mostra "Todos os projetos", `h1`, "O que é" (`shortDescription`), "Contexto" só com `context`, e "Repositório"/"Ver online" só quando as URLs existem;
  - mostra a imagem principal, "Sobre o projeto" com tecnologias e descrição, e um bloco por `section`;
  - mostra "Por enquanto, este é o único projeto publicado." quando o total é 1.

### Implementation

- [ ] T059 [US4] Alterar `app/utils/fetch-hygraph-query.ts` para `fetchHygraphQuery<T>(query, { variables?, revalidate? })`, tratando `errors` e status não-OK (faz a T055 passar); atualizar as chamadas em `app/page.tsx`, `app/layout.tsx` e `app/projects/**`
- [ ] T060 [P] [US4] Implementar `getProjectsLayout` e `filterProjectsByTech` em `app/utils/projects-layout.ts` (faz a T056 passar)
- [ ] T061 [US4] Ajustar as queries em `app/projects/page.tsx` e `app/projects/[slug]/page.tsx` aos contratos `ProjectsPage` e `ProjectDetail`: `$slug` como **variável** (sem interpolação), `context`, `projectsConnection { aggregate { count } }`; `generateMetadata` com `description.text` e a OG de `thumbnail`
- [ ] T062 [US4] Refazer a página Projetos em `app/componentes/pages/projects/page-introduction/index.tsx`, `projects-list-client.tsx`, `projects-list/index.tsx` e `projects-card/index.tsx` conforme o Figma `9:137` (destaque) e `24:242` (lista 4+); a prévia que segue o cursor usa `spring.cursor`, inclina até ±6° pela velocidade e entra com escala 0,9→1; com toque ou reduzir movimento, fica fixa ou não aparece; hover só com mouse
- [ ] T063 [US4] Refazer o detalhe em `app/componentes/pages/project/project-detail-client.tsx`, `project-details/index.tsx` e `project-sections/index.tsx` conforme o Figma `9:227` / `11:402`: título `display-l` com InspectOutline; colunas O que é / Contexto / Links; imagem principal com zoom 1,08→1 e paralaxe de 40 px ligados à rolagem (estática com reduzir movimento); seções com `alt` do título da seção
- [ ] T064 [US4] Criar `app/componentes/contact-band/index.tsx` ("Vamos conversar?", "Vaga ou projeto, a mensagem chega direto para mim.", botão "Escrever mensagem" → `/#contact`) e mostrá-la em `/projects` e no detalhe, conforme FR-007

**Checkpoint**: projetos navegáveis de ponta a ponta.

---

## Phase 7: User Story 7 — Achar o caminho numa página inexistente (P3) · Parte 4 `feat/redesign-projects`

**Goal**: 404 com a assinatura tracejada.

**Independent Test**: `/nao-existe` e `/projects/nao-existe` (quickstart V11).

- [ ] T065 [P] [US7] Teste do 404 em `tests/components/not-found.test.tsx`: "404" grande dentro do InspectOutline `dashed` com `aria-hidden`; `h1` "Essa página não existe."; texto de apoio; botões "Voltar para a Home" (`/`) e "Ver projetos" (`/projects`); textos em EN quando EN está ativo
- [ ] T066 [US7] Refazer `app/not-found.tsx` conforme o Figma `12:385` / `12:583` (remover `react-icons` daqui) e confirmar que o `notFound()` do detalhe cai nele; verificar a Parte 4 (gates, Playwright MCP com `9:137`, `24:242`, `9:227`, `12:385` e mobile) e abrir o PR

**Checkpoint**: Parte 4 entregue.

---

## Phase 8: User Story 2 — Mandar uma mensagem sem sair do site (P1) · Parte 5 `feat/redesign-contact-form`

**Goal**: formulário com os estados inline do data-model §3 e a rota do contrato.

**Independent Test**: enviar com dados válidos, inválidos e com falha (quickstart V4–V5).

### Tests (primeiro)

- [ ] T067 [P] [US2] Teste do schema em `tests/lib/contact-schema.test.ts`: `name` aparado com "3–100 caracteres", `email` válido com "até 254 caracteres", `message` aparada com "1–500 caracteres"; cada erro tem mensagem PT e EN que ensina a corrigir (ex.: "Falta o domínio. Use algo como nome@gmail.com.")
- [ ] T068 [P] [US2] Teste da rota em `tests/api/contact-route.test.ts` (ambiente `node`, com `axios` mockado), cobrindo cada resposta do contrato `specs/002-redesign/contracts/contact-api.md`:
  - válido → `200 { ok: true }`;
  - corpo inválido ou JSON quebrado → `400 { ok: false, error: "invalid_input" }`;
  - webhook falha ou passa de 10 s → `502 delivery_failed`;
  - sem `WEBHOOK_URL` → `500 unexpected`;
  - nenhuma resposta vaza detalhes.
- [ ] T069 [P] [US2] Teste do ContactForm em `tests/components/contact-form.test.tsx`, cobrindo os estados com `fetch`/`axios` mockado:
  - **invalid**: erros abaixo dos campos, foco no 1º campo com erro, erro some ao corrigir e sair do campo;
  - **submitting**: campos e botão desabilitados, "Enviando…";
  - **sent**: "Mensagem enviada." com foco no título, e "Enviar outra mensagem" volta vazio;
  - **failed**: dados mantidos, aviso `role="alert"` e "Tentar de novo";
  - clique duplo não envia duas vezes.

### Implementation

- [ ] T070 [US2] Criar `app/lib/contact-schema.ts` com o zod compartilhado (faz a T067 passar), recebendo as mensagens por locale
- [ ] T071 [US2] Reescrever `app/api/contact/route.ts` conforme o contrato (faz a T068 passar): `safeParse`; `axios.post` com `timeout: 10000`; respostas `{ ok, error }`; `console.error` só no servidor
- [ ] T072 [US2] Reescrever `app/componentes/contact-form/index.tsx` com os estados `idle | invalid | submitting | sent | failed` (faz a T069 passar):
  - react-hook-form com `mode: "onTouched"` e `zodResolver`;
  - Input e Textarea da T025, com `maxLength={500}` e o limite informado;
  - região `aria-live="polite"`;
  - confirmação conforme o Figma `27:314`;
  - layout da seção Contato da Home conforme `6:21` (título "Vamos conversar?" e texto da FR-013).
- [ ] T073 [US2] Remover `react-hot-toast` do `package.json`, `app/componentes/toaster/` e o `<Toaster/>` de `app/layout.tsx`; tirar o `<ContactForm />` do layout global e deixá-lo só na Home (`#contact`); verificar a Parte 5 (gates, Playwright MCP com os 4 estados contra `27:314` em 1440 e 390) e abrir o PR

**Checkpoint**: todas as user stories funcionando.

---

## Phase 9: Polish & Cross-Cutting — Parte 6 `feat/redesign-motion` (US8 + E2E)

**Purpose**: completar a tabela de motion, fechar acessibilidade de teclado e automatizar as jornadas.

- [ ] T074 Instalar `@playwright/test` ^1.65 e `@axe-core/playwright` ^4.14 como devDependencies; criar `playwright.config.ts` com projetos `desktop` (1440×900) e `mobile` (390×844, `hasTouch`) e `webServer` com `npm run build && npm run start`; adicionar o script `"test:e2e": "playwright test"`; excluir `e2e/` do Jest em `jest.config.js`
- [ ] T075 Implementar a troca de página (saída 120 ms; entrada com opacity e `y` 8→0 em `duration-base`; só fade com reduzir movimento) em `app/template.tsx`
- [ ] T076 Implementar o destaque da Home ligado à rolagem em `app/componentes/pages/home/highlighted-projects/index.tsx`: seção fixa por 1,5 tela; imagem de 0,86→1 com raio 14→0; depois título e texto. Com reduzir movimento, a imagem já cheia e sem fixar. Só transform e opacity (o raio via `clip-path inset(... round)`)
- [ ] T077 Revisar a tabela do board `12:21` item a item contra o código e corrigir divergências em `app/componentes/**`:
  - hover só em `(hover: hover) and (pointer: fine)`;
  - nenhuma animação de `top`/`left`/`width`/`height`;
  - entradas na viewport com `once: true`;
  - toda animação usa `useReducedMotion` ou `@media (prefers-reduced-motion)`.
- [ ] T078 [P] [US1] E2E da primeira dobra em `e2e/home.spec.ts`: V1 (elementos visíveis sem rolar em desktop e mobile), V2 (não anima de novo na sessão) e V3 (`reducedMotion: 'reduce'`, sem transform nos elementos)
- [ ] T079 [P] [US2] E2E do contato em `e2e/contact.spec.ts`, com `page.route('**/api/contact')` respondendo 200 e 502: inválido → erros e foco; sucesso → "Mensagem enviada."; falha → dados mantidos e "Tentar de novo"
- [ ] T080 [P] [US4] E2E dos projetos em `e2e/projects.spec.ts`: Home → "Ver todos os projetos" → "Ver projeto" → detalhe com "Contexto" → "Todos os projetos"
- [ ] T081 [P] [US5] E2E do idioma em `e2e/language.spec.ts`: alternar PT/EN em `/`, `/projects` e no detalhe; `html[lang]` acompanha; a preferência persiste após reload
- [ ] T082 [P] [US6] E2E do menu mobile em `e2e/mobile-menu.spec.ts` (projeto mobile): abre, foco preso, Esc fecha e devolve o foco
- [ ] T083 [P] [US7] E2E do 404 em `e2e/not-found.spec.ts`: `/nao-existe` e `/projects/nao-existe` mostram o 404 com os dois botões
- [ ] T084 [P] [US8] E2E de teclado em `e2e/keyboard.spec.ts`: o primeiro Tab mostra "Pular para o conteúdo"; percorrer cada página só com Tab, com elemento focado sempre visível (outline calculado ≠ none); voltar ao topo move o foco
- [ ] T085 [P] E2E de acessibilidade e layout em `e2e/a11y.spec.ts`: axe com tags `wcag2a`, `wcag2aa`, `wcag21aa` e `wcag22aa` sem violações em `/`, `/projects`, `/projects/hour-sync` e 404 (SC-004); `scrollWidth === clientWidth` em 360, 390, 768, 1440 e 1920 (SC-006)
- [ ] T086 Remover o que ficou órfão: `app/componentes/divider/`, `app/componentes/cms-icon/`, `react-icons` (se não houver mais uso), `public/images/hero-bg.jpeg`, `logo2.png`; conferir com `grep` antes de apagar
- [ ] T087 Rodar o quickstart completo (V1–V16), incluindo o Lighthouse mobile em `npm run build && npm run start` (Performance ≥ 90, Acessibilidade 100, LCP < 2,5 s, CLS < 0,1); registrar os números no PR
- [ ] T088 Revisão final: `code-simplifier` nas mudanças, `/code-review`, `frontend-reviewer` e `security-reviewer` (rota de contato e queries); corrigir os achados, rodar os gates de novo (`lint`, `test`, `build`, `test:e2e`) e abrir o PR da Parte 6

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Parte 0)**: sem dependências; bloqueia tudo.
- **Phase 2 (Partes 1 e 2)**: depende da Phase 1. A Parte 2 depende da Parte 1 (tokens). Bloqueia todas as telas.
- **Phases 3–5 (Parte 3)**: dependem da Phase 2. US1 → US6 → US3 dentro do mesmo PR (o Header da US6 e as seções da US3 compõem a mesma Home).
- **Phases 6–7 (Parte 4)**: dependem da Parte 3 (Footer, sociais, `pickLocale`, tipos com `context`).
- **Phase 8 (Parte 5)**: depende da Phase 2 (Input/Textarea) e da Parte 3 (seção `#contact` na Home).
- **Phase 9 (Parte 6)**: depende de todas as anteriores.

### User Story Dependencies

- **US1 (P1)**: só Foundational.
- **US6 (P2)**: só Foundational; entra na Parte 3 porque o Header aparece em todas as telas.
- **US3 (P2)**: usa `app/utils/experience.ts` da US1.
- **US4 (P2)**: usa sociais e `pickLocale` da US1; independente das demais.
- **US7 (P3)**: só Foundational; vai junto com a US4 pelo `notFound()` do detalhe.
- **US2 (P1)**: só Foundational + seção da Home. É P1, mas fica na Parte 5 porque o form atual continua funcionando até lá. Se quiser antecipar, a Parte 5 pode vir logo depois da Parte 3 sem conflito.
- **US5 (P2)**: atravessa tudo; T024 na fundação, conferida em cada parte e no E2E T081.
- **US8 (P1)**: focus ring e skip link na fundação (T016, T029); fechada e automatizada na Phase 9.

### Within Each Phase

- Testes primeiro, vendo falhar → utils → componentes → montagem da página → verificação visual → PR.
- Uma parte só começa com a anterior mergeada em `dev`.

### Parallel Opportunities

- Phase 2: T018, T020–T023 e T025–T029 tocam arquivos diferentes.
- Phase 3: T032–T035 (testes) em paralelo; depois T036–T038.
- Phase 5: T047–T049 em paralelo.
- Phase 6: T055–T058 em paralelo.
- Phase 8: T067–T069 em paralelo.
- Phase 9: todos os E2E (T078–T085) em paralelo.

---

## Parallel Example: User Story 1

```bash
# Testes primeiro, juntos:
Task: "Teste de getCurrentExperience em tests/utils/experience.test.ts"
Task: "Teste de getSocialLabel em tests/utils/socials.test.ts"
Task: "Teste de pickLocale em tests/utils/locale.test.ts"
Task: "Teste do Hero em tests/components/hero.test.tsx"

# Depois as utils, juntas:
Task: "Implementar getCurrentExperience em app/utils/experience.ts"
Task: "Implementar getSocialLabel em app/utils/socials.ts"
Task: "Implementar pickLocale em app/utils/locale.ts"
```

---

## Implementation Strategy

### MVP First

1. Phase 1 (Parte 0) → PR → merge.
2. Phase 2 (Partes 1 e 2) → PRs → merge.
3. Phase 3 (US1) dentro da Parte 3 → **validar a primeira dobra** (quickstart V1–V3) antes de seguir com US6 e US3 no mesmo PR.

### Incremental Delivery

Cada parte é um PR independente para `dev`, revisado e mergeado antes da próxima. O site em `dev`
fica funcional ao fim de cada parte: telas antigas e novas convivem até a Parte 5, porque os
tokens novos se aplicam a tudo desde a Parte 1.

---

## Notes

- Commits pequenos por tarefa ou grupo lógico; sem linhas de atribuição a IA.
- Todo dado mostrado vem do contrato de queries; campo novo = proposta de mudança no CMS antes.
- Parar em cada checkpoint para validar e pedir OK antes da próxima parte.
