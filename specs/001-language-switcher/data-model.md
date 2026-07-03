# Data Model: Language Switcher (Troca de Idioma)

## Types & State Structures

### 1. Locale Type
Representação do idioma ativo no sistema.
```typescript
type Locale = 'pt-BR' | 'en';
```

---

### 2. Language Context State (`LanguageContextProps`)
O estado global que gerencia o idioma e expõe a função de alternância.
```typescript
interface LanguageContextProps {
  locale: Locale;
  toggleLocale: () => void;
  translate: (key: string) => string;
}
```

---

### 3. Localized UI Dictionary Schema (`TranslationDictionary`)
Dicionário de traduções locais para os textos estáticos da interface.
```typescript
interface TranslationDictionary {
  header: {
    home: string;
    projects: string;
  };
  footer: {
    madeWith: string;
    by: string;
  };
  contact: {
    title: string;
    description: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    sendButton: string;
    successMessage: string;
    errorMessage: string;
  };
  home: {
    experienceTitle: string;
    projectsTitle: string;
    techsTitle: string;
    contactTitle: string;
  };
}
```

---

### 4. CMS Localized Page Data Types
Precisamos tipar os retornos do CMS que agora virão duplicados por conta do aliasing:
```typescript
// app/types/page-info.ts

export interface HomePageData {
  ptPage: PageInfo;
  enPage: PageInfo;
  ptWorkExperiences: WorkExperience[];
  enWorkExperiences: WorkExperience[];
}

export interface ProjectsPageData {
  ptProjects: Project[];
  enProjects: Project[];
}

export interface ProjectPageData {
  ptProject: ProjectDetails;
  enProject: ProjectDetails;
}
```
*(Os tipos internos `PageInfo`, `WorkExperience`, `Project` e `ProjectDetails` permanecem com suas estruturas de campos originais).*
