// File: components/layout/SideNavBar.tsx
'use client';

import React from 'react';

/**
 * Note: To ensure the Canvas preview works correctly, we are using standard 
 * <a> tags and a mocked usePathname. In your local Next.js environment, 
 * you should revert these to 'next/link' and 'next/navigation'.
 */

// Mock implementation of usePathname for preview stability in the Canvas
const usePathname = () => '/dashboard';

export default function SideNavBar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: 'dashboard' },
    { name: 'Ask Gemini', href: '/dashboard/ask-gemini', icon: 'auto_awesome' },
    { name: 'Grade Trends', href: '/dashboard/trends', icon: 'trending_up' },
    { name: 'Class Performance', href: '/dashboard/performance', icon: 'groups' },
    { name: 'Attendance', href: '/dashboard/attendance', icon: 'calendar_today' },
    { name: 'Settings', href: '/dashboard/settings', icon: 'settings' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-80px)] glass-card bg-surface-container-lowest/40 backdrop-blur-2xl border-r border-t-0 border-outline-variant/10 fixed left-0 top-20 z-50">
      <nav className="flex-1 mt-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <a 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-4 px-6 py-4 transition-all duration-200 group ${
                isActive 
                  ? 'bg-gradient-to-r from-primary-container/20 to-transparent border-l-4 border-primary text-primary' 
                  : 'text-on-surface-variant hover:bg-white/5 hover:translate-x-1'
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>
                {item.icon}
              </span>
              <span className="font-body text-xs font-medium uppercase tracking-widest">
                {item.name}
              </span>
            </a>
          );
        })}
      </nav>

      {/* Bottom Action Button matching Stitch Design */}
      <div className="px-6 pb-8 mt-auto">
        <button className="w-full py-4 glowing-btn font-headline font-bold rounded-lg flex items-center justify-center gap-2 transition-all text-on-primary">
          <span className="material-symbols-outlined text-sm">description</span>
          Generate Report
        </button>
      </div>
    </aside>
  );
}