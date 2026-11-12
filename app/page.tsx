import { HomePageInfo, LocalizedHomePageData } from "./types/page-info";
import { WorkExperience } from "./types/work-experience";
import { fetchHygraphQuery } from "./utils/fetch-hygraph-query";
import { HomeClient } from "./componentes/pages/home/home-client";

// Keep in sync with the `HomePage` operation in
// specs/002-redesign/contracts/hygraph-queries.graphql.
const query = `
  fragment HomeFields on Page {
    role
    introduction {
      raw
    }
    profilePicture {
      url
    }
    socials {
      name
      url
    }
    knownTechs {
      name
      startDate
    }
    highlightProjects {
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
  }

  fragment ExperienceFields on WorkExperience {
    role
    companyName
    companyUrl
    startDate
    endDate
    description {
      raw
    }
    technologies {
      name
    }
  }

  query HomePage {
    ptPages: pages(where: { slug: "home" }, locales: [pt_BR, en]) {
      ...HomeFields
    }
    enPages: pages(where: { slug: "home" }, locales: [en, pt_BR]) {
      ...HomeFields
    }
    ptWorkExperiences: workExperiences(orderBy: startDate_DESC, locales: [pt_BR, en]) {
      ...ExperienceFields
    }
    enWorkExperiences: workExperiences(orderBy: startDate_DESC, locales: [en, pt_BR]) {
      ...ExperienceFields
    }
  }
`;

interface QueryResponse {
  ptPages: HomePageInfo[];
  enPages: HomePageInfo[];
  ptWorkExperiences: WorkExperience[];
  enWorkExperiences: WorkExperience[];
}

const getPageData = async (): Promise<LocalizedHomePageData> => {
  const result = await fetchHygraphQuery<QueryResponse>(
    query,
    60 * 60 * 24 // 24 horas
  );

  return {
    ptPage: result?.ptPages?.[0] ?? null,
    enPage: result?.enPages?.[0] ?? null,
    ptWorkExperiences: result?.ptWorkExperiences ?? [],
    enWorkExperiences: result?.enWorkExperiences ?? [],
  };
};

export default async function Home() {
  const data = await getPageData();

  return <HomeClient data={data} />;
}
