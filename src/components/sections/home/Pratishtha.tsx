import { indianPratishthas, internationalPratishthas } from "@/data/homepage";
import { destination, pageById } from "@/data/navigation";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

function PlaceList({
  title,
  places,
}: {
  title: string;
  places: ReadonlyArray<{ place: string; detail: string }>;
}) {
  return (
    <div>
      <h3 className="font-sans text-[0.72rem] uppercase tracking-[0.2em] text-charcoal/70">{title}</h3>
      <dl className="mt-6 border-t border-sandstone">
        {places.map((place) => (
          <div key={place.place} className="grid gap-2 border-b border-sandstone py-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
            <dt className="font-display text-2xl leading-tight text-burgundy">{place.place}</dt>
            <dd className="leading-7 text-charcoal/85">{place.detail}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function Pratishtha() {
  return (
    <Section id="pratishtha" labelledBy="pratishtha-heading" className="bg-sandstone/25">
      <Container>
        <Reveal>
          <Eyebrow>Pratishtha</Eyebrow>
          <Heading id="pratishtha-heading" className="mt-5 max-w-3xl uppercase">
            More than 2,000 sacred consecrations
          </Heading>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-charcoal/90">
            A remarkable portfolio of temple consecrations extending across India and international destinations.
          </p>
          <div className="mt-12 grid gap-14 lg:grid-cols-2">
            <PlaceList title="International" places={internationalPratishthas} />
            <PlaceList title="India" places={indianPratishthas} />
          </div>
          <div className="mt-12 flex flex-col items-start gap-6 sm:flex-row sm:gap-10">
            <Button href={destination(pageById("pratishtha"))} variant="quiet">
              Pratishtha portfolio
            </Button>
            <Button href={destination(pageById("temples"))} variant="quiet">
              Temple contributions
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
