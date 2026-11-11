import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  absoluteUrl,
  fullTitle,
  isIndexableSlug,
  pageMetadata,
  pratishthaDescription,
  publicPages,
  selectSocialImage,
  sitemapRecords,
  socialImage,
  structuredData,
  visibleRecordDecision,
} from "@/lib/seo";

test("public pages use one canonical domain and unique descriptions", () => {
  const descriptions = new Set<string>();
  for (const page of Object.values(publicPages)) {
    assert.equal(descriptions.has(page.description), false);
    descriptions.add(page.description);
    assert.equal(absoluteUrl(page.path), page.path === "/" ? "https://www.rameshsarmamachavolu.com" : `https://www.rameshsarmamachavolu.com${page.path}`);
    assert.equal(page.path.includes("admin"), false);
    const metadata = pageMetadata(page);
    assert.equal(metadata.alternates && "canonical" in metadata.alternates ? metadata.alternates.canonical : "", page.path);
    assert.equal(fullTitle(page).includes("| Machavolu Ramesh Sarma |"), false);
  }
  assert.equal(fullTitle(publicPages.home), "Machavolu Ramesh Sarma | Vedic Scholar and Pratishthapanacharya");
  assert.equal(fullTitle(publicPages.about), "Biography and Vedic Lineage | Machavolu Ramesh Sarma");
});

test("homepage structured data uses only verified identity fields", () => {
  const data = structuredData(publicPages.home);
  const graph = data["@graph"] as Array<Record<string, unknown>>;
  const person = graph.find((node) => node["@type"] === "Person");
  const website = graph.find((node) => node["@type"] === "WebSite");
  assert.ok(person);
  assert.ok(website);
  assert.equal("birthDate" in person, false);
  assert.equal("address" in person, false);
  assert.equal("award" in person, false);
  assert.equal("alumniOf" in person, false);
  assert.equal("aggregateRating" in person, false);
  assert.equal(graph.filter((node) => node["@type"] === "Person").length, 1);
  assert.equal(graph.filter((node) => node["@type"] === "WebSite").length, 1);
});

test("inner pages do not repeat the person and website nodes", () => {
  const graph = structuredData(publicPages.contact)["@graph"] as Array<Record<string, unknown>>;
  assert.equal(graph.some((node) => node["@type"] === "Person"), false);
  assert.equal(graph.some((node) => node["@type"] === "BreadcrumbList"), true);
});

test("published pratishtha records are indexed and drafts are not", () => {
  const rows = sitemapRecords([
    { slug: "sri-rama-temple", status: "published", updated_at: "2026-01-02T00:00:00.000Z" },
    { slug: "hidden-draft", status: "draft", updated_at: "2026-01-02T00:00:00.000Z" },
    { slug: "Bad Slug", status: "published", updated_at: "2026-01-02T00:00:00.000Z" },
    { slug: "", status: "published", updated_at: "2026-01-02T00:00:00.000Z" },
  ]);
  assert.deepEqual(rows.map((row) => row.path), ["/pratishtha-kainkaryam/sri-rama-temple"]);
  assert.equal(isIndexableSlug("sri-rama-temple"), true);
  assert.equal(isIndexableSlug("not a slug"), false);
});

test("pratishtha descriptions use only supplied fields", () => {
  const description = pratishthaDescription({
    title: "Sri Rama Pratishtha",
    description: "A consecration performed for the temple.",
    temple_name: "Sri Rama Temple",
    pratishtha_name: null,
    city: "Ongole",
    state: "Andhra Pradesh",
    country: "India",
    year: 2019,
    ritual_type: "Pratishtha",
  });
  assert.match(description, /Sri Rama Temple/);
  assert.match(description, /Ongole/);
  assert.equal(description.includes("birth"), false);
  assert.ok(description.length <= 160);
  const repeated = pratishthaDescription({
    title: "Singapore — Sivalinga Pratishtha",
    description: "Sivalinga Pratishtha.",
    temple_name: null,
    pratishtha_name: "Sivalinga Pratishtha",
    city: "Singapore",
    state: null,
    country: "Singapore",
    year: null,
    ritual_type: null,
  });
  assert.equal(repeated.toLowerCase().includes("sivalinga pratishtha. sivalinga"), false);
  assert.ok(repeated.length <= 160);
});

test("robots allows public files and blocks only private routes", () => {
  const robots = readFileSync(new URL("../app/robots.ts", import.meta.url), "utf8");
  assert.match(robots, /disallow: \["\/admin", "\/admin\/", "\/api\/"\]/);
  assert.match(robots, /sitemap\.xml/);
  assert.doesNotMatch(robots, /disallow:.*\/_next|disallow:.*\/images/);
});

test("social sharing uses the landscape cover when it is present", () => {
  const cover = selectSocialImage(true);
  assert.equal(cover.path, "/images/og-cover.jpg");
  assert.equal(cover.width, 1200);
  assert.equal(cover.height, 630);
  const fallback = selectSocialImage(false);
  assert.equal(fallback.path, "/images/ramesh-sarma-portrait.jpeg");
  const expected = existsSync(join(process.cwd(), "public", "images", "og-cover.jpg")) ? cover.path : fallback.path;
  assert.equal(socialImage.path, expected);
  const metadata = pageMetadata(publicPages.home);
  const images = metadata.openGraph && "images" in metadata.openGraph ? metadata.openGraph.images : [];
  const image = Array.isArray(images) ? images[0] : undefined;
  assert.equal(image && typeof image === "object" && "url" in image ? image.url : "", socialImage.path);
});

test("unknown and unpublished pratishtha slugs are not public", () => {
  assert.equal(visibleRecordDecision("not a slug", "published"), "not-found");
  assert.equal(visibleRecordDecision("unknown-record", "absent"), "not-found");
  assert.equal(visibleRecordDecision("draft-record", "absent"), "not-found");
  assert.equal(visibleRecordDecision("sri-rama-temple", "published"), "show");
  assert.equal(visibleRecordDecision("sri-rama-temple", "unavailable"), "show");
});
