import type { Metadata } from "next";
import { enquiryCategories } from "@/data/enquiry";
import { site } from "@/data/site";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { PageIntro } from "@/components/layout/PageIntro";
import { RelatedPages } from "@/components/layout/RelatedPages";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Enquire with Sri Machavolu Ramesh Sarma about Temple Pratishthas, yagams, religious ceremonies, weddings, Shanti rites, Jyotisham, or Vaastu.",
  openGraph: {
    title: `Contact · ${site.name}`,
    description:
      "An enquiry page for temple committees, devotees and families. No telephone number or email address has been published with this record.",
    locale: "en_IN",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="An enquiry"
        lede="Write about Temple Pratishthas, yagams, religious ceremonies, weddings, Shanti rites, Jyotisham or Vaastu. A telephone number, email address and office address have not been supplied for this record."
      />
      <Section>
        <Container className="grid items-start gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>Enquiries</Eyebrow>
            <Heading className="mt-5 uppercase">Enquiry categories</Heading>
            <ul className="mt-8 border-t border-sandstone">
              {enquiryCategories.map((category) => (
                <li key={category.id} className="border-b border-sandstone py-4">
                  <p className="font-display text-2xl leading-snug text-burgundy">{category.label}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-8">
            <EnquiryForm />
          </div>
        </Container>
      </Section>
      <RelatedPages ids={["pratishtha", "rituals", "gallery"]} />
    </>
  );
}
