"use client";

import { useEffect } from "react";
import { Button } from "./componentes/button";
import { StatusPage } from "./componentes/status-page";
import { useLanguage } from "./componentes/context/language-context";

export default function ErrorPage({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const { translations } = useLanguage();
  const t = translations.errorPage;

  const digest = (error as { digest?: string } | null)?.digest;

  useEffect(() => {
    // Only the digest (matches the server log); never the message, which may leak internals.
    console.error("Route error", digest);
  }, [digest]);

  return (
    <StatusPage code={t.code} label={t.label} title={t.title} description={t.description}>
      <Button onClick={retry}>{t.retry}</Button>
      <Button href="/" variant="secondary">
        {t.backToHome}
      </Button>
    </StatusPage>
  );
}
