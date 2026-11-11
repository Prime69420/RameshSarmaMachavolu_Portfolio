import type { Metadata } from "next";
import { sadhanaPage } from "@/data/sadhana";
import { PageIntro } from "@/components/layout/PageIntro";
import { RelatedPages } from "@/components/layout/RelatedPages";
import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArchMotif } from "@/components/ui/ArchMotif";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { pageMetadata, publicPages, structuredData } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(publicPages.sadhana);

export default function SadhanaPage() {
  const [main, ...companions] = sadhanaPage.devatarchana;

  return (
    <>
      <JsonLd data={structuredData(publicPages.sadhana)} />
      <PageIntro eyebrow={sadhanaPage.eyebrow} title={sadhanaPage.title} lede={sadhanaPage.lede} />
      <Section id="devatarchana" labelledBy="devatarchana-heading">
        <Container className="grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow>Home worship</Eyebrow>
            <Heading id="devatarchana-heading" className="mt-5 uppercase">
              Home Devatarchana
            </Heading>
            <p className="mt-6 leading-7 text-charcoal/80">{sadhanaPage.altarNote}</p>
            <div className="mt-8 border border-gold/60 bg-burgundy px-6 py-10 text-center text-ivory">
              <ArchMotif className="mx-auto h-36 w-auto text-gold" />
              <p className="mt-6 font-sans text-[0.68rem] uppercase leading-5 tracking-[0.16em] text-sandstone">
                Architectural mark — not a photograph of the altar
              </p>
            </div>
          </div>
          <div className="lg:col-span-7">
            <article className="border border-sandstone px-6 py-8 text-center">
              <h3 className="font-display text-4xl text-burgundy">{main.name}</h3>
              {"note" in main ? (
                <p className="mt-3 font-sans text-[0.72rem] uppercase tracking-[0.18em] text-charcoal/70">{main.note}</p>
              ) : null}
            </article>
            <ul className="mt-6 grid gap-px border border-sandstone bg-sandstone sm:grid-cols-2">
              {companions.map((deity) => (
                <li key={deity.name} className="bg-ivory px-5 py-5">
                  <p className="font-display text-2xl text-burgundy">{deity.name}</p>
                  {"note" in deity ? (
                    <p className="mt-2 font-sans text-[0.68rem] uppercase tracking-[0.14em] text-charcoal/65">{deity.note}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>
      <Section id="navaratri" labelledBy="navaratri-heading" className="border-t border-sandstone bg-sandstone/25">
        <Container>
          <Eyebrow>Navaratri</Eyebrow>
          <Heading id="navaratri-heading" className="mt-5 max-w-3xl uppercase">
            Navaratri Anushthanam
          </Heading>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-charcoal/85">
            During Navaratri his observance includes vratham, parayanam and worship. The disciplines are set out in that order.
          </p>
          <div className="mt-12 grid gap-12 lg:grid-cols-3">
            {sadhanaPage.navaratri.map((group, index) => (
              <section key={group.id} aria-labelledby={`${group.id}-heading`}>
                <p className="font-sans text-[0.68rem] uppercase tracking-[0.18em] text-charcoal/55">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 id={`${group.id}-heading`} className="mt-3 font-display text-3xl leading-tight text-burgundy">
                  {group.title}
                </h3>
                <ul className="mt-6 border-t border-sandstone">
                  {group.items.map((item) => (
                    <li key={item} className="border-b border-sandstone py-3 leading-7 text-charcoal/85">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <p className="mt-12 max-w-2xl font-display text-2xl leading-snug text-burgundy">{sadhanaPage.devotees}</p>
        </Container>
      </Section>
      <RelatedPages ids={["about", "rituals", "alankarams"]} />
    </>
  );
}
