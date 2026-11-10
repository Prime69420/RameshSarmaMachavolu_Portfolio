import { createBrowserClient } from "@supabase/ssr";
import { supabaseKey, supabaseUrl } from "@/lib/supabase/env";

/**
 * Browser client using only the public anon or publishable key.
 * Sign-in, uploads, and archive changes go through server actions so a
 * service-role key is never imported here.
 */
export function createBrowserSupabaseClient() {
  const url = supabaseUrl();
  const key = supabaseKey();
  if (!url || !key) {
    throw new Error("Supabase is not configured.");
  }

  return createBrowserClient(url, key);
}
