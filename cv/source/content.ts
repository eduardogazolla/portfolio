import type { CvContent, CvEntry, CvLang } from "./types";

// Single source of truth for the public CVs (see docs/cv/content-review.md).
// Public file: no client or brand names, no internal metrics, no phone.

const PORTFOLIO = "https://eduardogazolla.dev";
const API_REPO = "https://github.com/eduardogazolla/api-rest";
const HOUR_SYNC = "https://hoursync.vercel.app";

const contact = (lang: CvLang): CvContent["contact"] => [
  { icon: "web", label: "eduardogazolla.dev", href: PORTFOLIO },
  { icon: "mail", label: "eduardogazolla1@gmail.com", href: "mailto:eduardogazolla1@gmail.com" },
  { icon: "linkedin", label: "linkedin.com/in/eduardogazolla", href: "https://www.linkedin.com/in/eduardogazolla/" },
  { icon: "github", label: "github.com/eduardogazolla", href: "https://github.com/eduardogazolla" },
  { icon: "pin", label: lang === "pt" ? "Cianorte/PR · Remoto" : "Cianorte, Brazil · Remote" },
];

const labels: Record<CvLang, CvContent["labels"]> = {
  pt: {
    contact: "Contato",
    highlights: "Destaques",
    projects: "Projetos",
    experience: "Experiência",
    languages: "Idiomas",
    education: "Formação",
    courses: "Cursos",
    featured: "Destaque",
    others: "Outros",
    certificate: "certificado",
    photoAlt: "Foto de Eduardo Gazolla",
  },
  en: {
    contact: "Contact",
    highlights: "Highlights",
    projects: "Projects",
    experience: "Experience",
    languages: "Languages",
    education: "Education",
    courses: "Courses",
    featured: "Core",
    others: "Also",
    certificate: "certificate",
    photoAlt: "Photo of Eduardo Gazolla",
  },
};

const languages: CvContent["languages"] = [{ name: "", level: "B2" }];

const education: Record<CvLang, CvContent["education"]> = {
  pt: [
    { title: "Engenharia de Software", detail: "Cursando · Unipar, Cianorte · previsão 2030" },
    { title: "Análise e Desenvolvimento de Sistemas", detail: "Graduado · Unipar, Cianorte · 2025" },
  ],
  en: [
    { title: "B.Eng. in Software Engineering", detail: "In progress · Unipar, Brazil · expected 2030" },
    { title: "Systems Analysis and Development (associate degree)", detail: "Completed · Unipar, Brazil · 2025" },
  ],
};

const courses = (lang: CvLang): CvContent["courses"] => {
  const alura = (hours: number, date: string) => `Alura · ${hours} h · ${date}`;
  return [
    {
      title: "Spring Boot 3: desenvolva uma API Rest em Java",
      detail: alura(10, "10/2026"),
      href: "https://cursos.alura.com.br/certificate/bd75a23b-62b0-4296-aa17-5f5017a095ef",
    },
    {
      title: lang === "pt" ? "Java: aplicando a Orientação a Objetos" : "Java: applying Object-Oriented Programming",
      detail: alura(10, "09/2026"),
      href: "https://cursos.alura.com.br/certificate/87c5e6ad-d79e-4dc7-9b3f-9d56ccc41b01",
    },
    {
      title: lang === "pt" ? "Java: criando a sua primeira aplicação" : "Java: building your first application",
      detail: alura(8, "09/2026"),
      href: "https://cursos.alura.com.br/certificate/6d679531-034d-4c10-b476-e7b581fcdce7",
    },
  ];
};

const shared = (lang: CvLang) => ({
  lang,
  name: { first: "Eduardo Izidoro", last: "Gazolla" },
  labels: labels[lang],
  contact: contact(lang),
  languages: languages.map((l) => ({ ...l, name: lang === "pt" ? "Inglês" : "English" })),
  education: education[lang],
  courses: courses(lang),
});

// ---------- Entries ----------

