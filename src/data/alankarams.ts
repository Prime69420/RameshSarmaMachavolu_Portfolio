/**
 * Set `src` to a file under /images/alankarams/ when an authentic photograph is supplied.
 * Example: src: "/images/alankarams/swarna.jpg"
 * Leave `src` null to keep the reserved panel. Do not point it at a stock image.
 */
export type AlankaramCategory = {
  slug: string;
  title: string;
  text: string;
  src: string | null;
};

export const alankaramPage = {
  eyebrow: "Alankaram",
  title: "The art of adorning the divine",
  lede: "Devatha Alankaram is the devotional work of dressing and presenting the deity. For Sri Machavolu Ramesh Sarma it is a form of kainkaryam: sacred presentation, offered in service.",
  note: "The panels below name the categories supplied for this record. Authentic photographs can replace each reserved frame as they become available, and the gallery can be expanded.",
  categories: [
    { slug: "swarna", title: "Swarna Alankaram", text: "Gold arranged as the adornment of the deity.", src: null },
    {
      slug: "pasupu-kumkuma",
      title: "Pasupu Kumkuma Alankaram",
      text: "Turmeric and kumkuma used as the adornment.",
      src: null,
    },
    { slug: "chandanam", title: "Chandanam Alankaram", text: "Sandal paste applied as the adornment.", src: null },
    { slug: "butter", title: "Butter Alankaram", text: "Butter used as the adornment.", src: null },
    { slug: "bangles", title: "Bangles Alankaram", text: "Bangles set as the adornment.", src: null },
    { slug: "anna", title: "Anna Alankaram", text: "Cooked rice offered as the adornment.", src: null },
    { slug: "saree", title: "Saree Alankaram", text: "A saree draped as the adornment.", src: null },
    { slug: "dry-fruits", title: "Dry Fruits Alankaram", text: "Dry fruits composed as the adornment.", src: null },
    { slug: "pearls", title: "Pearls Alankaram", text: "Pearls used as the adornment.", src: null },
    {
      slug: "betel-leaves",
      title: "Betel Leaves Alankaram",
      text: "Betel leaves composed as the adornment.",
      src: null,
    },
    {
      slug: "sakhambari",
      title: "Sakhambari Alankaram",
      text: "The Sakhambari adornment, made with the produce of the field.",
      src: null,
    },
    { slug: "dhana", title: "Dhana Alankaram", text: "An adornment of dhana, the wealth of grain.", src: null },
    { slug: "rudraksha", title: "Rudraksha Alankaram", text: "Rudraksha beads used as the adornment.", src: null },
    { slug: "fruits", title: "Fruits Alankaram", text: "Fruits composed as the adornment.", src: null },
    { slug: "flowers", title: "Flowers Alankaram", text: "Flowers composed as the adornment.", src: null },
  ] satisfies AlankaramCategory[],
};
