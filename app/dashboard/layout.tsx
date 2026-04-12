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
    // REMOVED 'bg-background' from this div. 
    // Now it is completely transparent, allowing the body's glowing gradients to show!
    <div className="min-h-screen flex flex-col">
      {/* TopNavBar is the first flex item */}
      <TopNavBar />

      <div className="flex flex-1 overflow-hidden">
        {/* SideNavBar is fixed to the left (w-64) */}
        <SideNavBar />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto lg:ml-64">
          <div className="mx-auto max-w-7xl min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}