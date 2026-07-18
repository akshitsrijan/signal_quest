import Link from "next/link";

import { auth } from "~/server/auth";
import { RegistrationForm } from "~/app/_components/registration-form";

export default async function RegisterPage() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] px-4 text-white">
      <h1 className="mb-8 text-4xl font-extrabold tracking-tight">
        Register for <span className="text-[hsl(280,100%,70%)]">SIGNAL QUEST</span>
      </h1>

      {session ? (
        <RegistrationForm />
      ) : (
        <Link
          href="/api/auth/signin"
          className="rounded-full bg-white/10 px-8 py-3 font-semibold transition hover:bg-white/20"
        >
          Sign in with Discord to register
        </Link>
      )}
    </main>
  );
}
