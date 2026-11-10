export const PAGE_SIZE = 20;
export const MEDIA_BUCKET = "pratishtha-media";
export const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
export const MAX_PHOTOS = 8;

export type PratishthaStatus = "draft" | "published";

export type PratishthaRecord = {
  id: string;
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
  created_at: string;
  updated_at: string;
};

export type PratishthaMedia = {
  id: string;
  pratishtha_id: string;
  storage_path: string;
  alt_text: string;
  caption: string | null;
  display_order: number;
  created_at: string;
};

export type ArchiveRow = Pick<
  PratishthaRecord,
  | "id"
  | "title"
  | "slug"
  | "temple_name"
  | "pratishtha_name"
  | "devatas"
  | "city"
  | "state"
  | "country"
  | "year"
  | "event_date"
  | "description"
  | "ritual_type"
  | "status"
  | "featured"
  | "display_order"
  | "updated_at"
> & {
  cover_path: string | null;
  cover_alt: string | null;
};

export type FilterOptions = {
  countries: string[];
  states: string[];
  cities: string[];
  devatas: string[];
  types: string[];
  years: number[];
};

export type ActionState = { ok: true; message?: string } | { ok: false; error: string } | null;

export type ArchiveQuery = {
  q: string;
  country: string;
  state: string;
  city: string;
  devata: string;
  type: string;
  year: string;
  page: number;
};

export function locationLabel(record: { city: string | null; state: string | null; country: string | null }) {
  return [record.city, record.state, record.country].map((part) => part?.trim()).filter(Boolean).join(", ");
}

export function formatEventDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = months[Number(match[2]) - 1];
  if (!month) return value;
  return `${Number(match[3])} ${month} ${match[1]}`;
}

export function formatUpdated(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(value);
  if (!match) return value;
  return `${match[3]} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Number(match[2]) - 1] ?? match[2]} ${match[1]}, ${match[4]}:${match[5]} UTC`;
}
