import { Achievements } from "@/components/sections/home/Achievements";
import { Alankarams } from "@/components/sections/home/Alankarams";
import { Closing } from "@/components/sections/home/Closing";
import { Hero } from "@/components/sections/home/Hero";
import { Honours } from "@/components/sections/home/Honours";
import { Introduction } from "@/components/sections/home/Introduction";
import { Lineage } from "@/components/sections/home/Lineage";
import { Pratishtha } from "@/components/sections/home/Pratishtha";
import { Rituals } from "@/components/sections/home/Rituals";
import { Sadhana } from "@/components/sections/home/Sadhana";
import { Scholarship } from "@/components/sections/home/Scholarship";

export function HomePage() {
  return (
    <>
      <Hero />
      <Achievements />
      <Introduction />
      <Scholarship />
      <Pratishtha />
      <Rituals />
      <Alankarams />
      <Honours />
      <Sadhana />
      <Lineage />
      <Closing />
    </>
  );
}
