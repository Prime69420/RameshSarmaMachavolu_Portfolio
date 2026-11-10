"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/app/actions/auth";
import { parsePratishthaForm } from "@/lib/pratishtha/validation";
import { MAX_PHOTO_BYTES, MAX_PHOTOS, MEDIA_BUCKET, type ActionState, type PratishthaStatus } from "@/lib/pratishtha/types";
import { createClient } from "@/lib/supabase/server";

const mimeExtensions = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/jpg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

function databaseMessage(error: { code?: string; message?: string }) {
  if (error.code === "23505") return "A record with this address already exists. Choose a different slug.";
  const message = error.message?.toLowerCase() ?? "";
  if (error.code === "42501" || message.includes("row-level security")) {
    return "This account cannot change the archive.";
  }
  return "The record could not be saved. Try again.";
}

function refreshArchive(slug?: string) {
  revalidatePath("/pratishtha-kainkaryam");
  revalidatePath("/gallery");
  revalidatePath("/admin");
  revalidatePath("/admin/pratishthas");
  if (slug) revalidatePath(`/pratishtha-kainkaryam/${slug}`);
}

async function selectedFiles(formData: FormData) {
  return formData
    .getAll("photos")
    .filter((item): item is File => item instanceof File && item.size > 0);
}

async function storePhotographs(pratishthaId: string, files: File[], altText: string) {
  if (files.length === 0) return null;
  if (files.length > MAX_PHOTOS) return `Upload no more than ${MAX_PHOTOS} photographs at a time.`;

  const supabase = await createClient();
  const { count } = await supabase.from("pratishtha_media").select("id", { count: "exact", head: true }).eq("pratishtha_id", pratishthaId);
  let position = count ?? 0;

  for (const file of files) {
    const extension = mimeExtensions.get(file.type);
    if (!extension) return "Photographs must be JPEG, PNG, WebP, or AVIF files.";
    if (file.size > MAX_PHOTO_BYTES) return "Each photograph must be 8 MB or smaller.";

    const path = `${pratishthaId}/${crypto.randomUUID()}.${extension}`;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const uploaded = await supabase.storage.from(MEDIA_BUCKET).upload(path, bytes, {
      contentType: file.type === "image/jpg" ? "image/jpeg" : file.type,
      upsert: false,
    });
    if (uploaded.error) return "A photograph could not be uploaded.";

    const inserted = await supabase.from("pratishtha_media").insert({
      pratishtha_id: pratishthaId,
      storage_path: path,
      alt_text: altText,
      caption: null,
      display_order: position,
    });
    if (inserted.error) {
      await supabase.storage.from(MEDIA_BUCKET).remove([path]);
      return databaseMessage(inserted.error);
    }
    position += 1;
  }

  return null;
}

export async function savePratishtha(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const gate = await assertAdmin();
  if (!gate.ok) return gate;

  const parsed = parsePratishthaForm(formData);
  if (!parsed.ok) return parsed;

  const supabase = await createClient();
  const id = String(formData.get("id") ?? "").trim();
  const duplicate = await supabase.from("pratishthas").select("id").eq("slug", parsed.value.slug).maybeSingle();
  if (duplicate.error) return { ok: false, error: "The record could not be saved. Try again." };
  if (duplicate.data && duplicate.data.id !== id) {
    return { ok: false, error: "A record with this address already exists. Choose a different slug." };
  }

  if (!id) {
    const created = await supabase.from("pratishthas").insert(parsed.value).select("id, title, slug").single();
    if (created.error || !created.data) return { ok: false, error: databaseMessage(created.error ?? {}) };
    const files = await selectedFiles(formData);
    const alt = String(formData.get("photo_alt") ?? "").trim() || created.data.title;
    const uploadError = await storePhotographs(created.data.id, files, alt);
    refreshArchive(created.data.slug);
    const notice = uploadError ? `?notice=${encodeURIComponent(uploadError)}` : "";
    redirect(`/admin/pratishthas/${created.data.id}/edit${notice}`);
  }

  const previous = await supabase.from("pratishthas").select("slug").eq("id", id).maybeSingle();
  if (previous.error) return { ok: false, error: "The record could not be saved. Try again." };
  if (!previous.data) return { ok: false, error: "This record could not be found." };

  const updated = await supabase.from("pratishthas").update(parsed.value).eq("id", id);
  if (updated.error) return { ok: false, error: databaseMessage(updated.error) };
  refreshArchive(previous.data.slug);
  refreshArchive(parsed.value.slug);
  return { ok: true, message: "Saved." };
}

