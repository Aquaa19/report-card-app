// file: components/CommandPalette.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { DashboardRow } from "@/lib/parse-responses";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DashboardRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/students");
        const resData = await response.json();
        if (resData.success) {
          const q = query.toLowerCase().trim();
          const matches = resData.data.filter((student: DashboardRow) =>
            student.studentName.toLowerCase().includes(q) ||
            student.batch.toLowerCase().includes(q)
          );
          setResults(matches);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce to prevent immediate fetch on every keystroke
    const timeoutId = setTimeout(fetchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleNavigate = (studentName: string) => {
    router.push(`/dashboard/${encodeURIComponent(studentName)}`);
    onClose();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "ST";
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/10 backdrop-blur-md dark:bg-[#0a0a1a]/80 z-50 transition-all duration-500 animate-in fade-in"
        onClick={onClose}
      />
      
      <div className="fixed top-[15vh] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white dark:bg-[#1a1a2b] border border-slate-200/50 dark:border-[#434656] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-2xl rounded-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-top-[10vh] fade-in duration-200 transition-colors">
        
        {/* Input Header */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-100 dark:border-[#28283b] bg-white dark:bg-[#1a1a2b] transition-colors duration-500">
          <span className="material-symbols-outlined text-blue-500 dark:text-[#8e90a2] transition-colors duration-500">search</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none text-slate-900 dark:text-white text-lg placeholder:text-slate-400 dark:placeholder:text-[#8e90a2] focus:outline-none transition-colors duration-500"
            placeholder="Search students by name or batch..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={onClose}
            className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-[#8e90a2] bg-slate-100 dark:bg-[#28283b] px-2 py-1 rounded transition-colors duration-500 hover:bg-slate-200 dark:hover:bg-[#434656]"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 bg-slate-50/50 dark:bg-[#1a1a2b] transition-colors duration-500">
          {isLoading ? (
            <div className="flex items-center justify-center p-8 text-slate-400 dark:text-[#8e90a2] transition-colors duration-500">
              <span className="material-symbols-outlined animate-spin text-[24px]">sync</span>
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 dark:text-[#8e90a2] tracking-widest px-3 py-2 uppercase transition-colors duration-500">
                Students Found
              </span>
              {results.map((student, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNavigate(student.studentName)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white dark:bg-transparent shadow-sm border border-slate-200/60 hover:border-blue-300 dark:border-transparent dark:hover:bg-[#28283b] transition-all duration-300 text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-[#121223] flex items-center justify-center text-blue-600 dark:text-[#c4c5d9] font-bold text-sm border border-blue-100 dark:border-[#28283b] group-hover:border-blue-400 dark:group-hover:border-[#00dbe7] transition-colors duration-300 scale-100 group-hover:scale-105">
                      {getInitials(student.studentName)}
                    </div>
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-semibold transition-colors duration-300">{student.studentName}</h4>
                      <p className="text-slate-500 dark:text-[#8e90a2] text-[11px] transition-colors duration-300 uppercase tracking-wider font-semibold mt-0.5">Batch {student.batch}</p>
                    </div>
                  </div>

                  <div className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors duration-300
                      ${student.status.toLowerCase().includes('excellent') || student.status.toLowerCase().includes('good') ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-[#007980]/20 dark:border-[#007980]/30 dark:text-[#00dbe7]' : 
                        student.status.toLowerCase().includes('warning') || student.status.toLowerCase().includes('poor') ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400' : 
                        'bg-amber-50 border-amber-200 text-amber-600 dark:bg-yellow-500/10 dark:border-yellow-500/30 dark:text-yellow-400'}`
                    }>
                      {student.status || 'Average'}
                  </div>
                </button>
              ))}
            </div>
          ) : query ? (
            <div className="flex flex-col items-center justify-center p-8 text-slate-500 dark:text-[#8e90a2] transition-colors duration-500">
              <span className="material-symbols-outlined text-[32px] mb-2 opacity-50">search_off</span>
              <p>No results found for "{query}"</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-slate-400 dark:text-[#434656] transition-colors duration-500">
              <p className="text-sm">Start typing to search...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
