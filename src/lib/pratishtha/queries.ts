import type { GalleryPhotograph } from "@/data/gallery";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { MEDIA_BUCKET, PAGE_SIZE, type ArchiveQuery, type ArchiveRow, type FilterOptions, type PratishthaMedia, type PratishthaRecord, type PratishthaStatus } from "@/lib/pratishtha/types";

export type Loaded<T> = { ok: true; data: T } | { ok: false };

const emptyFilters: FilterOptions = {
  countries: [],
  states: [],
  cities: [],
  devatas: [],
  types: [],
  years: [],
};

function asString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asStatus(value: unknown): PratishthaStatus {
  return value === "published" ? "published" : "draft";
}

function asDevatas(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function asRecord(value: unknown): PratishthaRecord | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (typeof row.id !== "string" || typeof row.title !== "string" || typeof row.slug !== "string") return null;
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    temple_name: asString(row.temple_name),
    pratishtha_name: asString(row.pratishtha_name),
    devatas: asDevatas(row.devatas),
    city: asString(row.city),
    state: asString(row.state),
    country: asString(row.country),
    year: asNumber(row.year),
    event_date: asString(row.event_date),
    description: asString(row.description),
    ritual_type: asString(row.ritual_type),
    status: asStatus(row.status),
    featured: row.featured === true,
    display_order: asNumber(row.display_order) ?? 0,
    created_at: asString(row.created_at) ?? "",
    updated_at: asString(row.updated_at) ?? "",
  };
}

function asArchiveRow(value: unknown): ArchiveRow | null {
  const record = asRecord(value);
  if (!record || !value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  return {
    ...record,
    cover_path: asString(row.cover_path),
    cover_alt: asString(row.cover_alt),
  };
}

function asMedia(value: unknown): PratishthaMedia | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (typeof row.id !== "string" || typeof row.pratishtha_id !== "string" || typeof row.storage_path !== "string") return null;
  return {
    id: row.id,
    pratishtha_id: row.pratishtha_id,
    storage_path: row.storage_path,
    alt_text: asString(row.alt_text) ?? "",
    caption: asString(row.caption),
    display_order: asNumber(row.display_order) ?? 0,
    created_at: asString(row.created_at) ?? "",
  };
}

function stringList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

export async function searchArchive(query: ArchiveQuery, status: PratishthaStatus | "all"): Promise<Loaded<{ total: number; rows: ArchiveRow[] }>> {
  if (!isSupabaseConfigured()) return { ok: false };
  const supabase = await createClient();
  const year = /^\d{1,4}$/.test(query.year) ? Number(query.year) : null;
  const { data, error } = await supabase.rpc("search_pratishthas", {
    q: query.q || null,
    filter_country: query.country || null,
    filter_state: query.state || null,
    filter_city: query.city || null,
    filter_devata: query.devata || null,
    filter_type: query.type || null,
    filter_year: year,
    filter_status: status === "all" ? null : status,
    page_number: query.page,
    page_size: PAGE_SIZE,
  });

  if (error || !data || typeof data !== "object") return { ok: false };
  const payload = data as { total?: unknown; rows?: unknown };
  const total = typeof payload.total === "number" ? payload.total : Number(payload.total);
  if (!Number.isFinite(total) || !Array.isArray(payload.rows)) return { ok: false };
  return {
    ok: true,
    data: {
      total,
      rows: payload.rows.map(asArchiveRow).filter((row): row is ArchiveRow => row !== null),
    },
  };
}

export async function publishedFilters(): Promise<Loaded<FilterOptions>> {
  if (!isSupabaseConfigured()) return { ok: false };
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("published_filter_values");
  if (error || !data || typeof data !== "object") return { ok: false };
  const payload = data as Record<string, unknown>;
  return {
    ok: true,
    data: {
      countries: stringList(payload.countries),
      states: stringList(payload.states),
      cities: stringList(payload.cities),
      devatas: stringList(payload.devatas),
      types: stringList(payload.types),
      years: Array.isArray(payload.years) ? payload.years.filter((item): item is number => typeof item === "number") : emptyFilters.years,
    },
  };
}

export async function getPublishedRecord(slug: string): Promise<Loaded<PratishthaRecord | null>> {
  if (!isSupabaseConfigured()) return { ok: false };
  const supabase = await createClient();
  const { data, error } = await supabase.from("pratishthas").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  if (error) return { ok: false };
  return { ok: true, data: data ? asRecord(data) : null };
}

export async function getRecordById(id: string): Promise<Loaded<PratishthaRecord | null>> {
  if (!isSupabaseConfigured()) return { ok: false };
  const supabase = await createClient();
  const { data, error } = await supabase.from("pratishthas").select("*").eq("id", id).maybeSingle();
  if (error) return { ok: false };
  return { ok: true, data: data ? asRecord(data) : null };
}

