import type { Metadata } from "next";
import { site } from "@/data/site";
import { ContactMethods } from "@/components/contact/ContactMethods";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { PageIntro } from "@/components/layout/PageIntro";
import { RelatedPages } from "@/components/layout/RelatedPages";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Sri Machavolu Ramesh Sarma by enquiry, email, telephone or WhatsApp.",
  openGraph: {
    title: `Contact · ${site.name}`,
    description: "An enquiry page for temple committees, devotees and families, with email, telephone and WhatsApp.",
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
        lede="Write about Temple Pratishthas, yagams, religious ceremonies, weddings, Shanti rites, Jyotisham or Vaastu. You may also write by email, telephone or WhatsApp."
      />
      <Section>
        <Container className="grid items-start gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>Correspondence</Eyebrow>
            <Heading className="mt-5 uppercase">Direct contact</Heading>
            <ContactMethods className="mt-8" />
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
