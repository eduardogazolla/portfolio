import { HomePageInfo, LocalizedHomePageData } from "./types/page-info";
import { WorkExperience } from "./types/work-experience";
import { fetchHygraphQuery } from "./utils/fetch-hygraph-query";
import { HomeClient } from "./componentes/pages/home/home-client";

const getPageData = async (): Promise<LocalizedHomePageData> => {
  const query = `
    query PageInfoQuery {
      ptPages: pages(where: {slug: "home"}, locales: [pt_BR, en]) {
        introduction {
          raw
        }
        technologies {
          name
        }
        profilePicture {
          url
        }
        socials {
          url
          iconSvg
        }
        knownTechs {
          iconSvg
          name
          startDate
        }
        highlightProjects {
          slug
          thumbnail {
            url
          }
          title
          shortDescription
          technologies {
            name
          }
        }
      }
      enPages: pages(where: {slug: "home"}, locales: [en, pt_BR]) {
        introduction {
          raw
        }
        technologies {
          name
        }
        profilePicture {
          url
        }
        socials {
          url
          iconSvg
        }
        knownTechs {
          iconSvg
          name
          startDate
        }
        highlightProjects {
          slug
          thumbnail {
            url
          }
          title
          shortDescription
          technologies {
            name
          }
        }
      }
      ptWorkExperiences: workExperiences(locales: [pt_BR, en]) {
        companyLogo {
          url
        }
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
      enWorkExperiences: workExperiences(locales: [en, pt_BR]) {
        companyLogo {
          url
        }
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
    }
  `;

  interface QueryResponse {
    ptPages: HomePageInfo[];
    enPages: HomePageInfo[];
    ptWorkExperiences: WorkExperience[];
    enWorkExperiences: WorkExperience[];
  }

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