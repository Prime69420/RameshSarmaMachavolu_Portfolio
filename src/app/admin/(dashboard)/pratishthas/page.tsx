import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { RecordActions } from "@/components/admin/RecordActions";
import { Pagination } from "@/components/archive/Pagination";
import { Container } from "@/components/layout/Container";
import { searchArchive } from "@/lib/pratishtha/queries";
import { formatUpdated, PAGE_SIZE } from "@/lib/pratishtha/types";
import { adminHref, parsePage, readParam } from "@/lib/pratishtha/url";

const fieldClass = "mt-2 w-full border-0 border-b border-sandstone bg-transparent py-3 font-sans text-base text-charcoal";

function RecordCell({ label, value, className }: { label: string; value: string | null; className?: string }) {
  return (
    <p className={`text-sm leading-6 text-charcoal/80 ${className ?? ""}`}>
      <span className="mb-1 block font-sans text-[0.68rem] uppercase tracking-[0.14em] text-charcoal/50 lg:hidden">{label}</span>
      {value || "Not recorded"}
    </p>
  );
}

async function RecordList({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const params = await searchParams;
  const q = readParam(params.q);
  const statusParam = readParam(params.status);
  const status = statusParam === "draft" || statusParam === "published" ? statusParam : "all";
  const page = parsePage(readParam(params.page));
  const notice = readParam(params.notice);
  const result = await searchArchive({ q, country: "", state: "", city: "", devata: "", type: "", year: "", page }, status);

  return (
    <>
      {notice === "deleted" ? <p className="mt-6 text-sm text-burgundy">The record was deleted.</p> : null}
      <form method="get" action="/admin/pratishthas" className="mt-8 grid gap-4 md:grid-cols-[1fr_12rem_auto] md:items-end">
        <label>
          <span className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-charcoal">Search</span>
          <input name="q" defaultValue={q} className={fieldClass} />
        </label>
        <label>
          <span className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-charcoal">Status</span>
          <select name="status" defaultValue={status} className={fieldClass}>
            <option value="all">All</option>
            <option value="draft">Drafts</option>
            <option value="published">Published</option>
          </select>
        </label>
        <button type="submit" className="bg-burgundy px-6 py-3 font-sans text-[0.72rem] uppercase tracking-[0.2em] text-ivory">
          Search
        </button>
      </form>
      {!result.ok ? <p className="mt-10 leading-7 text-charcoal/80">The records could not be loaded.</p> : null}
      {result.ok && result.data.total === 0 ? (
        <p className="mt-10 leading-7 text-charcoal/80">{q || status !== "all" ? "No records match this search." : "No records yet."}</p>
      ) : null}
      {result.ok && result.data.rows.length === 0 && result.data.total > 0 ? (
        <p className="mt-10 leading-7">
          No records on this page. <Link href={adminHref({ q, status })} className="text-burgundy">First page</Link>
        </p>
      ) : null}
      {result.ok && result.data.rows.length > 0 ? (
        <>
          <p className="mt-8 hidden border-b border-burgundy/30 py-3 font-sans text-[0.68rem] uppercase tracking-[0.14em] text-charcoal/60 lg:grid lg:grid-cols-12">
            <span className="col-span-3">Title</span>
            <span className="col-span-2">Temple</span>
            <span className="col-span-2">Devata</span>
            <span className="col-span-1">City</span>
            <span className="col-span-1">Country</span>
            <span className="col-span-1">Year</span>
            <span className="col-span-2">Status</span>
          </p>
          <div className="border-t border-sandstone lg:border-t-0">
            {result.data.rows.map((record) => (
              <article key={record.id} className="grid gap-3 border-b border-sandstone py-5 lg:grid-cols-12 lg:items-start">
                <h2 className="font-display text-2xl leading-tight text-burgundy lg:col-span-3">{record.title}</h2>
                <RecordCell label="Temple" value={record.temple_name} className="lg:col-span-2" />
                <RecordCell label="Devata" value={record.devatas.join(", ")} className="lg:col-span-2" />
                <RecordCell label="City" value={record.city} className="lg:col-span-1" />
                <RecordCell label="Country" value={record.country} className="lg:col-span-1" />
                <RecordCell label="Year" value={record.year ? String(record.year) : null} className="lg:col-span-1" />
                <div className="lg:col-span-2">
                  <p className="text-sm text-charcoal/80">{record.status === "published" ? "Published" : "Draft"}</p>
                  <p className="mt-1 text-sm text-charcoal/60">Updated {formatUpdated(record.updated_at)}</p>
                  <div className="mt-3">
                    <RecordActions id={record.id} status={record.status} title={record.title} />
                  </div>
                </div>
              </article>
            ))}
          </div>
          <Pagination page={page} total={result.data.total} pageSize={PAGE_SIZE} hrefFor={(nextPage) => adminHref({ q, status }, nextPage)} />
        </>
      ) : null}
    </>
  );
}

export default function AdminRecordsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Container className="py-12 md:py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h1 className="font-display text-5xl text-burgundy">Records</h1>
        <Link href="/admin/pratishthas/new" className="inline-flex bg-burgundy px-6 py-3 font-sans text-[0.72rem] uppercase tracking-[0.2em] text-ivory">
          Add Pratishtha
        </Link>
      </div>
      <Suspense fallback={<p className="mt-8 leading-7 text-charcoal/70">Loading records…</p>}>
        <RecordList searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}
