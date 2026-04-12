"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function SideNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "OVERVIEW", icon: "dashboard", href: "/dashboard" },
    { name: "GRADE TRENDS", icon: "trending_up", href: "/dashboard/trends" },
    { name: "CLASS PERFORMANCE", icon: "groups", href: "/dashboard/class" },
    { name: "ATTENDANCE", icon: "calendar_today", href: "/dashboard/attendance" },
    { name: "SETTINGS", icon: "settings", href: "/dashboard/settings" },
  ];

  return (
    <aside className="w-72 h-screen bg-white dark:bg-[#0a0a1a] border-r border-slate-200 dark:border-white/5 flex flex-col p-6 sticky top-0 z-50 shrink-0 transition-colors duration-500">
      <div className="mb-12 px-2">
        <h1 className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white transition-colors duration-500">
          Luminescent <span className="text-cyan-600 dark:text-cyan-400 font-black">Scholar</span>
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm dark:bg-blue-600/20 dark:text-blue-400 dark:border-blue-500/20 dark:shadow-[0_0_15px_rgba(37,99,235,0.1)]" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-500 dark:hover:text-slate-200 dark:hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined !text-[24px] shrink-0">
                {item.icon}
              </span>
              <span className="text-[11px] font-bold tracking-widest whitespace-nowrap">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-slate-200 dark:border-white/5 transition-colors duration-500">
        <button className="w-full bg-linear-to-r from-blue-600 to-blue-500 text-white p-4 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-95">
          <span className="material-symbols-outlined text-xl shrink-0">description</span>
          <span className="text-xs font-black uppercase tracking-widest">Generate Report</span>
        </button>
      </div>
    </aside>
  );
}