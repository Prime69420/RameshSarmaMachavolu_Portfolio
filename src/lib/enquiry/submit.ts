import { validateEnquiry, type EnquiryErrors, type EnquiryValue } from "@/lib/enquiry/validation";

export type StoredEnquiry = EnquiryValue & { id: string };

export type EnquiryStore = {
  findRecentDuplicate(value: EnquiryValue, sinceIso: string): Promise<{ id: string } | null>;
  countRecentByEmail(email: string, sinceIso: string): Promise<number>;
  insert(value: EnquiryValue): Promise<StoredEnquiry>;
};

export type SubmitEnquiryResult =
  | { ok: true; stored: false; notification: "skipped" }
  | { ok: true; stored: true; duplicate: true; notification: "skipped" }
  | { ok: true; stored: true; duplicate: false; notification: "sent" | "failed" }
  | { ok: false; error: "validation"; fields: EnquiryErrors }
  | { ok: false; error: "rate_limit" }
  | { ok: false; error: "unavailable" };

const duplicateWindowMs = 10 * 60 * 1000;
const emailWindowMs = 60 * 60 * 1000;
const emailLimit = 3;

export async function submitEnquiry(
  input: Parameters<typeof validateEnquiry>[0],
  options: {
    now?: Date;
    addressAllowed: boolean;
    store: EnquiryStore;
    notify: (enquiry: StoredEnquiry) => Promise<boolean>;
  },
): Promise<SubmitEnquiryResult> {
  const parsed = validateEnquiry(input);
  if (!parsed.ok) return { ok: false, error: "validation", fields: parsed.errors };
  if (parsed.spam) return { ok: true, stored: false, notification: "skipped" };
  if (!options.addressAllowed) return { ok: false, error: "rate_limit" };

  const now = options.now ?? new Date();
  try {
    const recent = await options.store.countRecentByEmail(parsed.value.email, new Date(now.getTime() - emailWindowMs).toISOString());
    if (recent >= emailLimit) return { ok: false, error: "rate_limit" };

    const duplicate = await options.store.findRecentDuplicate(
      parsed.value,
      new Date(now.getTime() - duplicateWindowMs).toISOString(),
    );
    if (duplicate) return { ok: true, stored: true, duplicate: true, notification: "skipped" };

    const saved = await options.store.insert(parsed.value);
    let sent = false;
    try {
      sent = await options.notify(saved);
    } catch {
      sent = false;
    }
    return { ok: true, stored: true, duplicate: false, notification: sent ? "sent" : "failed" };
  } catch {
    return { ok: false, error: "unavailable" };
  }
}
