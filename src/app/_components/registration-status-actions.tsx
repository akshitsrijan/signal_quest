"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function RegistrationStatusActions({
  id,
  teamName,
  status,
}: {
  id: string;
  teamName: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "ON_HOLD";
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const setStatus = api.registration.setStatus.useMutation({
    onSuccess: () => {
      setPending(false);
      router.refresh();
    },
    onError: () => setPending(false),
  });

  const deleteRegistration = api.registration.delete.useMutation({
    onSuccess: () => {
      setPending(false);
      router.refresh();
    },
    onError: () => setPending(false),
  });

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={pending || status === "APPROVED"}
        onClick={() => {
          setPending(true);
          setStatus.mutate({ id, status: "APPROVED" });
        }}
        className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-300 transition hover:bg-green-500/30 disabled:opacity-40"
      >
        Approve
      </button>
      <button
        type="button"
        disabled={pending || status === "REJECTED"}
        onClick={() => {
          setPending(true);
          setStatus.mutate({ id, status: "REJECTED" });
        }}
        className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-300 transition hover:bg-red-500/30 disabled:opacity-40"
      >
        Reject
      </button>
      <button
        type="button"
        disabled={pending || status === "ON_HOLD"}
        onClick={() => {
          setPending(true);
          setStatus.mutate({ id, status: "ON_HOLD" });
        }}
        className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-semibold text-yellow-300 transition hover:bg-yellow-500/30 disabled:opacity-40"
      >
        Hold
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (
            !window.confirm(
              `Delete ${teamName}'s registration? They'll be able to register again from scratch.`,
            )
          ) {
            return;
          }
          setPending(true);
          deleteRegistration.mutate({ id });
        }}
        className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70 transition hover:bg-white/20 disabled:opacity-40"
      >
        Delete
      </button>
    </div>
  );
}
