# Data Model: Redesign do portfólio

**Data**: 2026-11-11 · **Spec**: [spec.md](./spec.md) · **Research**: [research.md](./research.md)

## 1. Design tokens (fonte: Figma Fundação 3:12 e Motion 12:21)

Os tokens ficam como CSS vars em `app/globals.css` e são mapeados no `tailwind.config.js`.
Componentes usam só as classes geradas (constitution III).

### Cores

| Token | CSS var | Valor | Uso |
|-------|---------|-------|-----|
| `bg` | `--color-bg` | `#050505` | fundo da página |
| `surface` | `--color-surface` | `#111113` | blocos, linha em hover, confirmação do form |
| `line` | `--color-line` | `#232327` | divisores, borda de inputs e botões secundários |
| `text` | `--color-text` | `#F2F2EF` | texto principal |
| `text-muted` | `--color-text-muted` | `#8B8B92` | apoio, datas, placeholders |
| `accent` | `--color-accent` | `var(--accent-cobalto)` | links ativos, foco, contorno, botão primário |
| `on-accent` | `--color-on-accent` | `#050505` | texto sobre o accent |
| `danger` | `--color-danger` | `#FF5C5C` | erros do form (6,7:1 sobre `bg`; lido do Input/Error 5:101) |
| `accent-cobalto` | `--accent-cobalto` | `#5B6BFF` | opção ativa (4,8:1 sobre `bg`) |
| `accent-laranja` | `--accent-laranja` | `#FF5A1F` | opção alternativa |
| `accent-lima` | `--accent-lima` | `#C8FF2E` | opção alternativa |

Trocar o accent = mudar só o alias `--color-accent`.

### Tipografia

| Token | Família | Peso | Tamanho / altura de linha / tracking | Uso |
|-------|---------|------|--------------------------------------|-----|
| `display-xl` | Bricolage Grotesque | 800 | 176 / 0,88 / −4 px | nome no hero (desktop) |
| `display-l` | Bricolage Grotesque | 800 | 112 / 0,92 / −3 px | títulos de seção e página (desktop) |
| `h1` | Bricolage Grotesque | 700 | 64 / 1,0 / −2 px | títulos de seção no mobile |
| `h2` | Bricolage Grotesque | 600 | 40 / 1,1 / −1 px | títulos de projeto |
| `h3` | Bricolage Grotesque | 600 | 24 / 1,25 / −0,5 px | cargo, títulos de seção do detalhe |
| `body-l` | Geist | 400 | 20 / 1,5 | apresentação, intros |
| `body-m` | Geist | 400 | 16 / 1,6 | texto corrido |
| `label-m` | Geist | 500 | 14 / 1,4 | botões, nav, labels |
| `mono-s` | IBM Plex Mono | 400 | 13 / 1,4 | só a etiqueta do contorno de inspeção |

Títulos grandes usam `clamp()` entre o tamanho mobile e o desktop, para não quebrar palavras em 360 px.

### Espaço, raio e grid

- Espaçamento: escala 4, 8, 12, 16, 24, 32, 48, 64, 96, 160 (a escala padrão do Tailwind cobre;
  160 vira `spacing.40`).
- Raio: `none` 0, `sm` 6, `md` 14, `full` 9999.
- Grid: 12 colunas, conteúdo máximo de 1200 px, margens de 120 px no desktop e 20 px no mobile.

### Motion

