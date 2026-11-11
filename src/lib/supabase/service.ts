import { createClient } from "@supabase/supabase-js";
import { supabaseUrl } from "@/lib/supabase/env";

/** Server-only client. The key bypasses Row Level Security and must never reach the browser. */
export function createServiceClient() {
  if (typeof window !== "undefined") {
    throw new Error("The service client is server-only.");
  }

  const url = supabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
