import type { EnquiryStore, StoredEnquiry } from "@/lib/enquiry/submit";
import type { EnquiryValue } from "@/lib/enquiry/validation";
import { createServiceClient } from "@/lib/supabase/service";

function asStored(value: EnquiryValue, id: unknown): StoredEnquiry {
  if (typeof id !== "string") throw new Error("enquiry save failed");
  return { id, ...value };
}

export function createEnquiryStore(): EnquiryStore | null {
  const supabase = createServiceClient();
  if (!supabase) return null;

  return {
    async findRecentDuplicate(value, sinceIso) {
      const { data, error } = await supabase
        .from("enquiries")
        .select("id")
        .eq("email", value.email)
        .eq("subject", value.subject)
        .eq("message", value.message)
        .gte("created_at", sinceIso)
        .limit(1);
      if (error) throw new Error("enquiry lookup failed");
      const row = data?.[0];
      return row?.id ? { id: String(row.id) } : null;
    },
    async countRecentByEmail(email, sinceIso) {
      const { count, error } = await supabase
        .from("enquiries")
        .select("id", { count: "exact", head: true })
        .eq("email", email)
        .gte("created_at", sinceIso);
      if (error) throw new Error("enquiry lookup failed");
      return count ?? 0;
    },
    async insert(value) {
      const { data, error } = await supabase
        .from("enquiries")
        .insert({
          name: value.name,
          email: value.email,
          phone: value.phone,
          subject: value.subject,
          message: value.message,
        })
        .select("id")
        .single();
      if (error) throw new Error("enquiry save failed");
      return asStored(value, data?.id);
    },
  };
}
