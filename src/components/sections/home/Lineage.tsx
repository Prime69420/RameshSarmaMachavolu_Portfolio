import { lineage } from "@/data/homepage";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function Lineage() {
  return (
    <Section id="lineage" labelledBy="lineage-heading" className="border-t border-sandstone">
      <Container>
        <Reveal>
          <Eyebrow>Family</Eyebrow>
          <Heading id="lineage-heading" className="mt-5 max-w-3xl uppercase">
            A legacy continued through generations
          </Heading>
          <ol className="mt-12 max-w-xl border-l border-gold">
            {lineage.map((person, index) => {
              const current = index === lineage.length - 1;
              return (
                <li key={person.name} className="relative py-6 pl-8">
                  <span aria-hidden="true" className="absolute -left-[5px] top-9 size-2 rotate-45 border border-gold bg-ivory" />
                  <p className={current ? "font-display text-3xl leading-tight text-burgundy md:text-4xl" : "font-display text-2xl leading-tight text-burgundy"}>
                    {person.name}
                  </p>
                  {"note" in person ? (
                    <p className="mt-2 font-sans text-[0.72rem] uppercase tracking-[0.16em] text-charcoal/70">{person.note}</p>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </Reveal>
      </Container>
    </Section>
  );
}
