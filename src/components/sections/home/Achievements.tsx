import { achievements } from "@/data/homepage";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";

export function Achievements() {
  return (
    <section aria-label="Achievements at a glance" className="border-b border-sandstone">
      <Container>
        <Reveal>
          <ul className="grid sm:grid-cols-2 xl:grid-cols-4">
            {achievements.map((item) => (
              <li key={item.label} className="border-sandstone py-10 sm:px-6 xl:border-l xl:py-14 xl:first:border-l-0">
                <p className="font-display text-5xl leading-none tracking-tight text-burgundy xl:text-[2.45rem]">{item.value}</p>
                <p className="mt-4 max-w-[12rem] font-sans text-[0.72rem] uppercase leading-5 tracking-[0.16em] text-charcoal/80">
                  {item.label}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
