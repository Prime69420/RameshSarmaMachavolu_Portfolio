const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isIndexableSlug(slug: string) {
  return slugPattern.test(slug);
}

export function visibleRecordDecision(slug: string, lookup: "published" | "absent" | "unavailable") {
  if (!isIndexableSlug(slug) || lookup === "absent") return "not-found" as const;
  return "show" as const;
}