export async function uploadPhotographs(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const gate = await assertAdmin();
  if (!gate.ok) return gate;
  const id = String(formData.get("pratishtha_id") ?? "").trim();
  if (!id) return { ok: false, error: "The record could not be found." };

  const supabase = await createClient();
  const record = await supabase.from("pratishthas").select("title, slug").eq("id", id).maybeSingle();
  if (record.error || !record.data) return { ok: false, error: "The record could not be found." };

  const files = await selectedFiles(formData);
  if (files.length === 0) return { ok: false, error: "Choose at least one photograph." };
  const alt = String(formData.get("photo_alt") ?? "").trim() || record.data.title;
  const uploadError = await storePhotographs(id, files, alt);
  if (uploadError) return { ok: false, error: uploadError };
  refreshArchive(record.data.slug);
  return { ok: true, message: "Photographs added. Add a description for each one below." };
}

export async function manageMedia(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const gate = await assertAdmin();
  if (!gate.ok) return gate;

  const id = String(formData.get("id") ?? "").trim();
  const intent = String(formData.get("intent") ?? "");
  const supabase = await createClient();
  const current = await supabase.from("pratishtha_media").select("*").eq("id", id).maybeSingle();
  if (current.error || !current.data) return { ok: false, error: "This photograph could not be found." };

  const parent = await supabase.from("pratishthas").select("slug, title").eq("id", current.data.pratishtha_id).maybeSingle();
  if (parent.error || !parent.data) return { ok: false, error: "The record could not be found." };

  if (intent === "delete") {
    await supabase.storage.from(MEDIA_BUCKET).remove([current.data.storage_path]);
    const removed = await supabase.from("pratishtha_media").delete().eq("id", id);
    if (removed.error) return { ok: false, error: "The photograph could not be removed." };
    refreshArchive(parent.data.slug);
    return { ok: true, message: "Photograph removed." };
  }

  if (intent === "up" || intent === "down") {
    const siblings = await supabase
      .from("pratishtha_media")
      .select("id")
      .eq("pratishtha_id", current.data.pratishtha_id)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (siblings.error || !siblings.data) return { ok: false, error: "The photographs could not be reordered." };
    const ordered = siblings.data.map((item) => item.id);
    const index = ordered.indexOf(id);
    const target = intent === "up" ? index - 1 : index + 1;
    if (index < 0 || target < 0 || target >= ordered.length) return { ok: true, message: "The photograph is already at that end." };
    const next = ordered.slice();
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    for (let position = 0; position < next.length; position += 1) {
      const result = await supabase.from("pratishtha_media").update({ display_order: position }).eq("id", next[position]);
      if (result.error) return { ok: false, error: "The photographs could not be reordered." };
    }
    refreshArchive(parent.data.slug);
    return { ok: true, message: "Order saved." };
  }

  const alt = String(formData.get("alt_text") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim();
  if (alt.length < 2) return { ok: false, error: "Enter a description of the photograph." };
  if (alt.length > 200) return { ok: false, error: "The photograph description is too long." };
  if (caption.length > 300) return { ok: false, error: "The caption is too long." };
  const saved = await supabase.from("pratishtha_media").update({ alt_text: alt, caption: caption || null }).eq("id", id);
  if (saved.error) return { ok: false, error: "The photograph details could not be saved." };
  refreshArchive(parent.data.slug);
  return { ok: true, message: "Photograph details saved." };
}

export async function setPratishthaStatus(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const gate = await assertAdmin();
  if (!gate.ok) return gate;
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "");
  if (status !== "draft" && status !== "published") return { ok: false, error: "Choose draft or published." };

  const supabase = await createClient();
  const record = await supabase.from("pratishthas").select("slug").eq("id", id).maybeSingle();
  if (record.error || !record.data) return { ok: false, error: "This record could not be found." };
  const updated = await supabase.from("pratishthas").update({ status: status as PratishthaStatus }).eq("id", id);
  if (updated.error) return { ok: false, error: databaseMessage(updated.error) };
  refreshArchive(record.data.slug);
  return { ok: true, message: status === "published" ? "Published." : "Returned to draft." };
}

export async function deletePratishtha(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const gate = await assertAdmin();
  if (!gate.ok) return gate;
  const id = String(formData.get("id") ?? "").trim();
  const supabase = await createClient();
  const record = await supabase.from("pratishthas").select("slug").eq("id", id).maybeSingle();
  if (record.error || !record.data) return { ok: false, error: "This record could not be found." };

  const media = await supabase.from("pratishtha_media").select("storage_path").eq("pratishtha_id", id);
  const paths = (media.data ?? []).map((item) => item.storage_path).filter((path): path is string => typeof path === "string");
  if (paths.length > 0) await supabase.storage.from(MEDIA_BUCKET).remove(paths);

  const removed = await supabase.from("pratishthas").delete().eq("id", id);
  if (removed.error) return { ok: false, error: "The record could not be deleted." };
  refreshArchive(record.data.slug);
  redirect("/admin/pratishthas?notice=deleted");
}
