import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { canManageEnquiries } from "./access";
import { isAcceptableSender } from "./mail";
import { createRateLimiter } from "./rate-limit";
import { submitEnquiry, type EnquiryStore, type StoredEnquiry } from "./submit";
import { validateEnquiry } from "./validation";

const valid = {
  name: "Lakshmi Rao",
  email: "Lakshmi@Example.com",
  phone: "+91 94405 88359",
  subject: "Temple pratishtha",
  message: "We would like to enquire about a consecration.",
};

function memoryStore() {
  const rows: StoredEnquiry[] = [];
  const store: EnquiryStore = {
    async findRecentDuplicate(value, sinceIso) {
      return rows.find((row) => row.email === value.email && row.subject === value.subject && row.message === value.message && row.id >= sinceIso) ?? null;
    },
    async countRecentByEmail(email) {
      return rows.filter((row) => row.email === email).length;
    },
    async insert(value) {
      const row = { id: new Date().toISOString(), ...value };
      rows.push(row);
      return row;
    },
  };
  return { rows, store };
}

test("requires name, email, subject and message, and allows a blank mobile number", () => {
  const missing = validateEnquiry({ name: "A", email: "not-an-email", subject: " ", message: "short" });
  assert.equal(missing.ok, false);
  if (!missing.ok) {
    assert.equal(missing.errors.name, "Enter your full name.");
    assert.equal(missing.errors.email, "Enter a valid email address.");
    assert.equal(missing.errors.subject, "Enter a subject.");
    assert.equal(missing.errors.message, "Write the enquiry in a little more detail.");
    assert.equal(missing.errors.phone, undefined);
  }

  const accepted = validateEnquiry({ ...valid, phone: "  " });
  assert.equal(accepted.ok, true);
  if (accepted.ok && !accepted.spam) {
    assert.equal(accepted.value.email, "lakshmi@example.com");
    assert.equal(accepted.value.phone, null);
  }
});

test("rejects a mobile number that is too short and strips control characters", () => {
  const phone = validateEnquiry({ ...valid, phone: "123" });
  assert.equal(phone.ok, false);
  if (!phone.ok) assert.match(phone.errors.phone ?? "", /8 to 15/);

  const cleaned = validateEnquiry({ ...valid, name: "Lakshmi\u0000 Rao", message: "A consecration\u0007 enquiry for the temple." });
  assert.equal(cleaned.ok, true);
  if (cleaned.ok && !cleaned.spam) assert.equal(cleaned.value.name.includes("\u0000"), false);
});

test("honeypot submissions are not stored", async () => {
  const { rows, store } = memoryStore();
  let notified = 0;
  const result = await submitEnquiry({ ...valid, fax: "spam company" }, {
    addressAllowed: true,
    store,
    notify: async () => {
      notified += 1;
      return true;
    },
  });
  assert.deepEqual(result, { ok: true, stored: false, notification: "skipped" });
  assert.equal(rows.length, 0);
  assert.equal(notified, 0);
});

test("keeps a saved enquiry when email delivery fails", async () => {
  const { rows, store } = memoryStore();
  const result = await submitEnquiry(valid, {
    addressAllowed: true,
    store,
    notify: async () => false,
  });
  assert.equal(result.ok, true);
  if (result.ok && result.stored && !result.duplicate) assert.equal(result.notification, "failed");
  assert.equal(rows.length, 1);
});

test("does not send email when the database save fails", async () => {
  let notified = 0;
  const store: EnquiryStore = {
    async findRecentDuplicate() {
      return null;
    },
    async countRecentByEmail() {
      return 0;
    },
    async insert() {
      throw new Error("database unavailable");
    },
  };
  const result = await submitEnquiry(valid, {
    addressAllowed: true,
    store,
    notify: async () => {
      notified += 1;
      return true;
    },
  });
  assert.deepEqual(result, { ok: false, error: "unavailable" });
  assert.equal(notified, 0);
});

test("reports email success only after the enquiry is stored", async () => {
  const { store } = memoryStore();
  const result = await submitEnquiry(valid, { addressAllowed: true, store, notify: async () => true });
  assert.deepEqual(result, { ok: true, stored: true, duplicate: false, notification: "sent" });
});

test("does not insert the same enquiry twice", async () => {
  const { rows, store } = memoryStore();
  await submitEnquiry(valid, { addressAllowed: true, store, notify: async () => true });
  const second = await submitEnquiry(valid, { addressAllowed: true, store, notify: async () => true });
  assert.equal(second.ok && second.stored && second.duplicate, true);
  assert.equal(rows.length, 1);
});

test("rate limiter blocks the sixth attempt from one address", () => {
  const limiter = createRateLimiter(5, 60_000);
  for (let attempt = 0; attempt < 5; attempt += 1) assert.equal(limiter.allow("203.0.113.8", 1_000), true);
  assert.equal(limiter.allow("203.0.113.8", 1_000), false);
  assert.equal(limiter.allow("203.0.113.9", 1_000), true);
});

test("refuses a Gmail address as the sender", () => {
  assert.equal(isAcceptableSender("rameshsarmamachavolu@gmail.com"), false);
  assert.equal(isAcceptableSender("Enquiries <hello@example.com>"), true);
  assert.equal(isAcceptableSender(""), false);
});

test("only an administrator may manage enquiries", () => {
  assert.equal(canManageEnquiries("admin"), true);
  for (const role of ["anon", "user", "unavailable", "unconfigured"] as const) {
    assert.equal(canManageEnquiries(role), false);
  }
});

test("the migration keeps enquiries private", () => {
  const sql = readFileSync(new URL("../../../supabase/migrations/20261111130000_enquiries.sql", import.meta.url), "utf8");
  assert.match(sql, /enable row level security/i);
  assert.match(sql, /revoke all on table public\.enquiries from public, anon, authenticated/i);
  assert.match(sql, /using \(public\.is_admin\(\)\)/);
  assert.doesNotMatch(sql, /for insert/i);
  assert.match(sql, /enquiry content is immutable/);
});
