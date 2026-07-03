export type Locale = 'pt-BR' | 'en';

export type TranslationDictionary = {
  header: {
    home: string;
    projects: string;
  };
  hero: {
    greeting: string;
    contactButton: string;
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
