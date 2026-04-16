// File: app/dashboard/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";

const Link = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
  <a href={href} className={className}>{children}</a>
);

// Updated interface based on the exact Google Form schema and API types
interface FormResponse {
  timestamp: string;
  date: string;
  topicsCovered: string; // Required in form
  difficultTopic: string; // Required in form
  douts?: string; // Optional in form (spelled 'douts' in API parser)
  testScore: number | null; // Optional in form
  attendedTest: boolean; // Required in form
}

interface StudentHistory {
  studentName: string;
  batch: string;
  status: string;
  latestScore: number;
  scoreImprovement: number;
  avgStudyDays: number;
  avgStudyHours: number;
  weakTopic: string;
  history: FormResponse[]; 
}

export default function StudentReportPage() {
  const [decodedName, setDecodedName] = useState('');
  const [displayId, setDisplayId] = useState('');

  const [data, setData] = useState<StudentHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const rawId = window.location.pathname.split('/').pop() || '';
      setDisplayId(rawId); 
      
      try {
        setDecodedName(atob(decodeURIComponent(rawId)));
      } catch (e) {
        setDecodedName(decodeURIComponent(rawId));
      }
    }
  }, []);

  useEffect(() => {
    async function fetchStudentDetails() {
      if (!decodedName) return; 
      
      try {
        setLoading(true);
        const res = await fetch(`/api/student-history?name=${encodeURIComponent(decodedName)}`);
        const json = await res.json();
        
        if (json.success && json.data.length > 0) {
          setData(json.data[0]);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchStudentDetails();
  }, [decodedName]);

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      const res = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: decodedName })
      });
      const json = await res.json();
      
      if (json.success) {
        alert("Backend Success! JSON payload ready for Arko's PDF renderer.\nCheck console for data.");
        console.log("PDF Export Data:", json.data);
      } else {
        alert("Failed to generate report: " + json.message);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while generating the report.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-bold tracking-widest animate-pulse uppercase">Analyzing Data...</p>
    </div>
  );

  if (error || !data) return (
    <div className="p-20 text-center space-y-6 pt-28">
      <span className="material-symbols-outlined text-6xl text-red-500/50">person_off</span>
      <h2 className="text-2xl font-bold text-white">Student Record Not Found</h2>
      <Link href="/dashboard" className="text-cyan-400 underline block font-bold">Return to Search</Link>
    </div>
  );

  return (
    <div className="pt-24 pb-8 px-8 md:pt-28 md:pb-12 md:px-12 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-all group">
          <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Exit to Dashboard</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 tracking-widest uppercase hidden md:block">
            Ref ID: {displayId.slice(0, 8).toUpperCase()}
          </div>
          <button 
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-2 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-widest rounded-full transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <span className="material-symbols-outlined animate-spin text-sm">sync</span>
            ) : (
              <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
            )}
            {isGenerating ? "Exporting..." : "Generate Report"}
          </button>
        </div>
      </div>

      <section className="bg-slate-900/40 backdrop-blur-2xl p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl flex flex-col md:flex-row items-center gap-10">
        <div className="relative shrink-0">
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-white text-5xl font-black shadow-[0_0_40px_rgba(37,99,235,0.3)]">
            {data.studentName.charAt(0)}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-[#0a0a1a] shadow-lg"></div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <h1 className="text-5xl font-black text-white tracking-tighter">{data.studentName}</h1>
          <p className="text-xl text-slate-400 font-medium">{data.batch || "Unassigned Batch"}</p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
          <span className="px-6 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-black tracking-widest uppercase">
            {data.status || "Unknown"}
          </span>
          <p className="text-slate-500 text-sm font-medium italic">
            Learning Focus: {data.weakTopic?.trim() ? data.weakTopic : "None"}
          </p>
        </div>
      </section>

      {/* Stats Grid with Null/NaN Fallbacks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Performance Score", value: `${data.latestScore ?? 0}%`, icon: "insights", color: "text-white" },
          { label: "Growth Index", value: `${(data.scoreImprovement ?? 0) > 0 ? '+' : ''}${data.scoreImprovement ?? 0}%`, icon: "trending_up", color: (data.scoreImprovement ?? 0) >= 0 ? "text-green-400" : "text-red-400" },
          { label: "Dedication (Days)", value: `${data.avgStudyDays ?? 0}d/wk`, icon: "event_available", color: "text-white" },
          { label: "Daily Focus", value: `${data.avgStudyHours ?? 0}h`, icon: "timer", color: "text-white" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 backdrop-blur-sm border border-white/5 p-8 rounded-3xl hover:bg-white/5 transition-all">
            <span className="material-symbols-outlined text-slate-500 mb-6">{stat.icon}</span>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
            <p className={`text-4xl font-black mt-2 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="space-y-6">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
          <span className="w-8 h-px bg-slate-800"></span>
          Academic History Log
        </h3>
        
        <div className="bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Module & Insights</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Score</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.history && data.history.length > 0 ? (
                  data.history.map((record, index) => {
                    
                    // 1. Strict Validation mapping Form schema
                    const cleanTopic = record.topicsCovered?.trim() ? record.topicsCovered.trim() : "General Study";
                    const cleanDifficult = record.difficultTopic?.trim() ? record.difficultTopic.trim() : "None";
                    const cleanDoubt = record.douts?.trim(); // Purely optional field
                    
                    // 2. Exception Handling for Attendance vs Missing Scores
                    let weekStatus = "Average";
                    let dotColor = "bg-cyan-500";
                    let displayScore: React.ReactNode = <span className="text-sm font-medium text-slate-600">—</span>;
                    
                    if (record.attendedTest) {
                      // Claimed "Yes" to attending test
                      if (record.testScore !== null && record.testScore !== undefined && !isNaN(record.testScore)) {
                        displayScore = <span className="text-2xl font-black text-cyan-400">{record.testScore}%</span>;
                        if (record.testScore >= 85) { weekStatus = "Excellent"; dotColor = "bg-green-400"; }
                        else if (record.testScore >= 70) { weekStatus = "Good"; dotColor = "bg-blue-400"; }
                        else if (record.testScore < 50) { weekStatus = "Needs Attention"; dotColor = "bg-red-400"; }
                      } else {
                        // "Yes" to test, but left the optional Score field completely blank
                        weekStatus = "Score Pending";
                        dotColor = "bg-yellow-400";
                        displayScore = <span className="text-sm font-medium text-yellow-500/70 italic">Pending</span>;
                      }
                    } else {
                      // Explicitly claimed "No" to attending the test
                      weekStatus = "No Test";
                      dotColor = "bg-slate-500";
                    }

                    return (
                      <tr key={index} className="group hover:bg-white/5 transition-colors">
                        <td className="px-10 py-8 text-sm font-medium text-slate-400 whitespace-nowrap align-top">
                          {record.date || record.timestamp?.split(' ')[0] || "Unknown Date"}
                        </td>
                        <td className="px-10 py-8 align-top">
                          <p className="text-white font-bold">{cleanTopic}</p>
                          
                          <div className="mt-2 space-y-1">
                            {/* Always render difficult topic since it's required */}
                            <p className="text-xs text-slate-400">
                              <span className="text-slate-500">Struggled with:</span> {cleanDifficult}
                            </p>
                            
                            {/* Conditionally render Doubts only if they filled out the optional field */}
                            {cleanDoubt && (
                              <p className="text-xs text-amber-500/80 italic">
                                <span className="text-slate-500 not-italic">Doubts:</span> {cleanDoubt}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-10 py-8 text-center align-top">
                          {displayScore}
                        </td>
                        <td className="px-10 py-8 align-top">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${dotColor} animate-pulse`}></span>
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">{weekStatus}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="px-10 py-8 text-center text-slate-500 italic">No historical data found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
}