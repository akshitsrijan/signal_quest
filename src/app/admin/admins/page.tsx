import Link from "next/link";
import { TRPCError } from "@trpc/server";

import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import { ManageAdmins } from "~/app/_components/manage-admins";

export default async function ManageAdminsPage() {
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
    const initial = await api.admin.list();

    return (
      <main className="flex min-h-screen flex-col items-center gap-8 bg-gradient-to-b from-[#2e026d] to-[#15162c] px-4 py-16 text-white">
        <h1 className="text-center text-3xl font-extrabold tracking-tight">
          Manage Admins
        </h1>
        <Link
          href="/admin/registrations"
          className="-mt-4 text-sm text-white/60 underline hover:text-white/80"
        >
          Back to Registrations
        </Link>
        <ManageAdmins initial={initial} />
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
