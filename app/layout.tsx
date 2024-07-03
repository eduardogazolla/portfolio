import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { Header } from "./componentes/header";
import { ContactForm } from "./componentes/contact-form";
import { Footer } from "./componentes/footer";
import { BackToTop } from "./componentes/back-to-top";
import { Toaster } from "./componentes/toaster";

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

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${plexMono.variable}`}>
      <body>
        <Toaster/>
        <BackToTop />
        <Header />
        {children}
        <ContactForm />
        <Footer />
      </body>
    </html>
  );
}
