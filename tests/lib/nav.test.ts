import { getNavCurrent } from '../../app/lib/nav';

describe('getNavCurrent', () => {
  it('returns "page" on an exact match', () => {
    expect(getNavCurrent('/projects', '/projects')).toBe('page');
    expect(getNavCurrent('/', '/')).toBe('page');
  });
  it('returns "true" for a section match', () => {
    expect(getNavCurrent('/projects/hour-sync', '/projects')).toBe('true');
  });
  it('returns undefined otherwise', () => {
    expect(getNavCurrent('/projects-x', '/projects')).toBeUndefined();
    expect(getNavCurrent('/projects', '/')).toBeUndefined();
    expect(getNavCurrent('/', '/#contact')).toBeUndefined();
    expect(getNavCurrent(null, '/')).toBeUndefined();
  });
});
