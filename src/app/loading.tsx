// Next.js shows this automatically as the Suspense fallback for any route
// under the app root while that route's async work (data fetching) is in
// flight — on first load of a page and on client-side navigation to one.
// Unlike BootSequence, real load time isn't known up front, so the bar is
// an indeterminate sweep rather than a fixed-duration fill, and there's no
// JS here — Next.js unmounts this the instant the route is ready.
export default function Loading() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black"
    >
      <p className="animate-pulse font-mono text-xs tracking-[0.4em] text-white/60">
        LOADING
      </p>
      <div className="relative h-1 w-48 overflow-hidden rounded-full bg-white/10">
        <div className="animate-loading-sweep absolute top-0 h-full w-2/5 rounded-full bg-[hsl(280,100%,70%)]" />
      </div>
    </div>
  );
}
