import Link from "next/link";
import { TRPCError } from "@trpc/server";

import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import { AdminRegistrationsTable } from "~/app/_components/admin-registrations-table";
import { THEMES, type Theme } from "~/lib/themes";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white/10 px-4 py-3">
      <p className="text-sm text-white/60">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

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
          Sign in
        </Link>
      </main>
    );
  }

  try {
    const registrations = await api.registration.list();

    const statusCounts = {
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
      ON_HOLD: 0,
    };
    const themeCounts = Object.fromEntries(
      THEMES.map((theme) => [theme.id, 0]),
    ) as Record<Theme, number>;
    let unspecifiedTheme = 0;
    let totalParticipants = 0;

    for (const registration of registrations) {
      statusCounts[registration.status]++;
      totalParticipants += registration.numParticipants + 1;
      if (registration.theme) {
        themeCounts[registration.theme]++;
      } else {
        unspecifiedTheme++;
      }
    }

    return (
      <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] px-6 py-12 text-white">
        <h1 className="mb-6 text-3xl font-extrabold tracking-tight">
          Registrations ({registrations.length})
        </h1>

        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Total teams" value={registrations.length} />
          <StatCard label="Pending" value={statusCounts.PENDING} />
          <StatCard label="Approved" value={statusCounts.APPROVED} />
          <StatCard label="Rejected" value={statusCounts.REJECTED} />
          <StatCard label="On hold" value={statusCounts.ON_HOLD} />
          <StatCard label="Total participants" value={totalParticipants} />
        </div>

        <div className="mb-6 rounded-lg bg-white/10 p-6">
          <h2 className="mb-4 text-lg font-semibold">Teams by theme</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {THEMES.map((theme) => (
              <div key={theme.id} className="rounded-lg bg-white/5 px-4 py-3">
                <p className="text-sm text-white/60">{theme.label}</p>
                <p className="text-xl font-bold">{themeCounts[theme.id]}</p>
              </div>
            ))}
            {unspecifiedTheme > 0 && (
              <div className="rounded-lg bg-white/5 px-4 py-3">
                <p className="text-sm text-white/60">Unspecified</p>
                <p className="text-xl font-bold">{unspecifiedTheme}</p>
              </div>
            )}
          </div>
        </div>

        <AdminRegistrationsTable registrations={registrations} />
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
