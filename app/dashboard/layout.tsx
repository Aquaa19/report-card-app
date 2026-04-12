// File: app/dashboard/layout.tsx
import React from 'react';
import TopNavBar from '@/components/layout/TopNavBar';
import SideNavBar from '@/components/layout/SideNavBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* TopNavBar is the first flex item */}
      <TopNavBar />

      <div className="flex flex-1 overflow-hidden">
        {/* SideNavBar is fixed to the left (w-64) */}
        <SideNavBar />

        {/* Main content area. 
            Added 'lg:ml-64' so it shifts to the right by exactly the width of the sidebar 
            only on large screens where the sidebar is visible.
        */}
        <main className="flex-1 overflow-y-auto lg:ml-64">
          <div className="mx-auto max-w-7xl min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}