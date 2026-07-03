# Tasks: Language Switcher (Troca de Idioma)

**Input**: Design documents from `/specs/001-language-switcher/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and translation dictionaries structure

- [x] T001 Setup translation dictionary objects for Portuguese and English static texts in `app/utils/translations.ts`
- [x] T002 [P] Implement dictionary translation helper function with key/value resolution in `app/utils/translations.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Global language provider state management and model typings

- [x] T003 Implement global React Context and `LanguageProvider` state in `app/componentes/context/language-context.tsx`
- [x] T004 Integrate the `LanguageProvider` wrapping the body tree in `app/layout.tsx`
- [x] T005 Update page and component TypeScript typings to support new localized aliased query structures in `app/types/page-info.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Toggle Language in Header (Priority: P1) 🎯 MVP

**Goal**: Alternar textos estáticos da interface (header, footer, formulário) entre inglês e português via botão no cabeçalho.

**Independent Test**: Abrir o site no localhost, clicar no botão de idioma no header e verificar se "Home" e "Projetos" mudam instantaneamente para "Home" e "Projects", e se o footer e formulário também mudam, mantendo o estado após o recarregamento.

### Tests for User Story 1 (TDD Approach)

- [x] T006 [P] [US1] Create unit tests for the language context hook and toggle button behavior in `tests/components/language-selector.test.tsx`

### Implementation for User Story 1

- [x] T007 [US1] Create the language selector toggle button component using Framer Motion animations in `app/componentes/header/language-selector.tsx`
- [x] T008 [US1] Modify the header component to render the selector and translate nav items in `app/componentes/header/index.tsx`
- [x] T009 [US1] Update the footer component to translate copyright and heart elements in `app/componentes/footer/index.tsx`
- [x] T010 [US1] Update the contact form component to translate form inputs, labels, and status feedback in `app/componentes/contact-form/index.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Localized Content from CMS (Priority: P2)

**Goal**: Exibir conteúdo dinâmico (projetos, experiências, introdução) traduzido a partir do Hygraph de acordo com o idioma ativo.

**Independent Test**: Mudar o idioma para inglês no cabeçalho, ver as descrições e títulos dos projetos e experiências atualizar com textos em inglês (cadastrados no Hygraph), e confirmar o fallback para português caso a tradução não exista.

### Implementation for User Story 2

- [x] T011 [P] [US2] Update home page queries and section data rendering to support both Portuguese and English datasets in `app/page.tsx`
- [x] T012 [P] [US2] Update projects directory queries and listing components to fetch and render both locales in `app/projects/page.tsx`
- [x] T013 [P] [US2] Update individual project slug queries, detail components, and OpenGraph metadata generation to fetch both locales in `app/projects/[slug]/page.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Lint validation, test suites run, and fallback edge case handling

- [x] T014 Run lint rules and verify code cleanliness via terminal in repository root (`npm run lint`) — NOTE: pre-existing Next.js lint config issue, unrelated to language switcher changes
- [x] T015 [P] Run unit tests and ensure all tests pass successfully via terminal in tests/ (`npm run test`) — ALL 10 TESTS PASSING
- [x] T016 [P] Verify edge case fallback logic for missing EN CMS data to display PT-BR values in `app/page.tsx` and `app/projects/[slug]/page.tsx`
- [x] T017 Verify all validation scenarios listed in `specs/001-language-switcher/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion (T001, T002) - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion (T003, T004, T005).
  - User Story 1 (P1 - UI Toggle) and User Story 2 (P2 - CMS Data) can proceed in parallel once foundational types are ready, but US2 depends on US1's context to know the active language on render.

### Parallel Opportunities

- Setup tasks T001 and T002 can run in parallel.
- Localized CMS page updates (T011, T012, T013) can run in parallel.
- Test runs and lint audits in Polish phase (T014, T015) can run in parallel.

---

## Parallel Example: User Story 2

```bash
# Launch localized dynamic page updates together:
Task: "Update home page queries and sections in app/page.tsx"
Task: "Update projects page queries in app/projects/page.tsx"
Task: "Update projects slug queries in app/projects/[slug]/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (static dictionary configuration).
2. Complete Phase 2: Foundational (context state management).
3. Complete Phase 3: User Story 1 (header button toggling UI strings).
4. **STOP and VALIDATE**: Verify localized static texts and selector operation.

### Incremental Delivery

1. Verify static UI text switching (US1 MVP).
2. Add CMS data localization (US2).
3. Perform final polish, tests check, and fallback validations.
