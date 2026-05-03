"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";

export default function MemberNav() {
  const detailsRefs = useRef<HTMLDetailsElement[]>([]);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    detailsRefs.current.forEach((el) => {
  if (el) el.open = false;
});
  }, [pathname, searchParams]);

  return (
    <nav className="px-6 py-4">
      <div className="mx-auto flex max-w-2xl items-center justify-end gap-4 relative">
        <details ref={(el) => {
  if (el) detailsRefs.current[0] = el;
}} className="relative mr-24">
          <summary className="w-[200px] cursor-pointer list-none text-center text-sm font-medium text-zinc-300 transition hover:text-white">
            Archive
          </summary>

          <div className="absolute right-0 top-full z-30 mt-2 min-w-[200px] rounded-[1.75rem] border border-zinc-800/80 bg-zinc-950/95 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
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
        </details>
<details ref={(el) => {
  if (el) detailsRefs.current[1] = el;
}} className="relative">
  <summary className="w-[200px] cursor-pointer list-none text-center text-sm font-medium text-zinc-300 transition hover:text-white">
    Profile
  </summary>

  <div className="absolute right-0 top-full z-30 mt-2 min-w-[200px] rounded-[1.75rem] border border-zinc-800/80 bg-zinc-950/95 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
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
</details>
      </div>
    </nav>
  );
}