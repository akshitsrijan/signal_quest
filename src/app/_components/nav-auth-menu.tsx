"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

export function NavAuthMenu({
  isSignedIn,
  isAdmin,
}: {
  isSignedIn: boolean;
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full bg-white/10 px-6 py-2 font-semibold transition hover:bg-white/20"
      >
        {isSignedIn ? "Account" : "Register / Sign In"}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-10 mt-2 flex w-48 flex-col overflow-hidden rounded-lg bg-[#15162c] shadow-lg ring-1 ring-white/10">
          {isSignedIn ? (
            <>
              {!isAdmin && (
                <Link
                  href="/register"
                  className="px-4 py-3 font-medium hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  Register
                </Link>
              )}
              {isAdmin && (
                <>
                  <Link
                    href="/admin/registrations"
                    className="px-4 py-3 font-medium hover:bg-white/10"
                    onClick={() => setOpen(false)}
                  >
                    Admin: Registrations
                  </Link>
                  <Link
                    href="/admin/admins"
                    className="px-4 py-3 font-medium hover:bg-white/10"
                    onClick={() => setOpen(false)}
                  >
                    Manage Admins
                  </Link>
                </>
              )}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  void signOut({ callbackUrl: "/" });
                }}
                className="px-4 py-3 text-left font-medium hover:bg-white/10"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/api/auth/signin?callbackUrl=%2Fregister"
                className="px-4 py-3 font-medium hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Register
              </Link>
              <Link
                href="/api/auth/signin?callbackUrl=%2Fregister"
                className="px-4 py-3 font-medium hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
