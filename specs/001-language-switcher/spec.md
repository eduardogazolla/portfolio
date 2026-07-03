# Feature Specification: Language Switcher (Troca de Idioma)

**Feature Branch**: `001-language-switcher`

**Created**: 2026-07-03

**Status**: Ready

**Input**: User description: "eu quero fazer uma implementacao de troca de linguagem, quero ter um botao no cabecalho do projeto que posso alternar o site inteiro entre ingles e portugues"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Toggle Language in Header (Priority: P1)

As a website visitor, I want to click a language selector in the header so that all static UI text immediately translates between Portuguese and English.

**Why this priority**: It is the core mechanism of the language switcher and provides the direct entry point for visitors.

**Independent Test**: Verify that clicking the language button toggle in the header toggles the text of the header links and footer between Portuguese and English.

**Acceptance Scenarios**:

1. **Given** the user is on any page, **When** they click the language toggle button, **Then** all static UI labels (e.g., "Home", "Projetos", "Made with") translate to the target language instantly.
2. **Given** the user has toggled the language, **When** they navigate to another page or refresh, **Then** the selected language is persisted and loaded automatically.

---

### User Story 2 - Localized Content from CMS (Priority: P2)

As a website visitor, I want the project and experience content loaded from Hygraph to reflect my selected language.

**Why this priority**: Essential to have the actual portfolio content (descriptions, project names, intros) translated, not just the shell/UI.

**Independent Test**: Verify that switching language updates the dynamic content fetched from the CMS.

**Acceptance Scenarios**:

1. **Given** the language is set to English, **When** page fetches data from Hygraph, **Then** the English version of the introduction, work experiences, and project details is rendered.
2. **Given** the language is set to Portuguese, **When** the page fetches data from Hygraph, **Then** the Portuguese version of the content is rendered.

---

### Edge Cases

- **Slow Network / CMS fetch failure**: If the CMS query for a specific locale fails or returns empty, the UI MUST fall back gracefully to the default locale (Portuguese) rather than showing blank text or crashing.
- **First-time Visitor**: For visitors with no saved preference in `localStorage`, the system SHOULD detect their browser language (via `navigator.language`) and default to English if it is non-Portuguese, otherwise default to Portuguese.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A language selector component MUST be added to the header, styled to match the dark theme and responsive.
- **FR-002**: The application MUST persist the selected language in `localStorage` so that the preference is remembered across page refreshes and future visits.
- **FR-003**: The application MUST support a translation dictionary for all static UI strings (e.g., header menu links, contact form labels, footer text).
- **FR-004**: The system MUST fetch localized dynamic data from the CMS (Hygraph) utilizing the native Hygraph Locales feature (e.g. sending the locale query header/argument).
- **FR-005**: Language state MUST be managed globally via a React Context/Provider to avoid prop drilling and ensure all components update immediately.
- **FR-006**: The URL structure MUST remain unchanged upon language toggle (no subroutes). Active locale state will be client-driven.

### Key Entities

- **Locale**: The configuration representing the active language (Portuguese `pt-BR` or English `en-US`).
- **TranslationDictionary**: Local mapping of UI keys to translated text values.
- **CMSLocalizedContent**: Dynamic models fetched from Hygraph, containing translated content fields.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Clicking the language toggle updates all UI strings in under 100ms.
- **SC-002**: 100% of static UI labels and contact form text are translated when language is switched.
- **SC-003**: Persistence ensures returning users see their preferred language on 100% of visits without visual flicker.

## Assumptions

- We assume Portuguese is the default language if no preference is set and the browser language is Portuguese.
- Hygraph native localization features will be utilized on the free tier (which allows up to 2 locales).
