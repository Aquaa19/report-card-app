// File: components/layout/TopNavBar.tsx
import React from 'react';

/**
 * Note: To ensure the Canvas preview works correctly, we are using standard 
 * <a> tags and a local ThemeToggle implementation. In your local Next.js 
 * environment, you can revert these to 'next/link' and your relative imports.
 */

// Simple local implementation of ThemeToggle for the Canvas preview environment
const ThemeToggle = () => (
  <button className="p-2 rounded-full hover:bg-white/10 transition-colors duration-300">
    <span className="material-symbols-outlined text-on-surface-variant">dark_mode</span>
  </button>
);

export default function TopNavBar() {
  return (
    <nav className="fixed top-0 w-full z-[60] h-20 px-8 flex justify-between items-center glass-card bg-surface/20 backdrop-blur-lg border-b border-outline-variant/15 shadow-[0_0_15px_rgba(46,91,255,0.08)] transition-all duration-300">
      <div className="flex items-center gap-8">
        {/* Using <a> instead of <Link> for Canvas preview stability */}
        <a href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center border border-primary/30 group-hover:shadow-glow-primary transition-all duration-300">
            <span className="material-symbols-outlined text-primary">
              school
            </span>
          </div>
          <span className="text-xl font-bold tracking-tighter text-primary font-headline">
            Luminescent <span className="text-on-surface">Scholar</span>
          </span>
        </a>
        
        {/* Desktop Navigation Links from Stitch Design */}
        <div className="hidden md:flex gap-6 items-center ml-4">
          <a href="/dashboard" className="text-sm font-semibold tracking-tight text-primary border-b-2 border-primary pb-1">
            Dashboard
          </a>
          <a href="/analytics" className="text-sm font-semibold tracking-tight text-on-surface-variant hover:text-primary transition-colors">
            Analytics
          </a>
          <a href="/students" className="text-sm font-semibold tracking-tight text-on-surface-variant hover:text-primary transition-colors">
            Students
          </a>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        {/* User Profile matching Stitch HTML */}
        <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/20">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-xs font-bold text-on-surface">Lead Admin</span>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">admin@luminescent.edu</span>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/30 bg-surface-container">
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-tertiary/50">
               <span className="material-symbols-outlined text-on-primary text-xl">person</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}