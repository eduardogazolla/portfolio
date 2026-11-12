import { Bricolage_Grotesque, Geist, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { Header } from "./componentes/header";
import { ContactForm } from "./componentes/contact-form";
import { Footer } from "./componentes/footer";
import { BackToTop } from "./componentes/back-to-top";
import { Toaster } from "./componentes/toaster";
import { LanguageProvider } from "./componentes/context/language-context";

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

const geist = Geist({
  weight: ["400", "500"],
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  weight: "400",
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${bricolage.variable} ${geist.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <body>
        <LanguageProvider>
          <Toaster/>
          <BackToTop />
          <Header />
          {children}
          <ContactForm />
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