const olderJobs: Record<CvLang, CvEntry[]> = {
  pt: [
    { title: "Auxiliar Administrativo", period: "Jan/2023 – Fev/2025", org: "Loja Comac", meta: "Cianorte/PR", bullets: [] },
    { title: "Estagiário de TI", period: "Jan/2022 – Jan/2023", org: "IAT – Instituto Água e Terra", meta: "Cianorte/PR", bullets: [] },
  ],
  en: [
    { title: "Administrative Assistant", period: "Jan 2023 – Feb 2025", org: "Loja Comac", meta: "Cianorte, Brazil", bullets: [] },
    { title: "IT Intern", period: "Jan 2022 – Jan 2023", org: "IAT – Instituto Água e Terra (state environmental agency)", meta: "Cianorte, Brazil", bullets: [] },
  ],
};

const db1 = {
  pt: {
    title: "Analista de Testes (QA)",
    period: "Fev/2025 – Atual",
    org: "DB1 Global Software",
    meta: "Cliente do varejo automotivo",
    context: "Plataforma própria de e-commerce multi-tenant, com tenants de site e app mobile.",
  },
  en: {
    title: "QA Analyst",
    period: "Feb 2025 – Present",
    org: "DB1 Global Software",
    meta: "Automotive retail client",
    context: "In-house multi-tenant e-commerce platform, with website and mobile app tenants.",
  },
} satisfies Record<CvLang, Omit<CvEntry, "bullets">>;

const portfolioProject = {
  pt: (focus: "qa" | "java"): CvEntry => ({
    title: "Portfólio pessoal",
    period: "2026",
    org: "Next.js · React · TypeScript · Playwright",
    link: { label: "eduardogazolla.dev", href: PORTFOLIO },
    bullets:
      focus === "qa"
        ? [
            "Site bilíngue (PT/EN) com conteúdo de um CMS headless e formulário de contato validado no cliente e no servidor.",
            "**Mais de 400 testes unitários** (Jest + Testing Library) e **mais de 50 testes E2E com Playwright**, cobrindo navegação, teclado, idioma, formulário e acessibilidade (axe).",
            "Nota **100 em Acessibilidade, SEO e Boas Práticas** no Lighthouse.",
          ]
        : [
            "Site bilíngue com CMS headless e API de contato com validação no servidor, coberto por **mais de 400 testes unitários e 50 testes E2E** com Playwright.",
          ],
  }),
  en: (focus: "qa" | "java"): CvEntry => ({
    title: "Personal portfolio",
    period: "2026",
    org: "Next.js · React · TypeScript · Playwright",
    link: { label: "eduardogazolla.dev", href: PORTFOLIO },
    bullets:
      focus === "qa"
        ? [
            "Bilingual site (PT/EN) with content from a headless CMS and a contact form validated on client and server.",
            "**400+ unit tests** (Jest + Testing Library) and **50+ Playwright E2E tests** covering navigation, keyboard, language switching, the form and accessibility (axe).",
            "Lighthouse score of **100 for Accessibility, SEO and Best Practices**.",
          ]
        : [
            "Bilingual site with a headless CMS and a server-validated contact API, covered by **400+ unit tests and 50+ Playwright E2E tests**.",
          ],
  }),
};

const hourSync: Record<CvLang, CvEntry> = {
  pt: {
    title: "Hour Sync",
    period: "2024",
    org: "React · TypeScript · Tailwind · Node",
    link: { label: "hoursync.vercel.app", href: HOUR_SYNC },
    bullets: ["Sistema de controle de ponto, feito como projeto integrador da faculdade, com painel do administrador e relatório por colaborador."],
  },
  en: {
    title: "Hour Sync",
    period: "2024",
    org: "React · TypeScript · Tailwind · Node",
    link: { label: "hoursync.vercel.app", href: HOUR_SYNC },
    bullets: ["Time-tracking system built as a college capstone project, with an admin dashboard and per-employee reports."],
  },
};

const hourSyncCompact: Record<CvLang, CvEntry> = {
  pt: { ...hourSync.pt, org: "Controle de ponto · projeto integrador", meta: "React · Node", bullets: [] },
  en: { ...hourSync.en, org: "Time tracking · college capstone", meta: "React · Node", bullets: [] },
};

