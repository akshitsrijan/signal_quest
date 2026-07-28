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

type RegistrationDraft = {
  teamName: string;
  teamLeaderName: string;
  teamLeaderPhone: string;
  collegeName: string;
  participantNames: string[];
  ieeeMember: boolean;
  ieeeMembershipId: string | null;
  paymentProofUrl: string;
};

export function RegistrationForm({ initial }: { initial?: RegistrationDraft }) {
  const router = useRouter();

  const [teamName, setTeamName] = useState(initial?.teamName ?? "");
  const [teamLeaderName, setTeamLeaderName] = useState(
    initial?.teamLeaderName ?? "",
  );
  const [teamLeaderPhone, setTeamLeaderPhone] = useState(
    initial?.teamLeaderPhone ?? "",
  );
  const [collegeName, setCollegeName] = useState(initial?.collegeName ?? "");
  const [participantNames, setParticipantNames] = useState<string[]>(
    initial?.participantNames ?? [],
  );
  const [ieeeMember, setIeeeMember] = useState<"yes" | "no" | "">(
    initial ? (initial.ieeeMember ? "yes" : "no") : "",
  );
  const [ieeeMembershipId, setIeeeMembershipId] = useState(
    initial?.ieeeMembershipId ?? "",
  );
  const [paymentProofUrl, setPaymentProofUrl] = useState(
    initial?.paymentProofUrl ?? "",
  );

  const register = api.registration.create.useMutation({
    onSuccess: () => router.refresh(),
  });

  const setParticipantCount = (count: number) => {
    const clamped = Math.max(0, Math.min(3, count || 0));
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
          participantNames: participantNames
            .map((name) => name.trim())
            .filter(Boolean),
          ieeeMember: ieeeMember === "yes",
          ieeeMembershipId:
            ieeeMember === "yes" ? ieeeMembershipId || undefined : undefined,
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

      <Question label="Number of team members (excluding leader)" required>
        <div className="flex gap-3">
          {[0, 1, 2, 3].map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => setParticipantCount(count)}
              className={`h-12 w-12 rounded-lg font-semibold transition ${
                participantNames.length === count
                  ? "bg-[hsl(280,100%,70%)] text-black"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {count}
            </button>
          ))}
        </div>
      </Question>

      {participantNames.length > 0 && (
        <Question label="Team member names" required>
          <div className="flex flex-col gap-2">
            {participantNames.map((name, i) => (
              <input
                key={i}
                className={fieldClass}
                placeholder={`Team member ${i + 1}`}
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
      )}

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

      {ieeeMember !== "" && (
        <Question label="Entry fee">
          <p className="text-white/80">
            ₹{ieeeMember === "yes" ? 350 : 500} (fixed
            {ieeeMember === "yes" ? " for IEEE members" : " for non-IEEE members"})
          </p>
        </Question>
      )}

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
