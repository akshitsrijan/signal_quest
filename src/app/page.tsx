import Image from "next/image";
import Link from "next/link";

import { api } from "~/trpc/server";
import { auth } from "~/server/auth";
import { SiteNav } from "~/app/_components/site-nav";
import { StarfieldBackground } from "~/app/_components/starfield-background";
import { THEMES } from "~/lib/themes";
import { REGISTRATION_STATUS_COPY } from "~/lib/registration-status";
import { isAdminEmail } from "~/lib/admin";
import { CONTACTS } from "~/lib/contacts";
import { env } from "~/env";

const CO_ORGANIZER_LOGOS = [
  {
    src: "/ieee-bangalore-section.png",
    alt: "IEEE Bangalore Section",
    width: 339,
    height: 71,
    className: "h-10 w-auto",
  },
  {
    src: "/ieee-sps-bangalore-chapter.png",
    alt: "IEEE Signal Processing Society — Bangalore Chapter",
    width: 246,
    height: 249,
    className: "h-16 w-auto",
  },
  {
    src: "/CMRIT_NEW_A++.png",
    alt: "CMR Institute of Technology, Bengaluru",
    width: 375,
    height: 246,
    className: "h-20 w-auto",
  },
];

// Must match the -25% shift in the .animate-marquee keyframes (globals.css):
// each of the 4 copies needs to span 1/4 of the animated track.
const CO_ORGANIZER_TRACK_REPEATS = 4;

function CoOrganizerLogo({
  logo,
}: {
  logo: (typeof CO_ORGANIZER_LOGOS)[number];
}) {
  return (
    <div className="flex h-24 shrink-0 items-center justify-center rounded-xl bg-white px-6 py-3 shadow-sm">
      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        className={logo.className}
      />
    </div>
  );
}

