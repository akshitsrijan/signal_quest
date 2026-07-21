import Link from "next/link";

import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import { RegistrationForm } from "~/app/_components/registration-form";
import { REGISTRATION_STATUS_COPY } from "~/lib/registration-status";

export default async function RegisterPage() {
  const session = await auth();

  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <p>You need to sign in to register.</p>
        <Link
          href="/api/auth/signin?callbackUrl=%2Fregister"
          className="rounded-full bg-white/10 px-8 py-3 font-semibold transition hover:bg-white/20"
        >
          Sign in
        </Link>
      </main>
    );
  }

  const registration = await api.registration.mine();

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 bg-gradient-to-b from-[#2e026d] to-[#15162c] px-4 py-16 text-white">
      <h1 className="text-center text-4xl font-extrabold tracking-tight">
        Team <span className="text-[hsl(280,100%,70%)]">Registration</span>
      </h1>

      {registration ? (
        <div className="w-full max-w-2xl rounded-xl bg-white/10 p-8 text-center">
          <h2 className="text-2xl font-bold">{registration.teamName}</h2>
          <p className="mt-2 text-white/80">
            {REGISTRATION_STATUS_COPY[registration.status]}
          </p>
        </div>
      ) : (
        <RegistrationForm />
      )}
    </main>
  );
}
