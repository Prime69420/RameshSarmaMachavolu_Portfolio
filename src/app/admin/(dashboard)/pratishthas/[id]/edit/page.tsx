import { connection } from "next/server";
import { Suspense } from "react";
import { MediaManager } from "@/components/admin/MediaManager";
import { PratishthaForm, type PratishthaFormValues } from "@/components/admin/PratishthaForm";
import { Container } from "@/components/layout/Container";
import { getRecordById, listMedia, signedUrls } from "@/lib/pratishtha/queries";
import { readParam } from "@/lib/pratishtha/url";
import type { PratishthaRecord } from "@/lib/pratishtha/types";

function valuesFrom(record: PratishthaRecord): PratishthaFormValues {
  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    temple_name: record.temple_name ?? "",
    pratishtha_name: record.pratishtha_name ?? "",
    devatas: record.devatas,
    city: record.city ?? "",
    state: record.state ?? "",
    country: record.country ?? "",
    year: record.year ? String(record.year) : "",
    event_date: record.event_date?.slice(0, 10) ?? "",
    description: record.description ?? "",
    ritual_type: record.ritual_type ?? "",
    status: record.status,
    featured: record.featured,
    display_order: String(record.display_order),
  };
}

async function Editor({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const { id } = await params;
  const query = await searchParams;
  const notice = readParam(query.notice);
  const result = await getRecordById(id);
  if (!result.ok) return <p className="mt-8 leading-7 text-charcoal/80">This record could not be loaded.</p>;
  if (!result.data) return <p className="mt-8 leading-7 text-charcoal/80">This record could not be found.</p>;

  const mediaResult = await listMedia(result.data.id);
  const media = mediaResult.ok ? mediaResult.data : [];
  const urls = await signedUrls(media.map((item) => item.storage_path));

  return (
    <>
      <h1 className="font-display text-5xl text-burgundy">Edit Pratishtha</h1>
      {notice ? <p className="mt-6 max-w-2xl text-sm leading-6 text-burgundy">{notice}</p> : null}
      <PratishthaForm initial={valuesFrom(result.data)} />
      {mediaResult.ok ? (
        <MediaManager pratishthaId={result.data.id} media={media.map((item) => ({ ...item, src: urls.get(item.storage_path) ?? null }))} />
      ) : (
        <p className="mt-10 leading-7 text-charcoal/80">Photographs could not be loaded.</p>
      )}
    </>
  );
}

export default function EditPratishthaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Container className="py-12 md:py-16">
      <Suspense fallback={<p className="leading-7 text-charcoal/70">Loading the record…</p>}>
        <Editor params={params} searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}
