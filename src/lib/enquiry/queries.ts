import { canManageEnquiries } from "@/lib/enquiry/access";
import { isEnquiryStatus, type EnquiryStatus } from "@/lib/enquiry/validation";
import { getSessionRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type EnquiryRecord = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: EnquiryStatus;
  created_at: string;
};

type EnquiryRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

export type EnquirySummary = Omit<EnquiryRecord, "message">;

function asRecord(row: EnquiryRow): EnquiryRecord | null {
  if (!isEnquiryStatus(row.status)) return null;
  return { ...row, status: row.status };
}

export async function listEnquiries(): Promise<{ ok: true; data: EnquirySummary[] } | { ok: false; error: "forbidden" | "unavailable" }> {
  const session = await getSessionRole();
  if (!canManageEnquiries(session.role)) return { ok: false, error: "forbidden" };
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("enquiries")
      .select("id, name, email, phone, subject, status, created_at")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(200);
    if (error) {
      console.error("enquiry list failed", error.code);
      return { ok: false, error: "unavailable" };
    }
    return {
      ok: true,
      data: ((data ?? []) as Array<Omit<EnquiryRow, "message">>).flatMap((row) => {
        const record = asRecord({ ...row, message: "" });
        return record ? [{ id: record.id, name: record.name, email: record.email, phone: record.phone, subject: record.subject, status: record.status, created_at: record.created_at }] : [];
      }),
    };
  } catch {
    return { ok: false, error: "unavailable" };
  }
}

export async function getEnquiry(id: string): Promise<{ ok: true; data: EnquiryRecord | null } | { ok: false; error: "forbidden" | "unavailable" }> {
  const session = await getSessionRole();
  if (!canManageEnquiries(session.role)) return { ok: false, error: "forbidden" };
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("enquiries")
      .select("id, name, email, phone, subject, message, status, created_at")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      console.error("enquiry read failed", error.code);
      return { ok: false, error: "unavailable" };
    }
    return { ok: true, data: data ? asRecord(data as EnquiryRow) : null };
  } catch {
    return { ok: false, error: "unavailable" };
  }
}

export async function countNewEnquiries(): Promise<{ ok: true; data: number } | { ok: false }> {
  const session = await getSessionRole();
  if (!canManageEnquiries(session.role)) return { ok: false };
  try {
    const supabase = await createClient();
    const { count, error } = await supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new");
    if (error) return { ok: false };
    return { ok: true, data: count ?? 0 };
  } catch {
    return { ok: false };
  }
}
