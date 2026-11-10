/**
 * Canonical routes stay here for later pages.
 * Until a route exists, `interim` is a homepage section so navigation never 404s.
 * Set status to "ready" when that page is published.
 */
export const pages = [
  { id: "home", label: "Home", shortLabel: "Home", href: "/", interim: "/#top", status: "ready" },
  {
    id: "about",
    label: "About / Biography",
    shortLabel: "About",
    href: "/about",
    interim: "/#life",
    status: "ready",
  },
  {
    id: "scholarship",
    label: "Vedic Scholarship",
    shortLabel: "Scholarship",
    href: "/vedic-scholarship",
    interim: "/#scholarship",
    status: "ready",
  },
  {
    id: "pratishtha",
    label: "Pratishtha Kainkaryam",
    shortLabel: "Pratishthas",
    href: "/pratishtha-kainkaryam",
    interim: "/#pratishtha",
    status: "ready",
  },
  {
    id: "rituals",
    label: "Yagams & Homams",
    shortLabel: "Rituals",
    href: "/yagams-and-homams",
    interim: "/#rituals",
    status: "ready",
  },
  {
    id: "alankarams",
    label: "Devatha Alankarams",
    shortLabel: "Alankarams",
    href: "/devatha-alankarams",
    interim: "/#alankarams",
    status: "ready",
  },
  {
    id: "honours",
    label: "Honours & Titles",
    shortLabel: "Honours",
    href: "/honours",
    interim: "/#honours",
    status: "ready",
  },
  {
    id: "sadhana",
    label: "Personal Sadhana",
    shortLabel: "Sadhana",
    href: "/personal-sadhana",
    interim: "/#sadhana",
    status: "ready",
  },
  {
    id: "temples",
    label: "Temple Contributions",
    shortLabel: "Temples",
    href: "/temple-contributions",
    interim: "/#pratishtha",
    status: "ready",
  },
  {
    id: "gallery",
    label: "Gallery",
    shortLabel: "Gallery",
    href: "/gallery",
    interim: "/#gallery",
    status: "ready",
  },
  {
    id: "contact",
    label: "Contact",
    shortLabel: "Contact",
    href: "/contact",
    interim: "/#enquiry",
    status: "ready",
  },
] as const;

export type SitePage = {
  id: (typeof pages)[number]["id"];
  label: string;
  shortLabel: string;
  href: string;
  interim: string;
  status: "ready" | "planned";
};

const primaryIds = [
  "home",
  "about",
  "scholarship",
  "pratishtha",
  "rituals",
  "alankarams",
  "honours",
  "gallery",
  "contact",
] as const;

export function pageById(id: SitePage["id"]) {
  const page = pages.find((item) => item.id === id);
  if (!page) {
    throw new Error(`Unknown page: ${id}`);
  }
  return page satisfies SitePage;
}

export function destination(page: SitePage) {
  if (page.id === "home") {
    return "/#top";
  }
  return page.status === "ready" ? page.href : page.interim;
}

export const primaryNavigation = primaryIds.map((id) => pageById(id));
