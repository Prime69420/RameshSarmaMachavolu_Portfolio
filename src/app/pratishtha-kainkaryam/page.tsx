import type { Metadata } from "next";
import { Suspense } from "react";
import { pratishthaPage } from "@/data/pratishtha";
import { ArchiveListing } from "@/components/archive/ArchiveListing";
import { Container } from "@/components/layout/Container";
import { PageIntro } from "@/components/layout/PageIntro";
import { RelatedPages } from "@/components/layout/RelatedPages";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section } from "@/components/ui/Section";
import { pageMetadata, publicPages, structuredData } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(publicPages.pratishtha);

export default function PratishthaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <>
      <JsonLd data={structuredData(publicPages.pratishtha)} />
      <PageIntro eyebrow={pratishthaPage.eyebrow} title={pratishthaPage.title} lede={pratishthaPage.lede} />
      <Container>
        <Suspense fallback={<p className="border-t border-sandstone py-16 leading-7 text-charcoal/75">Loading the archive…</p>}>
          <ArchiveListing searchParams={searchParams} />
        </Suspense>
      </Container>
      <Section className="bg-burgundy text-ivory">
        <Container>
          <p className="max-w-2xl font-display text-3xl leading-snug text-ivory">{pratishthaPage.note}</p>
        </Container>
      </Section>
      <RelatedPages ids={["temples", "rituals", "about"]} />
    </>
  );
}
