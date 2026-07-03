# Research: Language Switcher (Troca de Idioma)

## Technical Analysis & Decisions

### 1. Multi-Locale Fetching in Server Components
**Problem:** Next.js Server Components are rendered on the server (statically built during build time or ISR revalidation). Since we chose **not** to use language subroutes (e.g. `/en/projects`), the server does not know the user's preferred language at render time.
**Decision:** We will fetch both languages in parallel on the server using **GraphQL query aliasing** (e.g. `ptPage: page(..., locales: [pt_BR])` and `enPage: page(..., locales: [en])`) in a single GraphQL request.
**Rationale:**
* **SEO & Performance:** The page remains 100% static/ISR (high performance, low TTFB). No client-side fetch or loading spinners.
* **Instant Toggle:** The client component can instantly switch between the pre-fetched Portuguese and English data in memory.
* **Hygraph Compatibility:** Free-tier friendly, no extra API calls, uses native locales.

**Alternatives Considered:**
1. *Next.js Internationalized Routing (Subroutes):* Rejected due to high complexity of restructuring all App Router directories (e.g. moving everything to `app/[locale]/...`).
2. *Client-side Fetching:* Rejected because it hurts SEO (content is not in the initial HTML) and introduces layout shifts/loading states.
3. *Cookie-based SSR:* Rejected because it disables static export/ISR, forcing dynamic server rendering for every request which degrades performance.

---

### 2. Client UI Localization (Static Strings)
**Problem:** UI elements like navigation links ("Home", "Projetos"), contact forms ("Nome", "Enviar"), and footers are hardcoded in the frontend and not stored in the CMS.
**Decision:** We will implement a client-side `LanguageContext` containing a dictionary of static translations (a simple key-value JSON file).
**Rationale:** Easy to maintain, lightweight, and works seamlessly with the global state context.

---

### 3. State Management & Persistence
**Problem:** The selected language must be shared across all components and persist between page reloads.
**Decision:** Use a React `LanguageContext.Provider` wrapping the root of the application in `app/layout.tsx`.
* Save preference in `localStorage`.
* Detect initial language: `localStorage` preference -> Browser language (`navigator.language`) -> Default (`pt-BR`).

---

### 4. GraphQL Schema Schema and Queries
We will update our GraphQL queries to fetch both locales:
```graphql
query PageInfoQuery {
  ptPage: page(where: {slug: "home"}, locales: [pt_BR]) {
    introduction { raw }
    profilePicture { url }
    socials { url iconSvg }
    knownTechs { iconSvg name startDate }
    highlightProjects {
      slug
      thumbnail { url }
      title
      shortDescription
      technologies { name }
    }
  }
  enPage: page(where: {slug: "home"}, locales: [en]) {
    introduction { raw }
    profilePicture { url }
    socials { url iconSvg }
    knownTechs { iconSvg name startDate }
    highlightProjects {
      slug
      thumbnail { url }
      title
      shortDescription
      technologies { name }
    }
  }
  # Same aliasing pattern applies to workExperiences, projects list, and project details
}
```
