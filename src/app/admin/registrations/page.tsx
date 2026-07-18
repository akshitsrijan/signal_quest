import Link from "next/link";
import { TRPCError } from "@trpc/server";

import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function AdminRegistrationsPage() {
  const session = await auth();

  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <p>You need to sign in to view this page.</p>
        <Link
          href="/api/auth/signin"
          className="rounded-full bg-white/10 px-8 py-3 font-semibold transition hover:bg-white/20"
        >
          Sign in with Discord
        </Link>
      </main>
    );
  }

  try {
    const registrations = await api.registration.list();

    return (
      <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] px-6 py-12 text-white">
        <h1 className="mb-6 text-3xl font-extrabold tracking-tight">
          Registrations ({registrations.length})
        </h1>
        <div className="overflow-x-auto rounded-lg bg-white/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/20 text-white/60">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">College</th>
                <th className="px-4 py-3">Team</th>
                <th className="px-4 py-3">Track</th>
                <th className="px-4 py-3">Registered</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((registration) => (
                <tr
                  key={registration.id}
                  className="border-b border-white/10 last:border-0"
                >
                  <td className="px-4 py-3">{registration.fullName}</td>
                  <td className="px-4 py-3">{registration.email}</td>
                  <td className="px-4 py-3">{registration.phone ?? "—"}</td>
                  <td className="px-4 py-3">{registration.college ?? "—"}</td>
                  <td className="px-4 py-3">{registration.teamName ?? "—"}</td>
                  <td className="px-4 py-3">{registration.track}</td>
                  <td className="px-4 py-3">
                    {registration.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    );
  } catch (error) {
    if (error instanceof TRPCError && error.code === "FORBIDDEN") {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
          <p>You don&apos;t have access to this page.</p>
        </main>
      );
    }
    throw error;
  }
}
