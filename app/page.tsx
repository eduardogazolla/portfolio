import { HeroSection } from "./componentes/pages/home/hero-section";
 import { HighlightedProjects } from "./componentes/pages/home/highlighted-projects";
 import { KnownTechs } from "./componentes/pages/home/known-techs";
 import { WorkExperience } from "./componentes/pages/home/work-experiences";
 import { HomePageData } from "./types/page-info";
 import { fetchHygraphQuery } from "./utils/fetch-hygraph-query";
 
 const getPageData = async (): Promise<HomePageData> => {
   const query = `
     query PageInfoQuery {
       page(where: {slug: "home"}) {
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
       workExperiences {
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
 
   return fetchHygraphQuery(
     query,
     60 * 60 * 24 // 24 horas
   );
 };
 
 export default async function Home() {
   const { page: pageData, workExperiences } = await getPageData();
 
   return (
     <>
       <HeroSection homeInfo={pageData} />
       <KnownTechs techs={pageData.knownTechs} />
       <HighlightedProjects projects={pageData.highlightProjects} />
       <WorkExperience experiences={workExperiences} />
     </>
   );
 }