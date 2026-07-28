"use client";

import { useState } from "react";

import { api, type RouterOutputs } from "~/trpc/react";

type ListOutput = RouterOutputs["admin"]["list"];

export function ManageAdmins({ initial }: { initial: ListOutput }) {
  const [email, setEmail] = useState("");

  const list = api.admin.list.useQuery(undefined, { initialData: initial });

  const add = api.admin.add.useMutation({
    onSuccess: () => {
      setEmail("");
      void list.refetch();
    },
  });

  const remove = api.admin.remove.useMutation({
    onSuccess: () => void list.refetch(),
  });

  return (
    <div className="w-full max-w-2xl">
      <form
        className="mb-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!email.trim()) return;
          add.mutate({ email: email.trim() });
        }}
      >
        <input
          type="email"
          required
          placeholder="new-admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/40 outline-none focus:bg-white/20"
        />
        <button
          type="submit"
          disabled={add.isPending}
          className="shrink-0 rounded-full bg-white/10 px-6 py-3 font-semibold transition hover:bg-white/20 disabled:opacity-50"
        >
          {add.isPending ? "Adding..." : "Add admin"}
        </button>
      </form>

      {add.error && (
        <p className="mb-4 text-sm text-red-400">{add.error.message}</p>
      )}
      {remove.error && (
        <p className="mb-4 text-sm text-red-400">{remove.error.message}</p>
      )}

      <div className="mt-6 mb-6 rounded-lg bg-white/10 p-4">
        <h2 className="mb-2 text-sm font-semibold text-white/60">
          Built-in admins (from ADMIN_EMAILS — can&apos;t be removed here)
        </h2>
        <ul className="flex flex-col gap-1">
          {list.data.envAdmins.map((adminEmail) => (
            <li key={adminEmail} className="text-white/80">
              {adminEmail}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg bg-white/10 p-4">
        <h2 className="mb-2 text-sm font-semibold text-white/60">
          Granted admins
        </h2>
        {list.data.grantedAdmins.length === 0 ? (
          <p className="text-sm text-white/50">No additional admins yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {list.data.grantedAdmins.map((admin) => (
              <li
                key={admin.id}
                className="flex items-center justify-between gap-4"
              >
                <span>{admin.email}</span>
                <button
                  type="button"
                  disabled={remove.isPending}
                  onClick={() => remove.mutate({ id: admin.id })}
                  className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-300 transition hover:bg-red-500/30 disabled:opacity-40"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