const apiRest: Record<CvLang, CvEntry> = {
  pt: {
    title: "API REST · Voll.med",
    period: "2026",
    org: "Java 17 · Spring Boot 4",
    link: { label: "github.com/eduardogazolla/api-rest", href: API_REPO },
    bullets: [
      "API REST de cadastro de médicos com **CRUD completo**, paginação, ordenação, exclusão lógica e reativação.",
      "**Arquitetura em camadas** (Controller → Service → Repository), DTOs com records, Bean Validation e **tratamento de erros centralizado**.",
      "Spring Data JPA com MySQL, schema versionado com **Flyway** e documentação com Swagger (SpringDoc).",
      "**Testes unitários com JUnit 5 e Mockito**, rodando com H2 sem depender do MySQL. Código revisado por mentor.",
    ],
  },
  en: {
    title: "REST API · Voll.med",
    period: "2026",
    org: "Java 17 · Spring Boot 4",
    link: { label: "github.com/eduardogazolla/api-rest", href: API_REPO },
    bullets: [
      "REST API for managing doctors, with **full CRUD**, pagination, sorting, soft delete and reactivation.",
      "**Layered architecture** (Controller → Service → Repository), record DTOs, Bean Validation and **centralized error handling**.",
      "Spring Data JPA with MySQL, schema versioned with **Flyway**, and Swagger (SpringDoc) docs.",
      "**Unit tests with JUnit 5 and Mockito**, running on H2 without MySQL. Code reviewed by a mentor.",
    ],
  },
};

// ---------- Variants ----------

const qaPt: CvContent = {
  ...shared("pt"),
  variant: "qa",
  documentTitle: "Eduardo Gazolla · Currículo · Analista de Testes (QA)",
  headline: "Analista de Testes (QA)",
  summary:
    "Analista de Testes na DB1 Global Software desde fevereiro de 2025, na plataforma própria de e-commerce multi-tenant de um cliente do varejo automotivo, com sites e app mobile. Participei de 3 lançamentos e atuo na sustentação de um dos sites, com foco em checkout, meios de pagamento, integrações e app mobile. Também desenvolvo front-end, com testes automatizados de ponta a ponta nos meus projetos.",
  highlights: [
    { value: "3 lançamentos", label: "App mobile · e-commerce", text: "App mobile (iOS e Android) e 2 sites de e-commerce." },
    { value: "~3× mais rápido", label: "Pós-deploy", text: "Smoke pós-deploy no lugar da regressão completa (estimativa do time)." },
    { value: "4 produtos", label: "Multi-tenant", text: "Sites e app de marcas diferentes na mesma plataforma." },
    { value: "50+ testes E2E", label: "Playwright · axe", text: "No meu portfólio, com nota 100 de acessibilidade no Lighthouse." },
  ],
  skills: [
    {
      title: "Qualidade",
      featured: ["Testes exploratórios", "Regressão", "Smoke pós-deploy", "BDD / Gherkin", "Playwright + TypeScript"],
      others: ["Testes funcionais", "Mobile iOS e Android", "Checkout", "Meios de pagamento", "OMS / ERP / Gateway", "Backoffice", "Jira", "Acessibilidade (axe)"],
    },
    { title: "Front-end", featured: ["React", "Next.js", "TypeScript", "Tailwind"], others: [] },
    { title: "Back-end", featured: ["Java", "Spring Boot", "API REST"], others: [] },
  ],
  sections: ["experience", "projects"],
  experience: [
    {
      ...db1.pt,
      bullets: [
        "Testei o **lançamento do app de e-commerce** (iOS via TestFlight e Android), com testes exploratórios, funcionais e smoke em produção a cada versão.",
        "Participei do **lançamento de dois sites de e-commerce** na mesma plataforma.",
        "Atuo na **sustentação de um site de e-commerce**, com regressão e smoke test a cada deploy em produção.",
        "Valido **integrações com OMS, ERP e gateway de pagamento** e funcionalidades de backoffice, como grupos de produtos, selos e cartões informativos.",
        "Escrevo **casos de teste em BDD/Gherkin** com happy path, cenários negativos, edge cases, riscos e gaps, considerando cada tenant.",
        "Registro bugs no Jira com **severidade e camada** (front, back, API, serviços), separando bug de retrabalho pelos critérios de aceite.",
        "Trabalho em squad grande, integrado com devs e PO.",
      ],
    },
    ...olderJobs.pt,
  ],
  projects: [portfolioProject.pt("qa"), hourSync.pt],
};

