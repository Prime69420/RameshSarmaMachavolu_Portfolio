import type { Metadata } from "next";
import { alankaramPage } from "@/data/alankarams";
import { site } from "@/data/site";
import { PageIntro } from "@/components/layout/PageIntro";
import { RelatedPages } from "@/components/layout/RelatedPages";
import { Container } from "@/components/layout/Container";
import { SuppliedImage } from "@/components/media/SuppliedImage";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Devatha Alankarams",
  description:
    "Devatha Alankaram in the kainkaryam of Sri Machavolu Ramesh Sarma: fifteen categories of sacred adornment, from Swarna and Pasupu Kumkuma to flowers and fruits.",
  openGraph: {
    title: `Devatha Alankarams · ${site.name}`,
    description:
      "A gallery of the Devatha Alankaram categories offered as devotional service by Sri Machavolu Ramesh Sarma.",
    locale: "en_IN",
    type: "website",
  },
};

export default function AlankaramsPage() {
  return (
    <>
      <PageIntro eyebrow={alankaramPage.eyebrow} title={alankaramPage.title} lede={alankaramPage.lede} />
      <Section>
        <Container>
          <p className="max-w-2xl leading-7 text-charcoal/80">{alankaramPage.note}</p>
          <ul className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {alankaramPage.categories.map((category, index) => (
              <li key={category.slug}>
                <article>
                  <SuppliedImage
                    src={category.src}
                    alt={`${category.title}. Photograph supplied for this record.`}
                    className="aspect-[3/4] border border-sandstone bg-ivory"
                  >
                    <div className="flex h-full flex-col justify-between p-5">
                      <p className="font-sans text-[0.68rem] uppercase tracking-[0.18em] text-charcoal/70">
                        {String(index + 1).padStart(2, "0")} · Photograph not yet supplied
                      </p>
                      <span aria-hidden="true" className="mx-auto size-2 rotate-45 border border-gold" />
                      <h2 className="font-display text-3xl leading-tight text-burgundy">{category.title}</h2>
                    </div>
                  </SuppliedImage>
                  {category.src ? (
                    <h2 className="mt-4 font-display text-3xl leading-tight text-burgundy">{category.title}</h2>
                  ) : null}
                  <p className={category.src ? "mt-3 leading-7 text-charcoal/85" : "mt-4 leading-7 text-charcoal/85"}>
                    {category.text}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <RelatedPages ids={["rituals", "honours", "sadhana"]} />
    </>
  );
}
