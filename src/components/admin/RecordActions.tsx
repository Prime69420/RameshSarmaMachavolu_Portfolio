"use client";

import { useActionState, useRef } from "react";
import Link from "next/link";
import { deletePratishtha, setPratishthaStatus } from "@/app/actions/pratishthas";
import type { PratishthaStatus } from "@/lib/pratishtha/types";

export function RecordActions({ id, status, title }: { id: string; status: PratishthaStatus; title: string }) {
  const [statusState, statusAction, statusPending] = useActionState(setPratishthaStatus, null);
  const [deleteState, deleteAction, deletePending] = useActionState(deletePratishtha, null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nextStatus = status === "published" ? "draft" : "published";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link href={`/admin/pratishthas/${id}/edit`} className="font-sans text-[0.72rem] uppercase tracking-[0.14em] text-burgundy">
        Edit
      </Link>
      <form action={statusAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="status" value={nextStatus} />
        <button type="submit" disabled={statusPending} className="font-sans text-[0.72rem] uppercase tracking-[0.14em] text-burgundy disabled:opacity-50">
          {statusPending ? "Saving…" : status === "published" ? "Unpublish" : "Publish"}
        </button>
      </form>
      <button type="button" className="font-sans text-[0.72rem] uppercase tracking-[0.14em] text-burgundy" onClick={() => dialogRef.current?.showModal()}>
        Delete
      </button>
      <dialog ref={dialogRef} className="w-[min(32rem,calc(100%-2rem))] border border-sandstone bg-ivory p-6 text-charcoal backdrop:bg-charcoal/50">
        <form action={deleteAction}>
          <input type="hidden" name="id" value={id} />
          <h2 className="font-display text-3xl text-burgundy">Delete this record?</h2>
          <p className="mt-4 leading-7">“{title}” and its photographs will be removed.</p>
          {deleteState?.ok === false ? <p className="mt-4 text-sm text-burgundy">{deleteState.error}</p> : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" disabled={deletePending} className="bg-burgundy px-5 py-3 font-sans text-[0.72rem] uppercase tracking-[0.16em] text-ivory disabled:opacity-50">
              {deletePending ? "Deleting…" : "Delete record"}
            </button>
            <button type="button" className="border border-burgundy px-5 py-3 font-sans text-[0.72rem] uppercase tracking-[0.16em] text-burgundy" onClick={() => dialogRef.current?.close()}>
              Cancel
            </button>
          </div>
        </form>
      </dialog>
      {statusState?.ok === false ? <p className="w-full text-sm text-burgundy">{statusState.error}</p> : null}
      {statusState?.ok === true ? <p className="w-full text-sm text-burgundy">{statusState.message}</p> : null}
    </div>
  );
}
