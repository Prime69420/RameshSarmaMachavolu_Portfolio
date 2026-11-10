import { isSlug, slugify } from "@/lib/slug";
import type { PratishthaStatus } from "@/lib/pratishtha/types";

export type PratishthaInput = {
  title: string;
  slug: string;
  temple_name: string | null;
  pratishtha_name: string | null;
  devatas: string[];
  city: string | null;
  state: string | null;
  country: string | null;
  year: number | null;
  event_date: string | null;
  description: string | null;
  ritual_type: string | null;
  status: PratishthaStatus;
  featured: boolean;
  display_order: number;
};

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function optional(value: string, max: number) {
  if (!value) return null;
  return value.slice(0, max);
}

function isRealDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function parsePratishthaForm(
  formData: FormData,
): { ok: true; value: PratishthaInput } | { ok: false; error: string } {
  const title = text(formData, "title");
  if (title.length < 2) return { ok: false, error: "Enter a display title." };
  if (title.length > 180) return { ok: false, error: "The display title is too long." };

  const slug = slugify(text(formData, "slug") || title);
  if (!isSlug(slug)) {
    return { ok: false, error: "The address must use lowercase letters, numbers, and hyphens." };
  }

  const yearText = text(formData, "year");
  let year: number | null = null;
  if (yearText) {
    if (!/^\d{1,4}$/.test(yearText)) return { ok: false, error: "Year must be a whole number, or left blank." };
    year = Number(yearText);
    if (year < 1 || year > 9999) return { ok: false, error: "Year must be a whole number, or left blank." };
  }

  const eventDate = text(formData, "event_date");
  if (eventDate && !isRealDate(eventDate)) {
    return { ok: false, error: "The event date is not a valid date. Leave it blank if it is unknown." };
  }

  const orderText = text(formData, "display_order");
  let displayOrder = 0;
  if (orderText) {
    if (!/^-?\d{1,6}$/.test(orderText)) return { ok: false, error: "Display order must be a whole number." };
    displayOrder = Number(orderText);
  }

  const statusText = text(formData, "status");
  if (statusText !== "draft" && statusText !== "published") {
    return { ok: false, error: "Choose draft or published." };
  }

  const devatas = formData
    .getAll("devatas")
    .map((item) => String(item).trim())
    .filter(Boolean)
    .slice(0, 24);
  if (devatas.some((item) => item.length > 80)) {
    return { ok: false, error: "Each Devata name must be 80 characters or fewer." };
  }

  return {
    ok: true,
    value: {
      title,
      slug,
      temple_name: optional(text(formData, "temple_name"), 200),
      pratishtha_name: optional(text(formData, "pratishtha_name"), 200),
      devatas,
      city: optional(text(formData, "city"), 120),
      state: optional(text(formData, "state"), 120),
      country: optional(text(formData, "country"), 120),
      year,
      event_date: eventDate || null,
      description: optional(text(formData, "description"), 8000),
      ritual_type: optional(text(formData, "ritual_type"), 120),
      status: statusText,
      featured: formData.get("featured") === "on",
      display_order: displayOrder,
    },
  };
}