const qaEn: CvContent = {
  ...shared("en"),
  variant: "qa",
  documentTitle: "Eduardo Gazolla · CV · QA Analyst",
  headline: "QA Analyst",
  summary:
    "QA Analyst at DB1 Global Software since February 2025, working on an automotive retail client's in-house multi-tenant e-commerce platform, with websites and a mobile app. I took part in 3 launches and support one of the live sites, focusing on checkout, payments, integrations and the mobile app. I also build front-end, with end-to-end automated tests in my own projects.",
  highlights: [
    { value: "3 launches", label: "Mobile app · e-commerce", text: "Mobile app (iOS and Android) and 2 e-commerce sites." },
    { value: "~3× faster", label: "Post-deploy", text: "Post-deploy smoke test instead of the full regression (team estimate)." },
    { value: "4 products", label: "Multi-tenant", text: "Websites and an app for different brands on one platform." },
    { value: "50+ E2E tests", label: "Playwright · axe", text: "In my portfolio, with a 100 Lighthouse accessibility score." },
  ],
  skills: [
    {
      title: "Quality",
      featured: ["Exploratory testing", "Regression", "Post-deploy smoke", "BDD / Gherkin", "Playwright + TypeScript"],
      others: ["Functional testing", "Mobile iOS and Android", "Checkout", "Payments", "OMS / ERP / Gateway", "Back office", "Jira", "Accessibility (axe)"],
    },
    { title: "Front-end", featured: ["React", "Next.js", "TypeScript", "Tailwind"], others: [] },
    { title: "Back-end", featured: ["Java", "Spring Boot", "REST API"], others: [] },
  ],
  sections: ["experience", "projects"],
  experience: [
    {
      ...db1.en,
      bullets: [
        "Tested the **e-commerce mobile app launch** (iOS via TestFlight and Android) with exploratory, functional and production smoke tests on every release.",
        "Took part in the **launch of two e-commerce sites** on the same platform.",
        "**Support a live e-commerce site**, running regression and smoke tests on every production deploy.",
        "Validate **OMS, ERP and payment gateway integrations** and back-office features such as product groups, badges and info cards.",
        "Write **BDD/Gherkin test cases** covering happy paths, negative scenarios, edge cases, risks and gaps for each tenant.",
        "Log bugs in Jira with **severity and layer** (front, back, API, services), telling bugs from rework by the acceptance criteria.",
        "Work in a large squad alongside developers and the PO.",
      ],
    },
    ...olderJobs.en,
  ],
  projects: [portfolioProject.en("qa"), hourSync.en],
};

const javaPt: CvContent = {
  ...shared("pt"),
  variant: "java",
  documentTitle: "Eduardo Gazolla · Currículo · Desenvolvedor Java",
  headline: "Desenvolvedor Java · Back-end",
  subline: "Em transição · Atualmente QA na DB1",
  summary:
    "Em transição de QA para desenvolvimento back-end com Java e Spring Boot. Desenvolvi uma API REST com arquitetura em camadas, migrations com Flyway e testes unitários com JUnit 5 e Mockito, com revisão de mentor. Desde fevereiro de 2025 sou Analista de Testes na DB1, em um e-commerce multi-tenant, onde valido regras de negócio e integrações com OMS, ERP e gateway e escrevo cenários em BDD: uma base que levo para escrever código testável.",
  highlights: [
    { value: "API REST", label: "Java 17 · Spring Boot 4", text: "CRUD completo, paginação, exclusão lógica e testes com JUnit 5 e Mockito." },
    { value: "OMS · ERP · Gateway", label: "Integrações · e-commerce", text: "Validação de integrações de e-commerce em produção." },
    { value: "3 lançamentos", label: "QA · e-commerce", text: "App mobile (iOS e Android) e 2 sites de e-commerce." },
    { value: "~3× mais rápido", label: "QA · pós-deploy", text: "Smoke pós-deploy no lugar da regressão completa (estimativa do time)." },
  ],
  skills: [
    {
      title: "Back-end",
      featured: ["Java", "Spring Boot", "API REST", "JUnit 5 + Mockito"],
      others: ["Orientação a Objetos", "Spring Data JPA", "MySQL", "Flyway", "Bean Validation", "Swagger", "Maven", "Git / GitHub"],
    },
    {
      title: "Qualidade",
      featured: ["BDD / Gherkin", "Testes exploratórios"],
      others: ["Regressão", "Smoke pós-deploy", "Playwright + TypeScript", "Jira"],
    },
    { title: "Front-end", featured: [], others: ["React", "Next.js", "TypeScript", "Tailwind"] },
  ],
  sections: ["projects", "experience"],
  projects: [apiRest.pt, portfolioProject.pt("java"), hourSyncCompact.pt],
  experience: [
    {
      ...db1.pt,
      context: "Plataforma própria de e-commerce multi-tenant.",
      bullets: [
        "Testei o **lançamento do app de e-commerce** (iOS e Android) e de dois sites, e atuo na **sustentação** de um deles, com regressão e smoke a cada deploy.",
        "Valido **integrações com OMS, ERP e gateway de pagamento**, checkout e funcionalidades de backoffice.",
        "Escrevo **casos de teste em BDD/Gherkin** e registro bugs no Jira por **camada (front, back, API, serviços)**, apontando a origem técnica do defeito.",
        "Automatizo **testes E2E com Playwright e TypeScript**, usando Page Object Model.",
      ],
    },
    ...olderJobs.pt,
  ],
};

