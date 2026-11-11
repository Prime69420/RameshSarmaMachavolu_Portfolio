import type { Metadata } from "next";
import { contactInfo, socialLinks } from "@/data/contact";
import { site } from "@/data/site";
import { locationLabel } from "@/lib/pratishtha/types";
import { isIndexableSlug } from "@/lib/seo-slug";
import { portraitImage, socialImage } from "@/lib/social-image";

export { isIndexableSlug, visibleRecordDecision } from "@/lib/seo-slug";
export { coverImage, portraitImage, selectSocialImage, socialImage } from "@/lib/social-image";

export const siteUrl = new URL("https://www.rameshsarmamachavolu.com");

export const defaultDescription =
  "Explore the Vedic scholarship, Agama traditions, temple Pratishthas, sacred rituals and contributions of Machavolu Ramesh Sarma.";

export type PublicPage = {
  path: string;
  title: string;
  description: string;
  absolute?: boolean;
  crumb: string;
};

export const publicPages = {
  home: {
    path: "/",
    title: "Machavolu Ramesh Sarma | Vedic Scholar and Pratishthapanacharya",
    description: defaultDescription,
    absolute: true,
    crumb: "Home",
  },
  about: {
    path: "/about",
    title: "Biography and Vedic Lineage",
    description:
      "Biography of Machavolu Ramesh Sarma, son of Sri Machavolu Rajasekhara Shastri and grandson of Sri Machavolu Ramayya Shastri, and his life of Vedic scholarship and temple kainkaryam.",
    crumb: "About",
  },
  scholarship: {
    path: "/vedic-scholarship",
    title: "Vedic Scholarship",
    description:
      "Smarthaagamam, Saivaagamam, Jyotisham and Vaastu, the four fields of scholarship and service practised by Machavolu Ramesh Sarma.",
    crumb: "Vedic Scholarship",
  },
  pratishtha: {
    path: "/pratishtha-kainkaryam",
    title: "Temple Pratishtha Kainkaryam",
    description:
      "Published temple Pratishtha records of Machavolu Ramesh Sarma. Only consecrations that have been reviewed are shown in this archive.",
    crumb: "Pratishtha Kainkaryam",
  },
  rituals: {
    path: "/yagams-and-homams",
    title: "Vedic Yagams and Homams",
    description:
      "Yagams, Homams, abhishekas and Shanti ceremonies performed in the kainkaryam of Machavolu Ramesh Sarma.",
    crumb: "Yagams and Homams",
  },
  alankarams: {
    path: "/devatha-alankarams",
    title: "Deity Alankarams and Sacred Decorations",
    description:
      "Devatha Alankaram offered by Machavolu Ramesh Sarma, from Swarna and Pasupu Kumkuma to flowers, fruits and other sacred adornments.",
    crumb: "Devatha Alankarams",
  },
  honours: {
    path: "/honours",
    title: "Honours and Titles",
    description:
      "Titles recorded for Machavolu Ramesh Sarma, including Vaidika Ratna, Aagama Siromani and Sahasraadhika Pratishthaapanaacharya, as they were supplied.",
    crumb: "Honours",
  },
  sadhana: {
    path: "/personal-sadhana",
    title: "Personal Sadhana and Vedic Worship",
    description:
      "Home Devatarchana and Navaratri observance of Machavolu Ramesh Sarma, with Sri Bala Devi as the principal deity.",
    crumb: "Personal Sadhana",
  },
  temples: {
    path: "/temple-contributions",
    title: "Temple Contributions and Pratishtha Work",
    description:
      "Temple donations and help in building temples by Machavolu Ramesh Sarma, recorded separately from the Pratishtha archive.",
    crumb: "Temple Contributions",
  },
  gallery: {
    path: "/gallery",
    title: "Photographs and Gallery",
    description:
      "Photographs from the published Pratishtha kainkaryam of Machavolu Ramesh Sarma. Other gallery categories appear when authentic pictures are supplied.",
    crumb: "Gallery",
  },
  contact: {
    path: "/contact",
    title: "Contact",
    description:
      "Contact Machavolu Ramesh Sarma about temple Pratishthas, ceremonies, Jyotisham or Vaastu, by form, email, telephone or WhatsApp.",
    crumb: "Contact",
  },
} as const satisfies Record<string, PublicPage>;

export function absoluteUrl(path: string) {
  if (path === "/" || path === "") return siteUrl.origin;
  const pathname = path.startsWith("/") ? path : `/${path}`;
  return new URL(pathname, siteUrl).toString();
}

