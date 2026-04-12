// components/TopBar.tsx
"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import CommandPalette from "@/components/CommandPalette";

export default function TopBar() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);
  
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    // Standard Tailwind system: toggling the generic 'dark' class on root element
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for CMD+K (Mac) or CTRL+K (Windows)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault(); // Prevent default browser search behavior
        setIsCommandOpen(true);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="h-20 w-full bg-white/80 dark:bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none sticky top-0 z-40 flex items-center justify-between px-8 md:px-12 shrink-0 transition-colors duration-500">
        
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
          <span className="material-symbols-outlined text-lg">home</span>
          {paths.map((path, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className={index === paths.length - 1 ? "text-blue-600 dark:text-cyan-400" : "text-slate-400"}>
                {decodeURIComponent(path)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsCommandOpen(true)}
            className="hidden md:flex items-center gap-3 px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white transition-all cursor-pointer shadow-sm hover:shadow dark:shadow-none"
          >
            <span className="material-symbols-outlined text-sm text-slate-400 dark:text-slate-500">search</span>
            <span className="text-[10px] font-bold tracking-widest">QUICK FIND</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-transparent px-2 py-0.5 rounded text-[9px] font-black tracking-widest text-slate-600 dark:text-slate-500">
              <span>CTRL</span>
              <span>K</span>
            </div>
          </button>

          <button 
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:rotate-12 transition-all duration-300"
          >
            <span className="material-symbols-outlined">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>

          <div className="w-px h-8 bg-slate-200 dark:bg-white/10 transition-colors duration-500"></div>

          <div className="flex items-center gap-4 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-slate-900 dark:text-white tracking-widest uppercase transition-colors duration-500">Samim Ali</p>
              <p className="text-[9px] font-bold text-cyan-600 dark:text-cyan-400 tracking-[0.2em] uppercase transition-colors duration-500">Lead Educator</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-white font-black shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              SA
            </div>
          </div>
        </div>
      </header>

      <CommandPalette 
        isOpen={isCommandOpen} 
        onClose={() => setIsCommandOpen(false)} 
      />
    </>
  );
}