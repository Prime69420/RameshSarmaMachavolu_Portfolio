import type { Metadata } from "next";
import { HomePage } from "@/components/sections/home/HomePage";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, publicPages, structuredData } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(publicPages.home);

export default function Page() {
  return (
    <>
      <JsonLd data={structuredData(publicPages.home)} />
      <HomePage />
    </>
  );
}
