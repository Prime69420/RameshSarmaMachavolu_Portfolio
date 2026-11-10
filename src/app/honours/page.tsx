import type { Metadata } from "next";
import { honourPhotographs, honourTitles } from "@/data/honours";
import { site } from "@/data/site";
import { PageIntro } from "@/components/layout/PageIntro";
import { RelatedPages } from "@/components/layout/RelatedPages";
import { Container } from "@/components/layout/Container";
import { SuppliedImage } from "@/components/media/SuppliedImage";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Honours and Titles",
  description:
    "Titles and recognitions recorded for Sri Machavolu Ramesh Sarma, including Vaidika Ratna, Aagama Siromani, Alankaara Samraat and Sahasraadhika Pratishthaapanaacharya.",
  openGraph: {
    title: `Honours and Titles · ${site.name}`,
    description: "The honours and titles supplied for Sri Machavolu Ramesh Sarma.",
    locale: "en_IN",
    type: "website",
  },
};

export default function HonoursPage() {
  return (
    <>
      <PageIntro
        eyebrow="Honours"
        title="A garland of distinctions"
        lede="Titles and recognitions recorded for Sri Machavolu Ramesh Sarma. Each line is given as it was supplied."
      />
      <Section>
        <Container>
          <ol className="mx-auto max-w-3xl border-t border-gold/70">
            {honourTitles.map((title, index) => (
              <li key={title} className="grid grid-cols-[3rem_1fr] items-baseline gap-4 border-b border-sandstone py-6 sm:grid-cols-[4.5rem_1fr] sm:py-8">
                <span className="font-sans text-[0.68rem] uppercase tracking-[0.16em] text-charcoal/55">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="font-display text-3xl italic leading-tight text-burgundy sm:text-4xl">{title}</p>
              </li>
            ))}
          </ol>
          <p className="mx-auto mt-10 max-w-3xl leading-7 text-charcoal/75">
            Verified certificates and photographs can be placed with these titles as they are supplied.
          </p>
          {honourPhotographs.length > 0 ? (
            <ul className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
              {honourPhotographs.map((src) => (
                <li key={src}>
                  <SuppliedImage
                    src={src}
                    alt="Honour photograph supplied for this record."
                    className="aspect-[4/3] border border-sandstone bg-ivory"
                  >
                    {null}
                  </SuppliedImage>
                </li>
              ))}
            </ul>
          ) : null}
        </Container>
      </Section>
      <RelatedPages ids={["about", "pratishtha", "alankarams"]} />
    </>
  );
}
