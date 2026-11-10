"use server";

import { redirect } from "next/navigation";
import { getSessionRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/pratishtha/types";

function safeNext(value: FormDataEntryValue | null) {
  const next = String(value ?? "");
  if (!next.startsWith("/admin") || next.startsWith("//") || next.startsWith("/admin/login")) return "/admin";
  return next;
}

export async function signIn(_previous: ActionState, formData: FormData): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { ok: false, error: "Enter the administrator email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: "The email or password was not accepted." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "The session could not be started. Try again." };

  const { data: admin, error: adminError } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (adminError) return { ok: false, error: "The archive database is temporarily unavailable." };
  if (!admin) {
    await supabase.auth.signOut();
    return { ok: false, error: "This account is not an administrator." };
  }

  redirect(safeNext(formData.get("next")));
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

export async function assertAdmin(): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSessionRole();
  if (session.role === "admin") return { ok: true };
  if (session.role === "user") return { ok: false, error: "This account cannot change the archive." };
  if (session.role === "unavailable") return { ok: false, error: "The archive database is temporarily unavailable." };
  return { ok: false, error: "Your session has expired. Sign in again." };
}
