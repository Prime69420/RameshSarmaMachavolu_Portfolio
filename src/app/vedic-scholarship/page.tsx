import type { Metadata } from "next";
import { scholarshipPage } from "@/data/scholarship";
import { PageIntro } from "@/components/layout/PageIntro";
import { RelatedPages } from "@/components/layout/RelatedPages";
import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { DisciplineMark } from "@/components/ui/DisciplineMark";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { pageMetadata, publicPages, structuredData } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(publicPages.scholarship);

export default function VedicScholarshipPage() {
  return (
    <>
      <JsonLd data={structuredData(publicPages.scholarship)} />
      <PageIntro eyebrow={scholarshipPage.eyebrow} title={scholarshipPage.title} lede={scholarshipPage.lede} />
      <nav aria-label="Fields of scholarship" className="border-b border-sandstone">
        <Container className="flex flex-wrap gap-x-6 gap-y-3 py-5">
          {scholarshipPage.fields.map((field) => (
            <a
              key={field.id}
              href={`#${field.id}`}
              className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-charcoal hover:text-burgundy"
            >
              {field.title}
            </a>
          ))}
        </Container>
      </nav>
      {scholarshipPage.fields.map((field, index) => (
        <Section
          key={field.id}
          id={field.id}
          labelledBy={`${field.id}-heading`}
          className={index % 2 === 1 ? "border-t border-sandstone bg-sandstone/25" : "border-t border-sandstone"}
        >
          <Container className="grid items-start gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <DisciplineMark name={field.mark} className="h-14 w-14 text-gold" />
              <Heading id={`${field.id}-heading`} className="mt-6 uppercase">
                {field.title}
              </Heading>
            </div>
            <div className="space-y-6 text-lg leading-8 text-charcoal/90 lg:col-span-8">
              {field.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Container>
        </Section>
      ))}
      <RelatedPages ids={["about", "pratishtha", "rituals"]} />
    </>
  );
}
