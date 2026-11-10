import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { site } from "@/data/site";
import { ArchivePhoto } from "@/components/archive/ArchivePhoto";
import { Container } from "@/components/layout/Container";
import { RelatedPages } from "@/components/layout/RelatedPages";
import { getPublishedRecord, listMedia, relatedRecords, signedUrls } from "@/lib/pratishtha/queries";
import { formatEventDate, locationLabel } from "@/lib/pratishtha/types";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  const result = await getPublishedRecord(slug);
  const record = result.ok ? result.data : null;
  if (!record) {
    return { title: "Pratishtha Kainkaryam" };
  }
  const description = record.description || [record.temple_name, locationLabel(record)].filter(Boolean).join(". ");
  return {
    title: record.title,
    description: description || record.title,
    openGraph: {
      title: `${record.title} · ${site.name}`,
      description: description || record.title,
      locale: "en_IN",
      type: "article",
    },
  };
}

function Fact({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="border-b border-sandstone py-4">
      <dt className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-charcoal/60">{label}</dt>
      <dd className="mt-2 leading-7 text-charcoal">{value}</dd>
    </div>
  );
}

async function RecordDetail({ params }: { params: Params }) {
  await connection();
  const { slug } = await params;
  const result = await getPublishedRecord(slug);
  if (!result.ok) {
    return (
      <Container className="py-16">
        <h1 className="font-display text-4xl text-burgundy">The archive is temporarily unavailable</h1>
        <p className="mt-4 max-w-2xl leading-7 text-charcoal/80">This record could not be loaded. Please try again later.</p>
        <Link href="/pratishtha-kainkaryam" className="mt-6 inline-block font-sans text-[0.72rem] uppercase tracking-[0.16em] text-burgundy">
          Back to the archive
        </Link>
      </Container>
    );
  }
  if (!result.data) notFound();

  const record = result.data;
  const [mediaResult, related] = await Promise.all([listMedia(record.id), relatedRecords(record)]);
  const media = mediaResult.ok ? mediaResult.data : [];
  const urls = await signedUrls(media.map((item) => item.storage_path));
  const place = locationLabel(record);
  const when = record.event_date ? formatEventDate(record.event_date) : record.year ? String(record.year) : null;

  return (
    <Container className="py-14 md:py-20">
      <Link href="/pratishtha-kainkaryam" className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-burgundy">
        Pratishtha archive
      </Link>
      <h1 className="mt-6 max-w-4xl font-display text-4xl leading-tight text-burgundy md:text-6xl">{record.title}</h1>
      {record.description ? <p className="mt-8 max-w-3xl whitespace-pre-line text-lg leading-8 text-charcoal/85">{record.description}</p> : null}
      <dl className="mt-10 max-w-3xl">
        <Fact label="Temple or project" value={record.temple_name} />
        <Fact label="Pratishtha" value={record.pratishtha_name} />
        <Fact label="Devata" value={record.devatas.length > 0 ? record.devatas.join(", ") : null} />
        <Fact label="Location" value={place || null} />
        <Fact label={record.event_date ? "Event date" : "Year"} value={when} />
        <Fact label="Ritual type" value={record.ritual_type} />
      </dl>

      <section className="mt-14" aria-labelledby="photographs-heading">
        <h2 id="photographs-heading" className="font-display text-3xl text-burgundy">
          Photographs
        </h2>
        {!mediaResult.ok ? <p className="mt-4 leading-7 text-charcoal/75">Photographs could not be loaded.</p> : null}
        {mediaResult.ok && media.length === 0 ? <p className="mt-4 leading-7 text-charcoal/75">No photographs available.</p> : null}
        {media.length > 0 ? (
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            {media.map((item) => {
              const src = urls.get(item.storage_path);
              return src ? (
                <ArchivePhoto key={item.id} src={src} alt={item.alt_text || record.title} caption={item.caption} sizes="(min-width: 768px) 40vw, 100vw" />
              ) : (
                <p key={item.id} className="text-sm leading-6 text-charcoal/70">
                  This photograph could not be displayed.
                </p>
              );
            })}
          </div>
        ) : null}
      </section>

      {related.length > 0 ? (
        <section className="mt-16" aria-labelledby="related-heading">
          <h2 id="related-heading" className="font-display text-3xl text-burgundy">
            Related records
          </h2>
          <ul className="mt-6 divide-y divide-sandstone border-y border-sandstone">
            {related.map((item) => {
              const relatedPlace = locationLabel(item);
              return (
                <li key={item.id}>
                  <Link href={`/pratishtha-kainkaryam/${item.slug}`} className="block py-4">
                    <span className="font-display text-2xl text-burgundy">{item.title}</span>
                    {relatedPlace || item.year ? (
                      <span className="mt-1 block text-sm leading-6 text-charcoal/75">
                        {[relatedPlace, item.year].filter(Boolean).join(" · ")}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </Container>
  );
}

export default function PratishthaRecordPage({ params }: { params: Params }) {
  return (
    <>
      <Suspense fallback={<Container className="py-16"><p className="leading-7 text-charcoal/75">Loading the record…</p></Container>}>
        <RecordDetail params={params} />
      </Suspense>
      <RelatedPages ids={["temples", "rituals", "about"]} />
    </>
  );
}
