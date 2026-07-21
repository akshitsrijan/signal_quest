"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";

import { api } from "~/trpc/react";
import { REGISTRATION_STATUS_COPY } from "~/lib/registration-status";

const fieldClass =
  "w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/40 outline-none focus:bg-white/20";

function Question({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white/5 p-6">
      <label className="mb-3 block text-lg font-medium">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

export function RegistrationForm() {
  const router = useRouter();

  const [teamName, setTeamName] = useState("");
  const [teamLeaderName, setTeamLeaderName] = useState("");
  const [teamLeaderPhone, setTeamLeaderPhone] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [participantNames, setParticipantNames] = useState<string[]>([""]);
  const [ieeeMember, setIeeeMember] = useState<"yes" | "no" | "">("");
  const [ieeeMembershipId, setIeeeMembershipId] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [paymentProofUrl, setPaymentProofUrl] = useState("");

  const register = api.registration.create.useMutation({
    onSuccess: () => router.refresh(),
  });

  const setParticipantCount = (count: number) => {
    const clamped = Math.max(1, Math.min(10, count || 1));
    setParticipantNames((prev) => {
      const next = prev.slice(0, clamped);
      while (next.length < clamped) next.push("");
      return next;
    });
  };

  if (register.isSuccess) {
    return (
      <div className="w-full max-w-2xl rounded-xl bg-white/10 p-8 text-center">
        <h2 className="text-2xl font-bold">You&apos;re registered!</h2>
        <p className="mt-2 text-white/80">
          {REGISTRATION_STATUS_COPY.PENDING}
        </p>
      </div>
    );
  }

  return (
    <form
      className="flex w-full max-w-2xl flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (ieeeMember === "") return;
        register.mutate({
          teamName,
          teamLeaderName,
          teamLeaderPhone,
          collegeName,
          numParticipants: participantNames.length,
          participantNames: participantNames
            .map((name) => name.trim())
            .filter(Boolean),
          ieeeMember: ieeeMember === "yes",
          ieeeMembershipId:
            ieeeMember === "yes" ? ieeeMembershipId || undefined : undefined,
          entryFee: Number(entryFee),
          paymentProofUrl,
        });
      }}
    >
      <Question label="Team name" required>
        <input
          className={fieldClass}
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
        />
      </Question>

      <Question label="Team leader name" required>
        <input
          className={fieldClass}
          value={teamLeaderName}
          onChange={(e) => setTeamLeaderName(e.target.value)}
          required
        />
      </Question>

      <Question label="Team leader phone" required>
        <input
          className={fieldClass}
          type="tel"
          value={teamLeaderPhone}
          onChange={(e) => setTeamLeaderPhone(e.target.value)}
          required
        />
      </Question>

      <Question label="College name" required>
        <input
          className={fieldClass}
          value={collegeName}
          onChange={(e) => setCollegeName(e.target.value)}
          required
        />
      </Question>

      <Question label="Number of participants" required>
        <input
          className={fieldClass}
          type="number"
          min={1}
          max={10}
          value={participantNames.length}
          onChange={(e) => setParticipantCount(Number(e.target.value))}
          required
        />
      </Question>

      <Question label="Participant names" required>
        <div className="flex flex-col gap-2">
          {participantNames.map((name, i) => (
            <input
              key={i}
              className={fieldClass}
              placeholder={`Participant ${i + 1}`}
              value={name}
              onChange={(e) =>
                setParticipantNames((prev) =>
                  prev.map((n, idx) => (idx === i ? e.target.value : n)),
                )
              }
              required
            />
          ))}
        </div>
      </Question>

      <Question label="Are you an IEEE member?" required>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="ieee"
              checked={ieeeMember === "yes"}
              onChange={() => setIeeeMember("yes")}
              required
            />
            Yes
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="ieee"
              checked={ieeeMember === "no"}
              onChange={() => setIeeeMember("no")}
            />
            No
          </label>
        </div>
      </Question>

      {ieeeMember === "yes" && (
        <Question label="IEEE membership ID">
          <input
            className={fieldClass}
            value={ieeeMembershipId}
            onChange={(e) => setIeeeMembershipId(e.target.value)}
          />
        </Question>
      )}

      <Question label="Entry fee paid (₹)" required>
        <input
          className={fieldClass}
          type="number"
          min={0}
          value={entryFee}
          onChange={(e) => setEntryFee(e.target.value)}
          required
        />
      </Question>

      <Question label="Payment proof link" required>
        <input
          className={fieldClass}
          type="url"
          placeholder="Link to a screenshot (Google Drive, Imgur, etc.)"
          value={paymentProofUrl}
          onChange={(e) => setPaymentProofUrl(e.target.value)}
          required
        />
      </Question>

      {register.error && (
        <p className="text-sm text-red-400">{register.error.message}</p>
      )}

      <button
        type="submit"
        disabled={register.isPending}
        className="rounded-full bg-white/10 px-8 py-3 font-semibold transition hover:bg-white/20 disabled:opacity-50"
      >
        {register.isPending ? "Submitting..." : "Submit registration"}
      </button>
    </form>
  );
}
