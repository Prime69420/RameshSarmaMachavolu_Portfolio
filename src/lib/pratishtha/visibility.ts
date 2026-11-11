import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "@/lib/supabase/env";

export type SlugLookup = "published" | "absent" | "unavailable";

export async function publishedSlugLookup(slug: string): Promise<SlugLookup> {
  if (!isSupabaseConfigured()) return "unavailable";
  const url = new URL("/rest/v1/pratishthas", supabaseUrl());
  url.searchParams.set("select", "slug");
  url.searchParams.set("slug", `eq.${slug}`);
  url.searchParams.set("status", "eq.published");
  url.searchParams.set("limit", "1");
  try {
    const response = await fetch(url, {
      headers: {
        apikey: supabaseKey(),
        Authorization: `Bearer ${supabaseKey()}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });
    if (!response.ok) return "unavailable";
    const rows: unknown = await response.json();
    return Array.isArray(rows) && rows.length > 0 ? "published" : "absent";
  } catch {
    return "unavailable";
  }
}
