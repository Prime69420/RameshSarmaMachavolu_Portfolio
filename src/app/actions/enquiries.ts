"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { canManageEnquiries } from "@/lib/enquiry/access";
import { isEnquiryStatus } from "@/lib/enquiry/validation";
import { getSessionRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const idPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function setEnquiryStatus(formData: FormData) {
  const session = await getSessionRole();
  if (!canManageEnquiries(session.role)) redirect("/admin/login");

  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "");
  if (!idPattern.test(id) || !isEnquiryStatus(status)) redirect("/admin/enquiries?notice=invalid");

  const supabase = await createClient();
  const updated = await supabase.from("enquiries").update({ status }).eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
  redirect(`/admin/enquiries/${id}?notice=${updated.error ? "failed" : "saved"}`);
}
