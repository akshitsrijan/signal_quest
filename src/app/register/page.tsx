import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import { RegistrationForm } from "~/app/_components/registration-form";
import { REGISTRATION_STATUS_COPY } from "~/lib/registration-status";
import { isAdminEmail } from "~/lib/admin";

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

  if (await isAdminEmail(session.user.email)) {
    redirect("/admin/registrations");
  }

  const registration = await api.registration.mine();

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 bg-gradient-to-b from-[#2e026d] to-[#15162c] px-4 py-16 text-white">
      <h1 className="text-center text-4xl font-extrabold tracking-tight">
        Team <span className="text-[hsl(280,100%,70%)]">Registration</span>
      </h1>

      {registration && registration.status !== "REJECTED" ? (
        <div className="w-full max-w-2xl rounded-xl bg-white/10 p-8 text-center">
          <h2 className="text-2xl font-bold">{registration.teamName}</h2>
          <p className="mt-2 text-white/80">
            {REGISTRATION_STATUS_COPY[registration.status]}
          </p>
        </div>
      ) : (
        <>
          {registration?.status === "REJECTED" && (
            <p className="w-full max-w-2xl rounded-xl bg-red-500/10 p-4 text-center text-red-200">
              {REGISTRATION_STATUS_COPY.REJECTED} You can fix and resubmit
              below.
            </p>
          )}

          <div className="w-full max-w-2xl rounded-xl bg-white/10 p-8 text-center">
            <h2 className="text-2xl font-bold">Registration Details</h2>
            <p className="mt-2 text-white/80">
              Pay the entry fee via bank transfer, then paste a link to your
              payment screenshot in the form below.
            </p>
          
            <div className="mt-4 space-y-1 text-lg font-semibold">
              <p>
                Account Name:{" "}
                <span className="text-[hsl(280,100%,70%)]">
                   IEEE CMRIT SB
                </span>
              </p>
              <p>
                Account Number:{" "}
                <span className="text-[hsl(280,100%,70%)]">
                  843410110012833
                </span>
              </p>
              <p>
                IFSC Code:{" "}
                <span className="text-[hsl(280,100%,70%)]">
                  BKID0008434
                </span>
              </p>
            </div>
         
          </div>

          <RegistrationForm initial={registration ?? undefined} />
        </>
      )}
    </main>
  );
}
