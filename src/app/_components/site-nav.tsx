"use client";

import Image from "next/image";
import { useState } from "react";

import { NavAuthMenu } from "~/app/_components/nav-auth-menu";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#themes", label: "Themes" },
  { href: "#event-date", label: "Event Date" },
  { href: "#registration-deadline", label: "Registration Deadline" },
  { href: "#venue", label: "Venue" },
  { href: "#timeline", label: "Timeline" },
  { href: "#announcements", label: "Announcements" },
  { href: "#join-us", label: "Join Us" },
  { href: "#contact-us", label: "Contact Us" },
];

export function SiteNav({
  isSignedIn,
  isAdmin,
}: {
  isSignedIn: boolean;
  isAdmin: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-20 border-b border-white/10 bg-[#3a1076] px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Full page reload on purpose — clicking the logo should refresh the site. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/">
          <Image
            src="/logo_preview.png"
            alt="SIGNAL QUEST"
            width={800}
            height={800}
            quality={100}
            className="h-16 w-auto"
            priority
          />
        </a>

        <div className="hidden items-center gap-6 md:flex">
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 font-medium hover:text-white/70"
            >
              Sections
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="transition group-hover:rotate-180"
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="invisible absolute left-0 top-full z-10 flex w-56 -translate-y-1 flex-col overflow-hidden rounded-lg bg-[#15162c] opacity-0 shadow-lg ring-1 ring-white/10 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 font-medium hover:bg-white/10"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <NavAuthMenu isSignedIn={isSignedIn} isAdmin={isAdmin} />
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="rounded-lg bg-white/10 p-2 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {mobileOpen ? (
              <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="mt-4 flex flex-col gap-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="font-medium hover:text-white/70"
            >
              {link.label}
            </a>
          ))}
          <NavAuthMenu isSignedIn={isSignedIn} isAdmin={isAdmin} />
        </div>
      )}
    </nav>
  );
}
