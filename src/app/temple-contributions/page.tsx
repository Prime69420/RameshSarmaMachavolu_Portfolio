import type { Metadata } from "next";
import { destination, pageById } from "@/data/navigation";
import { templePhotographs, templePreview } from "@/data/temples";
import { PageIntro } from "@/components/layout/PageIntro";
import { RelatedPages } from "@/components/layout/RelatedPages";
import { Container } from "@/components/layout/Container";
import { SuppliedImage } from "@/components/media/SuppliedImage";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArchMotif } from "@/components/ui/ArchMotif";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { pageMetadata, publicPages, structuredData } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(publicPages.temples);

export default function TempleContributionsPage() {
  return (
    <>
      <JsonLd data={structuredData(publicPages.temples)} />
      <PageIntro
        eyebrow="Temples"
        title="Service to the temple"
        lede="Sri Machavolu Ramesh Sarma has donated to temples and helped in their building, in India and across the world. Preservation of the sacred institution sits at the centre of that service."
      />
      <Section>
        <Container className="grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow>Contribution</Eyebrow>
            <Heading className="mt-5 uppercase">Building and giving</Heading>
            <div className="mt-6 space-y-6 text-lg leading-8 text-charcoal/90">
              <p>
                Donation and help in building temples belong to this kainkaryam, together with the consecrations through which worship is established.
              </p>
              <p>
                The Pratishtha record names those consecrations and is kept on its own page. What follows is a short preview of that record.
              </p>
            </div>
          </div>
          <div className="border border-gold/60 bg-burgundy p-8 text-ivory lg:col-span-5">
            {templePhotographs.length > 0 ? (
              <ul className="grid gap-4">
                {templePhotographs.map((src) => (
                  <li key={src}>
                    <SuppliedImage
                      src={src}
                      alt="Temple photograph supplied for this record."
                      className="aspect-[4/3]"
                      sizes="(min-width: 1024px) 40vw, 100vw"
                    >
                      {null}
                    </SuppliedImage>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex aspect-[4/3] flex-col items-center justify-between text-center">
                <ArchMotif className="h-36 w-auto text-gold" />
                <p className="font-sans text-[0.68rem] uppercase leading-5 tracking-[0.16em] text-sandstone">
                  Temple photographs have not been supplied
                </p>
              </div>
            )}
          </div>
        </Container>
      </Section>
      <Section labelledBy="preview-heading" className="border-t border-sandstone bg-sandstone/25">
        <Container>
          <Eyebrow>Preview</Eyebrow>
          <Heading id="preview-heading" className="mt-5 max-w-3xl uppercase">
            From the Pratishtha record
          </Heading>
          <dl className="mt-10 border-t border-sandstone">
            {templePreview.map((place) => (
              <div key={place.place} className="grid gap-2 border-b border-sandstone py-5 sm:grid-cols-[12rem_1fr] sm:gap-8">
                <dt className="font-display text-2xl text-burgundy">{place.place}</dt>
                <dd className="leading-7 text-charcoal/85">{place.detail}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10">
            <Button href={destination(pageById("pratishtha"))}>Pratishtha portfolio</Button>
          </div>
        </Container>
      </Section>
      <RelatedPages ids={["pratishtha", "about", "rituals"]} />
    </>
  );
}
