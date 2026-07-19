import { api } from "~/trpc/server";
import { NavAuthMenu } from "~/app/_components/nav-auth-menu";
import { TRACKS } from "~/lib/tracks";
import Image from "next/image";

export default async function Home() {
  const announcements = await api.announcement.list();

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
    <nav className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#3a1076] px-6 py-4">

        <Image src="/logo_preview.png" alt="SIGNAL QUEST" width={300} height={300} className="h-16 w-auto" priority />
        <div className="flex items-center gap-6">
          <a href="#about" className="font-medium hover:text-white/70">
            About
          </a>
          <a href="#tracks" className="font-medium hover:text-white/70">
            Tracks
          </a>
          <a href="#announcements" className="font-medium hover:text-white/70">
            Announcements
          </a>
          <NavAuthMenu />
        </div>
      </nav>

      <section
        id="about"
        className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center"
      >
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          SIGNAL <span className="text-[hsl(280,100%,70%)]">QUEST</span>
        </h1>
        <p className="max-w-2xl text-lg text-white/80">
          SIGNAL QUEST is a hackathon for builders working across speech &
          audio, computer vision, biomedical signals, AI/ML, wireless & IoT,
          and sustainable tech. Form a team, pick a track, and build
          something real.
        </p>
      </section>

      <section id="tracks" className="px-6 py-16">
        <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight">
          Tracks
        </h2>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {TRACKS.map((track) => (
            <div key={track.id} className="rounded-lg bg-white/10 px-6 py-4">
              <h3 className="text-xl font-semibold">{track.label}</h3>
              <p className="mt-2 text-white/80">{track.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="announcements" className="px-6 py-16">
        <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight">
          Announcements
        </h2>
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {announcements.length === 0 ? (
            <p className="text-center text-white/60">
              No announcements yet — check back soon.
            </p>
          ) : (
            announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="rounded-lg bg-white/10 px-6 py-4"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-xl font-semibold">
                    {announcement.title}
                  </h3>
                  <span className="shrink-0 text-sm text-white/50">
                    {announcement.createdAt.toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 text-white/80">{announcement.body}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
