import { api } from "~/trpc/server";
import { auth } from "~/server/auth";
import { SiteNav } from "~/app/_components/site-nav";
import { THEMES } from "~/lib/themes";
import { REGISTRATION_STATUS_COPY } from "~/lib/registration-status";
import { isAdminEmail } from "~/lib/admin";
import { TIMELINE } from "~/lib/timeline";
import { CONTACTS } from "~/lib/contacts";
import { env } from "~/env";

export default async function Home() {
  const session = await auth();
  const announcements = await api.announcement.list();
  const isAdmin = isAdminEmail(session?.user.email);
  const myRegistration =
    session && !isAdmin ? await api.registration.mine() : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <SiteNav isSignedIn={!!session} isAdmin={isAdmin} />

      {session && !isAdmin && (
        <div className="px-6 pt-4">
          <p className="mx-auto max-w-3xl rounded-lg bg-white/10 px-4 py-3 text-center text-sm">
            {myRegistration
              ? REGISTRATION_STATUS_COPY[myRegistration.status]
              : "You haven't registered yet — click Register above to get started."}
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
          and sustainable tech. Form a team, pick a theme, and build
          something real.
        </p>
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
        <h2 className="text-3xl font-extrabold tracking-tight">
          Prize Pool
        </h2>
        <p className="text-5xl font-extrabold text-[hsl(280,100%,70%)]">
          ₹14,000
        </p>
        <p className="max-w-2xl text-white/80">
          Up for grabs across all themes at SIGNAL QUEST.
        </p>
      </section>

      <section id="timeline" className="px-6 py-16">
        <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight">
          Timeline
        </h2>
        {TIMELINE.length === 0 ? (
          <p className="text-center text-white/60">
            Timeline coming soon — check back for dates.
          </p>
        ) : (
          <div className="mx-auto flex max-w-2xl flex-col gap-4 border-l-2 border-white/20 pl-6">
            {TIMELINE.map((event, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-[1.9rem] top-1.5 h-3 w-3 rounded-full bg-[hsl(280,100%,70%)]" />
                <p className="text-sm font-semibold text-white/60">
                  {event.date}
                </p>
                <p className="text-lg">{event.label}</p>
              </div>
            ))}
          </div>
        )}
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
            className="rounded-full bg-white/10 px-8 py-3 font-semibold transition hover:bg-white/20"
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
  );
}
