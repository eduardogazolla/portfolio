# Constitution do Portfólio Eduardo Gazolla

## Core Principles

### I. Conteúdo vem do Hygraph

- Todo conteúdo (perfil, projetos, experiências, tecnologias, redes sociais) MUST ser buscado no
  Hygraph, nos locales PT-BR e EN. Conteúdo hardcoded é proibido.
- A UI MUST mostrar apenas campos que existem no schema do Hygraph. Um dado novo na tela exige
  uma proposta explícita de mudança no CMS, aprovada antes de ser desenhada ou implementada.
- Strings de interface (menu, labels, mensagens do form, voz do contato) MUST ficar no
  dicionário de traduções PT/EN do código, nunca no CMS e nunca soltas em componentes.
- Quando um locale falhar ou vier vazio, a página MUST cair para PT-BR em vez de quebrar ou
  mostrar texto em branco.

**Por quê:** conteúdo e código evoluem em ritmos diferentes; o design só promete o que o CMS
consegue entregar.

### II. Renderização híbrida e performance

- Páginas MUST usar os recursos de cache e renderização estática/dinâmica do Next.js App Router,
  com revalidação das queries do Hygraph (padrão de 24 h).
- Fontes MUST ser carregadas via `next/font` e imagens via `next/image` (ou equivalente com
  dimensões explícitas).
- Metas SHOULD ser cumpridas no Lighthouse mobile: Performance ≥ 90, Acessibilidade = 100,
  LCP < 2,5 s, CLS < 0,1. Uma regressão abaixo disso precisa ser justificada no PR.

**Por quê:** um portfólio é julgado nos primeiros segundos; lentidão anula o design.

### III. Contenção editorial

- O layout MUST ser editorial e minimalista, com no máximo **um momento cinematográfico por
  página**. Elemento decorativo sem função não entra.
- A assinatura visual é o **inspect outline** (caixa no accent + alças nos cantos + tag mono).
  Ele MUST ser usado com parcimônia: hero, hover de títulos, 404 e foco de teclado.
- Cor, tipografia, espaçamento, raio e motion MUST vir de tokens definidos num único lugar
  (config do Tailwind + CSS vars). Hex, tamanho de fonte ou duração soltos em componente são
  proibidos.
- O sistema MUST ter **um único accent**, trocável por alias de token sem editar componentes.
- Hierarquia vem de tipografia grande e espaço, não de cor ou ornamento. Os valores concretos da
  direção atual ficam no `data-model.md` do spec de redesign vigente, não aqui.
- Layouts MUST funcionar de 360 px a 1440 px+, sem scroll horizontal.

**Por quê:** a contenção é o que faz o único momento de destaque funcionar.

### IV. Acessibilidade (NON-NEGOTIABLE)

- O site MUST atender WCAG 2.2 AA: contraste AA em texto e componentes, HTML semântico,
  hierarquia de headings correta e `lang` coerente com o idioma ativo.
- Tudo MUST ser operável por teclado, com focus ring sempre visível (o inspect outline sem tag).
  `outline: none` sem substituto é proibido.
- `prefers-reduced-motion` MUST ser respeitado em toda animação (ver V).
- Elementos puramente decorativos (ex.: outline do hero e da 404) MUST ter `aria-hidden`.
- Feedback assíncrono (envio do form, erros) MUST ser anunciado inline via `aria-live`; toasts
  efêmeros não são o canal principal.
- Inputs MUST ter label associado e mensagens de erro ligadas por `aria-describedby`.

**Por quê:** acessibilidade é requisito de qualidade, e o perfil de QA do autor torna isso parte
da vitrine.

### V. Motion com propósito

- Toda animação MUST ter um propósito declarado (feedback, mudança de estado, continuidade
  espacial ou o momento cinematográfico). "Fica bonito" não basta para algo visto com frequência.
- Só `transform` e `opacity` MAY ser animados. `top`, `left`, `width`, `height`, `margin` e
  `transition: all` são proibidos.
- Entradas na viewport MUST rodar uma única vez. Motion MUST NOT bloquear leitura nem
  interação, e ações iniciadas pelo teclado não animam.
- Interações de UI SHOULD ficar abaixo de 300 ms, com curvas ease-out customizadas vindas dos
  tokens. `ease-in` não é usado em UI. Entradas nunca partem de `scale(0)`.
- Hover com movimento MUST ficar atrás de `(hover: hover) and (pointer: fine)`.
- Com reduced motion, movimento e deslocamento MUST ser removidos; fades curtos que ajudam a
  entender a mudança MAY permanecer.
- Framer Motion é a ferramenta para animações orquestradas. Transições simples MAY usar CSS.

