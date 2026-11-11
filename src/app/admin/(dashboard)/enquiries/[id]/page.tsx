import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { setEnquiryStatus } from "@/app/actions/enquiries";
import { Container } from "@/components/layout/Container";
import { getEnquiry } from "@/lib/enquiry/queries";
import { enquiryStatuses } from "@/lib/enquiry/validation";
import { formatUpdated } from "@/lib/pratishtha/types";
import { readParam } from "@/lib/pratishtha/url";

const statusLabel: Record<(typeof enquiryStatuses)[number], string> = {
  new: "New",
  read: "Read",
  replied: "Replied",
  archived: "Archived",
};

async function EnquiryDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const { id } = await params;
  const notice = readParam((await searchParams).notice);
  const result = await getEnquiry(id);

  if (!result.ok) return <p className="mt-8 leading-7 text-charcoal/80">This enquiry could not be loaded.</p>;
  if (!result.data) return <p className="mt-8 leading-7 text-charcoal/80">This enquiry could not be found.</p>;

  const enquiry = result.data;
  const facts = [
    ["Email", enquiry.email],
    ["Mobile", enquiry.phone ?? "Not given"],
    ["Received", formatUpdated(enquiry.created_at)],
  ] as const;

  return (
    <>
      <p className="mt-6">
        <Link href="/admin/enquiries" className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-burgundy">
          All enquiries
        </Link>
      </p>
      <h1 className="mt-6 font-display text-5xl text-burgundy">{enquiry.subject}</h1>
      <p className="mt-4 font-display text-3xl text-charcoal">{enquiry.name}</p>
      {notice === "saved" ? <p className="mt-6 text-sm text-burgundy">The status was updated.</p> : null}
      {notice === "failed" ? <p className="mt-6 text-sm text-burgundy">The status could not be updated.</p> : null}
      <dl className="mt-8 grid gap-4 sm:grid-cols-3">
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt className="font-sans text-[0.68rem] uppercase tracking-[0.16em] text-charcoal/60">{label}</dt>
            <dd className="mt-2 break-all text-sm leading-6 text-charcoal">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-8 max-w-3xl whitespace-pre-wrap break-words leading-7 text-charcoal">{enquiry.message}</p>
      <form action={setEnquiryStatus} className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
        <label>
          <span className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-charcoal">Status</span>
          <select name="status" defaultValue={enquiry.status} className="mt-2 block border-0 border-b border-sandstone bg-transparent py-3 font-sans text-base text-charcoal">
            {enquiryStatuses.map((status) => (
              <option key={status} value={status}>
                {statusLabel[status]}
              </option>
            ))}
          </select>
        </label>
        <input type="hidden" name="id" value={enquiry.id} />
        <button type="submit" className="bg-burgundy px-6 py-3 font-sans text-[0.72rem] uppercase tracking-[0.2em] text-ivory">
          Save status
        </button>
      </form>
    </>
  );
}

export default function EnquiryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Container className="py-12 md:py-16">
      <Suspense fallback={<p className="leading-7 text-charcoal/70">Loading the enquiry…</p>}>
        <EnquiryDetail params={params} searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}
