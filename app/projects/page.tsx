import { PageIntroduction } from "../componentes/pages/projects/page-introduction";
import { ProjectsList } from "../componentes/pages/projects/projects-list";
import { ProjectsPageData } from "../types/page-info";
import { fetchHygraphQuery } from "../utils/fetch-hygraph-query";

export const metadata = {
  title: 'Projetos'
}

const getPageData = async (): Promise<ProjectsPageData> => {
  const query = `
      query ProjectsQuery {
        projects {
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
  const { projects } = await getPageData();
  return (
    <>
      <PageIntroduction />
      <ProjectsList projects={projects} />
    </>
  );
}
