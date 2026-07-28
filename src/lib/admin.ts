import { env } from "~/env";
import { db } from "~/server/db";

function envAdminEmails(): string[] {
  return (env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((adminEmail) => adminEmail.trim().toLowerCase())
    .filter(Boolean);
}

// Emails from the ADMIN_EMAILS env var are a bootstrap list that can't be
// removed via the UI, so the site can never lock itself out of its own
// admin panel.
export function isEnvAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return envAdminEmails().includes(email.toLowerCase());
}

export async function isAdminEmail(
  email: string | null | undefined,
): Promise<boolean> {
  if (!email) return false;

  const normalized = email.toLowerCase();
  if (envAdminEmails().includes(normalized)) return true;

  const granted = await db.adminEmail.findUnique({
    where: { email: normalized },
  });
  return !!granted;
}
