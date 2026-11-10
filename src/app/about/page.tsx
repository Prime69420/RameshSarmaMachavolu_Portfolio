import type { Metadata } from "next";
import { aboutPage } from "@/data/about";
import { honours, lineage } from "@/data/homepage";
import { destination, pageById } from "@/data/navigation";
import { site } from "@/data/site";
import { PageIntro } from "@/components/layout/PageIntro";
import { RelatedPages } from "@/components/layout/RelatedPages";
import { Container } from "@/components/layout/Container";
import { ArchMotif } from "@/components/ui/ArchMotif";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "About",
  description:
    "Sri Machavolu Ramesh Sarma, Vedic scholar, son of Sri Machavolu Rajasekhara Shastri, a Nityaagnihotri, and grandson of Sri Machavolu Ramayya Shastri. Practitioner of Smartham, Saivaagamam, Jyotisham and Vaastu, with more than 2,000 temple Pratishthas.",
  openGraph: {
    title: `About · ${site.name}`,
    description:
      "A biography and professional profile of Sri Machavolu Ramesh Sarma, Vedic scholar and Pratishthapanacharya.",
    locale: "en_IN",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <>
      <PageIntro eyebrow={aboutPage.eyebrow} title={aboutPage.title} lede={aboutPage.lede} />
      <Section labelledBy="about-life">
        <Container className="grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow>The scholar</Eyebrow>
            <Heading id="about-life" className="mt-5 uppercase">
              Vedic scholar and practitioner
            </Heading>
            <div className="mt-8 space-y-6 text-lg leading-8 text-charcoal/90">
              {aboutPage.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <figure className="lg:col-span-5">
            <div className="flex aspect-[4/5] flex-col justify-between border border-gold/70 bg-burgundy p-6 text-ivory sm:p-8">
              <div className="border border-gold/40 px-6 py-8">
                <ArchMotif className="mx-auto h-40 w-auto text-gold" />
              </div>
              <figcaption className="pt-6 font-sans text-[0.68rem] uppercase leading-5 tracking-[0.16em] text-sandstone">
                Portrait reserved — photograph not yet supplied
              </figcaption>
            </div>
          </figure>
        </Container>
      </Section>
      <Section labelledBy="about-profile" className="border-t border-sandstone bg-sandstone/25">
        <Container>
          <Eyebrow>Profile</Eyebrow>
          <Heading id="about-profile" className="mt-5 uppercase">
            Professional profile
          </Heading>
          <dl className="mt-10 border-t border-sandstone">
            {aboutPage.profile.map((row) => (
              <div key={row.label} className="grid gap-2 border-b border-sandstone py-5 sm:grid-cols-[12rem_1fr] sm:gap-8">
                <dt className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-charcoal/70">{row.label}</dt>
                <dd className="font-display text-2xl leading-snug text-burgundy">{row.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>
      <Section labelledBy="about-lineage">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow>Family</Eyebrow>
            <Heading id="about-lineage" className="mt-5 uppercase">
              Three generations
            </Heading>
            <p className="mt-6 leading-7 text-charcoal/85">
              The record names three generations of the Machavolu family. Sri Machavolu Rajasekhara Shastri is remembered here as a Nityaagnihotri.
            </p>
          </div>
          <ol className="border-l border-gold lg:col-span-7">
            {lineage.map((person, index) => {
              const current = index === lineage.length - 1;
              return (
                <li key={person.name} className="relative py-6 pl-8">
                  <span aria-hidden="true" className="absolute -left-[5px] top-9 size-2 rotate-45 border border-gold bg-ivory" />
                  <p className={current ? "font-display text-3xl leading-tight text-burgundy" : "font-display text-2xl leading-tight text-burgundy"}>
                    {person.name}
                  </p>
                  {"note" in person ? (
                    <p className="mt-2 font-sans text-[0.72rem] uppercase tracking-[0.16em] text-charcoal/70">{person.note}</p>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </Container>
      </Section>
      <Section labelledBy="about-distinctions" className="border-t border-sandstone">
        <Container>
          <Eyebrow>Distinctions</Eyebrow>
          <Heading id="about-distinctions" className="mt-5 max-w-xl uppercase">
            Titles associated with his service
          </Heading>
          <ul className="mt-8 grid gap-x-10 sm:grid-cols-2">
            {honours.map((title) => (
              <li key={title} className="border-t border-sandstone py-4 font-display text-2xl text-burgundy">
                {title}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button href={destination(pageById("honours"))} variant="quiet">
              Honours
            </Button>
          </div>
        </Container>
      </Section>
      <RelatedPages ids={["scholarship", "pratishtha", "rituals"]} />
    </>
  );
}
