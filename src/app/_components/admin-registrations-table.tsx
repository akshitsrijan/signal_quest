"use client";

import { useState } from "react";

import { RegistrationStatusActions } from "~/app/_components/registration-status-actions";
import { THEME_LABELS } from "~/lib/themes";
import { type RouterOutputs } from "~/trpc/react";

type Registration = RouterOutputs["registration"]["list"][number];

const TABS = [
  { key: "ALL", label: "All records" },
  { key: "PENDING", label: "Pending" },
  { key: "APPROVED", label: "Approved" },
  { key: "REJECTED", label: "Rejected" },
  { key: "ON_HOLD", label: "On hold" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function AdminRegistrationsTable({
  registrations,
}: {
  registrations: Registration[];
}) {
  const [tab, setTab] = useState<TabKey>("ALL");

  const filtered =
    tab === "ALL"
      ? registrations
      : registrations.filter((registration) => registration.status === tab);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const count =
            t.key === "ALL"
              ? registrations.length
              : registrations.filter(
                  (registration) => registration.status === t.key,
                ).length;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === t.key
                  ? "bg-[hsl(280,100%,70%)] text-black"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {t.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-lg bg-white/10">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/20 text-white/60">
              <th className="px-4 py-3">Team</th>
              <th className="px-4 py-3">Leader</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">College</th>
              <th className="px-4 py-3">Theme</th>
              <th className="px-4 py-3">Participants</th>
              <th className="px-4 py-3">IEEE</th>
              <th className="px-4 py-3">Fee</th>
              <th className="px-4 py-3">Proof</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Registered</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={13} className="px-4 py-6 text-center text-white/50">
                  No registrations in this view.
                </td>
              </tr>
            ) : (
              filtered.map((registration) => (
                <tr
                  key={registration.id}
                  className="border-b border-white/10 last:border-0"
                >
                  <td className="px-4 py-3">{registration.teamName}</td>
                  <td className="px-4 py-3">{registration.teamLeaderName}</td>
                  <td className="px-4 py-3">{registration.email}</td>
                  <td className="px-4 py-3">{registration.teamLeaderPhone}</td>
                  <td className="px-4 py-3">{registration.collegeName}</td>
                  <td className="px-4 py-3">
                    {registration.theme
                      ? THEME_LABELS[registration.theme]
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {registration.numParticipants} (
                    {registration.participantNames.join(", ") || "—"})
                  </td>
                  <td className="px-4 py-3">
                    {registration.ieeeMember
                      ? `Yes${registration.ieeeMembershipId ? ` (${registration.ieeeMembershipId})` : ""}`
                      : "No"}
                  </td>
                  <td className="px-4 py-3">₹{registration.entryFee}</td>
                  <td className="px-4 py-3">
                    <a
                      href={registration.paymentProofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-white/70"
                    >
                      View
                    </a>
                  </td>
                  <td className="px-4 py-3">{registration.status}</td>
                  <td className="px-4 py-3">
                    {registration.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <RegistrationStatusActions
                      id={registration.id}
                      teamName={registration.teamName}
                      status={registration.status}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
