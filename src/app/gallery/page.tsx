import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { galleryCategories, type GalleryCategory } from "@/data/gallery";
import { GalleryArchive } from "@/components/gallery/GalleryArchive";
import { PageIntro } from "@/components/layout/PageIntro";
import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section } from "@/components/ui/Section";
import { publishedPratishthaGallery } from "@/lib/pratishtha/queries";
import { pageMetadata, publicPages, structuredData } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(publicPages.gallery);

async function GalleryContent() {
  await connection();
  const published = await publishedPratishthaGallery();
  const categories: GalleryCategory[] = galleryCategories.map((category) => {
    if (category.id !== "pratishthas") return category;
    if (!published.ok) return { ...category, photos: category.photos, unavailable: true };
    const seen = new Set(category.photos.map((photo) => photo.src));
    return {
      ...category,
      photos: [...category.photos, ...published.data.filter((photo) => !seen.has(photo.src))],
    };
  });
  return <GalleryArchive categories={categories} />;
}

export default function GalleryPage() {
  return (
    <>
      <JsonLd data={structuredData(publicPages.gallery)} />
      <PageIntro
        eyebrow="Gallery"
        title="A photographic archive"
        lede="Pictures of Pratishtha, ritual, adornment, Navaratri, temple service, ceremony, honour and home worship will be kept here as authentic photographs are supplied."
      />
      <Section>
        <Container>
          <Suspense fallback={<p className="leading-7 text-charcoal/80">Loading photographs.</p>}>
            <GalleryContent />
          </Suspense>
        </Container>
      </Section>
    </>
  );
}
