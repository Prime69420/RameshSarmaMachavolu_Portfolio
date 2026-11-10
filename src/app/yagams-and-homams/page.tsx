import type { Metadata } from "next";
import { ritualsPage } from "@/data/rituals";
import { site } from "@/data/site";
import { PageIntro } from "@/components/layout/PageIntro";
import { RelatedPages } from "@/components/layout/RelatedPages";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Yagams and Homams",
  description:
    "Yagams, Homams, abhishekas and Shanti ceremonies in the kainkaryam of Sri Machavolu Ramesh Sarma, including Koti Lalitha Sahasranama Homam, Atirudra Yagams and rites beside Manasa Sarovar.",
  openGraph: {
    title: `Yagams and Homams · ${site.name}`,
    description:
      "The ritual record of Sri Machavolu Ramesh Sarma: Devi homams, Rudra and Shiva kainkaryam, maha yagams, and Shanti and Kalyana ceremonies.",
    locale: "en_IN",
    type: "website",
  },
};

export default function RitualsPage() {
  return (
    <>
      <PageIntro eyebrow={ritualsPage.eyebrow} title={ritualsPage.title} lede={ritualsPage.lede} />
      <nav aria-label="Ritual categories" className="border-b border-sandstone">
        <Container className="flex flex-wrap gap-x-6 gap-y-3 py-5">
          {ritualsPage.groups.map((group) => (
            <a
              key={group.id}
              href={`#${group.id}`}
              className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-charcoal hover:text-burgundy"
            >
              {group.title}
            </a>
          ))}
        </Container>
      </nav>
      {ritualsPage.groups.map((group, index) => (
        <Section
          key={group.id}
          id={group.id}
          labelledBy={`${group.id}-heading`}
          className={index % 2 === 1 ? "border-t border-sandstone bg-sandstone/25" : "border-t border-sandstone"}
        >
          <Container className="grid items-start gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="font-sans text-[0.68rem] uppercase tracking-[0.18em] text-charcoal/60">
                {String(index + 1).padStart(2, "0")}
              </p>
              <Heading id={`${group.id}-heading`} className="mt-4 uppercase">
                {group.title}
              </Heading>
              <p className="mt-5 max-w-md leading-7 text-charcoal/80">{group.text}</p>
            </div>
            <ol className="border-t border-sandstone lg:col-span-7">
              {group.items.map((item) => (
                <li key={item} className="border-b border-sandstone py-4 font-display text-2xl leading-snug text-burgundy">
                  {item}
                </li>
              ))}
            </ol>
          </Container>
        </Section>
      ))}
      <RelatedPages ids={["scholarship", "pratishtha", "about"]} />
    </>
  );
}
