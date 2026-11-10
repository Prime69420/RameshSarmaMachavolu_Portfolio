import { honours } from "@/data/homepage";
import { destination, pageById } from "@/data/navigation";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function Honours() {
  return (
    <Section id="honours" labelledBy="honours-heading" className="border-t border-sandstone">
      <Container>
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <Eyebrow>Honours</Eyebrow>
              <Heading id="honours-heading" className="mt-5 uppercase">
                A garland of distinctions
              </Heading>
              <div className="mt-10">
                <Button href={destination(pageById("honours"))} variant="quiet">
                  All honours
                </Button>
              </div>
            </div>
            <ul className="border-t border-sandstone">
              {honours.map((title) => (
                <li key={title} className="border-b border-sandstone py-5 font-display text-3xl italic leading-tight text-burgundy md:text-4xl">
                  {title}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