| Token | Valor | Uso |
|-------|-------|-----|
| `duration-fast` | 140 ms | hover, press, cor |
| `duration-base` | 220 ms | entradas e saídas pequenas, menus |
| `duration-slow` | 700 ms | revelação do nome, imagens |
| `ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | tudo que entra |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | o que muda de lugar |
| `spring-ui` | stiffness 500, damping 35 | pílula PT/EN |
| `spring-cursor` | stiffness 300, damping 30 | prévia que segue o cursor |

Os mesmos valores são exportados em TS (`app/lib/motion.ts`) para o Motion e como CSS vars para as
transições em CSS.

## 2. Conteúdo do CMS (Hygraph, locales `pt_BR` e `en`)

Tipos em `app/types/`. Os campos marcados como *novo na query* já existem no schema, mas não são buscados hoje.

### HomePage (`pages(where: {slug: "home"})`)

| Campo | Tipo | Uso no redesign |
|-------|------|-----------------|
| `role` | String (localizado) | linha de cargo do hero (*novo na query*; vem do CMS, não das traduções) |
| `introduction.raw` | RichText | apresentação do hero |
| `profilePicture.url` | Asset | foto do hero |
| `socials[]` | Social | hero, menu mobile, rodapé |
| `knownTechs[]` | KnownTech | seção Stack |
| `highlightProjects[]` | Project | Projetos da Home |
| `technologies[]` | KnownTech | **sai da query** (não é usado no redesign) |

### Social

| Campo | Tipo | Uso |
|-------|------|-----|
| `name` | String | rótulo do link (*novo na query*); vazio → domínio da URL |
| `url` | String | destino (abre em nova aba, com `rel="noopener noreferrer"`) |
| `iconSvg` | String | **sai da query** (o design não usa ícones) |

### KnownTech

| Campo | Tipo | Uso |
|-------|------|-----|
| `name` | String | nome na Stack e badges |
| `startDate` | Date | "desde <ano>"; ordenação crescente |
| `iconSvg` | String | **sai da query** |

### Project

| Campo | Tipo | Uso |
|-------|------|-----|
| `slug` | String | URL `/projects/<slug>` |
| `title` | String | título |
| `context` | String (localizado, opcional) | rótulo na lista e coluna "Contexto" no detalhe (*novo*) |
| `shortDescription` | String | "O que é" no detalhe, descrição na lista e na Home |
| `description` | RichText (`raw`, `text`) | "Sobre o projeto"; `text` alimenta a meta description |
| `technologies[]` | KnownTech (`name`) | badges e filtros |
| `thumbnail.url` | Asset | imagem na Home, na lista e no OG |
| `pageThumbnail.url` | Asset | imagem principal do detalhe |
| `sections[]` | `{ title, image.url }` | blocos do detalhe (`ProjectSection.title` é localizado) |
| `gitHubUrl` | String? | link "Repositório" |
| `liveProjectUrl` | String? | link "Ver online" |

### WorkExperience

| Campo | Tipo | Uso |
|-------|------|-----|
| `role` | String | cargo |
| `companyName` | String | empresa |
| `companyUrl` | String? | link da empresa (só na atual) |
| `startDate` | Date | período, duração e ordenação (decrescente) |
| `endDate` | Date? | vazio = atual |
| `description.raw` | RichText | texto da atual; conteúdo da sanfona nas anteriores |
| `technologies[]` | KnownTech (`name`) | badges |
| `companyLogo` | Asset | **sai da query** |

### Regras derivadas (funções puras, feitas com TDD)

- `getCurrentExperience(list)`: entre as experiências sem `endDate`, a de `startDate` mais recente;
  `null` se não houver nenhuma.
- `formatDuration(start, end ?? hoje, locale)`: "1 ano e 9 meses" / "1 year and 9 months"; meses
  arredondados para baixo; mínimo "1 mês".
- `formatPeriod(start, end, locale)`: "fev 2025 – atual" / "Feb 2025 – present".
- `getProjectsLayout(count)`: `"featured"` se `count < 4`, `"list"` se `count ≥ 4`.
- `filterProjectsByTech(projects, tech | "all")`: lista filtrada e contador.
- `getSocialLabel(social)`: `name` aparado; sem nome, usa um mapa de hosts conhecidos
  (`github.com` → GitHub, `linkedin.com` → LinkedIn, `api.whatsapp.com`/`wa.me` → WhatsApp) e, por
  último, o domínio sem `www.`/`api.`. Hoje as 3 socials do CMS estão com `name` vazio.
- `pickLocale(pt, en, locale)`: conteúdo EN com fallback campo a campo para PT.

## 3. Estado de UI

### Formulário de contato

```text
idle ──submit inválido──▶ invalid ──corrige/blur──▶ idle
idle ──submit válido────▶ submitting ──200──▶ sent ──"Enviar outra mensagem"──▶ idle (vazio)
                                     └─erro──▶ failed ──"Tentar de novo"──▶ submitting
```

| Estado | Campos | Botão | Anúncio (`aria-live`) | Foco |
|--------|--------|-------|-----------------------|------|
| `idle` | editáveis | "Enviar mensagem" | — | — |
| `invalid` | erro abaixo de cada campo, `aria-invalid`, `aria-describedby` | "Enviar mensagem" | — (sem anúncio de resumo) | 1º campo com erro |
| `submitting` | desabilitados | `aria-disabled` + "Enviando…" + spinner (sem girar com reduzir movimento) | "Enviando mensagem" | mantém no botão |
| `sent` | form substituído | "Enviar outra mensagem" | — (o título focado é lido) | título da confirmação |
| `failed` | mantêm os dados | "Tentar de novo" + link do LinkedIn | `role="alert"`: "Não consegui enviar agora." | aviso |

Validação: nome 3–100, e-mail válido, mensagem 1–500 (o mesmo schema zod no cliente e no servidor).

### Outros estados

- **Sanfona de experiência**: `closed ⇄ open`, via botão com `aria-expanded` e `aria-controls`.
- **Menu mobile**: `closed ⇄ open`; aberto bloqueia a rolagem, prende o foco e fecha com Esc,
  link ou "Fechar".
- **Idioma**: `pt | en`, salvo no `localStorage`, que sincroniza `document.documentElement.lang`.
- **Entrada do hero**: `played | not-played`, guardado no `sessionStorage`.
- **Filtro de projetos (4+)**: `"all" | <tech>`, estado local da página.
