import { ProjectDetailClient } from "@/app/componentes/pages/project/project-detail-client";
import { LocalizedProjectPageData, ProjectsPageStaticData } from "@/app/types/page-info";
import { fetchHygraphQuery } from "@/app/utils/fetch-hygraph-query";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type ProjectProps = {
  params: Promise<{ slug: string }>;
};

const getProjectDetails = async (slug: string): Promise<LocalizedProjectPageData> => {
  const query = `
   query ProjectQuery {
     ptProject: project(where: {slug: "${slug}"}, locales: [pt_BR, en]) {
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
     enProject: project(where: {slug: "${slug}"}, locales: [en, pt_BR]) {
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

export default async function Project({ params }: ProjectProps) {
  const { slug } = await params;
  const data = await getProjectDetails(slug);

  if (!data?.ptProject && !data?.enProject) {
    notFound();
  }

  return <ProjectDetailClient data={data} />;
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
  params,
}: ProjectProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProjectDetails(slug);

  const project = data?.ptProject ?? data?.enProject;

  if (!project) {
    notFound();
  }

  return {
    title: project.title,
    description: project.description.text,
    openGraph: {
      images: [
        {
          url: project.thumbnail?.url ?? '',
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
