import { env } from "~/env";

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;

  const adminEmails = (env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((adminEmail) => adminEmail.trim().toLowerCase())
    .filter(Boolean);

  return adminEmails.includes(email.toLowerCase());
}
