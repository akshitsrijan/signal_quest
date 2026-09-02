"use client";

import { api } from "~/trpc/react";

export function RegistrationTracker({
  registered: initialRegistered,
  max: initialMax,
}: {
  registered: number;
  max: number;
}) {
  const { data } = api.registration.count.useQuery(undefined, {
    initialData: { registered: initialRegistered, max: initialMax },
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });

  const { registered, max } = data;
  const remaining = Math.max(0, max - registered);
  const full = remaining === 0;

  return (
    <div className="mx-auto w-full max-w-md rounded-xl bg-white/10 px-6 py-4 text-center">
      <p className="text-lg font-semibold">
        {registered} / {max} teams registered
      </p>
      <p className="mt-1 text-sm text-white/70">
        {full
          ? "Registrations are closed — all slots are filled."
          : `${remaining} ${remaining === 1 ? "slot" : "slots"} left`}
      </p>
    </div>
  );
}
