import { ritualGroups } from "@/data/homepage";
import { destination, pageById } from "@/data/navigation";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function Rituals() {
  return (
    <Section id="rituals" labelledBy="rituals-heading">
      <Container>
        <Reveal>
          <Eyebrow>Rituals</Eyebrow>
          <Heading id="rituals-heading" className="mt-5 max-w-3xl uppercase">
            The sacred fire of Vedic tradition
          </Heading>
          <p className="mt-6 max-w-2xl leading-7 text-charcoal/80">
            A selection is set out here. The rituals page carries the fuller record.
          </p>
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {ritualGroups.map((group, index) => (
              <li key={group.title} className="border border-sandstone p-7 md:p-8">
                <p className="font-sans text-[0.68rem] uppercase tracking-[0.18em] text-charcoal/60">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-display text-3xl leading-tight text-burgundy">{group.title}</h3>
                <ul className="mt-6 space-y-3">
                  {group.items.map((item) => (
                    <li key={item} className="border-t border-sandstone pt-3 leading-7 text-charcoal/85">
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <div className="mt-12">
            <Button href={destination(pageById("rituals"))} variant="quiet">
              Yagams and Homams
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