export default async function Home() {
  const session = await auth();
  const announcements = await api.announcement.list();
  const isAdmin = await isAdminEmail(session?.user.email);
  const myRegistration =
    session && !isAdmin ? await api.registration.mine() : null;

  return (
    <>
      <StarfieldBackground />
      <main className="text-over-starfield relative z-0 min-h-screen text-white">
        <SiteNav isSignedIn={!!session} isAdmin={isAdmin} />

        {session && !isAdmin && (
          <div className="px-6 pt-4">
            <p className="mx-auto max-w-3xl rounded-lg bg-white/10 px-4 py-3 text-center text-sm">
              {myRegistration ? (
                REGISTRATION_STATUS_COPY[myRegistration.status]
              ) : (
                <>
                  You haven&apos;t registered yet —{" "}
                  <Link href="/register" className="underline hover:text-white/70">
                    click Register
                  </Link>{" "}
                  to get started.
                </>
              )}
            </p>
          </div>
        )}

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
            and sustainable tech. Form a team, pick a theme, and build something
            real.
          </p>
        </section>

        <section id="co-organizers" className="px-6 py-16 text-center">
          <h2 className="mb-8 text-3xl font-extrabold tracking-tight">
            Co-Organizers
          </h2>
          <div className="mx-auto max-w-5xl overflow-hidden">
            <div className="animate-marquee flex w-max">
              {Array.from({ length: CO_ORGANIZER_TRACK_REPEATS }, (_, i) => (
                <div
                  key={i}
                  className="flex shrink-0 items-center gap-10 pr-10"
                  aria-hidden={i === 0 ? undefined : true}
                >
                  {CO_ORGANIZER_LOGOS.map((logo) => (
                    <CoOrganizerLogo key={logo.alt} logo={logo} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="themes" className="px-6 py-16">
          <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight">
            Themes
          </h2>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {THEMES.map((theme) => (
              <div key={theme.id} className="rounded-lg bg-white/10 px-6 py-4">
                <h3 className="text-xl font-semibold">{theme.label}</h3>
                <p className="mt-2 text-white/80">{theme.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="prize-pool"
          className="flex flex-col items-center gap-2 px-6 py-16 text-center"
        >
          <h2 className="text-3xl font-extrabold tracking-tight">Prize Pool</h2>
          <p className="text-5xl font-extrabold text-[hsl(280,100%,70%)]">
            ₹14,000
          </p>
          <p className="max-w-2xl text-white/80">
            ₹14,000 plus goodies — up for grabs across all themes at SIGNAL
            QUEST.
          </p>
        </section>

        <section
          id="event-date"
          className="flex flex-col items-center gap-2 px-6 py-16 text-center"
        >
          <h2 className="text-3xl font-extrabold tracking-tight">
            Event Date
          </h2>
          <p className="text-5xl font-extrabold text-[hsl(280,100%,70%)]">
            September 26, 2026
          </p>
          <p className="max-w-2xl text-white/80">
            Mark your calendars — SIGNAL QUEST takes place on this date.
          </p>
        </section>

        <section
          id="registration-deadline"
          className="flex flex-col items-center gap-2 px-6 py-16 text-center"
        >
          <h2 className="text-3xl font-extrabold tracking-tight">
            Registration Deadline
          </h2>
          <p className="text-5xl font-extrabold text-[hsl(280,100%,70%)]">
            September 20
          </p>
          <p className="max-w-2xl text-white/80">
            Make sure your team is registered before this date to secure your
            spot at SIGNAL QUEST.
          </p>
        </section>

        <section
          id="venue"
          className="flex flex-col items-center gap-2 px-6 py-16 text-center"
        >
          <h2 className="text-3xl font-extrabold tracking-tight">Venue</h2>
          <p className="max-w-2xl text-white/80">
            CMR Institute of Technology, Sri Nivasa Reddy Layout, AECS Layout,
            Marathahalli, Bengaluru, Karnataka 560037
          </p>
          <a
            href="https://maps.app.goo.gl/UmQ5euVyrEhyXshT6"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 rounded-full bg-[hsl(280,100%,70%)] px-8 py-3 font-semibold text-black transition hover:bg-[hsl(280,100%,65%)] [text-shadow:none]"
          >
            Open in Google Maps
          </a>
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

        <section
          id="join-us"
          className="flex flex-col items-center gap-4 px-6 py-16 text-center"
        >
          <h2 className="text-3xl font-extrabold tracking-tight">Join Us</h2>
          <p className="max-w-2xl text-white/80">
            Our Discord server is where SIGNAL QUEST happens outside the
            hackathon floor — team formation, announcements, and direct support
            from organizers. It&apos;s reserved for registered participants, so
            make sure you&apos;ve registered before requesting to join.
          </p>
          {env.NEXT_PUBLIC_DISCORD_INVITE_URL ? (
            <a
              href={env.NEXT_PUBLIC_DISCORD_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[hsl(280,100%,70%)] px-8 py-3 font-semibold text-black transition hover:bg-[hsl(280,100%,65%)] [text-shadow:none]"
            >
              Join our Discord server
            </a>
          ) : (
            <p className="text-sm text-white/50">
              Discord invite link coming soon.
            </p>
          )}
        </section>

        <section
          id="contact-us"
          className="flex flex-col items-center gap-2 px-6 py-16 text-center"
        >
          <h2 className="text-3xl font-extrabold tracking-tight">
            Need Help??
          </h2>
          <p className="text-white/80">Please contact</p>
          {CONTACTS.length === 0 ? (
            <p className="mt-2 text-sm text-white/50">
              Contact details coming soon.
            </p>
          ) : (
            <div className="mt-2 flex flex-col gap-1">
              {CONTACTS.map((contact) => (
                <p key={contact.name} className="text-white/80">
                  {contact.name}:{" "}
                  <a
                    href={`tel:${contact.phone}`}
                    className="underline hover:text-white"
                  >
                    {contact.phone}
                  </a>
                </p>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
