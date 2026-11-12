export type Locale = 'pt-BR' | 'en';

export type TranslationDictionary = {
  header: {
    home: string;
    projects: string;
  };
  hero: {
    photoAlt: string;
    nowPrefix: string;
    nowAt: string;
    viewProjects: string;
  };
  projectsPage: {
    subtitle: string;
    title: string;
    description: string;
    // legacy: removed in Part 3
    backToHome: string;
  };
  notFound: {
    title: string;
    description: string;
    backToHome: string;
    viewProjects: string;
    code: string;
  };
  errorPage: {
    title: string;
    description: string;
    retry: string;
    backToHome: string;
    code: string;
    label: string;
  };
  a11y: {
    opensInNewTab: string;
    backToTop: string;
    skipToContent: string;
    languageGroup: string;
    mainNavigation: string;
    elementNotFound: string;
    formSummary: string;
  };
  menu: {
    open: string;
    close: string;
    experience: string;
  };
  stack: {
    title: string;
    subtitle: string;
    since: string;
  };
  experience: {
    sectionTitle: string;
    subtitle: string;
    subtitleShort: string;
    current: string;
    showDetails: string;
    duration: {
      and: string;
      year: string;
      years: string;
      month: string;
      months: string;
    };
  };
  projectsSection: {
    viewAllProjects: string;
    moreComing: string;
    filterAll: string;
    projectsCount: (count: number) => string;
    filterLabel: string;
    noProjectsWith: (tech: string) => string;
    clearFilter: string;
    viewProject: string;
    viewCode: string;
    viewLive: string;
  };
  contactVoice: {
    menuLabel: string;
    primaryButton: string;
    title: string;
    description: string;
    bandDescription: string;
    bandButton: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submit: string;
    submitting: string;
    submittingAnnouncement: string;
    sent: string;
    sentDescription: string;
    sendAnother: string;
    failed: string;
    failedDescription: string;
    retry: string;
    errors: {
      nameRequired: string;
      nameMin: string;
      nameMax: string;
      emailRequired: string;
      emailInvalid: string;
      messageRequired: string;
      messageMax: string;
    };
  };
  projectDetail: {
    backToProjects: string;
    whatItIs: string;
    context: string;
    links: string;
    onlyOneNotice: string;
    backToAll: string;
    about: string;
    technologies: string;
  };
};

