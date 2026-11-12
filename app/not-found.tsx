"use client";

import { Button } from "./componentes/button";
import { StatusPage } from "./componentes/status-page";
import { useLanguage } from "./componentes/context/language-context";

export default function NotFound() {
  const { translations } = useLanguage();
  const t = translations.notFound;

  return (
    <StatusPage code={t.code} title={t.title} description={t.description}>
      <Button href="/">{t.backToHome}</Button>
      <Button href="/projects" variant="secondary">
        {t.viewProjects}
      </Button>
    </StatusPage>
  );
}
