"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

import { api } from "~/trpc/react";

const inputClass =
  "rounded-lg bg-white/10 px-4 py-3 placeholder-white/50 outline-none focus:bg-white/20";

export function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const signUp = api.account.signUp.useMutation({
    onSuccess: async () => {
      setSigningIn(true);
      await signIn("credentials", { email, password, callbackUrl: "/" });
    },
  });

  return (
    <form
      className="flex w-full max-w-md flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        signUp.mutate({ name, email, password });
      }}
    >
      <input
        className={inputClass}
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
        type="password"
        placeholder="Password (min. 8 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={8}
        required
      />

      {signUp.error && (
        <p className="text-sm text-red-400">{signUp.error.message}</p>
      )}

      <button
        type="submit"
        disabled={signUp.isPending || signingIn}
        className="rounded-full bg-white/10 px-8 py-3 font-semibold transition hover:bg-white/20 disabled:opacity-50"
      >
        {signUp.isPending || signingIn ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
