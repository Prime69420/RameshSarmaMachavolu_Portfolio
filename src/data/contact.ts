export const contactInfo = {
  email: "rameshsarmamachavolu@gmail.com",
  phone: "+919440588359",
  whatsapp: "+919440588359",
  youtube: "https://www.youtube.com/@machavolurameshsarma",
  facebook: "https://www.facebook.com/share/1FD1TtqB2w/",
  instagram: "https://www.instagram.com/machavolu_ramesh_sarma/",
};

export const socialLinks = [
  { label: "YouTube", href: contactInfo.youtube },
  { label: "Facebook", href: contactInfo.facebook },
  { label: "Instagram", href: contactInfo.instagram },
] as const;

export function displayPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return value;
}

export function whatsappHref(value = contactInfo.whatsapp) {
  return `https://wa.me/${value.replace(/\D/g, "")}`;
}
