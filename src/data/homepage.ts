export const achievements = [
  { value: "2,000+", label: "Temple Pratishthas" },
  { value: "4", label: "Major Areas of Expertise" },
  { value: "Global", label: "Spiritual Kainkaryam" },
  { value: "Generations", label: "Vedic Family Legacy" },
] as const;

export const introduction = {
  heading: "A life dedicated to Dharma",
  paragraphs: [
    "Sri Machavolu Ramesh Sarma is the son of Sri Machavolu Rajasekhara Shastri, a Nityaagnihotri, and the grandson of Sri Machavolu Ramayya Shastri.",
    "He is a distinguished Vedic scholar and a practitioner of Smarthaagamam, Saivaagamam, Jyotisham and Vaastu. His kainkaryam includes more than 2,000 temple Pratishthas, extensive Yagams, Homams, Alankarams and religious ceremonies, and contributions to temple development.",
  ],
} as const;

export const disciplines = [
  {
    id: "smartham",
    title: "Smarthaagamam",
    mark: "hearth",
    text: "The Smarta path of Vedic worship, one of the four disciplines of his scholarship and practice.",
  },
  {
    id: "saivaagamam",
    title: "Saivaagamam",
    mark: "gate",
    text: "The Saiva Agamic tradition of temple worship, one of the four disciplines of his scholarship and practice.",
  },
  {
    id: "jyotisham",
    title: "Jyotisham",
    mark: "orbit",
    text: "Vedic astrology, one of the four disciplines of his scholarship and practice.",
  },
  {
    id: "vaastu",
    title: "Vaastu",
    mark: "grid",
    text: "The ordering of sacred space and dwelling, one of the four disciplines of his scholarship and practice.",
  },
] as const;

export const internationalPratishthas = [
  { place: "Sri Lanka", detail: "Saptarishi, Sri Chakra and Venkateswara Pratishthas." },
  { place: "Singapore", detail: "Sivalinga Pratishtha." },
  { place: "Andaman and Nicobar Islands", detail: "Ganga Devi Pratishtha." },
  { place: "Kathmandu, Nepal", detail: "Sivalinga Pratishtha." },
] as const;

export const indianPratishthas = [
  { place: "Varanasi", detail: "Multiple Sivalinga Pratishthas." },
  { place: "Amritsar", detail: "Subrahmanya Swamy Pratishtha." },
  { place: "New Delhi", detail: "Ganapathi and Shiva Pratishthas." },
  { place: "Nellore", detail: "Multiple temple consecrations." },
  { place: "Ongole", detail: "Trisakthi Peetham." },
  { place: "Mypadu", detail: "Dwadasa Jyothirlinga Pratishtha." },
] as const;

export const ritualGroups = [
  {
    title: "Yagams & Homams",
    items: ["Koti Lalitha Sahasranama Homam", "Atirudra Yagams", "Sahasra Chandi Yagams"],
  },
  {
    title: "Rudra and Shiva Kainkaryam",
    items: [
      "108-feet Maha Shivalinga Abhisheka Mahotsavam",
      "Maha Sahasra Lingarchana, conducted three times",
    ],
  },
  {
    title: "Devi Upasana",
    items: ["Dasa Mahavidya Homams", "Prathyangira Yagams"],
  },
  {
    title: "Shanti and Kalyana Ceremonies",
    items: ["Maha Rudra Homam, Rudrabhishekam and Shiva Kalyanam beside Manasa Sarovar"],
  },
] as const;

export const alankaramCategories = [
  "Swarna",
  "Pasupu Kumkuma",
  "Chandanam",
  "Butter",
  "Bangles",
  "Annalankaram",
  "Sakhambari",
  "Pearls",
  "Flowers",
  "Fruits",
] as const;

export const honours = [
  "Vaidika Ratna",
  "Aagama Siromani",
  "Alankaara Samraat",
  "Purohita Samraat",
  "Sakala Devata Pratishtha Chakravarthy",
  "Sahasraadhika Pratishthaapanaacharya",
] as const;

export const devatarchana = [
  { name: "Sri Bala Devi", note: "Main deity" },
  { name: "Baana Lingam" },
  { name: "Panchayatanam" },
  { name: "Dattatreya Swamy" },
  { name: "Ayyappa Swamy" },
  { name: "Ganapathi" },
  { name: "Saligramas", note: "More than 100" },
] as const;

export const navaratriObservances = [
  "Mouna Vratham",
  "Ekabhukta Upavasa Vratham",
  "Vedic Suktha Parayanams",
  "Lalitha Sahasranamam",
  "Devi Bhagavatam",
  "Navavarana Pooja",
  "Maha Chandi Homam",
  "Suvasini Pooja",
  "Sayamkaala Durbar Seva",
  "Mangala Harathi",
  "Maha Prasada Vitarana",
] as const;

export const lineage = [
  { name: "Sri Machavolu Ramayya Shastri" },
  { name: "Sri Machavolu Rajasekhara Shastri", note: "Nityaagnihotri" },
  { name: "Sri Machavolu Ramesh Sarma" },
] as const;

export const closing = {
  heading: "A legacy in the service of Dharma",
  text: "Preserving sacred traditions, establishing divine abodes and carrying forward the timeless wisdom of Sanatana Dharma.",
} as const;
