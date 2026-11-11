# Quickstart: validar o redesign

Guia para provar, ao fim de cada parte, que a feature funciona. Detalhes de dados em
[data-model.md](./data-model.md) e contratos em [contracts/](./contracts/).

## Pré-requisitos

- Node ≥ 20.9 e npm (o único gerenciador; ver constitution).
- `.env` com `HYGRAPH_URL`, `HYGRAPH_TOKEN` e `WEBHOOK_URL` (nunca commitado).
- `npm ci`
- A partir da Parte 6: `npx playwright install chromium`

## Gates de todo PR (constitution)

```bash
npm run lint      # ESLint 9 flat, zero erros e zero warnings
npm test          # Jest + Testing Library
npm run build     # build de produção sem erros
npm run test:e2e  # Playwright (a partir da Parte 6)
```

## Cenários de validação

| # | Cenário | Como | Esperado |
|---|---------|------|----------|
| V1 | Primeira dobra (US1) | `npm run dev`, abrir `/` em 1440×900 e 390×844 | nome, papel, apresentação, "Agora: …", sociais e "Vamos conversar" visíveis sem rolar |
| V2 | Entrada uma vez por sessão (US1) | recarregar `/` na mesma aba | topo aparece pronto, sem animar |
| V3 | Reduzir movimento (US1, SC-007) | DevTools → Rendering → `prefers-reduced-motion: reduce` | nada se desloca nem escala; só fades |
| V4 | Form inválido (US2) | enviar vazio; depois e-mail `eduardo@gmail` | erros abaixo dos campos, foco no 1º, texto do erro ensina a corrigir |
| V5 | Form sucesso e falha (US2) | E2E com `page.route('**/api/contact')` respondendo 200 e 502 | `sent` com foco no título; `failed` mantendo os dados |
| V6 | Stack e Experiência (US3) | conferir contra o Hygraph; abrir "+" com Enter | "desde <ano>"; DB1 completa; sanfona anunciada |
| V7 | Projetos 1 vs 4+ (US4) | `/projects` real (1 projeto) + teste de componente com 4 fixtures | destaque sem filtros; lista com filtros e contador |
| V8 | Detalhe (US4) | `/projects/hour-sync` | "Contexto: Projeto integrador", links, seções do CMS |
| V9 | Idioma (US5) | alternar PT/EN em cada página | textos e conteúdo trocam; `<html lang>` acompanha; preferência persiste |
| V10 | Menu mobile (US6) | 390 px: Menu → Tab até o fim → Esc | foco preso; Esc fecha e devolve o foco a "Menu" |
| V11 | 404 (US7) | `/nao-existe` e `/projects/nao-existe` | 404 tracejado com os dois botões |
| V12 | Teclado (US8) | só Tab/Enter/Espaço/Esc em todas as páginas | "Pular para o conteúdo"; focus ring sempre visível |
| V13 | Acessibilidade automática (SC-004) | axe em cada página via Playwright | 0 violações A/AA |
| V14 | Performance (SC-005) | Lighthouse mobile em `npm run build && npm run start` | Performance ≥ 90, Acessibilidade 100, LCP < 2,5 s, CLS < 0,1 |
| V15 | Sem rolagem horizontal (SC-006) | larguras 360, 390, 768, 1440, 1920 | `scrollWidth === clientWidth` |
| V16 | Fidelidade visual (SC-009) | Playwright MCP: screenshots 1440 e 390 lado a lado com os frames do Figma | sem divergências apontadas na revisão |

## Parte 0 (sem mudança visual)

Além dos gates: `npm ls react react-dom` sem erros de peer; Home, `/projects`, detalhe e troca PT/EN
renderizando como antes, sem erros no console.
