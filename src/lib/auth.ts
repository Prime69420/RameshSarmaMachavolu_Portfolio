import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type SessionRole =
  | { role: "unconfigured" }
  | { role: "unavailable" }
  | { role: "anon" }
  | { role: "user"; email: string }
  | { role: "admin"; email: string };

export async function getSessionRole(): Promise<SessionRole> {
  if (!isSupabaseConfigured()) return { role: "unconfigured" };

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return { role: "anon" };

    const { data, error } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
    if (error) return { role: "unavailable" };
    const email = user.email ?? "Signed-in account";
    if (!data) return { role: "user", email };
    return { role: "admin", email };
  } catch {
    return { role: "unavailable" };
  }
}
