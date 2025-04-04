import { ProjectDetails } from "@/app/componentes/pages/project/project-details";
import { ProjectSections } from "@/app/componentes/pages/project/project-sections";
import { ProjectPageData, ProjectsPageStaticData } from "@/app/types/page-info";
import { fetchHygraphQuery } from "@/app/utils/fetch-hygraph-query";
import { Metadata } from "next";

type ProjectProps = {
  params: {
    slug: string;
  };
};

const getProjectDetails = async (slug: string): Promise<ProjectPageData> => {
  const query = `
   query ProjectQuery() {
     project(where: {slug: "${slug}"}) {
       pageThumbnail {
         url
       }
       thumbnail {
         url
       }
       sections {
         title
         image {
           url
         }
       }
       title
       shortDescription
       description {
         raw
         text
       }
       technologies {
         name
       }
       liveProjectUrl
       gitHubUrl
     }
   }
   `;

  return fetchHygraphQuery(
    query,
    60 * 60 * 24 // 1 day
  );
};

export default async function Project({ params: { slug } }: ProjectProps) {
  const { project } = await getProjectDetails(slug);

  return (
    <>
      <ProjectDetails project={project} />
      <ProjectSections sections={project.sections} />
    </>
  );
}

export async function generateStaticParams() {
  const query = `
     query ProjectsSlugsQuery {
       projects(first: 100) {
         slug
       }
     }
   `;

  const data = await fetchHygraphQuery<ProjectsPageStaticData>(query);

  if (!data || !data.projects) {
    return [];
  }

  // O que o Next espera é um array de objetos com os parâmetros:
  return data.projects.map((project) => ({
    slug: project.slug,
  }));
}



export async function generateMetadata({
  params: { slug },
}: ProjectProps): Promise<Metadata> {
  const data = await getProjectDetails(slug);
  const project = data.project;

  return {
    title: project.title,
    description: project.description.text, 
    openGraph: {
      images: [
        {
          url: project.thumbnail.url,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
