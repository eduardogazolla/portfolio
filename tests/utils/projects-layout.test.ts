import {
  filterProjectsByTech,
  getProjectsLayout,
  getUniqueTechs,
} from '../../app/utils/projects-layout';

const project = (slug: string, techs: string[]) => ({
  slug,
  technologies: techs.map((name) => ({ name })),
});

const projects = [
  project('a', ['React', 'Node']),
  project('b', ['Next', 'React']),
  project('c', ['Java']),
  project('d', []),
];

const withoutTechs = [
  { slug: 'n', technologies: null },
  { slug: 'u' },
  ...projects,
];

describe('getProjectsLayout', () => {
  it.each([
    [0, 'featured'],
    [1, 'featured'],
    [3, 'featured'],
    [4, 'list'],
    [10, 'list'],
  ])('count %i -> %s', (count, expected) => {
    expect(getProjectsLayout(count)).toBe(expected);
  });
});

describe('filterProjectsByTech', () => {
  it('"all" returns every project', () => {
    expect(filterProjectsByTech(projects, 'all')).toEqual({
      projects,
      count: 4,
    });
  });

  it('filters by technology with the matching count', () => {
    const result = filterProjectsByTech(projects, 'React');
    expect(result.projects.map((p) => p.slug)).toEqual(['a', 'b']);
    expect(result.count).toBe(2);
  });

  it('returns empty for a tech nobody has', () => {
    expect(filterProjectsByTech(projects, 'Go')).toEqual({ projects: [], count: 0 });
  });
});

describe('projects with null or missing technologies', () => {
  it('filterProjectsByTech skips them without crashing', () => {
    expect(filterProjectsByTech(withoutTechs, 'React').projects.map((p) => p.slug)).toEqual(['a', 'b']);
    expect(filterProjectsByTech(withoutTechs, 'all').count).toBe(6);
  });

  it('getUniqueTechs ignores them', () => {
    expect(getUniqueTechs(withoutTechs)).toEqual(['Java', 'Next', 'Node', 'React']);
  });
});

describe('getUniqueTechs', () => {
  it('returns unique tech names sorted alphabetically', () => {
    expect(getUniqueTechs(projects)).toEqual(['Java', 'Next', 'Node', 'React']);
  });
});
