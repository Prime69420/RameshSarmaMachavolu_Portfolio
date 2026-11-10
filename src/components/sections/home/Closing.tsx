import { closing } from "@/data/homepage";
import { destination, pageById } from "@/data/navigation";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";

export function Closing() {
  return (
    <section className="surface-burgundy bg-burgundy py-20 text-ivory md:py-28">
      <Container>
        <Heading as="h2" size="title" className="max-w-3xl uppercase text-ivory">
          {closing.heading}
        </Heading>
        <p className="mt-8 max-w-2xl font-display text-2xl italic leading-snug text-sandstone md:text-3xl">
          “{closing.text}”
        </p>
        <div className="mt-10">
          <Button href={destination(pageById("contact"))} variant="inverse">
            Contact / Enquiry
          </Button>
        </div>
      </Container>
    </section>
  );
}
