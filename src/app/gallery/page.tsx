import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { galleryCategories, type GalleryCategory } from "@/data/gallery";
import { site } from "@/data/site";
import { GalleryArchive } from "@/components/gallery/GalleryArchive";
import { PageIntro } from "@/components/layout/PageIntro";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/ui/Section";
import { publishedPratishthaGallery } from "@/lib/pratishtha/queries";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A photographic archive of the Pratishthas, yagams, alankarams, Navaratri observance, temple service, ceremonies, honours and home worship of Sri Machavolu Ramesh Sarma.",
  openGraph: {
    title: `Gallery · ${site.name}`,
    description: "Photographs of the kainkaryam of Sri Machavolu Ramesh Sarma, added as authentic pictures are supplied.",
    locale: "en_IN",
    type: "website",
  },
};

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