const pt: TranslationDictionary = {
  header: {
    home: 'Home',
    projects: 'Projetos',
  },
  hero: {
    photoAlt: 'Retrato de Eduardo Gazolla sorrindo, com as mãos entrelaçadas.',
    nowPrefix: 'Agora:',
    nowAt: 'na',
    viewProjects: 'Ver projetos',
  },
  projectsPage: {
    subtitle: 'projetos',
    title: 'Projetos',
    description:
      'O que construí e estou construindo: as tecnologias usadas, como cada projeto foi feito e o que ele resolve.',
    // legacy: removed in Part 3
    backToHome: 'Voltar para Home',
  },
  notFound: {
    title: 'Essa página não existe.',
    description:
      'O link pode estar quebrado ou a página mudou de lugar. Volte para a Home ou veja os projetos.',
    backToHome: 'Voltar para a Home',
    viewProjects: 'Ver projetos',
    code: '404',
  },
  errorPage: {
    title: 'Algo deu errado.',
    description:
      'Não foi possível carregar este conteúdo agora. Tente de novo ou volte para a Home.',
    retry: 'Tentar de novo',
    backToHome: 'Voltar para a Home',
    code: '500',
    label: 'erro inesperado',
  },
  a11y: {
    opensInNewTab: '(abre em nova aba)',
    backToTop: 'Voltar ao topo',
    skipToContent: 'Pular para o conteúdo',
    languageGroup: 'Idioma',
    mainNavigation: 'Navegação principal',
    elementNotFound: 'elemento não encontrado',
    formSummary: 'O formulário tem erros:',
  },
  menu: {
    open: 'Menu',
    close: 'Fechar',
    experience: 'Experiência',
  },
  stack: {
    title: 'Stack',
    subtitle: 'Tecnologias que uso no dia a dia.',
    since: 'desde',
  },
  experience: {
    sectionTitle: 'Experiência',
    subtitle:
      'Do suporte de TI à qualidade de software: cada etapa me deixou mais perto de quem usa o que eu construo.',
    subtitleShort: 'Do suporte de TI à qualidade de software.',
    current: 'atual',
    showDetails: 'Ver detalhes',
    duration: {
      and: 'e',
      year: 'ano',
      years: 'anos',
      month: 'mês',
      months: 'meses',
    },
  },
  projectsSection: {
    viewAllProjects: 'Ver todos os projetos',
    moreComing:
      'Mais projetos chegando. Enquanto isso, o que estou construindo fica no GitHub.',
    filterAll: 'Todos',
    projectsCount: (count) => `${count} ${count === 1 ? 'projeto' : 'projetos'}`,
    filterLabel: 'Filtrar por tecnologia',
    noProjectsWith: (tech) => `Nenhum projeto com ${tech}`,
    clearFilter: 'Limpar filtro',
    viewProject: 'Ver projeto',
    viewCode: 'Repositório',
    viewLive: 'Ver online',
  },
  contactVoice: {
    menuLabel: 'Contato',
    primaryButton: 'Vamos conversar',
    title: 'Vamos conversar?',
    description: 'Conte o que você precisa, seja uma vaga ou um projeto. A mensagem chega direto para mim.',
    bandDescription: 'Vaga ou projeto, a mensagem chega direto para mim.',
    bandButton: 'Escrever mensagem',
    nameLabel: 'Nome',
    namePlaceholder: 'Seu nome',
    emailLabel: 'E-mail',
    emailPlaceholder: 'voce@empresa.com',
    messageLabel: 'Mensagem',
    messagePlaceholder: 'Conte sobre a vaga ou o projeto',
    submit: 'Enviar mensagem',
    submitting: 'Enviando…',
    submittingAnnouncement: 'Enviando mensagem',
    sent: 'Mensagem enviada.',
    sentDescription:
      'Ela chegou direto para mim. Vou responder no e-mail que você deixou.',
    sendAnother: 'Enviar outra mensagem',
    failed: 'Não consegui enviar agora.',
    failedDescription:
      'Seus dados continuam aqui. Tente de novo ou me chame no LinkedIn.',
    retry: 'Tentar de novo',
    errors: {
      nameRequired: 'Informe seu nome.',
      nameMin: 'O nome precisa ter pelo menos 3 caracteres.',
      nameMax: 'O nome pode ter no máximo 100 caracteres.',
      emailRequired: 'Informe seu e-mail.',
      emailInvalid: 'Falta o domínio. Use algo como nome@gmail.com.',
      messageRequired: 'Escreva sua mensagem antes de enviar.',
      messageMax: 'A mensagem pode ter no máximo 500 caracteres.',
    },
  },
  projectDetail: {
    backToProjects: 'Todos os projetos',
    whatItIs: 'O que é',
    context: 'Contexto',
    links: 'Links',
    onlyOneNotice: 'Por enquanto, este é o único projeto publicado.',
    backToAll: 'Voltar para todos os projetos',
    about: 'Sobre o projeto',
    technologies: 'Tecnologias',
  },
};

