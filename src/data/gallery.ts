/**
 * Temple Pratishtha photographs are loaded from published pratishtha_media rows.
 * Add a photograph in another category by placing the file in public/images/ and appending:
 * { id: "example", src: "/images/temples/example.jpg", alt: "What the photograph shows.", caption: "Short caption.", width: 1200, height: 1600 }
 * Use only authentic photographs. Leave `photos` empty until one is supplied.
 */
export type GalleryPhotograph = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  width?: number;
  height?: number;
};

export type GalleryCategory = {
  id: string;
  title: string;
  text: string;
  href: string;
  linkLabel: string;
  photos: GalleryPhotograph[];
  unavailable?: boolean;
};

export const galleryCategories: GalleryCategory[] = [
  {
    id: "pratishthas",
    title: "Temple Pratishthas",
    text: "Photographs of temple consecrations.",
    href: "/pratishtha-kainkaryam",
    linkLabel: "Pratishtha portfolio",
    photos: [],
  },
  {
    id: "yagams",
    title: "Yagams and Homams",
    text: "Photographs of yagams and homams.",
    href: "/yagams-and-homams",
    linkLabel: "Yagams and Homams",
    photos: [],
  },
  {
    id: "alankarams",
    title: "Devatha Alankarams",
    text: "Photographs of devatha alankarams.",
    href: "/devatha-alankarams",
    linkLabel: "Devatha Alankarams",
    photos: [],
  },
  {
    id: "navaratri",
    title: "Navaratri Anushthanam",
    text: "Photographs of the Navaratri observance.",
    href: "/personal-sadhana#navaratri",
    linkLabel: "Navaratri Anushthanam",
    photos: [],
  },
  {
    id: "temples",
    title: "Temple Contributions",
    text: "Photographs of temple service.",
    href: "/temple-contributions",
    linkLabel: "Temple contributions",
    photos: [],
  },
  {
    id: "ceremonies",
    title: "Vedic and Religious Ceremonies",
    text: "Photographs of Vedic and religious ceremonies.",
    href: "/yagams-and-homams",
    linkLabel: "Ceremonies",
    photos: [],
  },
  {
    id: "honours",
    title: "Honours and Recognitions",
    text: "Photographs of honours and recognitions.",
    href: "/honours",
    linkLabel: "Honours",
    photos: [],
  },
  {
    id: "devatarchana",
    title: "Personal Devatarchana",
    text: "Photographs of the home worship.",
    href: "/personal-sadhana#devatarchana",
    linkLabel: "Home Devatarchana",
    photos: [],
  },
];
