// File: app/dashboard/ask-gemini/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";

// We define a strict type for our chat messages
interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string | React.ReactNode;
}

export default function AskGeminiPage() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Initialize with a clean welcome message instead of mock data
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      role: "model",
      content: "Hello! I am Luminescent Scholar's Academic AI. You can ask me to analyze student performance, identify class trends, or summarize recent test scores. How can I help you today?"
    }
  ]);

  // 2. Production-ready send handler communicating with our API
  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const userText = input.trim();
    if (!userText || isLoading) return;
    
    // Add user message to state and clear input
    const newMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: userText };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Send the prompt to our backend API route
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "model",
          content: data.reply
        }]);
      } else {
        throw new Error(data.message || "Failed to fetch AI response");
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "model",
        content: "⚠️ I encountered an error while processing your request. Please ensure the Gemini API is configured correctly."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full relative min-h-[90vh]">
      
      {/* Title Header area */}
      <div className="pt-24 px-8 md:px-12 max-w-5xl mx-auto w-full shrink-0 animate-in fade-in slide-in-from-top-4">
        <h1 className="text-3xl font-bold text-cyan-400 flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          Ask Gemini
        </h1>
        <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Academic AI Engine</p>
      </div>

      {/* Main Chat Area */}
      <section className="flex-1 overflow-y-auto pt-10 pb-40 px-8 md:px-12 flex flex-col gap-8 max-w-5xl mx-auto w-full no-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            
            {msg.role === 'user' ? (
               // User Message Bubble
               <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl rounded-tr-none px-6 py-4 max-w-[85%] shadow-xl">
                 <p className="text-white leading-relaxed font-medium">{msg.content}</p>
               </div>
            ) : (
               // Gemini Message Bubble
               <div className="flex gap-4 max-w-[90%] md:max-w-[80%]">
                 <div className="flex-shrink-0 mt-1">
                   <div className="w-10 h-10 rounded-full bg-slate-800 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                     <span className="material-symbols-outlined text-cyan-400 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                   </div>
                 </div>
                 <div className="bg-cyan-950/20 backdrop-blur-xl border border-cyan-500/10 rounded-3xl rounded-tl-none px-6 py-6 md:px-8 md:py-8 shadow-[0_0_30px_rgba(34,211,238,0.05)] w-full overflow-hidden text-slate-300 leading-relaxed">
                    {msg.content}
                 </div>
               </div>
            )}
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex gap-4 max-w-[90%] md:max-w-[80%]">
                 <div className="flex-shrink-0 mt-1">
                   <div className="w-10 h-10 rounded-full bg-slate-800 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.2)] animate-pulse">
                     <span className="material-symbols-outlined text-cyan-400 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                   </div>
                 </div>
                 <div className="bg-cyan-950/20 backdrop-blur-xl border border-cyan-500/10 rounded-3xl rounded-tl-none px-6 py-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                 </div>
               </div>
          </div>
        )}

        {/* Invisible div for auto-scrolling */}
        <div ref={messagesEndRef} />
      </section>

      {/* Fixed Bottom Input Footer */}
      <footer className="fixed bottom-0 right-0 left-0 lg:left-64 p-6 md:p-8 bg-gradient-to-t from-[#020617] via-[#020617]/90 to-transparent z-40">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="relative group">
            {/* Glowing background behind input */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-cyan-400/10 to-blue-500/20 rounded-3xl blur-lg opacity-40 group-focus-within:opacity-100 transition duration-500"></div>
            
            <div className="relative flex items-center bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl px-4 py-2 shadow-2xl">
              <button type="button" className="p-2 text-slate-500 hover:text-cyan-400 transition-colors hidden sm:block">
                <span className="material-symbols-outlined">add_circle</span>
              </button>
              
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder:text-slate-500 text-sm py-4 px-4 font-medium disabled:opacity-50" 
                placeholder={isLoading ? "Gemini is thinking..." : "Ask Gemini for an insight..."} 
              />
              
              <div className="flex items-center gap-1 sm:gap-2">
                <button type="button" className="p-2 text-slate-500 hover:text-cyan-400 transition-colors hidden sm:block">
                  <span className="material-symbols-outlined">mic</span>
                </button>
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="ml-2 w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-600 text-white flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  <span className={`material-symbols-outlined ml-1 ${isLoading ? 'animate-pulse' : ''}`} style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                </button>
              </div>
            </div>
          </form>
          <p className="text-center mt-4 text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
            Powered by Academic AI Engine • Luminescent Scholar v2.4
          </p>
        </div>
      </footer>

    </div>
  );
}