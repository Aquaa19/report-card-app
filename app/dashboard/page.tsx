// File: app/dashboard/page.tsx
"use client";

import { useState } from "react";
import type { DashboardRow } from "@/lib/types";

const Link = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
  <a href={href} className={className}>{children}</a>
);

// Unified initials helper
function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]!.charAt(0)}${parts[parts.length - 1]!.charAt(0)}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "ST";
}

export default function DashboardPage() {
  // Unified State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DashboardRow[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Unified Search Handler
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    
    if (!q) {
      setError("Please enter a student name or ID.");
      setSearchResults(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearchResults(null);

    try {
      const res = await fetch(
        `/api/student-history?name=${encodeURIComponent(q)}`,
        { cache: "no-store" }
      );
      const json = await res.json();

      if (!res.ok) {
        setError(json.message ?? "Search failed.");
        setSearchResults([]);
        return;
      }

      setSearchResults(json.data ?? []);
    } catch (err) {
      setError("Connection error. Please try again.");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const firstResult = searchResults && searchResults.length > 0 ? searchResults[0] : null;

  // Samim's insights data adapted to your Stitch theme colors
  const insights = [
    { icon: 'notifications_active', title: 'Alerts', desc: 'Generated 24 progress alerts this week across all batches.', color: 'text-primary' },
    { icon: 'trending_up', title: 'Performance', desc: 'Average grade index increased by 4.2% since mid-term.', color: 'text-tertiary' },
    { icon: 'inventory_2', title: 'Reports Ready', desc: 'All Grade 12-A finals are compiled and ready for review.', color: 'text-secondary' }
  ];

  return (
    <main className="pt-24 pb-20 px-6 flex flex-col items-center min-h-[calc(100vh-80px)] text-center animate-in fade-in duration-700">
      {/* Greeting Section */}
      <header className="mb-12 space-y-3">
        <h1 className="text-5xl md:text-6xl font-bold font-headline tracking-tight text-on-surface">
          Welcome back,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">
            Teacher 👋
          </span>
        </h1>
        <p className="text-lg text-on-surface-variant font-medium">
          Search a student to view their performance report
        </p>
      </header>

      {/* Search Card Container */}
      <div className="w-full max-w-3xl relative">
        <div className="absolute -inset-4 bg-primary-container/20 blur-3xl rounded-full opacity-50 -z-10" />
        
        <form 
          className="glass-card p-8 md:p-12 rounded-lg border border-outline-variant/15 shadow-2xl flex flex-col md:flex-row gap-4 items-stretch md:items-center"
          onSubmit={handleSearch}
        >
          <div className="relative flex-1 group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-tertiary transition-colors">
              search
            </span>
            <input 
              className="w-full pl-12 pr-4 py-5 bg-surface-container-highest/40 border border-outline-variant/15 rounded-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-tertiary/20 focus:border-tertiary transition-all font-body text-lg" 
              placeholder="Enter Student Name or ID" 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className="px-10 py-5 glowing-btn text-on-primary font-headline font-bold rounded-full transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading ? <span className="material-symbols-outlined animate-spin">sync</span> : null}
            {isLoading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-error text-sm font-medium animate-pulse">
            {error}
          </p>
        )}
      </div>

      {/* Result Preview Section - Hidden by default until searchResults is populated */}
      {searchResults !== null && (
        <div className="mt-16 w-full max-w-2xl animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
            <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest font-label">
              Search Result
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
          </div>

          {/* Individual Student Preview Card */}
          {firstResult && (
            <Link href={`/dashboard/${btoa(firstResult.studentName)}`} className="block">
              <div className="bg-surface-container-low glass-card p-6 rounded-lg border border-outline-variant/10 flex items-center justify-between group hover:border-primary/30 transition-all cursor-pointer">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-surface-container-high to-surface-container-highest flex items-center justify-center border border-outline-variant/20 shadow-inner">
                    <span className="text-xl font-bold text-primary font-headline">
                      {getInitials(firstResult.studentName)}
                    </span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-on-surface font-headline">
                      {firstResult.studentName}
                    </h3>
                    <p className="text-on-surface-variant text-sm font-medium">
                      Batch: {firstResult.batch}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 mt-4 sm:mt-0">
                  <span className="px-4 py-1.5 rounded-full bg-tertiary-container/20 text-tertiary border border-tertiary/20 text-xs font-bold font-label flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                    {firstResult.status || "Average"}
                  </span>
                  <div className="flex gap-1 text-on-surface-variant group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-lg">visibility</span>
                    <span className="text-xs font-bold font-label uppercase tracking-tighter">View Full Report</span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Empty state if search returns nothing */}
          {searchResults.length === 0 && !isLoading && (
            <div className="bg-surface-container-low glass-card p-8 rounded-lg border border-outline-variant/10 text-center">
               <p className="text-on-surface-variant text-sm italic">No students found matching &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </div>
      )}

      {/* Quick Stats Bento */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {insights.map((item, idx) => (
          <div key={idx} className="bg-surface-container-low glass-card p-6 rounded-lg border border-outline-variant/10 text-left hover:border-primary/20 transition-all group">
            <div className={`w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mb-4 border border-outline-variant/10 group-hover:scale-110 transition-transform ${item.color}`}>
              <span className="material-symbols-outlined">{item.icon}</span>
            </div>
            <h4 className="text-on-surface font-semibold mb-1 font-headline">{item.title}</h4>
            <p className="text-on-surface-variant text-sm leading-relaxed font-body">{item.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}