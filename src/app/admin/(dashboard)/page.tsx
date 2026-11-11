import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { Container } from "@/components/layout/Container";
import { countNewEnquiries } from "@/lib/enquiry/queries";
import { adminOverview } from "@/lib/pratishtha/queries";
import { formatUpdated } from "@/lib/pratishtha/types";

async function Overview() {
  await connection();
  const result = await adminOverview();
  if (!result.ok) {
    return <p className="mt-8 leading-7 text-charcoal/80">The archive totals could not be loaded.</p>;
  }

  const figures = [
    ["Records", result.data.total],
    ["Published", result.data.published],
    ["Drafts", result.data.drafts],
  ] as const;
  const incoming = await countNewEnquiries();

  return (
    <>
      <dl className="mt-10 grid gap-4 sm:grid-cols-3">
        {figures.map(([label, value]) => (
          <div key={label} className="border border-sandstone px-5 py-6">
            <dt className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-charcoal/60">{label}</dt>
            <dd className="mt-3 font-display text-5xl text-burgundy">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-8">
        <Link href="/admin/enquiries" className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-burgundy">
          Enquiries{incoming.ok ? ` · ${incoming.data} new` : ""}
        </Link>
      </p>
      <section className="mt-12">
        <h2 className="font-display text-3xl text-burgundy">Recently updated</h2>
        {result.data.recent.length === 0 ? <p className="mt-4 leading-7 text-charcoal/75">No records yet.</p> : null}
        <ul className="mt-4 divide-y divide-sandstone border-y border-sandstone">
          {result.data.recent.map((record) => (
            <li key={record.id}>
              <Link href={`/admin/pratishthas/${record.id}/edit`} className="flex flex-col gap-1 py-4 md:flex-row md:items-baseline md:justify-between">
                <span className="font-display text-2xl text-burgundy">{record.title}</span>
                <span className="text-sm text-charcoal/70">
                  {record.status === "published" ? "Published" : "Draft"} · {formatUpdated(record.updated_at)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default function AdminHomePage() {
  return (
    <Container className="py-12 md:py-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-5xl text-burgundy">Pratishtha archive</h1>
          <p className="mt-4 max-w-2xl leading-7 text-charcoal/80">
            Review draft records, then publish the ones that are ready. Unpublished records stay off the public archive.
          </p>
        </div>
        <Link href="/admin/pratishthas/new" className="inline-flex bg-burgundy px-6 py-3 font-sans text-[0.72rem] uppercase tracking-[0.2em] text-ivory">
          Add Pratishtha
        </Link>
      </div>
      <Suspense fallback={<p className="mt-10 leading-7 text-charcoal/70">Loading records…</p>}>
        <Overview />
      </Suspense>
    </Container>
  );
}
