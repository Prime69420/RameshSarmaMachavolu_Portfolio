"use client";

import { useId, useRef, useState, type FormEvent, type ReactNode, type RefObject } from "react";
import { Button } from "@/components/ui/Button";
import { validateEnquiry, type EnquiryErrors, type EnquiryField } from "@/lib/enquiry/validation";

type Fields = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  fax: string;
};

type Result =
  | { kind: "idle" }
  | { kind: "saved"; notification: "sent" | "failed" }
  | { kind: "duplicate" }
  | { kind: "received" }
  | { kind: "rate_limit" }
  | { kind: "unavailable" }
  | { kind: "failed" };

const empty: Fields = { name: "", email: "", phone: "", subject: "", message: "", fax: "" };

const fieldClass =
  "mt-3 w-full border-0 border-b border-sandstone bg-transparent py-3 font-sans text-base text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy disabled:opacity-60";

export function EnquiryForm() {
  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [result, setResult] = useState<Result>({ kind: "idle" });
  const [pending, setPending] = useState(false);
  const sending = useRef(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const formId = useId();

  function update(name: keyof Fields, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setResult({ kind: "idle" });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;

    const parsed = validateEnquiry(values);
    if (!parsed.ok) {
      setErrors(parsed.errors);
      setResult({ kind: "idle" });
      summaryRef.current?.focus();
      return;
    }

    setErrors({});
    sending.current = true;
    setPending(true);
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = (await response.json().catch(() => null)) as
        | { ok: true; stored: boolean; duplicate?: boolean; notification: "sent" | "failed" | "skipped" }
        | { ok: false; error: string; fields?: EnquiryErrors }
        | null;

      if (!response.ok || !body || body.ok === false) {
        if (body && body.ok === false && body.error === "validation" && body.fields) {
          setErrors(body.fields);
          summaryRef.current?.focus();
          return;
        }
        if (body && body.ok === false && body.error === "rate_limit") setResult({ kind: "rate_limit" });
        else setResult({ kind: body && body.ok === false && body.error === "unavailable" ? "unavailable" : "failed" });
        return;
      }

      if (!body.stored) setResult({ kind: "received" });
      else if (body.duplicate) setResult({ kind: "duplicate" });
      else setResult({ kind: "saved", notification: body.notification === "failed" ? "failed" : "sent" });
      setValues(empty);
    } catch {
      setResult({ kind: "failed" });
    } finally {
      sending.current = false;
      setPending(false);
      window.setTimeout(() => resultRef.current?.focus(), 0);
    }
  }

  const errorItems = Object.entries(errors) as [EnquiryField, string][];

  return (
    <form id={formId} noValidate onSubmit={onSubmit} aria-busy={pending} className="relative space-y-8">
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="fax">Fax</label>
        <input id="fax" name="fax" type="text" tabIndex={-1} autoComplete="off" value={values.fax} onChange={(event) => update("fax", event.target.value)} />
      </div>

      {errorItems.length > 0 ? (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="border border-burgundy/30 bg-sandstone/30 px-5 py-4">
          <p className="font-sans text-sm text-burgundy">The enquiry needs a few corrections.</p>
          <ul className="mt-3 space-y-1">
            {errorItems.map(([field, message]) => (
              <li key={field}>
                <a href={`#${field}`} className="text-sm text-burgundy underline decoration-gold underline-offset-4">
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Field id="name" label="Full name" required error={errors.name}>
        <input id="name" name="name" type="text" autoComplete="name" required disabled={pending} value={values.name} onChange={(event) => update("name", event.target.value)} aria-invalid={errors.name ? true : undefined} aria-describedby={errors.name ? "name-error" : undefined} className={fieldClass} />
      </Field>
      <Field id="email" label="Email address" required error={errors.email}>
        <input id="email" name="email" type="email" autoComplete="email" required disabled={pending} value={values.email} onChange={(event) => update("email", event.target.value)} aria-invalid={errors.email ? true : undefined} aria-describedby={errors.email ? "email-error" : undefined} className={fieldClass} />
      </Field>
      <Field id="phone" label="Mobile number" hint="Optional" error={errors.phone}>
        <input id="phone" name="phone" type="tel" autoComplete="tel" disabled={pending} value={values.phone} onChange={(event) => update("phone", event.target.value)} aria-invalid={errors.phone ? true : undefined} aria-describedby={errors.phone ? "phone-error" : "phone-hint"} className={fieldClass} />
      </Field>
      <Field id="subject" label="Subject" required error={errors.subject}>
        <input id="subject" name="subject" type="text" required disabled={pending} value={values.subject} onChange={(event) => update("subject", event.target.value)} aria-invalid={errors.subject ? true : undefined} aria-describedby={errors.subject ? "subject-error" : undefined} className={fieldClass} />
      </Field>
      <Field id="message" label="Message" required error={errors.message}>
        <textarea id="message" name="message" rows={6} required disabled={pending} value={values.message} onChange={(event) => update("message", event.target.value)} aria-invalid={errors.message ? true : undefined} aria-describedby={errors.message ? "message-error" : undefined} className={fieldClass} />
      </Field>

      <p className="max-w-xl text-sm leading-6 text-charcoal/75">
        The name, email address, mobile number if you give one, subject and message are used only to respond to this enquiry. They are not published on this website.
      </p>

      <Button type="submit" disabled={pending}>
        {pending ? "Sending enquiry" : "Submit enquiry"}
      </Button>

      <ResultNotice result={result} resultRef={resultRef} />
    </form>
  );
}

function ResultNotice({ result, resultRef }: { result: Result; resultRef: RefObject<HTMLHeadingElement | null> }) {
  if (result.kind === "idle") return null;
  const alert = result.kind === "failed" || result.kind === "unavailable" || result.kind === "rate_limit";
  const message =
    result.kind === "saved" && result.notification === "sent"
      ? "Your enquiry has been received, and an email notification was sent."
      : result.kind === "saved"
        ? "Your enquiry has been saved. The email notification could not be sent, so it has not been delivered by email."
        : result.kind === "duplicate"
          ? "This enquiry was already received, so it was not submitted again."
          : result.kind === "received"
            ? "Your enquiry has been received."
            : result.kind === "rate_limit"
              ? "Please wait a little while before sending another enquiry."
              : result.kind === "unavailable"
                ? "The enquiry could not be saved. Nothing was stored. Please try again, or use the email or phone on this page."
                : "The enquiry could not be saved. Nothing has been confirmed as received.";

  return (
    <h2 ref={resultRef} tabIndex={-1} role={alert ? "alert" : "status"} className="max-w-xl font-display text-3xl leading-snug text-burgundy">
      {message}
    </h2>
  );
}

function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="font-sans text-[0.72rem] uppercase tracking-[0.18em] text-charcoal">
        {label}
        {required ? <span className="ml-2 tracking-[0.12em] text-charcoal/60">Required</span> : null}
        {hint ? (
          <span id={`${id}-hint`} className="ml-2 tracking-[0.12em] text-charcoal/60">
            {hint}
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-burgundy">
          {error}
        </p>
      ) : null}
    </div>
  );
}
