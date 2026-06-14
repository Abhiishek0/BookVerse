import React, { useState } from "react";
import { Sparkles, ArrowRight, Loader2, BookOpen, Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Book } from "../types";
import { mockBooks } from "../data/mockBooks";

interface AIRecommendWidgetProps {
  onSelectBook: (book: Book) => void;
}

export default function AIRecommendWidget({ onSelectBook }: AIRecommendWidgetProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    suggestedBookId: string;
    analysis: string;
    confidence: number;
    thoughtTrail?: string;
  } | null>(null);

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/ai-recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        throw new Error("API Route issues");
      }
    } catch (err) {
      console.error("AI recommend fetch error, using smart fallback", err);
      // Fallback matching
      const p = prompt.toLowerCase();
      let selectedId = "chambers-of-secrets";
      let analysis = "Based on your focus, the secret lore matching Julian's underground sanctuary in chambers of secrets matches perfectly.";
      
      if (p.includes("dragon") || p.includes("blood") || p.includes("history") || p.includes("war")) {
        selectedId = "fire-and-blood";
        analysis = "A historical chronicle detailing Westeros Targaryen dynasties fits your desire for sweeping wars and epic crowns.";
      } else if (p.includes("money") || p.includes("economics") || p.includes("society") || p.includes("politics")) {
        selectedId = "coailty-reit";
        analysis = "Challenge material frameworks with socioeconomic perspectives detailing faith, consensus, and ledger trades.";
      } else if (p.includes("philosophy") || p.includes("mind") || p.includes("memory") || p.includes("quiet") || p.includes("calm")) {
        selectedId = "the-fumber";
        analysis = "A tranquil exploration through cognitive memory landscapes and silent human regrets matches your query perfectly.";
      } else if (p.includes("short") || p.includes("minimal")) {
        selectedId = "kinille-goife";
        analysis = "Minimalist short story structures with pristine negative spaces matches your modern prose appetite.";
      } else if (p.includes("travel") || p.includes("spirit")) {
        selectedId = "the-slamon-road";
        analysis = "ocontemplative geographical journey diaries track outstanding mountain ridges perfectly.";
      }

      setResult({
        suggestedBookId: selectedId,
        analysis,
        confidence: 0.92,
        thoughtTrail: "Heuristic matching of keywords inside local catalog."
      });
    } finally {
      setLoading(false);
    }
  };

  const suggestedBook = result ? mockBooks.find((b) => b.id === result.suggestedBookId) : null;

  return (
    <div className="bg-[#1e1d1b] text-[#fbf9f4] p-8 rounded-3xl border border-[#ab9f8c]/20 relative overflow-hidden text-left my-8 shadow-2xl">
      {/* Decorative gold backdrop gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-[#9c7b41]/10 to-transparent rounded-full pointer-events-none blur-3xl" />
      
      <div className="relative z-10 space-y-6">
        {/* Widget Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#9c7b41]/15 rounded-full border border-[#9c7b41]/35">
            <Sparkles className="w-5 h-5 text-[#dfa47e]" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#fbf9f4]">
              Consult the Literary Concierge
            </h3>
            <p className="text-[10px] uppercase font-mono tracking-widest text-[#dfa47e]/75">
              Powered by BookVerse AI Synthesis
            </p>
          </div>
        </div>

        <p className="text-xs text-[#fbf9f4]/70 leading-relaxed max-w-xl">
          Describe the mood, themes, or historical periods you desire to inhabit. Our algorithmic archivist will read your mind and retrieve correct manuscripts from our private vault.
        </p>

        {/* Input Form */}
        <form onSubmit={handleConsult} className="flex flex-col sm:flex-row gap-3 items-center">
          <input
            type="text"
            required
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., An immersive high-fantasy filled with dragons, legendary bloodlines, and dark political warfare..."
            className="flex-1 w-full bg-[#2a2927] border border-[#ab9f8c]/20 hover:border-[#ab9f8c]/40 focus:border-[#dfa47e] rounded-xl px-4 py-3 text-xs text-[#fbf9f4] outline-none placeholder:text-neutral-500 transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto shrink-0 bg-[#9c7b41] hover:bg-[#856531] disabled:bg-[#5f5139] px-6 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase text-[#fbf9f4] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Interrogating Archives...</span>
              </>
            ) : (
              <>
                <span>Scribble Request</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Loading and Results sections */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-6 bg-[#2a2927] rounded-2xl border border-[#ab9f8c]/15 space-y-4 animate-pulse"
            >
              <div className="h-4 bg-neutral-700 rounded-md w-1/4" />
              <div className="space-y-2">
                <div className="h-3 bg-neutral-700 rounded-md w-3/4" />
                <div className="h-3 bg-neutral-700 rounded-md w-1/2" />
              </div>
            </motion.div>
          )}

          {result && suggestedBook && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-[#262523] rounded-2xl border border-[#9c7b41]/25 flex flex-col md:flex-row gap-6"
            >
              {/* Cover */}
              <img
                src={suggestedBook.coverUrl}
                alt={suggestedBook.title}
                className="w-24 h-36 object-cover rounded shadow-2xl border border-[#ab9f8c]/25 hover:scale-102 transition-transform"
                referrerPolicy="no-referrer"
              />

              {/* Analysis & Details */}
              <div className="flex-1 flex flex-col justify-between space-y-4 md:space-y-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#dfa47e] bg-[#dfa47e]/10 px-2 py-0.5 rounded border border-[#dfa47e]/20">
                      Recommendation Match
                    </span>
                    <span className="text-[9px] font-mono text-neutral-400">
                      Confidence: {Math.round(result.confidence * 100)}%
                    </span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#fbf9f4]">
                    {suggestedBook.title}
                  </h4>
                  <p className="text-xs text-neutral-400 italic">by {suggestedBook.author}</p>
                  
                  <p className="text-xs text-[#fbf9f4]/85 leading-relaxed mt-3 border-l-2 border-[#dfa47e] pl-3 italic">
                    "{result.analysis}"
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={() => onSelectBook(suggestedBook)}
                    className="w-full sm:w-auto px-4 py-2 bg-[#9c7b41]/15 hover:bg-[#9c7b41]/25 border border-[#9c7b41]/35 rounded-lg text-xs font-semibold text-[#dfa47e] flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Examine Manuscript</span>
                  </button>
                  <p className="text-[10px] text-neutral-400 font-mono italic">
                    {result.thoughtTrail || "Calculated via cognitive stylistic mapping."}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
