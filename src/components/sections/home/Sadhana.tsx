import { devatarchana, navaratriObservances } from "@/data/homepage";
import { destination, pageById } from "@/data/navigation";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function Sadhana() {
  return (
    <Section id="sadhana" labelledBy="sadhana-heading" className="border-t border-sandstone">
      <Container>
        <Reveal>
          <Eyebrow>Sadhana</Eyebrow>
          <Heading id="sadhana-heading" className="mt-5 max-w-3xl uppercase">
            A life of devotion and spiritual discipline
          </Heading>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-charcoal/90">
            His personal Devatarchana is offered to Sri Bala Devi as the main deity, together with a Baana Lingam, a Panchayatanam, Dattatreya Swamy, Ayyappa Swamy, Ganapathi, and more than 100 Saligramas.
          </p>
          <div className="mt-12 grid gap-14 lg:grid-cols-2">
            <div>
              <h3 className="font-sans text-[0.72rem] uppercase tracking-[0.2em] text-charcoal/70">Devatarchana</h3>
              <ul className="mt-6 border-t border-sandstone">
                {devatarchana.map((deity) => (
                  <li key={deity.name} className="flex items-baseline justify-between gap-6 border-b border-sandstone py-4">
                    <span className="font-display text-2xl text-burgundy">{deity.name}</span>
                    {"note" in deity ? (
                      <span className="font-sans text-[0.68rem] uppercase tracking-[0.14em] text-charcoal/65">{deity.note}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-sans text-[0.72rem] uppercase tracking-[0.2em] text-charcoal/70">Navaratri observances</h3>
              <ul className="mt-6 columns-1 gap-x-10 sm:columns-2">
                {navaratriObservances.map((observance) => (
                  <li key={observance} className="border-b border-sandstone py-3 leading-6 text-charcoal/85">
                    {observance}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12">
            <Button href={destination(pageById("sadhana"))} variant="quiet">
              Personal Sadhana
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
