import { PageIntroduction } from "../componentes/pages/projects/page-introduction";
import { ProjectsListClient } from "../componentes/pages/projects/projects-list-client";
import { LocalizedProjectsPageData } from "../types/page-info";
import { fetchHygraphQuery } from "../utils/fetch-hygraph-query";

export const metadata = {
  title: 'Projetos'
}

// Keep in sync with the `ProjectsPage` operation in
// specs/002-redesign/contracts/hygraph-queries.graphql.
const query = `
  fragment ProjectCard on Project {
    slug
    title
    context
    shortDescription
    thumbnail {
      url
    }
    technologies {
      name
    }
  }

  query ProjectsPage {
    ptProjects: projects(locales: [pt_BR, en]) {
      ...ProjectCard
    }
    enProjects: projects(locales: [en, pt_BR]) {
      ...ProjectCard
    }
  }
`;

const getPageData = async (): Promise<LocalizedProjectsPageData> => {
  const data = await fetchHygraphQuery<Partial<LocalizedProjectsPageData>>(query, {
    revalidate: 60 * 60 * 24, // 24 hours
  });

  return {
    ptProjects: data?.ptProjects ?? [],
    enProjects: data?.enProjects ?? [],
  };
};

export default async function Projects() {
  const data = await getPageData();
  return (
    <>
      <PageIntroduction />
      <ProjectsListClient data={data} />
    </>
  );
}
