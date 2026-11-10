import { introduction } from "@/data/homepage";
import { destination, pageById } from "@/data/navigation";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GoldRule } from "@/components/ui/GoldRule";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function Introduction() {
  return (
    <Section id="life" labelledBy="life-heading">
      <Container>
        <Reveal>
          <div className="max-w-3xl">
            <Eyebrow>Biography</Eyebrow>
            <Heading id="life-heading" className="mt-5 uppercase">
              {introduction.heading}
            </Heading>
            <GoldRule className="mt-8" />
            <div className="mt-8 space-y-6 text-lg leading-8 text-charcoal/90">
              {introduction.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-10">
              <Button href={destination(pageById("about"))} variant="quiet">
                About
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
