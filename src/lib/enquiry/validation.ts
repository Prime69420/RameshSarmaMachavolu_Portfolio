export const enquiryStatuses = ["new", "read", "replied", "archived"] as const;

export type EnquiryStatus = (typeof enquiryStatuses)[number];

export type EnquiryField = "name" | "email" | "phone" | "subject" | "message";

export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

export type EnquiryValue = {
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
};

export type EnquiryValidation =
  | { ok: true; spam: true }
  | { ok: true; spam: false; value: EnquiryValue }
  | { ok: false; errors: EnquiryErrors };

const controlCharacters = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export function isEnquiryStatus(value: string): value is EnquiryStatus {
  return (enquiryStatuses as readonly string[]).includes(value);
}

export function sanitizeText(value: unknown, max: number) {
  return String(value ?? "")
    .replace(controlCharacters, "")
    .replace(/\r\n/g, "\n")
    .trim()
    .slice(0, max);
}

export function validateEnquiry(input: {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  subject?: unknown;
  message?: unknown;
  fax?: unknown;
}): EnquiryValidation {
  if (sanitizeText(input.fax, 200).length > 0) return { ok: true, spam: true };

  const errors: EnquiryErrors = {};
  const name = sanitizeText(input.name, 120).replace(/\s+/g, " ");
  const email = sanitizeText(input.email, 254).toLowerCase();
  const phoneText = sanitizeText(input.phone, 32);
  const subject = sanitizeText(input.subject, 160).replace(/[\r\n]+/g, " ").replace(/\s+/g, " ");
  const message = sanitizeText(input.message, 5000).replace(/\n{4,}/g, "\n\n\n");

  if (name.length < 2) errors.name = "Enter your full name.";
  if (!emailPattern.test(email)) errors.email = "Enter a valid email address.";
  const digits = phoneText.replace(/\D/g, "");
  if (phoneText && (digits.length < 8 || digits.length > 15 || !/^[+\d][\d\s().-]*$/.test(phoneText))) {
    errors.phone = "Enter a mobile number with 8 to 15 digits, or leave it blank.";
  }
  if (subject.length < 2) errors.subject = "Enter a subject.";
  if (message.length < 10) errors.message = "Write the enquiry in a little more detail.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    spam: false,
    value: { name, email, phone: phoneText || null, subject, message },
  };
}
