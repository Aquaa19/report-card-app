"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { DashboardRow } from "@/lib/parse-responses";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DashboardRow[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const response = await fetch("/api/students");
      const resData = await response.json();
      
      if (resData.success) {
        const query = searchQuery.toLowerCase().trim();
        const matches = resData.data.filter((student: DashboardRow) =>
          student.studentName.toLowerCase().includes(query)
        );
        setSearchResults(matches);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Failed to search students", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "ST";
  };

  const insights = [
    {
      icon: "notifications_active",
      label: "Alerts",
      iconColor: "text-blue-600 dark:text-[#b8c3ff]",
      value: "24 Progress Alerts",
      description: "Generated this week across all batches.",
    },
    {
      icon: "trending_up",
      label: "Performance",
      iconColor: "text-[#007980] dark:text-[#00dbe7]",
      value: "+4.2% Grade Index",
      description: "Average grade index increased since the mid-term.",
    },
    {
      icon: "inventory_2",
      label: "Reports Ready",
      iconColor: "text-indigo-600 dark:text-[#d8b9ff]",
      value: "Class 10 Finals",
      description: "All reports are compiled and ready for review.",
    },
  ];

  return (
    <div className="w-full min-h-full p-6 md:p-12 flex flex-col transition-colors duration-500">
      <div className="w-full max-w-4xl mx-auto flex flex-col flex-1 pb-12">
        {/* ── HERO ─────────────────────────────────────────── */}
        <div className="text-center space-y-3 mb-10 w-full mt-4">
          <h1 className="text-[40px] md:text-[54px] font-bold text-slate-900 dark:text-white tracking-tight leading-tight transition-colors duration-500">
            Welcome back,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-400 dark:to-blue-500 transition-colors duration-500">
              Teacher
            </span>{" "}
            <span className="inline-block">👋</span>
          </h1>
          <p className="text-slate-500 dark:text-[#c4c5d9] text-base md:text-[17px] transition-colors duration-500">
            Search a student to view their performance report
          </p>
        </div>

        {/* ── SEARCH BAR CONTAINER ────────────────────────── */}
        <div className="w-full bg-white dark:bg-[#1a1a2b] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-200 dark:border-transparent rounded-[24px] p-6 md:p-10 mb-12 flex flex-col transition-all duration-500">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#8e90a2] pointer-events-none text-[22px] transition-colors duration-500">
                search
              </span>
              <input
                id="student-search-input"
                type="text"
                placeholder="Enter Student Name"
                className="w-full bg-slate-50 dark:bg-[#28283b] border border-slate-200 dark:border-transparent rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8e90a2] focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#b8c3ff]/50 transition-all duration-500 font-medium shadow-inner dark:shadow-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
              />
            </div>
            <button
              id="student-search-btn"
              type="submit"
              disabled={isLoading}
              className="px-10 py-4 rounded-xl font-semibold text-[15px] transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100 text-white shadow-lg shadow-blue-500/30 dark:shadow-[0_4px_20px_rgba(46,91,255,0.25)] bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-[#7b8bff] dark:to-[#2e5bff]"
            >
              {isLoading ? (
                  <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
              ) : null}
              {isLoading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>

        {/* ── SEARCH RESULT DIVIDER ───────────────────────── */}
        {(hasSearched || searchResults !== null) && (
          <>
            <div className="w-full flex items-center justify-center mb-8 relative animate-in fade-in duration-500">
              <div className="absolute left-0 right-0 h-[1px] bg-slate-200 dark:bg-[#28283b] top-1/2 -translate-y-1/2 z-0 transition-colors duration-500"></div>
              <span className="bg-[#f8fafc] dark:bg-[#121223] px-4 text-slate-400 dark:text-[#8e90a2] text-xs font-bold tracking-widest uppercase z-10 transition-colors duration-500">
                Search Result
              </span>
            </div>

            {/* ── SEARCH RESULT CARDS ──────────────────────────── */}
            <div className="mb-16 space-y-4 animate-in fade-in duration-500">
              {searchResults && searchResults.length > 0 ? (
                searchResults.map((student, idx) => (
                  <div key={idx} className="w-full bg-white dark:bg-[#1a1a2b] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none rounded-[20px] p-5 flex flex-col sm:flex-row items-center justify-between border border-slate-200 dark:border-[#28283b] hover:border-blue-200 dark:hover:border-[#434656] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
                    <div className="flex items-center gap-4">
                      <div className="w-[52px] h-[52px] rounded-full bg-blue-50 dark:bg-[#28283b] flex items-center justify-center text-blue-600 dark:text-[#c4c5d9] font-bold text-lg transition-colors duration-500 border border-blue-100 dark:border-none">
                        {getInitials(student.studentName)}
                      </div>
                      <div>
                        <h3 className="text-slate-900 dark:text-white font-semibold text-lg transition-colors duration-500">{student.studentName}</h3>
                        <p className="text-slate-500 dark:text-[#8e90a2] text-sm transition-colors duration-500">Batch: {student.batch}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 mt-4 sm:mt-0">
                      <div className={`flex items-center gap-2 pb-0.5 pt-0.5 px-3 rounded-full border text-xs font-medium transition-colors duration-500
                        ${student.status.toLowerCase().includes('excellent') || student.status.toLowerCase().includes('good') ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-[#007980]/20 dark:border-[#007980]/30 dark:text-[#00dbe7]' : 
                          student.status.toLowerCase().includes('warning') || student.status.toLowerCase().includes('poor') ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400' : 
                          'bg-amber-50 border-amber-200 text-amber-600 dark:bg-yellow-500/10 dark:border-yellow-500/30 dark:text-yellow-400'}`
                      }>
                        <span className={`w-1.5 h-1.5 rounded-full ${student.status.toLowerCase().includes('excellent') || student.status.toLowerCase().includes('good') ? 'bg-emerald-500 dark:bg-[#00dbe7]' : student.status.toLowerCase().includes('warning') || student.status.toLowerCase().includes('poor') ? 'bg-red-500 dark:bg-red-400' : 'bg-amber-500 dark:bg-yellow-400'}`}></span>
                        {student.status || 'Average'}
                      </div>
                      <Link href={`/dashboard/${encodeURIComponent(student.studentName)}`} className="flex items-center gap-1.5 text-slate-500 dark:text-[#c4c5d9] hover:text-blue-600 dark:hover:text-white transition-colors duration-300 text-xs font-semibold tracking-wide">
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        VIEW FULL REPORT
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full bg-white dark:bg-[#1a1a2b] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none rounded-[20px] p-8 text-center border border-slate-200 dark:border-[#28283b] transition-all duration-500">
                  <p className="text-slate-500 dark:text-[#8e90a2] transition-colors duration-500">No students found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── INSIGHT CARDS ───────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {insights.map((card) => (
            <div
              key={card.label}
              className="bg-white dark:bg-[#1a1a2b] shadow-sm hover:shadow-md dark:shadow-none rounded-[20px] p-6 flex flex-col gap-3 border border-slate-200 dark:border-transparent hover:border-slate-300 dark:hover:border-[#28283b] transition-all duration-500"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-1 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-transparent transition-colors duration-500"
              >
                <span className={`material-symbols-outlined text-[20px] ${card.iconColor} drop-shadow-sm transition-colors duration-500`}>
                  {card.icon}
                </span>
              </div>
              <h4 className="text-slate-900 dark:text-white font-bold text-[15px] transition-colors duration-500">{card.label}</h4>
              <p className="text-slate-500 dark:text-[#8e90a2] text-[13px] leading-relaxed transition-colors duration-500">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}