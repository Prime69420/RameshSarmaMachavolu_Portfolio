export const enquiryCategories = [
  { id: "pratishtha", label: "Temple Pratishthas" },
  { id: "yagams", label: "Yagams and Homams" },
  { id: "ceremonies", label: "Religious Ceremonies" },
  { id: "weddings", label: "Weddings and Upanayanams" },
  { id: "shanti", label: "Shanti Ceremonies" },
  { id: "jyotisham", label: "Jyotisham" },
  { id: "vaastu", label: "Vaastu" },
  { id: "other", label: "Other enquiries" },
] as const;

/**
 * Same-origin path for a future enquiry handler, such as "/api/enquiry".
 * Leave null until that handler exists. Do not put keys or secrets in this file.
 */
export const enquiryEndpoint: string | null = null;