const en: TranslationDictionary = {
  header: {
    home: 'Home',
    projects: 'Projects',
  },
  hero: {
    photoAlt: 'Portrait of Eduardo Gazolla smiling, hands clasped.',
    nowPrefix: 'Now:',
    nowAt: 'at',
    viewProjects: 'View projects',
  },
  projectsPage: {
    subtitle: 'projects',
    title: 'Projects',
    description:
      'What I built and am building: the technologies used, how each project was made and what it solves.',
    // legacy: removed in Part 3
    backToHome: 'Back to Home',
  },
  notFound: {
    title: 'This page does not exist.',
    description:
      'The link may be broken or the page may have moved. Go back to Home or see the projects.',
    backToHome: 'Back to Home',
    viewProjects: 'View projects',
    code: '404',
  },
  errorPage: {
    title: 'Something went wrong.',
    description:
      'This content could not be loaded right now. Try again or go back to Home.',
    retry: 'Try again',
    backToHome: 'Back to Home',
    code: '500',
    label: 'unexpected error',
  },
  a11y: {
    opensInNewTab: '(opens in a new tab)',
    backToTop: 'Back to top',
    skipToContent: 'Skip to content',
    languageGroup: 'Language',
    mainNavigation: 'Main navigation',
    elementNotFound: 'element not found',
    formSummary: 'The form has errors:',
  },
  menu: {
    open: 'Menu',
    close: 'Close',
    experience: 'Experience',
  },
  stack: {
    title: 'Stack',
    subtitle: 'Technologies I use day to day.',
    since: 'since',
  },
  experience: {
    sectionTitle: 'Experience',
    subtitle:
      'From IT support to software quality: each step brought me closer to the people who use what I build.',
    subtitleShort: 'From IT support to software quality.',
    current: 'present',
    showDetails: 'Details',
    duration: {
      and: 'and',
      year: 'year',
      years: 'years',
      month: 'month',
      months: 'months',
    },
  },
  projectsSection: {
    viewAllProjects: 'View all projects',
    moreComing:
      'More projects coming. Meanwhile, what I am building lives on GitHub.',
    filterAll: 'All',
    projectsCount: (count) => `${count} ${count === 1 ? 'project' : 'projects'}`,
    filterLabel: 'Filter by technology',
    noProjectsWith: (tech) => `No project with ${tech}`,
    clearFilter: 'Clear filter',
    viewProject: 'View project',
    viewCode: 'Repository',
    viewLive: 'View live',
  },
  contactVoice: {
    menuLabel: 'Contact',
    primaryButton: "Let's talk",
    title: "Let's talk?",
    description: 'Tell me what you need, whether it is a job or a project. The message goes straight to me.',
    bandDescription: 'A job or a project, the message goes straight to me.',
    bandButton: 'Write a message',
    nameLabel: 'Name',
    namePlaceholder: 'Your name',
    emailLabel: 'Email',
    emailPlaceholder: 'you@company.com',
    messageLabel: 'Message',
    messagePlaceholder: 'Tell me about the job or the project',
    submit: 'Send message',
    submitting: 'Sending…',
    submittingAnnouncement: 'Sending message',
    sent: 'Message sent.',
    sentDescription:
      'It reached me directly. I will reply to the email you left.',
    sendAnother: 'Send another message',
    failed: 'I could not send it right now.',
    failedDescription:
      'Your details are still here. Try again or reach me on LinkedIn.',
    retry: 'Try again',
    errors: {
      nameRequired: 'Enter your name.',
      nameMin: 'The name must have at least 3 characters.',
      nameMax: 'The name can have at most 100 characters.',
      emailRequired: 'Enter your email.',
      emailInvalid: 'The domain is missing. Use something like name@gmail.com.',
      messageRequired: 'Write your message before sending.',
      messageMax: 'The message can have at most 500 characters.',
    },
  },
  projectDetail: {
    backToProjects: 'All projects',
    whatItIs: 'What it is',
    context: 'Context',
    links: 'Links',
    onlyOneNotice: 'For now, this is the only published project.',
    backToAll: 'Back to all projects',
    about: 'About the project',
    technologies: 'Technologies',
  },
};

export const dictionaries: Record<Locale, TranslationDictionary> = {
  'pt-BR': pt,
  'en': en,
};

/**
 * Returns the translation dictionary for a given locale.
 * Falls back to Portuguese if the locale is not found.
 */
export function getTranslations(locale: Locale): TranslationDictionary {
  return dictionaries[locale] ?? dictionaries['pt-BR'];
}
