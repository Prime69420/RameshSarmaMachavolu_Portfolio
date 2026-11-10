import { destination, pageById } from "@/data/navigation";
import { site } from "@/data/site";
import { ArchMotif } from "@/components/ui/ArchMotif";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";

export function Hero() {
  return (
    <section id="top" className="surface-burgundy flex min-h-[85vh] items-center bg-burgundy text-ivory">
      <Container className="grid items-center gap-12 py-14 lg:grid-cols-12 lg:gap-10 lg:py-12">
        <div className="lg:col-span-7">
          <Eyebrow tone="light">{site.headerSubtitle}</Eyebrow>
          <Heading as="h1" size="display" className="mt-6 uppercase text-ivory">
            <span className="block">{site.givenLines[0]}</span>
            <span className="block">{site.givenLines[1]}</span>
          </Heading>
          <p className="mt-6 max-w-xl font-sans text-xs uppercase leading-6 tracking-[0.16em] text-sandstone sm:text-[0.72rem]">
            {site.heroCredentials}
          </p>
          <p className="mt-6 max-w-xl font-display text-2xl italic leading-snug text-ivory md:text-3xl">
            “{site.statement}”
          </p>
          <p className="mt-6 max-w-prose text-base leading-7 text-sandstone md:text-lg md:leading-8">
            {site.description}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <Button href={destination(pageById("about"))} variant="inverse">
              Explore his legacy
            </Button>
            <Button href={destination(pageById("pratishtha"))} variant="light">
              Discover his kainkaryam
            </Button>
          </div>
        </div>
        <figure className="lg:col-span-5">
          <div className="flex aspect-[4/5] w-full max-w-md flex-col justify-between border border-gold/60 p-6 sm:p-8 lg:max-w-none">
            <div className="border border-gold/30 px-6 py-8">
              <ArchMotif className="mx-auto h-44 w-auto text-gold sm:h-52" />
            </div>
            <figcaption className="pt-6 font-sans text-[0.68rem] uppercase leading-5 tracking-[0.16em] text-sandstone">
              Portrait reserved — photograph not yet supplied
            </figcaption>
          </div>
        </figure>
      </Container>
    </section>
  );
}
