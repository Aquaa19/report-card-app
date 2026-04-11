"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const AVATAR_SRC =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBYD0b8UoxYroSEDYs20CoQ7QJVISAscfoH7QboSkUmJCWHjCXsd2x7T0gghoD58IM1j05Cm5czoGlO7jo9nU1lgJVTHoCxOrO9Bj20mMjiOvVLUCNwPn6CMevSgxzoNhPjnjTChyhm3-B-SRCbZ13yU11hffCRcek0aOjKgcgNxeGmqDfxpJZ5hpzs-Ecd5oMx17hdcp-E-K7o9NVN7NBNEzD27cCB93ASBjJH6S9aEEg-4cUhQJJ0uq6PJI4Sbg7Pou0tw-3YznQ";

const topLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analytics", href: "/dashboard/trends" },
  { label: "Students", href: "/dashboard#student-search" },
  { label: "Reports", href: "/dashboard/reports" },
] as const;

function useHash() {
  const [hash, setHash] = useState("");

  useEffect(() => {
    const read = () =>
      setHash(typeof window !== "undefined" ? window.location.hash : "");
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  return hash;
}

function isTopLinkActive(
  label: (typeof topLinks)[number]["label"],
  pathname: string,
  hash: string
): boolean {
  if (label === "Dashboard") {
    return pathname === "/dashboard" && hash !== "#student-search";
  }
  if (label === "Students") {
    return pathname === "/dashboard" && hash === "#student-search";
  }
  const item = topLinks.find((l) => l.label === label);
  const base = item?.href.split("#")[0] ?? "";
  return pathname === base || pathname.startsWith(`${base}/`);
}

export default function TopNav() {
  const pathname = usePathname();
  const hash = useHash();

  return (
    <nav
      className="tonal-transition fixed top-0 z-50 flex w-full max-w-full items-center justify-between bg-white/10 px-8 py-4 shadow-[0_0_15px_rgba(46,91,255,0.08)] backdrop-blur-lg dark:bg-black/20"
      aria-label="Top"
    >
      <div className="flex items-center gap-8">
        <Link
          href="/dashboard"
          className="font-headline text-xl font-bold tracking-tighter text-blue-500 dark:text-blue-400"
        >
          Luminescent Scholar
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {topLinks.map((item) => {
            const active = isTopLinkActive(item.label, pathname, hash);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`font-headline text-sm font-semibold tracking-tight transition-colors ${
                  active
                    ? "border-b-2 border-blue-400 pb-1 text-blue-400 dark:border-blue-300 dark:text-blue-300"
                    : "text-slate-400 hover:text-blue-400 dark:text-slate-500 dark:hover:text-blue-400"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="scale-98 rounded-full p-2 transition-all duration-300 hover:backdrop-blur-xl hover:bg-white/20 active:opacity-80 dark:hover:bg-black/30"
          aria-label="Theme"
        >
          <span className="material-symbols-outlined text-on-surface-variant">
            dark_mode
          </span>
        </button>
        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-outline-variant/30">
          <Image
            src={AVATAR_SRC}
            alt="User profile"
            fill
            className="object-cover"
            sizes="40px"
            priority
          />
        </div>
      </div>
    </nav>
  );
}
