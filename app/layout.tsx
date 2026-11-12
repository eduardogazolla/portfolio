import { Bricolage_Grotesque, Geist, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { Header } from "./componentes/header";
import { ContactForm } from "./componentes/contact-form";
import { Footer } from "./componentes/footer";
import { BackToTop } from "./componentes/back-to-top";
import { Toaster } from "./componentes/toaster";
import { SkipLink } from "./componentes/skip-link";
import { LanguageProvider } from "./componentes/context/language-context";
import { fetchHygraphQuery } from "./utils/fetch-hygraph-query";
import type { Social } from "./types/page-info";

export const metadata = {
  title: {
    default: "Eduardo Gazolla - Portfólio",
    template: "%s | Eduardo Gazolla - Portfólio",
  },
  icons: [
    {
      url: "/favicon.svg",
    },
  ],
};

const bricolage = Bricolage_Grotesque({
  weight: "variable",
  axes: ["opsz"],
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

// 600/700 (Geist) and 500 (Plex) are only for the current screens' font-semibold/bold/medium;
// drop them once Parts 3–4 replace those screens (design uses Geist 400/500, Plex 400).
const geist = Geist({
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// Keep in sync with the `SiteSocials` operation in
// specs/002-redesign/contracts/hygraph-queries.graphql.
const siteSocialsQuery = `
  query SiteSocials {
    pages(where: { slug: "home" }, locales: [pt_BR]) {
      socials {
        name
        url
      }
    }
  }
`;

const getSiteSocials = async (): Promise<Social[]> => {
  try {
    const result = await fetchHygraphQuery<{ pages?: { socials: Social[] }[] }>(
      siteSocialsQuery,
      60 * 60 * 24 // 24 horas, same as the pages
    );
    return result?.pages?.[0]?.socials ?? [];
  } catch (error) {
    // The footer still renders (without socials) if the CMS is unreachable.
    console.error("SiteSocials query failed", error);
    return [];
  }
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const socials = await getSiteSocials();

  return (
    <html lang="pt-BR" className={`${bricolage.variable} ${geist.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <body>
        <LanguageProvider>
          <SkipLink />
          <Toaster/>
          <Header />
          {/* tabIndex -1 lets the skip link and BackToTop move focus here; main is not
              interactive, so no focus ring is shown when focused programmatically. */}
          <main id="main" tabIndex={-1} className="focus:outline-none">
            {children}
          </main>
          <ContactForm />
          <Footer socials={socials} />
          <BackToTop />
        </LanguageProvider>
      </body>
    </html>
  );
}
