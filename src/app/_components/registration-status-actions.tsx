"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function RegistrationStatusActions({
  id,
  status,
}: {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
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

  return (
    <div className="flex gap-2">
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
    </div>
  );
}
