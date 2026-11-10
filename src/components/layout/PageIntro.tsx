import { ArchMotif } from "@/components/ui/ArchMotif";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Container } from "@/components/layout/Container";

export function PageIntro({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede: string;
}) {
  return (
    <section className="surface-burgundy bg-burgundy text-ivory">
      <Container className="grid grid-cols-1 items-end gap-10 py-16 md:py-24 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8">
          <Eyebrow tone="light">{eyebrow}</Eyebrow>
          <Heading as="h1" size="title" className="mt-6 max-w-full uppercase text-ivory [overflow-wrap:anywhere]">
            {title}
          </Heading>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-sandstone [overflow-wrap:anywhere]">{lede}</p>
        </div>
        <ArchMotif className="h-28 w-auto text-gold lg:col-span-4 lg:h-36 lg:justify-self-end" />
      </Container>
    </section>
  );
}
