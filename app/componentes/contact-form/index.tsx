"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../button";
import { Link } from "../link";
import { Input } from "../form/input";
import { Textarea } from "../form/textarea";
import { PageSection } from "../page-section";
import { SectionTitle } from "../section-title";
import { useLanguage } from "@/app/componentes/context/language-context";
import { isLinkedInSocial } from "@/app/utils/socials";
import type { Social } from "@/app/types/page-info";
import { CONTACT_LIMITS, createContactSchema, type ContactFormData, type ContactFormInput } from "@/app/lib/contact-schema";

// `invalid` is derived from the form errors while the status is `idle`.
type Status = "idle" | "submitting" | "sent" | "failed";

const EMPTY: ContactFormInput = { name: "", email: "", message: "", company_url: "" };

// The API answers 200 { ok: true } on success; anything else counts as a failure.
const REQUEST_TIMEOUT_MS = 15000;

const sendMessage = async ({ name, email, message }: ContactFormData): Promise<boolean> => {
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
      // A stalled request ends in the failed state instead of hanging on "Enviando…".
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) return false;
    const body = await response.json();
    return body?.ok === true;
  } catch {
    return false;
  }
};

export const ContactForm = ({ socials = [] }: { socials?: Social[] }) => {
  const { locale, translations } = useLanguage();
  const t = translations.contactVoice;
  const linkedIn = socials.find(isLinkedInSocial);
  const [status, setStatus] = useState<Status>("idle");
  const sending = useRef(false);
  const confirmationRef = useRef<HTMLHeadingElement>(null);
  const failureRef = useRef<HTMLDivElement>(null);

  const schema = useMemo(() => createContactSchema(locale === "en" ? "en" : "pt"), [locale]);
  const {
    handleSubmit,
    register,
    reset,
    control,
    setFocus,
    trigger,
    formState: { errors },
  } = useForm<ContactFormInput, unknown, ContactFormData>({
    mode: "onTouched",
    resolver: zodResolver(schema),
    defaultValues: EMPTY,
  });

  // Re-run validation for the fields showing an error so the messages follow the language.
  const errorsRef = useRef(errors);
  useEffect(() => {
    errorsRef.current = errors;
  });
  useEffect(() => {
    const invalid = (Object.keys(errorsRef.current) as (keyof ContactFormInput)[]).filter((field) => errorsRef.current[field]);
    if (invalid.length > 0) void trigger(invalid);
  }, [locale, trigger]);

  // Move focus to the confirmation or the failure notice once it is on screen.
  // Coming back from the confirmation, the form remounts: put focus on its first field.
  const previousStatus = useRef<Status>(status);
  useEffect(() => {
    if (status === "sent") confirmationRef.current?.focus();
    if (status === "failed") failureRef.current?.focus();
    if (status === "idle" && previousStatus.current === "sent") setFocus("name");
    previousStatus.current = status;
  }, [status, setFocus]);

  const onSubmit = async (data: ContactFormData) => {
    if (sending.current) return;
    // Honeypot filled: a bot. Look successful, send nothing.
    if (data.company_url.trim() !== "") {
      reset(EMPTY);
      setStatus("sent");
      return;
    }
    sending.current = true;
    setStatus("submitting");
    const ok = await sendMessage(data);
    sending.current = false;
    if (ok) reset(EMPTY);
    setStatus(ok ? "sent" : "failed");
  };

  const submitting = status === "submitting";
  const messageLength = (useWatch({ control, name: "message" }) ?? "").length;

  return (
    <PageSection
      id="contact"
      className="pt-28 md:pt-10 md:pb-40"
      innerClassName="flex flex-col gap-7 md:flex-row md:justify-between md:gap-12"
    >
      <SectionTitle
        title={t.title}
        subtitle={t.description}
        className="gap-7 md:gap-6"
        subtitleClassName="md:max-w-[440px] md:text-body-l"
      />
      <div className="w-full md:max-w-[480px] md:shrink-0">
        <div aria-live="polite" className="sr-only">
          {/* The confirmation is announced by its focused heading. */}
          {submitting ? t.submittingAnnouncement : ""}
        </div>

        {status === "sent" ? (
          <div className="flex flex-col items-start gap-4 rounded-md bg-surface px-7 py-8">
            <svg
              aria-hidden="true"
              viewBox="0 0 32 32"
              className="size-8 text-accent"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17l6 6 12-13" />
            </svg>
            <h3 ref={confirmationRef} tabIndex={-1} className="text-h2 text-text focus:outline-none">
              {t.sent}
            </h3>
            <p className="text-body-m text-text-muted">{t.sentDescription}</p>
            <Button variant="secondary" onClick={() => setStatus("idle")}>
              {t.sendAnother}
            </Button>
          </div>
        ) : (
          <form noValidate className="relative flex w-full flex-col gap-7 md:gap-9" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
            <Input
              label={t.nameLabel}
              placeholder={t.namePlaceholder}
              autoComplete="name"
              maxLength={CONTACT_LIMITS.nameMax}
              disabled={submitting}
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label={t.emailLabel}
              placeholder={t.emailPlaceholder}
              type="email"
              autoComplete="email"
              disabled={submitting}
              error={errors.email?.message}
              {...register("email")}
            />
            <Textarea
              label={t.messageLabel}
              placeholder={t.messagePlaceholder}
              maxLength={CONTACT_LIMITS.messageMax}
              helper={`${messageLength}/${CONTACT_LIMITS.messageMax}`}
              disabled={submitting}
              error={errors.message?.message}
              {...register("message")}
            />
            {/* Honeypot: off-screen (not display:none, so bots still fill it), out of the tab order and the accessibility tree. */}
            <div aria-hidden="true" inert className="pointer-events-none absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
              <label>
                {t.honeypotLabel}
                <input type="text" tabIndex={-1} autoComplete="off" {...register("company_url")} />
              </label>
            </div>
            {status === "failed" && (
              <div
                ref={failureRef}
                role="alert"
                tabIndex={-1}
                className="flex flex-col gap-1.5 rounded-md border border-danger px-[18px] py-4 focus:outline-none"
              >
                <p className="text-label-m text-danger">{t.failed}</p>
                <p className="text-body-m text-text-muted">
                  {t.failedDescription}{" "}
                  {linkedIn ? (
                    <Link href={linkedIn.url} target="_blank" className="text-body-m text-text underline">
                      {t.failedLinkLabel}
                    </Link>
                  ) : (
                    t.failedLinkLabel
                  )}
                  .
                </p>
              </div>
            )}
            <Button type="submit" loading={submitting} className="w-full md:w-fit md:px-7 md:py-4">
              {submitting ? t.submitting : status === "failed" ? t.retry : t.submit}
            </Button>
          </form>
        )}
      </div>
    </PageSection>
  );
};
