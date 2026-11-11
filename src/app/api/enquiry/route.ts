import { NextResponse } from "next/server";
import { sendEnquiryNotification } from "@/lib/enquiry/mail";
import { enquiryAddressLimiter } from "@/lib/enquiry/rate-limit";
import { createEnquiryStore } from "@/lib/enquiry/repository";
import { submitEnquiry } from "@/lib/enquiry/submit";
import { validateEnquiry } from "@/lib/enquiry/validation";

function clientAddress(request: Request) {
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real.slice(0, 80);
  const forwarded = request.headers.get("x-forwarded-for");
  if (!forwarded) return "unknown";
  const parts = forwarded.split(",").map((part) => part.trim()).filter(Boolean);
  return (parts[parts.length - 1] || "unknown").slice(0, 80);
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ ok: false, error: "unavailable" }, 403);
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json({ ok: false, error: "validation", fields: { message: "The enquiry could not be read." } }, 415);
  }

  let payload: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 20_000) return json({ ok: false, error: "validation", fields: { message: "The enquiry is too long." } }, 413);
    payload = JSON.parse(raw) as unknown;
  } catch {
    return json({ ok: false, error: "validation", fields: { message: "The enquiry could not be read." } }, 400);
  }

  if (!payload || typeof payload !== "object") {
    return json({ ok: false, error: "validation", fields: { message: "The enquiry could not be read." } }, 400);
  }

  const body = payload as Parameters<typeof validateEnquiry>[0];
  const preview = validateEnquiry(body);
  if (!preview.ok) return json({ ok: false, error: "validation", fields: preview.errors }, 400);
  if (!enquiryAddressLimiter.allow(clientAddress(request))) return json({ ok: false, error: "rate_limit" }, 429);
  if (preview.spam) return json({ ok: true, stored: false, notification: "skipped" });

  const store = createEnquiryStore();
  if (!store) return json({ ok: false, error: "unavailable" }, 503);

  const result = await submitEnquiry(body, {
    addressAllowed: true,
    store,
    notify: sendEnquiryNotification,
  });

  if (!result.ok && result.error === "validation") return json(result, 400);
  if (!result.ok && result.error === "rate_limit") return json(result, 429);
  if (!result.ok) return json(result, 503);
  return json(result);
}
