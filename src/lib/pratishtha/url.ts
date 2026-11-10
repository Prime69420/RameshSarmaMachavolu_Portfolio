export function readParam(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? "";
}

export function parsePage(value: string) {
  const page = Number.parseInt(value, 10);
  if (!Number.isFinite(page) || page < 1) return 1;
  return page;
}

type ArchiveFilters = {
  q?: string;
  country?: string;
  state?: string;
  city?: string;
  devata?: string;
  type?: string;
  year?: string;
};

export function archiveHref(filters: ArchiveFilters, page = 1) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.country) params.set("country", filters.country);
  if (filters.state) params.set("state", filters.state);
  if (filters.city) params.set("city", filters.city);
  if (filters.devata) params.set("devata", filters.devata);
  if (filters.type) params.set("type", filters.type);
  if (filters.year) params.set("year", filters.year);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/pratishtha-kainkaryam?${query}` : "/pratishtha-kainkaryam";
}

export function adminHref(filters: { q?: string; status?: string }, page = 1) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.status && filters.status !== "all") params.set("status", filters.status);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/admin/pratishthas?${query}` : "/admin/pratishthas";
}

export function hasArchiveFilters(filters: ArchiveFilters) {
  return Boolean(filters.q || filters.country || filters.state || filters.city || filters.devata || filters.type || filters.year);
}
