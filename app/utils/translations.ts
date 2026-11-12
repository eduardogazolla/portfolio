export type Locale = 'pt-BR' | 'en';

export type TranslationDictionary = {
  header: {
    home: string;
    projects: string;
  };
  hero: {
    greeting: string;
    contactButton: string;
    role: string;
    nowPrefix: string;
    nowAt: string;
    viewProjects: string;
    talkButton: string;
  };
  knownTechs: {
    subtitle: string;
    title: string;
    experience: string;
  };
  highlightedProjects: {
    subtitle: string;
    title: string;
    interested: string;
    viewAll: string;
  };
  workExperience: {
    subtitle: string;
    title: string;
    description: string;
  };
  contact: {
    subtitle: string;
    title: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    sendButton: string;
    successMessage: string;
    errorMessage: string;
  };
  footer: {
    madeWith: string;
    by: string;
  };
  projectsPage: {
    subtitle: string;
    title: string;
    description: string;
    backToHome: string;
  };
  notFound: {
    title: string;
    description: string;
    backToHome: string;
    code: string;
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
    contact: string;
  };
  stack: {
    subtitle: string;
    description: string;
    since: string;
  };
  experience: {
    sectionTitle: string;
    current: string;
    present: string;
    showDetails: string;
    hideDetails: string;
  };
  projectsSection: {
    viewAllProjects: string;
    moreComing: string;
    filterAll: string;
    projectsCount: string;
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
    sendAnother: string;
    failed: string;
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
};

const pt: TranslationDictionary = {
  header: {
    home: 'Home',
    projects: 'Projetos',
  },
  hero: {
    greeting: 'Olá, meu nome é',
    contactButton: 'Entre em contato',
    role: 'Desenvolvedor front-end e analista de testes',
    nowPrefix: 'Agora:',
    nowAt: 'na',
    viewProjects: 'Ver projetos',
    talkButton: 'Vamos conversar',
  },
  knownTechs: {
    subtitle: 'competências',
    title: 'Conhecimentos',
    experience: 'de experiência',
  },
  highlightedProjects: {
    subtitle: 'destaques',
    title: 'Projetos',
    interested: 'Se interessou?',
    viewAll: 'Ver todos',
  },
  workExperience: {
    subtitle: 'experiências',
    title: 'Experiência Profissional',
    description:
      'Estou sempre aberto a novos desafios e projetos emocionantes. Vamos trabalhar juntos para criar soluções incríveis para sua empresa!',
  },
  contact: {
    subtitle: 'contato',
    title: 'Vamos trabalhar juntos? Entre em contato',
    namePlaceholder: 'Nome',
    emailPlaceholder: 'E-mail',
    messagePlaceholder: 'Mensagem',
    sendButton: 'Enviar mensagem',
    successMessage: 'Mensagem enviada com sucesso!',
    errorMessage: 'Ocorreu um erro ao enviar a mensagem. Tente novamente.',
  },
  footer: {
    madeWith: 'Feito com',
    by: 'por',
  },
  projectsPage: {
    subtitle: 'projetos',
    title: 'Meus projetos',
    description:
      'Aqui você poderá ver alguns dos trabalhos que desenvolvi e estou desenvolvendo. Fique à vontade para ver todos os meus projetos, como foram criados, as tecnologias usadas neles e as funcionalidades que cada um tem.',
    backToHome: 'Voltar para Home',
  },
  notFound: {
    title: 'Página não encontrada',
    description: 'A página que você procura não existe ou foi removida.',
    backToHome: 'Voltar para Home',
    code: '404',
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
    contact: 'Contato',
  },
  stack: {
    subtitle: 'Stack',
    description: 'Tecnologias que uso no dia a dia.',
    since: 'desde',
  },
  experience: {
    sectionTitle: 'Experiência',
    current: 'atual',
    present: 'atual',
    showDetails: 'Ver detalhes',
    hideDetails: 'Ocultar detalhes',
  },
  projectsSection: {
    viewAllProjects: 'Ver todos os projetos',
    moreComing: 'Mais projetos chegando…',
    filterAll: 'Todos',
    projectsCount: 'projetos',
    viewProject: 'Ver projeto',
    viewCode: 'Ver código',
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
    emailPlaceholder: 'voce@exemplo.com',
    messageLabel: 'Mensagem',
    messagePlaceholder: 'Conte um pouco sobre a vaga ou o projeto',
    submit: 'Enviar mensagem',
    submitting: 'Enviando…',
    submittingAnnouncement: 'Enviando mensagem',
    sent: 'Mensagem enviada.',
    sendAnother: 'Enviar outra mensagem',
    failed: 'Não consegui enviar agora.',
    retry: 'Tentar de novo',
    errors: {
      nameRequired: 'Informe seu nome.',
      nameMin: 'O nome precisa ter pelo menos 3 caracteres.',
      nameMax: 'O nome pode ter no máximo 100 caracteres.',
      emailRequired: 'Informe seu e-mail.',
      emailInvalid: 'Informe um e-mail válido.',
      messageRequired: 'Escreva uma mensagem.',
      messageMax: 'A mensagem pode ter no máximo 500 caracteres.',
    },
  },
};

const en: TranslationDictionary = {
  header: {
    home: 'Home',
    projects: 'Projects',
  },
  hero: {
    greeting: 'Hello, my name is',
    contactButton: 'Get in touch',
    role: 'Front-end developer and test analyst',
    nowPrefix: 'Now:',
    nowAt: 'at',
    viewProjects: 'View projects',
    talkButton: "Let's talk",
  },
  knownTechs: {
    subtitle: 'skills',
    title: 'Knowledge',
    experience: 'of experience',
  },
  highlightedProjects: {
    subtitle: 'highlights',
    title: 'Projects',
    interested: 'Interested?',
    viewAll: 'View all',
  },
  workExperience: {
    subtitle: 'experiences',
    title: 'Work Experience',
    description:
      'I am always open to new challenges and exciting projects. Let\'s work together to create amazing solutions for your company!',
  },
  contact: {
    subtitle: 'contact',
    title: 'Let\'s work together? Get in touch',
    namePlaceholder: 'Name',
    emailPlaceholder: 'Email',
    messagePlaceholder: 'Message',
    sendButton: 'Send message',
    successMessage: 'Message sent successfully!',
    errorMessage: 'An error occurred while sending the message. Please try again.',
  },
  footer: {
    madeWith: 'Made with',
    by: 'by',
  },
  projectsPage: {
    subtitle: 'projects',
    title: 'My projects',
    description:
      'Here you can see some of the work I have developed and am developing. Feel free to explore all my projects, how they were created, the technologies used, and the features each one has.',
    backToHome: 'Back to Home',
  },
  notFound: {
    title: 'Page not found',
    description: 'The page you are looking for does not exist or has been removed.',
    backToHome: 'Back to Home',
    code: '404',
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
    contact: 'Contact',
  },
  stack: {
    subtitle: 'Stack',
    description: 'Technologies I use day to day.',
    since: 'since',
  },
  experience: {
    sectionTitle: 'Experience',
    current: 'current',
    present: 'present',
    showDetails: 'Show details',
    hideDetails: 'Hide details',
  },
  projectsSection: {
    viewAllProjects: 'View all projects',
    moreComing: 'More projects coming…',
    filterAll: 'All',
    projectsCount: 'projects',
    viewProject: 'View project',
    viewCode: 'View code',
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
    emailPlaceholder: 'you@example.com',
    messageLabel: 'Message',
    messagePlaceholder: 'Tell me a bit about the job or project',
    submit: 'Send message',
    submitting: 'Sending…',
    submittingAnnouncement: 'Sending message',
    sent: 'Message sent.',
    sendAnother: 'Send another message',
    failed: 'I could not send it right now.',
    retry: 'Try again',
    errors: {
      nameRequired: 'Enter your name.',
      nameMin: 'The name must have at least 3 characters.',
      nameMax: 'The name can have at most 100 characters.',
      emailRequired: 'Enter your email.',
      emailInvalid: 'Enter a valid email.',
      messageRequired: 'Write a message.',
      messageMax: 'The message can have at most 500 characters.',
    },
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
