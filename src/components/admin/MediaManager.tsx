"use client";

import { useActionState } from "react";
import { manageMedia, uploadPhotographs } from "@/app/actions/pratishthas";
import { ArchivePhoto } from "@/components/archive/ArchivePhoto";
import type { PratishthaMedia } from "@/lib/pratishtha/types";

const labelClass = "block font-sans text-[0.72rem] uppercase tracking-[0.16em] text-charcoal";
const fieldClass = "mt-2 w-full border-0 border-b border-sandstone bg-transparent py-3 font-sans text-base text-charcoal";

function PhotoEditor({ item, src, index, total }: { item: PratishthaMedia; src: string | null; index: number; total: number }) {
  const [state, action, pending] = useActionState(manageMedia, null);

  return (
    <form action={action} className="grid gap-4 border-b border-sandstone py-6 md:grid-cols-12">
      <input type="hidden" name="id" value={item.id} />
      <div className="md:col-span-4">
        {src ? (
          <ArchivePhoto src={src} alt={item.alt_text || "Pratishtha photograph"} sizes="(min-width: 768px) 240px, 100vw" caption={null} />
        ) : (
          <p className="text-sm leading-6 text-charcoal/70">This photograph could not be displayed.</p>
        )}
      </div>
      <div className="space-y-4 md:col-span-8">
        <label className={labelClass} htmlFor={`alt-${item.id}`}>
          Photograph description
        </label>
        <input id={`alt-${item.id}`} name="alt_text" defaultValue={item.alt_text} className={fieldClass} required />
        <label className={labelClass} htmlFor={`caption-${item.id}`}>
          Caption
        </label>
        <input id={`caption-${item.id}`} name="caption" defaultValue={item.caption ?? ""} className={fieldClass} />
        {state?.ok === false ? <p className="text-sm text-burgundy">{state.error}</p> : null}
        {state?.ok === true ? <p className="text-sm text-burgundy">{state.message}</p> : null}
        <div className="flex flex-wrap gap-3">
          <button name="intent" value="save" disabled={pending} className="font-sans text-[0.72rem] uppercase tracking-[0.14em] text-burgundy disabled:opacity-50">
            Save details
          </button>
          <button name="intent" value="up" disabled={pending || index === 0} className="font-sans text-[0.72rem] uppercase tracking-[0.14em] text-burgundy disabled:opacity-50">
            Move earlier
          </button>
          <button name="intent" value="down" disabled={pending || index === total - 1} className="font-sans text-[0.72rem] uppercase tracking-[0.14em] text-burgundy disabled:opacity-50">
            Move later
          </button>
          <button
            name="intent"
            value="delete"
            disabled={pending}
            className="font-sans text-[0.72rem] uppercase tracking-[0.14em] text-burgundy disabled:opacity-50"
            onClick={(event) => {
              if (!window.confirm("Remove this photograph?")) event.preventDefault();
            }}
          >
            Remove
          </button>
        </div>
      </div>
    </form>
  );
}

export function MediaManager({
  pratishthaId,
  media,
}: {
  pratishthaId: string;
  media: Array<PratishthaMedia & { src: string | null }>;
}) {
  const [state, action, pending] = useActionState(uploadPhotographs, null);

  return (
    <section className="mt-16 max-w-3xl border-t border-sandstone pt-10">
      <h2 className="font-display text-3xl text-burgundy">Photographs</h2>
      <form action={action} className="mt-6 space-y-4">
        <input type="hidden" name="pratishtha_id" value={pratishthaId} />
        <p className="text-sm leading-7 text-charcoal/75">JPEG, PNG, WebP, or AVIF. Up to 8 files, 8 MB each.</p>
        <label className={labelClass} htmlFor="more-photos">
          Add photographs
        </label>
        <input id="more-photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple className="block w-full text-sm" required />
        <label className={labelClass} htmlFor="more-photo-alt">
          Description for these photographs
        </label>
        <input id="more-photo-alt" name="photo_alt" className={fieldClass} />
        {state?.ok === false ? <p className="text-sm text-burgundy">{state.error}</p> : null}
        {state?.ok === true ? <p className="text-sm text-burgundy">{state.message}</p> : null}
        <button type="submit" disabled={pending} className="bg-burgundy px-6 py-3 font-sans text-[0.72rem] uppercase tracking-[0.2em] text-ivory disabled:opacity-50">
          {pending ? "Uploading…" : "Upload photographs"}
        </button>
      </form>
      {media.length === 0 ? <p className="mt-8 leading-7 text-charcoal/75">No photographs available.</p> : null}
      <div className="mt-4">
        {media.map((item, index) => (
          <PhotoEditor key={item.id} item={item} src={item.src} index={index} total={media.length} />
        ))}
      </div>
    </section>
  );
}
