import { destination, pageById } from "@/data/navigation";
import { site } from "@/data/site";
import { HeroPortrait } from "@/components/sections/home/HeroPortrait";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ivory text-charcoal">
      <Container className="relative grid items-center gap-8 py-12 md:grid-cols-2 md:gap-8 md:py-16 lg:grid-cols-12 lg:gap-10 lg:py-20">
        <div className="min-w-0 lg:col-span-7">
          <Eyebrow className="max-w-xl flex-wrap">{site.designation}</Eyebrow>
          <Heading as="h1" size="display" className="mt-6 uppercase text-burgundy" style={{ fontSize: "clamp(2.7rem, 4.7vw, 4.7rem)" }}>
            <span className="block">{site.givenLines[0]}</span>
            <span className="block">{site.givenLines[1]}</span>
          </Heading>
          <p className="mt-6 max-w-xl font-display text-2xl leading-snug text-burgundy md:text-3xl">
            A lifetime dedicated to Vedic traditions, Agama practices and sacred temple consecrations.
          </p>
          <p className="mt-6 max-w-prose text-base leading-7 text-charcoal md:text-lg md:leading-8">
            Rooted in an illustrious Vedic lineage, Machavolu Ramesh Sarma has dedicated his life to preserving and
            practising the sacred traditions of Smartham, Saivaagamam, Jyotisham and Vaastu.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <Button href={destination(pageById("pratishtha"))}>Explore His Kainkaryam</Button>
            <Button href={destination(pageById("about"))} variant="secondary">
              About the Scholar
            </Button>
          </div>
        </div>
        <HeroPortrait />
      </Container>
    </section>
  );
}