export async function listMedia(pratishthaId: string): Promise<Loaded<PratishthaMedia[]>> {
  if (!isSupabaseConfigured()) return { ok: false };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pratishtha_media")
    .select("*")
    .eq("pratishtha_id", pratishthaId)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) return { ok: false };
  return { ok: true, data: (data ?? []).map(asMedia).filter((item): item is PratishthaMedia => item !== null) };
}

function parentFields(value: unknown) {
  const row = Array.isArray(value) ? value[0] : value;
  if (!row || typeof row !== "object") return { title: "Pratishtha", order: 0 };
  const record = row as { title?: unknown; display_order?: unknown };
  return {
    title: typeof record.title === "string" && record.title.trim() ? record.title.trim() : "Pratishtha",
    order: typeof record.display_order === "number" ? record.display_order : 0,
  };
}

export async function publishedPratishthaGallery(): Promise<Loaded<GalleryPhotograph[]>> {
  if (!isSupabaseConfigured()) return { ok: false };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pratishtha_media")
    .select("id, storage_path, alt_text, caption, display_order, created_at, pratishthas!inner(title, status, display_order)")
    .eq("pratishthas.status", "published")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error || !data) return { ok: false };

  const rows = data.flatMap((item) => {
    if (typeof item.id !== "string" || typeof item.storage_path !== "string" || !item.storage_path) return [];
    const parent = parentFields(item.pratishthas);
    const caption = typeof item.caption === "string" && item.caption.trim() ? item.caption.trim() : parent.title;
    const alt = typeof item.alt_text === "string" && item.alt_text.trim() ? item.alt_text.trim() : caption;
    return [
      {
        id: item.id,
        path: item.storage_path,
        alt,
        caption,
        order: parent.order,
        displayOrder: typeof item.display_order === "number" ? item.display_order : 0,
        createdAt: typeof item.created_at === "string" ? item.created_at : "",
      },
    ];
  });
  rows.sort((a, b) => a.order - b.order || a.displayOrder - b.displayOrder || a.createdAt.localeCompare(b.createdAt));
  if (rows.length === 0) return { ok: true, data: [] };

  const urls = await signedUrls(rows.map((row) => row.path));
  const photographs = rows.flatMap((row) => {
    const src = urls.get(row.path);
    if (!src) return [];
    return [{ id: row.id, src, alt: row.alt, caption: row.caption }];
  });
  if (photographs.length === 0) return { ok: false };
  return { ok: true, data: photographs };
}

export async function signedUrls(paths: string[]) {
  const unique = [...new Set(paths.filter(Boolean))];
  if (unique.length === 0 || !isSupabaseConfigured()) return new Map<string, string>();
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from(MEDIA_BUCKET).createSignedUrls(unique, 60 * 60);
  const urls = new Map<string, string>();
  if (error || !data) return urls;
  data.forEach((item) => {
    if (item.path && item.signedUrl && !item.error) urls.set(item.path, item.signedUrl);
  });
  return urls;
}

function remember(found: Map<string, PratishthaRecord>, rows: unknown) {
  if (!Array.isArray(rows)) return;
  rows.forEach((item) => {
    const row = asRecord(item);
    if (row && found.size < 4) found.set(row.id, row);
  });
}

export async function relatedRecords(record: PratishthaRecord): Promise<PratishthaRecord[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const found = new Map<string, PratishthaRecord>();
  const base = () =>
    supabase
      .from("pratishthas")
      .select("*")
      .eq("status", "published")
      .neq("id", record.id)
      .order("display_order", { ascending: true })
      .order("title", { ascending: true })
      .limit(4);

  if (record.city) {
    const { data } = await base().eq("city", record.city);
    remember(found, data);
  }

  const devata = record.devatas.find((item) => item.trim());
  if (devata && found.size < 4) {
    const { data } = await base().contains("devatas", [devata]);
    remember(found, data);
  }

  return [...found.values()];
}

export async function adminOverview(): Promise<
  Loaded<{ total: number; published: number; drafts: number; recent: Pick<PratishthaRecord, "id" | "title" | "status" | "updated_at">[] }>
> {
  if (!isSupabaseConfigured()) return { ok: false };
  const supabase = await createClient();
  const [total, published, drafts, recent] = await Promise.all([
    supabase.from("pratishthas").select("id", { count: "exact", head: true }),
    supabase.from("pratishthas").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("pratishthas").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("pratishthas").select("id, title, status, updated_at").order("updated_at", { ascending: false }).order("id", { ascending: true }).limit(8),
  ]);
  if (total.error || published.error || drafts.error || recent.error) return { ok: false };
  return {
    ok: true,
    data: {
      total: total.count ?? 0,
      published: published.count ?? 0,
      drafts: drafts.count ?? 0,
      recent: (recent.data ?? []).flatMap((item) => {
        if (typeof item.id !== "string" || typeof item.title !== "string") return [];
        return [{ id: item.id, title: item.title, status: asStatus(item.status), updated_at: asString(item.updated_at) ?? "" }];
      }),
    },
  };
}
