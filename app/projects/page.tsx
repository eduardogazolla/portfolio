import { PageIntroduction } from "../componentes/pages/projects/page-introduction";
import { ProjectsListClient } from "../componentes/pages/projects/projects-list-client";
import { LocalizedProjectsPageData } from "../types/page-info";
import { fetchHygraphQuery } from "../utils/fetch-hygraph-query";

export const metadata = {
  title: 'Projetos'
}

const getPageData = async (): Promise<LocalizedProjectsPageData> => {
  const query = `
      query ProjectsQuery {
        ptProjects: projects(locales: [pt_BR, en]) {
          shortDescription
          slug
          title
          thumbnail {
            url
          }
          technologies {
            name
          }
        }
        enProjects: projects(locales: [en, pt_BR]) {
          shortDescription
          slug
          title
          thumbnail {
            url
          }
          technologies {
            name
          }
        }
      }
      `;

  return fetchHygraphQuery(
    query,
    60 * 60 * 24 // 24 hours
  );
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
