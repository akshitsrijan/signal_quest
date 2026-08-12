"use client";

import { useLayoutEffect, useState } from "react";

// A minimal loading screen shown on every full page load/refresh: a
// "LOADING" label over a bar that fills to 100%, then fades into the site.
// Lives in the root layout, which Next.js doesn't remount on client-side
// navigation — so it naturally only replays on an actual start/refresh,
// not on every in-app link click.

const BAR_MS = 1400;
const HOLD_MS = 250;
const FADE_MS = 400;

type Phase = "loading" | "fading" | "done";

export function BootSequence() {
  const [phase, setPhase] = useState<Phase>("loading");

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      setPhase("done");
      return;
    }

    const timers = [
      setTimeout(() => setPhase("fading"), BAR_MS + HOLD_MS),
      setTimeout(() => setPhase("done"), BAR_MS + HOLD_MS + FADE_MS),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      style={{ transitionDuration: `${FADE_MS}ms` }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black transition-opacity ${
        phase === "fading" ? "opacity-0" : "opacity-100"
      }`}
    >
      <p className="animate-pulse font-mono text-xs tracking-[0.4em] text-white/60">
        LOADING
      </p>
      <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
        <div
          style={{ animationDuration: `${BAR_MS}ms` }}
          className="animate-loading-bar h-full rounded-full bg-[hsl(280,100%,70%)]"
        />
      </div>
    </div>
  );
}
