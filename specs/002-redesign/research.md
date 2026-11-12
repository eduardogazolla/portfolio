# Research: Redesign do portfólio

**Data**: 2026-11-11 · **Spec**: [spec.md](./spec.md)

Versões consultadas no npm em 2026-11-11; APIs conferidas no context7 (docs do Next.js e do Motion).

## R1. React 19

- **Decision**: `react` / `react-dom` ^19.3, `@types/react` / `@types/react-dom` ^19.3.
- **Rationale**: o projeto roda Next 16 com React 18.2; o Next 16 foi feito para React 19, e o
  App Router depende dele. Testing Library 16.3 já suporta 19.
- **Alternatives considered**: ficar no 18 (incompatível com o caminho suportado do Next 16).
- **Riscos**: tipos do JSX global (`JSX.Element` → `React.JSX.Element`), `ref` como prop, e
  `useRef` exigindo argumento. Rodar `tsc --noEmit` depois do upgrade para achar os pontos.

## R2. Biblioteca de motion

- **Decision**: trocar `framer-motion` 10.11 pelo pacote **`motion`** ^14.12 e importar de
  `motion/react` (14 arquivos hoje importam `framer-motion`).
- **Rationale**: o guia oficial de upgrade manda desinstalar `framer-motion`, instalar `motion` e
  trocar os imports. Peer deps aceitam React 18 e 19. Breaking changes de 10 → 14 que nos tocam:
  só o cálculo de velocity do MotionValue (v11), irrelevante para o uso atual. A v13 removeu
  `@emotion/is-prop-valid` (não usamos CSS-in-JS). A v14 não tem breaking changes. A partir da
  14.2, `x`/`y`/`scale` são acelerados por hardware, o que permite o uso direto da prévia que segue o
  cursor e da sanfona.
- **Alternatives considered**: manter `framer-motion` 14 com o nome antigo (funciona, mas é o nome
  legado); CSS puro (não cobre springs, prévia do cursor nem progresso de rolagem).

## R3. Lint

- **Decision**: ESLint **^9** + `eslint-config-next` alinhado à versão do `next`, com
  `eslint.config.mjs` em flat config (`eslint-config-next/core-web-vitals` +
  `eslint-config-next/typescript` + `globalIgnores`). O script fica `"lint": "eslint ."`.
  Remover `.eslintrc.json` e `@rocketseat/eslint-config`.
- **Rationale**: o Next 16 removeu o `next lint` (`npm run lint` está quebrado hoje).
  `eslint-config-next@16` exige ESLint ≥ 9. A config da Next já inclui `jsx-a11y`, que ajuda no
  princípio IV da constitution.
- **Alternatives considered**: ESLint 10 (suportado a partir de `eslint-config-next` 16.4, mas o
  `eslint-plugin-react` declara peer só até `^9.7`); manter Rocketseat via FlatCompat (decisão do
  usuário: não).

## R4. Next.js

- **Decision**: subir `next` de 16.2.6 para a última 16.x (16.4.6 hoje) na Parte 0, junto com
  `eslint-config-next` da mesma versão.
- **Rationale**: manter config e framework na mesma versão evita regras divergentes. É um minor
  dentro da 16.
- **Alternatives considered**: travar a 16.2.6 e usar `eslint-config-next@16.2.6`.

## R5. Formulário

- **Decision**: `react-hook-form` ^7.92, `@hookform/resolvers` ^5 com zod 3 (peer aceita
  `zod ^3.25 || ^4`). Manter zod 3 nesta feature.
- **Rationale**: a versão 3.0 do resolvers é antiga, e a atual exige `react-hook-form ^7.55`. A
  validação nova (mensagens que ensinam a corrigir, `mode: "onTouched"` + validação no envio)
  precisa das APIs recentes.
- **Alternatives considered**: migrar para zod 4 (fora do escopo; nada no spec pede).

## R6. Fontes

- **Decision**: `next/font/google` com `Bricolage_Grotesque` (pesos 600, 700, 800; eixo `opsz`),
  `Geist` (400, 500) e `IBM_Plex_Mono` (400, só na etiqueta do contorno), expostas como CSS vars.
  O Inter sai.
- **Rationale**: as três existem em `next/font/google` na versão instalada (verificado nos tipos).
  Isso evita CLS e mantém tudo self-hosted (constitution II).
- **Alternatives considered**: pacote `geist` da Vercel (dependência a mais sem ganho).

## R7. Tailwind

- **Decision**: continuar no Tailwind **3.x** (atualizar para a última 3.4). Os tokens viram CSS vars
  em `app/globals.css` e são mapeados no `tailwind.config.js` (`colors`, `fontFamily`,
  `fontSize`, `borderRadius`, `transitionTimingFunction`, `transitionDuration`).
- **Rationale**: decisão da constitution (v4 é projeto próprio). CSS vars permitem trocar o
  accent por alias.

## R8. Notificações do form

- **Decision**: remover `react-hot-toast` e `app/componentes/toaster`. Estados inline numa região
  `aria-live="polite"` (erro de envio com `role="alert"`).
- **Rationale**: FR-016 e constitution IV.

## R9. E2E e acessibilidade automatizada

- **Decision**: `@playwright/test` ^1.65 em `e2e/`, projetos Chromium desktop (1440×900) e
  mobile (390×844, toque), `webServer` rodando `npm run build && npm run start`.
  `@axe-core/playwright` ^4.14 para varrer cada página (SC-004). A rota `/api/contact` é
  interceptada com `page.route` nos testes de envio, e o webhook real nunca é chamado.
- **Rationale**: o fluxo do `~/.claude/CLAUDE.md` exige Playwright nas jornadas críticas;
  interceptar a rota torna sucesso e falha determinísticos.

## R10. Queries do Hygraph

- **Decision**: `fetchHygraphQuery(query, { variables, revalidate })`. A query do detalhe passa
  a usar `$slug: String!` como variável (constitution VIII). As queries passam a buscar
  `Project.context` e `Social.name`. A resposta com `errors` vira erro tratado, sem mais
  `data` undefined silencioso.
- **Rationale**: hoje o `slug` é interpolado na string da query, e erros da API são ignorados.
- **Verificado**: `Project.context` (String localizado, opcional) foi criado em 2026-11-11 e já
  responde na API de conteúdo. `Social.name` existe no schema.

## R11. Dados de teste para o layout 4+

- **Decision**: a lógica "filtros e contador só com ≥ 4" vira função pura testada com TDD
  (`app/utils/projects-layout.ts`). O layout 4+ é verificado por teste de componente com fixtures,
  não por conteúdo falso no CMS.
- **Rationale**: o CMS tem 1 projeto; criar conteúdo fake no Hygraph poluiria o site real.

## R12. Gates de E2E antes da Parte 6

- **Decision**: até a Parte 6 existir, o gate "E2E verdes" é cumprido com a verificação manual via
  Playwright MCP (desktop 1440 e mobile 390), registrada no PR. Da Parte 6 em diante, a suíte
  `e2e/` é obrigatória.
- **Rationale**: a suíte E2E só faz sentido sobre as telas novas; registrado em Complexity
  Tracking do plan.
