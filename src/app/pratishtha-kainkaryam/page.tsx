import type { Metadata } from "next";
import { Suspense } from "react";
import { pratishthaPage } from "@/data/pratishtha";
import { site } from "@/data/site";
import { ArchiveListing } from "@/components/archive/ArchiveListing";
import { Container } from "@/components/layout/Container";
import { PageIntro } from "@/components/layout/PageIntro";
import { RelatedPages } from "@/components/layout/RelatedPages";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Pratishtha Kainkaryam",
  description:
    "Search the published Pratishtha archive of Sri Machavolu Ramesh Sarma. More than 2,000 consecrations have been performed; this page shows the records that have been reviewed and published.",
  openGraph: {
    title: `Pratishtha Kainkaryam · ${site.name}`,
    description: "A searchable archive of published temple Pratishthas performed by Sri Machavolu Ramesh Sarma.",
    locale: "en_IN",
    type: "website",
  },
};

export default function PratishthaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <>
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
