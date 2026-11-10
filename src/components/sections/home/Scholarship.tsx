import { disciplines } from "@/data/homepage";
import { destination, pageById } from "@/data/navigation";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { DisciplineMark } from "@/components/ui/DisciplineMark";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function Scholarship() {
  return (
    <Section id="scholarship" labelledBy="scholarship-heading" className="border-t border-sandstone">
      <Container>
        <Reveal>
          <Eyebrow>Scholarship</Eyebrow>
          <Heading id="scholarship-heading" className="mt-5 max-w-xl uppercase">
            Four pillars of scholarship
          </Heading>
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {disciplines.map((discipline, index) => (
              <li key={discipline.id}>
                <article className="flex h-full flex-col border border-sandstone p-7 transition-colors duration-200 hover:border-gold hover:bg-sandstone/25 md:p-8">
                  <div className="flex items-start justify-between gap-6">
                    <p className="font-sans text-[0.68rem] uppercase tracking-[0.18em] text-charcoal/60">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <DisciplineMark name={discipline.mark} className="h-12 w-12 text-gold" />
                  </div>
                  <h3 className="mt-8 font-display text-3xl text-burgundy">{discipline.title}</h3>
                  <p className="mt-4 max-w-md leading-7 text-charcoal/85">{discipline.text}</p>
                </article>
              </li>
            ))}
          </ul>
          <div className="mt-12">
            <Button href={destination(pageById("scholarship"))} variant="quiet">
              Vedic scholarship
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
