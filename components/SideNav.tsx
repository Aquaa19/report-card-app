"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LOGO_SRC =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDdWHxdRFdGPfdQ5Vf_bLaHJGRFMfFDq0HQKsgxGxeNaYGYHZFJKDBcnycxURWTJGpfCw_zzzTfNZvD4MFp7g2iII2ZykYINPAtlceKecsMfdqY-7yDRGbzG1p7LTNMpxSOONJdZ8eXsLO7GRVGMcH5TjYQ6HR2yi5N8fobu8ZTkz5Z4CpTfLuLdTEMvTEYGrldiEEDQ6BXCr36g3P4GxWXhblGk5Mk6J44GqJOYWaFnDQu7tdErcbgm1ytq5oQXkvhWyycnV4w10I";

const navItems = [
  { name: "Overview", icon: "dashboard", href: "/dashboard" },
  { name: "Grade Trends", icon: "trending_up", href: "/dashboard/trends" },
  { name: "Class Performance", icon: "groups", href: "/dashboard/class" },
  { name: "Attendance", icon: "calendar_today", href: "/dashboard/attendance" },
  { name: "Settings", icon: "settings", href: "/dashboard/settings" },
] as const;

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-outline-variant/10 bg-slate-900/50 py-6 shadow-2xl shadow-blue-900/20 backdrop-blur-2xl dark:bg-black/40 lg:flex">
      <div className="mb-10 px-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 p-px">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-slate-900">
              <Image
                src={LOGO_SRC}
                alt="Institution logo"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div>
            <h2 className="font-headline text-lg font-black leading-none text-white">
              Academic AI
            </h2>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-blue-400">
              Premium Analytics
            </p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col space-y-1" aria-label="Section">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href ||
                pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-6 py-4 transition-transform duration-200 ${
                isActive
                  ? "border-l-4 border-blue-500 bg-gradient-to-r from-blue-600/20 to-transparent text-blue-400"
                  : "text-slate-400 hover:translate-x-1 hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined" aria-hidden>
                {item.icon}
              </span>
              <span className="font-label text-xs font-medium uppercase tracking-widest">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-6">
        <button
          type="button"
          className="font-headline flex w-full items-center justify-center gap-2 rounded-stitch-lg bg-primary-container py-4 font-bold text-on-primary-container shadow-lg transition-all hover:brightness-110 active:scale-95"
        >
          <span className="material-symbols-outlined text-sm" aria-hidden>
            description
          </span>
          Generate Report
        </button>
      </div>
    </aside>
  );
}
