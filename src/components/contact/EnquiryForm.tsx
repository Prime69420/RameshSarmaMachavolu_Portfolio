"use client";

import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { enquiryCategories, enquiryEndpoint } from "@/data/enquiry";
import { Button } from "@/components/ui/Button";

type Fields = {
  name: string;
  phone: string;
  email: string;
  category: string;
  location: string;
  message: string;
};

type Errors = Partial<Record<keyof Fields, string>>;

const empty: Fields = {
  name: "",
  phone: "",
  email: "",
  category: "",
  location: "",
  message: "",
};

function validate(values: Fields): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Enter your name.";
  const digits = values.phone.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) errors.phone = "Enter a phone number we can use to reply.";
  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address, or leave this blank.";
  }
  if (!enquiryCategories.some((item) => item.id === values.category)) errors.category = "Choose an enquiry category.";
  if (values.location.trim().length < 2) errors.location = "Enter the town or place for this enquiry.";
  if (values.message.trim().length < 10) errors.message = "Write the enquiry in a little more detail.";
  return errors;
}

const fieldClass =
  "mt-3 w-full border-0 border-b border-sandstone bg-transparent py-3 font-sans text-base text-charcoal placeholder:text-charcoal/40";

export function EnquiryForm() {
  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [result, setResult] = useState<"idle" | "held" | "sent" | "failed">("idle");
  const [pending, setPending] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const formId = useId();

  function update(name: keyof Fields, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setResult("idle");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setResult("idle");
      summaryRef.current?.focus();
      return;
    }

    if (!enquiryEndpoint) {
      setResult("held");
      window.setTimeout(() => resultRef.current?.focus(), 0);
      return;
    }

    setPending(true);
    try {
      const response = await fetch(enquiryEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          phone: values.phone.trim(),
          email: values.email.trim(),
          category: values.category,
          location: values.location.trim(),
          message: values.message.trim(),
        }),
      });
      if (!response.ok) throw new Error("Enquiry was not accepted.");
      setResult("sent");
      setValues(empty);
    } catch {
      setResult("failed");
    } finally {
      setPending(false);
      window.setTimeout(() => resultRef.current?.focus(), 0);
    }
  }

  const errorItems = Object.entries(errors) as [keyof Fields, string][];

  return (
    <form id={formId} noValidate onSubmit={onSubmit} className="space-y-8">
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

      <Field id="name" label="Name" required error={errors.name}>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={fieldClass}
        />
      </Field>

      <Field id="phone" label="Phone number" required error={errors.phone}>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={(event) => update("phone", event.target.value)}
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          className={fieldClass}
        />
      </Field>

      <Field id="email" label="Email address" hint="Optional" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => update("email", event.target.value)}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : "email-hint"}
          className={fieldClass}
        />
      </Field>

      <Field id="category" label="Enquiry category" required error={errors.category}>
        <select
          id="category"
          name="category"
          value={values.category}
          onChange={(event) => update("category", event.target.value)}
          aria-invalid={errors.category ? true : undefined}
          aria-describedby={errors.category ? "category-error" : undefined}
          className={fieldClass}
        >
          <option value="">Choose a category</option>
          {enquiryCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </Field>

      <Field id="location" label="Location" required error={errors.location}>
        <input
          id="location"
          name="location"
          type="text"
          autoComplete="address-level2"
          value={values.location}
          onChange={(event) => update("location", event.target.value)}
          aria-invalid={errors.location ? true : undefined}
          aria-describedby={errors.location ? "location-error" : undefined}
          className={fieldClass}
        />
      </Field>

      <Field id="message" label="Message" required error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={fieldClass}
        />
      </Field>

      <p className="max-w-xl text-sm leading-6 text-charcoal/75">
        What you enter is for this enquiry alone. This website does not yet pass the form to an email or messaging
        service, so the details are not transmitted or stored. When a delivery service is connected, the name, phone
        number, email if given, category, location and message will be used only to reply.
      </p>

      <Button type="submit" disabled={pending}>
        {pending ? "Sending enquiry" : "Submit enquiry"}
      </Button>

      {result === "held" ? (
        <h2 ref={resultRef} tabIndex={-1} className="max-w-xl font-display text-3xl leading-snug text-burgundy">
          This enquiry was not sent. No delivery service is connected, so the details stayed on this page and were not stored.
        </h2>
      ) : null}
      {result === "sent" ? (
        <h2 ref={resultRef} tabIndex={-1} className="max-w-xl font-display text-3xl leading-snug text-burgundy">
          The enquiry was accepted for a reply.
        </h2>
      ) : null}
      {result === "failed" ? (
        <h2 ref={resultRef} tabIndex={-1} role="alert" className="max-w-xl font-display text-3xl leading-snug text-burgundy">
          The enquiry could not be delivered. Nothing has been confirmed as received.
        </h2>
      ) : null}
    </form>
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
