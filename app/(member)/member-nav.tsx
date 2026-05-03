"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";

type OpenMenu = "archive" | "profile" | null;

export default function MemberNav() {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setOpenMenu(null);
  }, [pathname, searchParams]);

  return (
    <nav className="px-6 py-4">
      <div className="mx-auto flex max-w-2xl items-start justify-end gap-3">
        {/* Archive */}
        <div
          className="relative pb-4"
          onMouseLeave={() => setOpenMenu(null)}
        >
          <button
            type="button"
            onClick={() =>
              setOpenMenu(openMenu === "archive" ? null : "archive")
            }
            className="cursor-pointer px-3 text-center text-sm font-medium text-zinc-300 transition hover:text-white"
          >
            Archive
          </button>

          {openMenu === "archive" ? (
            <div className="absolute right-0 top-8 z-30 min-w-[200px] rounded-[1.75rem] border border-zinc-800/80 bg-zinc-950/95 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
              <Link
                href="/journey"
                className="block rounded-xl px-4 py-3 text-center text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
              >
                Return to the present
              </Link>

              <Link
                href="/journey/archive?view=room"
                className="mt-1 block rounded-xl px-4 py-3 text-center text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
              >

By room
              </Link>

              <Link
                href="/journey/archive?view=day"
                className="mt-1 block rounded-xl px-4 py-3 text-center text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
              >
                By day
              </Link>

              <Link
                href="/journey/archive?view=search"
                className="mt-1 block rounded-xl px-4 py-3 text-center text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
              >
                Search
              </Link>
            </div>
          ) : null}
        </div>

        {/* Profile */}
        <div
          className="relative pb-4"
          onMouseLeave={() => setOpenMenu(null)}
        >
          <button
            type="button"
            onClick={() =>
              setOpenMenu(openMenu === "profile" ? null : "profile")
            }
            className="cursor-pointer px-3 text-center text-sm font-medium text-zinc-300 transition hover:text-white"
          >
            Profile
          </button>

          {openMenu === "profile" ? (
            <div className="absolute right-0 top-8 z-30 min-w-[200px] rounded-[1.75rem] border border-zinc-800/80 bg-zinc-950/95 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
              <Link
                href="/profile"
                className="block rounded-xl px-4 py-3 text-center text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
              >
                Profile
              </Link>

              <div className="mt-2 border-t border-zinc-800 pt-2">
                <SignOutButton>
                  <button
                    type="button"
                    className="block w-full rounded-xl px-4 py-3 text-center text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
                  >
                    Sign out
                  </button>
                </SignOutButton>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}