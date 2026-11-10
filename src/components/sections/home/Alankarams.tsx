import { alankaramCategories } from "@/data/homepage";
import { destination, pageById } from "@/data/navigation";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function Alankarams() {
  return (
    <Section id="alankarams" labelledBy="alankarams-heading" className="border-t border-sandstone">
      <Container>
        <Reveal>
          <Eyebrow>Alankaram</Eyebrow>
          <Heading id="alankarams-heading" className="mt-5 max-w-3xl uppercase">
            The art of adorning the divine
          </Heading>
          <p className="mt-6 max-w-2xl leading-7 text-charcoal/80">
            Photographs have not been supplied. The panels name each category and will receive authentic images when they are provided.
          </p>
          <ul className="mt-12 grid grid-cols-2 border-l border-t border-sandstone md:grid-cols-5">
            {alankaramCategories.map((category) => (
              <li key={category} className="flex min-h-36 items-end border-b border-r border-sandstone bg-ivory p-5">
                <h3 className="font-display text-2xl leading-tight text-burgundy">{category}</h3>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Button href={destination(pageById("alankarams"))}>Explore all Alankarams</Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
