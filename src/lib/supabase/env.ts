/** Public project URL. Empty when the website has not been configured. */
export function supabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
}

/**
 * Public client key. Accepts the legacy anon key or, when that is unset, the
 * publishable key shown in the current Supabase dashboard. Never reads a
 * service-role key.
 */
export function supabaseKey() {
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  return anon || publishable || "";
}

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl() && supabaseKey());
}
