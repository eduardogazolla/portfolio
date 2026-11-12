export type ProjectsLayout = 'featured' | 'list';

type WithTechnologies = { technologies?: { name: string }[] | null };

/** Fewer than 4 projects get the featured block; 4 or more get the filterable list. */
export const getProjectsLayout = (count: number): ProjectsLayout =>
  count < 4 ? 'featured' : 'list';

export const filterProjectsByTech = <T extends WithTechnologies>(
  projects: T[],
  filter: string,
): { projects: T[]; count: number } => {
  const filtered =
    filter === 'all'
      ? projects
      : projects.filter((p) => p.technologies?.some((t) => t.name === filter));
  return { projects: filtered, count: filtered.length };
};

/** Unique technology names across projects, sorted alphabetically. */
export const getUniqueTechs = (projects: WithTechnologies[]): string[] =>
  Array.from(
    new Set(projects.flatMap((p) => (p.technologies ?? []).map((t) => t.name))),
  ).sort((a, b) => a.localeCompare(b));