const javaEn: CvContent = {
  ...shared("en"),
  variant: "java",
  documentTitle: "Eduardo Gazolla · CV · Java Developer",
  headline: "Java Developer · Back-end",
  subline: "Career transition · Currently QA at DB1",
  summary:
    "Moving from QA into back-end development with Java and Spring Boot. I built a REST API with a layered architecture, Flyway migrations and unit tests with JUnit 5 and Mockito, reviewed by a mentor. Since February 2025 I have been a QA Analyst at DB1 on a multi-tenant e-commerce platform, validating business rules and OMS, ERP and gateway integrations and writing BDD scenarios: a foundation I bring to writing testable code.",
  highlights: [
    { value: "REST API", label: "Java 17 · Spring Boot 4", text: "Full CRUD, pagination, soft delete and tests with JUnit 5 and Mockito." },
    { value: "OMS · ERP · Gateway", label: "Integrations · e-commerce", text: "Validating e-commerce integrations in production." },
    { value: "3 launches", label: "QA · e-commerce", text: "Mobile app (iOS and Android) and 2 e-commerce sites." },
    { value: "~3× faster", label: "QA · post-deploy", text: "Post-deploy smoke test instead of the full regression (team estimate)." },
  ],
  skills: [
    {
      title: "Back-end",
      featured: ["Java", "Spring Boot", "REST API", "JUnit 5 + Mockito"],
      others: ["Object-Oriented Programming", "Spring Data JPA", "MySQL", "Flyway", "Bean Validation", "Swagger", "Maven", "Git / GitHub"],
    },
    {
      title: "Quality",
      featured: ["BDD / Gherkin", "Exploratory testing"],
      others: ["Regression", "Post-deploy smoke", "Playwright + TypeScript", "Jira"],
    },
    { title: "Front-end", featured: [], others: ["React", "Next.js", "TypeScript", "Tailwind"] },
  ],
  sections: ["projects", "experience"],
  projects: [apiRest.en, portfolioProject.en("java"), hourSyncCompact.en],
  experience: [
    {
      ...db1.en,
      context: "In-house multi-tenant e-commerce platform.",
      bullets: [
        "Tested the **launch of the e-commerce mobile app** (iOS and Android) and two sites, and **support** one of them with regression and smoke tests on every deploy.",
        "Validate **OMS, ERP and payment gateway integrations**, checkout and back-office features.",
        "Write **BDD/Gherkin test cases** and log bugs in Jira by **layer (front, back, API, services)**, pointing to the defect's technical origin.",
        "Automate **E2E tests with Playwright and TypeScript** using the Page Object Model.",
      ],
    },
    ...olderJobs.en,
  ],
};

export const cvVariants: CvContent[] = [qaPt, qaEn, javaPt, javaEn];
