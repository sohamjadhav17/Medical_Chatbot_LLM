"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Send, User, Bot, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string, sources?: any[]}[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setError(null);
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMsg, 
          conversation_id: conversationId,
          new_conversation: !conversationId 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      setConversationId(data.conversation_id);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.answer,
        sources: data.sources 
      }]);
      
    } catch (err: any) {
      setError(err.message);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error connecting to the medical engine." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen h-[100dvh] bg-gray-950 overflow-hidden font-sans">
      <Sidebar session={session} />
      
      <div className="flex-1 flex flex-col relative bg-[#0a0a0f] overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/10 rounded-full blur-[150px] pointer-events-none" />

        <header className="h-16 border-b border-gray-800/60 bg-gray-950/40 backdrop-blur-xl flex items-center justify-between px-6 z-10 shrink-0 shadow-sm">
          <h1 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Medical Consultation
          </h1>
          {conversationId && (
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800/80 shadow-inner">
              ID: {String(conversationId).substring(0,8)}
            </span>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin scrollbar-thumb-gray-800 z-10 w-full max-w-4xl mx-auto space-y-8">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-80 mt-[-5%] relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-600/10 rounded-full blur-[60px] pointer-events-none" />
              <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center shadow-2xl mb-2 border border-white/5 z-10">
                <Bot className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-200 z-10 tracking-tight">How can I assist you today?</h2>
              <p className="text-sm text-gray-400 max-w-sm leading-relaxed z-10">
                Query patient records, verify complex diagnoses, or explore medical literature securely.
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  key={i}
                  className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] rounded-3xl p-5 shadow-sm text-[15px] leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-blue-900/40 border border-blue-500/50 rounded-tr-sm' 
                      : 'bg-gray-900/80 backdrop-blur-md border border-gray-800 text-gray-200 rounded-tl-sm shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]'
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-gray-700/50 bg-gray-950/30 -mx-5 -mb-5 px-5 pb-5 rounded-b-[22px]">
                        <p className="text-[10px] text-gray-400 mb-2 font-semibold uppercase tracking-widest flex items-center gap-1.5">
                          <AlertCircle className="w-3 h-3" /> Sources Consulted
                        </p>
                        <ul className="space-y-1.5">
                          {msg.sources.map((s: any, idx: number) => (
                            <li key={idx} className="text-[11px] text-blue-300 flex items-start gap-2 bg-blue-500/5 hover:bg-blue-500/10 transition-colors p-1.5 rounded-md px-2">
                              <span className="shrink-0 pt-[2px] opacity-70">•</span>
                              <span className="truncate" title={s.metadata?.source || "Unknown source"}>
                                {s.metadata?.source ? s.metadata.source.split(/[\\/]/).pop() : "Medical Database Document"}
                                {s.metadata?.page ? ` (Page ${s.metadata.page})` : ""}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 mt-1 shadow-inner">
                      <User className="w-4 h-4 text-gray-300" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-tl-sm rounded-3xl p-5 flex items-center gap-3 text-gray-400 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]">
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <span className="text-sm font-medium animate-pulse tracking-wide">Analyzing clinical context...</span>
              </div>
            </motion.div>
          )}
          
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-500/5 border border-red-500/20 text-red-400 rounded-2xl text-sm mt-4 shadow-sm backdrop-blur-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </main>

        <div className="p-4 sm:p-6 bg-gradient-to-t from-gray-950 via-gray-950/90 to-transparent pt-12 z-10">
          <form onSubmit={sendMessage} className="max-w-4xl mx-auto relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Medical Engine..."
              className="w-full bg-gray-900/80 backdrop-blur-xl border border-gray-700/60 hover:border-gray-600 text-gray-100 rounded-2xl pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] placeholder-gray-500 text-[15px]"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 top-2 bottom-2 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500 text-white rounded-[14px] transition-all flex items-center justify-center w-11 h-11 shadow-sm disabled:cursor-not-allowed group-focus-within:shadow-blue-500/20 shadow-lg"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
          <div className="text-center mt-4 mb-2">
            <p className="text-[11px] text-gray-500 font-medium tracking-wide">MediBot is an AI assistant. Verify critical clinical information independently.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
