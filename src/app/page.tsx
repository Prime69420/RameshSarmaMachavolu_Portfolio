import type { Metadata } from "next";
import { HomePage } from "@/components/sections/home/HomePage";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: {
    absolute: `${site.honorificName} · Vedic Scholar`,
  },
  description: site.description,
  openGraph: {
    title: site.honorificName,
    description: site.description,
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return <HomePage />;
}
