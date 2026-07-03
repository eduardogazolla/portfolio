<!--
### Sync Impact Report
- Version change: Template -> 1.0.0
- List of modified principles:
  - [PRINCIPLE_1_NAME] -> I. Hybrid Static/Dynamic Generation (ISR/SSR)
  - [PRINCIPLE_2_NAME] -> II. Headless CMS Integration (Hygraph)
  - [PRINCIPLE_3_NAME] -> III. Visual Excellence & Responsiveness (Tailwind & Framer Motion)
  - [PRINCIPLE_4_NAME] -> IV. Testing Discipline (Jest & Testing Library)
  - [PRINCIPLE_5_NAME] -> V. Clean Architecture & TypeScript Safety
- Added sections: None
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/plan-template.md: ✅ updated
  - .specify/templates/spec-template.md: ✅ updated
  - .specify/templates/tasks-template.md: ✅ updated
- Follow-up TODOs: None
-->

# Eduardo Gazolla Portfolio Constitution

## Core Principles

### I. Hybrid Static/Dynamic Generation (ISR/SSR)
The portfolio MUST leverage Next.js App Router caching and static/dynamic rendering capabilities. Queries to the Hygraph CMS must use revalidation intervals (e.g., 24 hours caching) where appropriate to ensure sub-second page load times and excellent SEO, while allowing content updates to propagate without requiring manual rebuilds.

### II. Headless CMS Integration (Hygraph)
All content assets (projects, work experiences, social handles, profile information) MUST be dynamically fetched from the Hygraph headless CMS. Hardcoding of this data is strictly prohibited to keep code and content concerns fully decoupled.

### III. Visual Excellence & Responsiveness (Tailwind & Framer Motion)
UI components must be visually outstanding, responsive across all screen sizes, and feature smooth animations. They MUST be styled using Tailwind CSS and animated using Framer Motion to provide a premium user experience.

### IV. Testing Discipline (Jest & Testing Library)
To prevent regression and guarantee system stability, core interactive components (e.g., Header, Footer) and utility modules MUST have corresponding automated unit tests. Tests must be implemented in the `tests/` directory using Jest and React Testing Library.

### V. Clean Architecture & TypeScript Safety
The codebase must enforce strict type safety and modular components. Page files under `app/` handle high-level layout and data fetching, while reusable blocks reside in `app/componentes/`. All data queries and payloads must be fully typed in `app/types/` without using `any`.

## Technical Constraints & Performance

* Node.js version 18+ and Next.js 16+ MUST be used.
* Tailwind classes must be kept tidy; use helper utilities like `clsx` and `tailwind-merge` for conditional class combinations.
* Absolute path aliases (e.g., `@/app/...`) MUST be used for all project imports to keep import paths clean.

## Development Workflow & Quality Gates

* All code changes must be introduced via dedicated Git feature branches.
* Running `npm run lint` and `npm run test` must succeed cleanly with zero warnings/errors before code is merged into `main`.
* Local TypeScript types and schema definitions must be updated immediately upon any change to the Hygraph schema queries.

## Governance

This Constitution supersedes all undocumented development practices. Any proposed modifications to these principles require a pull request and a corresponding version increment in accordance with semantic versioning:
* **MAJOR**: Removal or incompatible redefinition of existing principles.
* **MINOR**: Addition of new principles or sections.
* **PATCH**: Refinements, formatting adjustments, or clarifications.

**Version**: 1.0.0 | **Ratified**: 2026-07-03 | **Last Amended**: 2026-07-03
