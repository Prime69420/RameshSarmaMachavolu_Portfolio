import type { SessionRole } from "@/lib/auth";

export function canManageEnquiries(role: SessionRole["role"]) {
  return role === "admin";
}
