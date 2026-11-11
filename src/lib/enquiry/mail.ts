import { contactInfo } from "@/data/contact";
import type { StoredEnquiry } from "@/lib/enquiry/submit";

export function isAcceptableSender(from: string | undefined, recipient = contactInfo.email) {
  const value = from?.trim() ?? "";
  const address = (value.match(/<([^>]+)>/)?.[1] ?? value).trim().toLowerCase();
  const domain = address.split("@")[1] ?? "";
  if (!address || !domain || domain === "gmail.com" || domain === "googlemail.com") return false;
  if (address === recipient.toLowerCase()) return false;
  return true;
}

export async function sendEnquiryNotification(enquiry: StoredEnquiry) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!apiKey || !isAcceptableSender(from)) return false;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [contactInfo.email],
        reply_to: enquiry.email,
        subject: `Enquiry: ${enquiry.subject}`,
        text: [
          `Name: ${enquiry.name}`,
          `Email: ${enquiry.email}`,
          `Mobile: ${enquiry.phone ?? "Not given"}`,
          `Subject: ${enquiry.subject}`,
          "",
          enquiry.message,
        ].join("\n"),
      }),
    });
    if (!response.ok) console.error("enquiry notification failed", response.status);
    return response.ok;
  } catch {
    console.error("enquiry notification failed");
    return false;
  }
}
