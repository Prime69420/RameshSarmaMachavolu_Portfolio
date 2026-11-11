import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { Container } from "@/components/layout/Container";
import { listEnquiries } from "@/lib/enquiry/queries";
import { enquiryStatuses } from "@/lib/enquiry/validation";
import { formatUpdated } from "@/lib/pratishtha/types";
import { readParam } from "@/lib/pratishtha/url";

const statusLabel: Record<(typeof enquiryStatuses)[number], string> = {
  new: "New",
  read: "Read",
  replied: "Replied",
  archived: "Archived",
};

async function EnquiryList({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await connection();
  const notice = readParam((await searchParams).notice);
  const result = await listEnquiries();

  return (
    <>
      {notice === "invalid" ? <p className="mt-6 text-sm text-burgundy">That status could not be applied.</p> : null}
      {!result.ok ? <p className="mt-8 leading-7 text-charcoal/80">Enquiries could not be loaded.</p> : null}
      {result.ok && result.data.length === 0 ? <p className="mt-8 leading-7 text-charcoal/80">No enquiries yet.</p> : null}
      {result.ok && result.data.length > 0 ? (
        <ul className="mt-8 divide-y divide-sandstone border-y border-sandstone">
          {result.data.map((enquiry) => (
            <li key={enquiry.id}>
              <Link href={`/admin/enquiries/${enquiry.id}`} className="grid gap-2 py-5 md:grid-cols-12 md:items-baseline">
                <span className="font-display text-2xl text-burgundy md:col-span-4">{enquiry.name}</span>
                <span className="text-sm text-charcoal/80 md:col-span-4">{enquiry.subject}</span>
                <span className="text-sm text-charcoal/70 md:col-span-2">{statusLabel[enquiry.status]}</span>
                <span className="text-sm text-charcoal/70 md:col-span-2">{formatUpdated(enquiry.created_at)}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

export default function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Container className="py-12 md:py-16">
      <h1 className="font-display text-5xl text-burgundy">Enquiries</h1>
      <p className="mt-4 max-w-2xl leading-7 text-charcoal/80">
        Messages sent from the contact page. Newest first. These records stay private to administrators.
      </p>
      <Suspense fallback={<p className="mt-8 leading-7 text-charcoal/70">Loading enquiries…</p>}>
        <EnquiryList searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}
