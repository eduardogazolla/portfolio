import { ContactBand } from "../componentes/contact-band";
import { ProjectsListClient } from "../componentes/pages/projects/projects-list-client";
import { LocalizedProjectsPageData, Social } from "../types/page-info";
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
    pages(where: { slug: "home" }, locales: [pt_BR]) {
      socials {
        name
        url
      }
    }
  }
`;

const getPageData = async (): Promise<LocalizedProjectsPageData> => {
  const data = await fetchHygraphQuery<Partial<Omit<LocalizedProjectsPageData, "socials">> & {
      pages?: { socials: Social[] }[];
    }>(query, {
    revalidate: 60 * 60 * 24, // 24 hours
  });

  return {
    ptProjects: data?.ptProjects ?? [],
    enProjects: data?.enProjects ?? [],
    socials: data?.pages?.[0]?.socials ?? [],
  };
};

export default async function Projects() {
  const data = await getPageData();
  return (
    <>
      <ProjectsListClient data={data} />
      <ContactBand />
    </>
  );
}
