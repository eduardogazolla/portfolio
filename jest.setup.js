import '@testing-library/jest-dom';

// Mock fetch for tests
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      data: {
        page: {
          introduction: { raw: { children: [] } },
          technologies: [],
          profilePicture: { url: '' },
          socials: [],
          knownTechs: [],
          highlightProjects: [],
          workExperiences: []
        },
        projects: []
      }
    }),
  })
);

// Mock fetchHygraphQuery
jest.mock('./app/utils/fetch-hygraph-query', () => ({
  fetchHygraphQuery: jest.fn(() => Promise.resolve({
    page: {
      introduction: { raw: { children: [] } },
      technologies: [],
      profilePicture: { url: '' },
      socials: [],
      knownTechs: [],
      highlightProjects: [],
      workExperiences: []
    }
  }))
}));