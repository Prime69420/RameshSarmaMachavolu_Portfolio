import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { absoluteUrl, publicPages } from "@/lib/seo";
import { publishedSitemapRecords } from "@/lib/pratishtha/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const staticEntries = Object.values(publicPages).map((page) => ({
    url: absoluteUrl(page.path),
  }));
  const records = await publishedSitemapRecords();
  const details = records.map((record) => ({
    url: absoluteUrl(record.path),
    lastModified: record.lastModified,
  }));
  return [...staticEntries, ...details];
}
