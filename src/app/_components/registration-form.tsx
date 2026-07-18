"use client";

import { useState } from "react";

import { api } from "~/trpc/react";
import { Track } from "../../../generated/prisma";

const TRACK_LABELS: Record<Track, string> = {
  SPEECH_AUDIO_AI: "Speech, Audio & AI",
  COMPUTER_VISION: "Computer Vision",
  BIOMEDICAL_SIGNALS: "Biomedical Signals",
  AI_ML: "AI & ML",
  WIRELESS_IOT: "Wireless & IoT",
  SUSTAINABLE_TECH: "Sustainable Tech",
};

const inputClass =
  "rounded-lg bg-white/10 px-4 py-3 placeholder-white/50 outline-none focus:bg-white/20";

export function RegistrationForm() {
  const utils = api.useUtils();
  const { data: existing, isPending } = api.registration.mine.useQuery();
  const register = api.registration.register.useMutation({
    onSuccess: () => utils.registration.mine.invalidate(),
  });

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [teamName, setTeamName] = useState("");
  const [track, setTrack] = useState<Track>(Track.SPEECH_AUDIO_AI);

  if (isPending) {
    return <p className="text-white/70">Loading...</p>;
  }

  if (existing) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg bg-white/10 px-8 py-6 text-center">
        <p className="text-xl font-semibold">You&apos;re registered!</p>
        <p className="text-white/70">
          Track: {TRACK_LABELS[existing.track]}
        </p>
      </div>
    );
  }

  return (
    <form
      className="flex w-full max-w-md flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        register.mutate({
          fullName,
          email,
          phone: phone || undefined,
          college: college || undefined,
          teamName: teamName || undefined,
          track,
        });
      }}
    >
      <input
        className={inputClass}
        placeholder="Full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
      <input
        className={inputClass}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className={inputClass}
        placeholder="Phone (optional)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        className={inputClass}
        placeholder="College (optional)"
        value={college}
        onChange={(e) => setCollege(e.target.value)}
      />
      <input
        className={inputClass}
        placeholder="Team name (optional)"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />
      <select
        className={inputClass}
        value={track}
        onChange={(e) => setTrack(e.target.value as Track)}
      >
        {Object.entries(TRACK_LABELS).map(([value, label]) => (
          <option key={value} value={value} className="text-black">
            {label}
          </option>
        ))}
      </select>

      {register.error && (
        <p className="text-sm text-red-400">{register.error.message}</p>
      )}

      <button
        type="submit"
        disabled={register.isPending}
        className="rounded-full bg-white/10 px-8 py-3 font-semibold transition hover:bg-white/20 disabled:opacity-50"
      >
        {register.isPending ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