**Por quê:** motion bem dosado dá vida; motion gratuito deixa o site lento e cansativo.

### VI. Disciplina de testes

- Lógica de negócio (validação do form, fallback de locale, formatação de datas relativas, regras
  de exibição como "filtros só com ≥ 4 projetos") MUST ser feita com TDD: teste falhando
  primeiro.
- Todo componente interativo MUST ter teste unitário com Jest + Testing Library em `tests/`.
- Jornadas críticas MUST ter E2E com `@playwright/test` em `e2e/`: home, troca de idioma, envio
  do form (sucesso e falha), navegação até o detalhe do projeto e 404.
- Testes MUST consultar a página por papel e nome acessível antes de recorrer a `data-testid`.
- Um teste MUST NOT ser removido ou pulado para o build passar.

**Por quê:** cada parte do redesign é entregue isoladamente; os testes provam que nada voltou
a quebrar.

### VII. Arquitetura limpa e TypeScript estrito

- Arquivos de página em `app/` cuidam de layout e busca de dados. Blocos reutilizáveis ficam em
  `app/componentes/`, tipos em `app/types/` e utilitários em `app/utils/` ou `app/lib/`.
- TypeScript MUST rodar em modo strict, sem `any`. Respostas do Hygraph MUST ser tipadas, e os
  tipos MUST mudar junto com as queries.
- Componentes MUST ser reutilizáveis e tratar os estados de carregando, vazio e erro.
  Classes condicionais usam `clsx` + `tailwind-merge`.
- Imports MUST usar o alias absoluto `@/app/...`.
- Abstração só entra quando houver um segundo uso real.

**Por quê:** um código pequeno e previsível é o que permite evoluir o design sem medo.

### VIII. Segurança

- Toda entrada externa MUST ser validada no servidor (ex.: rota de contato com zod), não só no
  cliente.
- Segredos (`WEBHOOK_URL`, token do Hygraph) MUST existir só no servidor e em variáveis de
  ambiente; nunca em código, em bundle do cliente ou em variável `NEXT_PUBLIC_*`.
- Queries GraphQL MUST passar dados dinâmicos (ex.: `slug`) como variáveis, nunca por
  interpolação de string.
- Erros MUST ser tratados de forma centralizada e retornar mensagens genéricas ao cliente, sem
  vazar detalhes internos.

**Por quê:** um site pequeno também é alvo, e um webhook vazado vira spam.

## Restrições técnicas

- Node.js ≥ 20.9, Next.js 16 (App Router), React 19 e TypeScript 5 strict.
- Estilo com Tailwind CSS 3; a migração para a v4 só como projeto próprio. Animação com Framer
  Motion. Formulários com react-hook-form + zod.
- Lint com ESLint 9 em flat config (`eslint-config-next`), via `npm run lint`.
- **npm** é o único gerenciador de pacotes; só `package-lock.json` é versionado.
- Dependência nova MUST ser justificada no PR, e a API de bibliotecas MUST ser conferida na
  documentação atual (context7) antes do uso.

## Fluxo de desenvolvimento e gates de qualidade

- Cada mudança MUST ir numa branch própria (`feat/…`, `fix/…`, `chore/…`, `docs/…`) com PR para
  `dev`. `dev` → `main` publica. Trabalho grande é dividido em partes, e cada parte é mergeada
  antes da próxima começar.
- Features novas seguem o ciclo do spec-kit (`/speckit-specify` → `/speckit-plan` →
  `/speckit-tasks` → implementação), com specs em `specs/NNN-nome/`.
- Todo PR para `dev` MUST ter `npm run lint`, `npm test`, `npm run build` e os E2E de Playwright
  verdes, sem erros nem warnings.
- PRs com UI MUST incluir verificação visual em desktop (1440) e mobile (390) contra o design
  aprovado, além de revisão de acessibilidade e de código.
- Nenhum PR afirma "testes passando" sem ter rodado os testes.

## Governance

- Esta constitution prevalece sobre práticas não documentadas. Plans e PRs MUST verificar a
  conformidade com ela. Desvios MUST ser justificados por escrito no plan (seção de complexidade)
  ou no PR.
- Emendas são feitas por PR que altera este arquivo e incrementa a versão em semver:
  - **MAJOR**: remoção ou redefinição incompatível de princípios;
  - **MINOR**: princípio ou seção nova, ou orientação ampliada de forma relevante;
  - **PATCH**: esclarecimentos, redação e formatação.
- Orientação operacional do dia a dia fica no `CLAUDE.md` do projeto e no `~/.claude/CLAUDE.md`.

**Version**: 2.0.0 | **Ratified**: 2026-07-03 | **Last Amended**: 2026-11-11
