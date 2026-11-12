"use client";

import { useEffect } from "react";
import { Button } from "./componentes/button";
import { StatusPage } from "./componentes/status-page";
import { useLanguage } from "./componentes/context/language-context";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { translations } = useLanguage();
  const t = translations.errorPage;

  useEffect(() => {
    // Only the digest (matches the server log); never the message, which may leak internals.
    console.error("Route error", error.digest);
  }, [error]);

  return (
    <StatusPage code={t.code} label={t.label} title={t.title} description={t.description}>
      <Button onClick={reset}>{t.retry}</Button>
      <Button href="/" variant="secondary">
        {t.backToHome}
      </Button>
    </StatusPage>
  );
}