export function fullTitle(page: Pick<PublicPage, "title" | "absolute">) {
  return page.absolute ? page.title : `${page.title} | ${site.name}`;
}

export function pageMetadata(page: PublicPage): Metadata {
  const title = fullTitle(page);
  const image = {
    url: socialImage.path,
    width: socialImage.width,
    height: socialImage.height,
    alt: socialImage.alt,
  };
  return {
    title: page.absolute ? { absolute: page.title } : page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      title,
      description: page.description,
      url: page.path,
      type: "website",
      locale: "en_IN",
      siteName: site.name,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: page.description,
      images: [socialImage.path],
    },
  };
}

export function clipText(value: string, max = 160) {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const clipped = text.slice(0, max - 1);
  const boundary = clipped.lastIndexOf(" ");
  return `${(boundary > 80 ? clipped.slice(0, boundary) : clipped).trim()}…`;
}

export function pratishthaDescription(record: {
  title: string;
  description: string | null;
  temple_name: string | null;
  pratishtha_name: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  year: number | null;
  ritual_type: string | null;
}) {
  const normalize = (value: string) => value.toLowerCase().replace(/[.,;:]+$/g, "").trim();
  const title = normalize(record.title);
  const novel = (value: string | null | undefined) => {
    const text = value?.replace(/\s+/g, " ").trim() ?? "";
    return text && !title.includes(normalize(text)) ? text : "";
  };
  const place = locationLabel(record);
  const parts = [
    novel(record.description),
    novel(record.temple_name) ? `Temple: ${record.temple_name?.trim()}.` : "",
    novel(record.pratishtha_name),
    novel(place),
    record.year && !title.includes(String(record.year)) ? String(record.year) : "",
    novel(record.ritual_type),
  ].filter(Boolean);
  return clipText(parts.join(" ") || record.title);
}

export function sitemapRecords(
  rows: Array<{ slug?: string | null; updated_at?: string | null; status?: string | null }>,
) {
  return rows.flatMap((row) => {
    if (row.status !== "published" || !row.slug || !isIndexableSlug(row.slug)) return [];
    const updated = row.updated_at ? new Date(row.updated_at) : null;
    return [{
      path: `/pratishtha-kainkaryam/${row.slug}`,
      lastModified: updated && !Number.isNaN(updated.getTime()) ? updated : undefined,
    }];
  });
}

type Crumb = { name: string; path: string };

export function breadcrumbFor(page: PublicPage, current?: { name: string; path: string }): Crumb[] {
  const crumbs: Crumb[] = [{ name: "Home", path: "/" }];
  if (page.path !== "/") crumbs.push({ name: page.crumb, path: page.path });
  if (current && current.path !== page.path) crumbs.push(current);
  return crumbs;
}

function personNode() {
  return {
    "@type": "Person",
    "@id": `${siteUrl.origin}/#person`,
    name: site.name,
    alternateName: site.honorificName,
    jobTitle: ["Vedic Scholar", "Agama Vidwan", "Pratishthapanacharya"],
    description: defaultDescription,
    url: absoluteUrl("/"),
    image: absoluteUrl(portraitImage.path),
    email: contactInfo.email,
    telephone: contactInfo.phone,
    sameAs: socialLinks.map((link) => link.href),
  };
}

function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl.origin}/#website`,
    name: site.name,
    url: absoluteUrl("/"),
    description: defaultDescription,
    inLanguage: "en",
    publisher: { "@id": `${siteUrl.origin}/#person` },
  };
}

export function structuredData(page: PublicPage, current?: { name: string; path: string; description?: string }) {
  const crumbs = breadcrumbFor(page, current);
  const url = absoluteUrl(current?.path ?? page.path);
  const name = current?.name ?? fullTitle(page);
  const description = current?.description ?? page.description;
  const nodes: Record<string, unknown>[] = [];
  if (page.path === "/" && !current) {
    nodes.push(personNode(), websiteNode());
  }
  nodes.push(
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name,
      description,
      inLanguage: "en",
      isPartOf: { "@id": `${siteUrl.origin}/#website` },
      about: { "@id": `${siteUrl.origin}/#person` },
      breadcrumb: { "@id": `${url}#breadcrumb` },
      ...(page.path === "/" && !current
        ? {
            primaryImageOfPage: {
              "@type": "ImageObject",
              url: absoluteUrl(portraitImage.path),
              width: portraitImage.width,
              height: portraitImage.height,
              caption: portraitImage.alt,
            },
          }
        : {}),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: absoluteUrl(crumb.path),
      })),
    },
  );
  return { "@context": "https://schema.org", "@graph": nodes };
}
