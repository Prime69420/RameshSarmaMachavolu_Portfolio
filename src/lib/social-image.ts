import { existsSync } from "node:fs";
import { join } from "node:path";

export const portraitImage = {
  path: "/images/ramesh-sarma-portrait.jpeg",
  width: 1066,
  height: 1600,
  alt: "Portrait of Machavolu Ramesh Sarma, Vedic Scholar.",
} as const;

export const coverImage = {
  path: "/images/og-cover.jpg",
  width: 1200,
  height: 630,
  alt: "Machavolu Ramesh Sarma, Vedic Scholar and Pratishthapanacharya.",
} as const;

export function selectSocialImage(coverExists: boolean) {
  return coverExists ? coverImage : portraitImage;
}

export const socialImage = selectSocialImage(existsSync(join(process.cwd(), "public", "images", "og-cover.jpg")));
