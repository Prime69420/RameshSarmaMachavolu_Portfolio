import { destination, pageById, type SitePage } from "@/data/navigation";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";

export function RelatedPages({ ids }: { ids: readonly SitePage["id"][] }) {
  return (
    <Section className="border-t border-sandstone bg-sandstone/25">
      <Container>
        <Eyebrow>Continue</Eyebrow>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {ids.map((id) => {
            const page = pageById(id);
            return (
              <li key={id}>
                <Button href={destination(page)} variant="secondary" className="w-full">
                  {page.shortLabel}
                </Button>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
