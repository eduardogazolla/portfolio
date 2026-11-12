import { ProjectDetailClient } from "@/app/componentes/pages/project/project-detail-client";
import { LocalizedProjectPageData, ProjectDetailResponse, ProjectsPageStaticData } from "@/app/types/page-info";
import { fetchHygraphQuery } from "@/app/utils/fetch-hygraph-query";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

type ProjectProps = {
  params: Promise<{ slug: string }>;
};

// Keep in sync with the `ProjectDetail` operation in
// specs/002-redesign/contracts/hygraph-queries.graphql.
// The slug is a GraphQL variable, never interpolated into the document.
const projectDetailQuery = `
  fragment ProjectDetailFields on Project {
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
    pageThumbnail {
      url
    }
    description {
      raw
      text
    }
    sections {
      title
      image {
        url
      }
    }
    gitHubUrl
    liveProjectUrl
  }

  query ProjectDetail($slug: String!) {
    ptProject: project(where: { slug: $slug }, locales: [pt_BR, en]) {
      ...ProjectDetailFields
    }
    enProject: project(where: { slug: $slug }, locales: [en, pt_BR]) {
      ...ProjectDetailFields
    }
    projectsConnection {
      aggregate {
        count
      }
    }
  }
`;

// Memoized per request so generateMetadata and the page share one fetch.
const getProjectDetails = cache(
  async (slug: string): Promise<LocalizedProjectPageData | null> => {
    const data = await fetchHygraphQuery<Partial<ProjectDetailResponse>>(
      projectDetailQuery,
      { variables: { slug }, revalidate: 60 * 60 * 24 }, // 1 day
    );

    if (!data?.ptProject && !data?.enProject) return null;

    return {
      ptProject: data.ptProject ?? data.enProject!,
      enProject: data.enProject ?? null,
      totalProjects: data.projectsConnection?.aggregate.count ?? 0,
    };
  },
);

export default async function Project({ params }: ProjectProps) {
  const { slug } = await params;
  const data = await getProjectDetails(slug);

  if (!data) {
    notFound();
  }

  return <ProjectDetailClient data={data} />;
}

// Intentionally throws on CMS failure: a loud build failure beats deploying without project pages.
export async function generateStaticParams() {
  const query = `
    query ProjectSlugs {
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

  // The page itself calls notFound(); metadata just stays empty.
  if (!data) return {};

  const project = data.ptProject;
  const image = project.thumbnail?.url;

  return {
    title: project.title,
    description: project.description?.text,
    openGraph: {
      images: image ? [{ url: image }] : [],
    },
  };
}
