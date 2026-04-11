"use client";

import { useState } from "react";
import type { DashboardRow } from "@/lib/parse-responses";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]!.charAt(0)}${parts[parts.length - 1]!.charAt(0)}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "?";
}

function statusPill(status: string) {
  const s = status.toLowerCase();
  if (s.includes("excellent") || s.includes("good")) {
    return {
      label: status || "Excellent",
      className: "border border-tertiary/20 bg-tertiary-container/20 text-tertiary",
    };
  }
  return {
    label: status || "Status",
    className:
      "border border-outline-variant/20 bg-surface-container-high/40 text-on-surface-variant",
  };
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<DashboardRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runSearch() {
    const q = searchQuery.trim();
    if (!q) {
      setError("Enter a student name or ID.");
      setResults(null);
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch(
        `/api/student-history?name=${encodeURIComponent(q)}`,
        { cache: "no-store" }
      );
      const json = (await res.json()) as {
        success?: boolean;
        data?: DashboardRow[];
        message?: string;
      };

      if (!res.ok) {
        setError(json.message ?? "Search failed.");
        setResults([]);
        return;
      }

      setResults(json.data ?? []);
    } catch {
      setError("Could not reach the server. Try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  const showMockPreview = results === null;
  const first = results && results.length > 0 ? results[0]! : null;

  return (
    <main className="flex min-h-screen flex-col items-center px-6 pb-20 text-center">
      <header className="mb-12 space-y-3">
        <h1 className="font-headline text-5xl font-bold tracking-tight text-on-surface md:text-6xl">
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
            Teacher 👋
          </span>
        </h1>
        <p className="font-body text-lg font-medium text-on-surface-variant">
          Search a student to view their performance report
        </p>
      </header>

      <div id="student-search" className="relative w-full max-w-3xl scroll-mt-36">
        <div className="absolute -inset-4 -z-10 rounded-full bg-primary-container/20 opacity-50 blur-3xl" />
        <form
          className="glass-card flex flex-col items-stretch gap-4 rounded-stitch-lg border border-outline-variant/15 p-8 shadow-2xl md:flex-row md:items-center md:p-12"
          onSubmit={(e) => {
            e.preventDefault();
            void runSearch();
          }}
        >
          <div className="group relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-tertiary">
              search
            </span>
            <input
              type="text"
              placeholder="Enter Student ID"
              className="font-body w-full rounded-md border border-outline-variant/15 bg-surface-container-highest/40 py-5 pl-12 pr-4 text-lg text-on-surface placeholder:text-on-surface-variant/50 transition-all focus:border-tertiary focus:outline-none focus:ring-2 focus:ring-tertiary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Student search"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="font-headline rounded-full bg-gradient-to-br from-primary to-primary-container px-10 py-5 font-bold text-on-primary shadow-[0_0_20px_rgba(46,91,255,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(46,91,255,0.5)] active:scale-95 disabled:opacity-60"
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </form>

        {error ? (
          <p className="mt-4 text-sm text-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <div className="mt-16 w-full max-w-2xl">
        <div className="mb-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
          <span className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            Search Result
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        </div>

        {showMockPreview ? (
          <div className="bg-surface-container-low glass-card group flex cursor-pointer items-center justify-between rounded-stitch-lg border border-outline-variant/10 p-6 transition-all hover:border-primary/30">
            <div className="flex items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-outline-variant/20 bg-gradient-to-br from-surface-container-high to-surface-container-highest shadow-inner">
                <span className="font-headline text-xl font-bold text-primary">JD</span>
              </div>
              <div className="text-left">
                <h3 className="font-headline text-xl font-semibold text-on-surface">
                  Jane Doe
                </h3>
                <p className="font-body text-sm font-medium text-on-surface-variant">
                  Batch: Grade 12-A
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <span className="font-label flex items-center gap-2 rounded-full border border-tertiary/20 bg-tertiary-container/20 px-4 py-1.5 text-xs font-bold text-tertiary">
                <span className="h-2 w-2 animate-pulse rounded-full bg-tertiary" />
                Excellent
              </span>
              <div className="flex items-center gap-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-lg">visibility</span>
                <span className="font-label text-xs font-bold uppercase tracking-tighter">
                  View Full Report
                </span>
              </div>
            </div>
          </div>
        ) : null}

        {!showMockPreview && results && results.length === 0 && !loading ? (
          <p className="text-on-surface-variant text-sm">
            No students matched &ldquo;{searchQuery.trim()}&rdquo;.
          </p>
        ) : null}

        {!showMockPreview && first ? (
          <div className="bg-surface-container-low glass-card group flex cursor-pointer items-center justify-between rounded-stitch-lg border border-outline-variant/10 p-6 transition-all hover:border-primary/30">
            <div className="flex items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-outline-variant/20 bg-gradient-to-br from-surface-container-high to-surface-container-highest shadow-inner">
                <span className="font-headline text-xl font-bold text-primary">
                  {initials(first.studentName)}
                </span>
              </div>
              <div className="text-left">
                <h3 className="font-headline text-xl font-semibold text-on-surface">
                  {first.studentName}
                </h3>
                <p className="font-body text-sm font-medium text-on-surface-variant">
                  Batch: {first.batch}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              {(() => {
                const pill = statusPill(first.status);
                return (
                  <span
                    className={`font-label flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold ${pill.className}`}
                  >
                    <span className="h-2 w-2 animate-pulse rounded-full bg-tertiary" />
                    {pill.label}
                  </span>
                );
              })()}
              <div className="flex items-center gap-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-lg">visibility</span>
                <span className="font-label text-xs font-bold uppercase tracking-tighter">
                  View Full Report
                </span>
              </div>
            </div>
          </div>
        ) : null}

        {!showMockPreview && results && results.length > 1 ? (
          <ul className="mt-6 space-y-3 text-left">
            {results.slice(1).map((row) => (
              <li
                key={`${row.studentName}-${row.batch}`}
                className="bg-surface-container-low glass-card rounded-stitch-lg border border-outline-variant/10 p-4"
              >
                <span className="font-headline font-semibold text-on-surface">
                  {row.studentName}
                </span>
                <span className="ml-2 text-sm text-on-surface-variant">
                  {row.batch} · {row.status}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="mt-20 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
        <div className="bg-surface-container-low glass-card rounded-stitch-lg border border-outline-variant/10 p-6 text-left">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
          </div>
          <h4 className="mb-1 font-semibold text-on-surface">AI Insights</h4>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            Generated 24 progress alerts this morning across all batches.
          </p>
        </div>
        <div className="bg-surface-container-low glass-card rounded-stitch-lg border border-outline-variant/10 p-6 text-left">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-tertiary/10">
            <span className="material-symbols-outlined text-tertiary">trending_up</span>
          </div>
          <h4 className="mb-1 font-semibold text-on-surface">Performance</h4>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            Average grade index increased by 4.2% since the mid-term.
          </p>
        </div>
        <div className="bg-surface-container-low glass-card rounded-stitch-lg border border-outline-variant/10 p-6 text-left">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
            <span className="material-symbols-outlined text-secondary">history_edu</span>
          </div>
          <h4 className="mb-1 font-semibold text-on-surface">Reports Ready</h4>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            All Grade 12-A finals are now compiled and ready for review.
          </p>
        </div>
      </div>
    </main>
  );
}
