import React, { useState } from "react";
import { ReadingProgress, Achievement, Book, ReadingGoal, BookingSchedule } from "../types";
import { Calendar, Play, Trophy, Flame, CheckCircle, Sparkles, RefreshCw, Send, ArrowRight, Settings, Check, ChevronRight } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../contexts/AuthContext";

interface DashboardProps {
  progressList: ReadingProgress[];
  achievements: Achievement[];
  goals: ReadingGoal;
  schedule: BookingSchedule[];
  allBooks: Book[];
  onSelectBook: (book: Book) => void;
  onUpdateProgress: (bookId: string, page: number) => void;
}

export default function Dashboard({
  progressList,
  achievements,
  schedule,
  allBooks,
  onSelectBook,
  onUpdateProgress,
}: DashboardProps) {
  const { goals: syncGoals, updateGoals, streak } = useAuth();

  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [newPageVal, setNewPageVal] = useState<number>(0);
  
  // AI Recommendation input fields
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResult, setAiResult] = useState<{ suggestedBookId: string; analysis: string; confidence: number } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Live Goals editor sliders states
  const [showConfig, setShowConfig] = useState(false);
  const [dailyMinutes, setDailyMinutes] = useState(syncGoals.dailyTargetMinutes);
  const [yearlyTarget, setYearlyTarget] = useState(syncGoals.yearlyTargetBooks);

  // Trigger server-side Gemini request helper
  const handleAISuggest = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResult(null);

    try {
      const response = await fetch("/api/ai-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiResult(data);
      }
    } catch (err) {
      console.error("Failed to query AI recommendation endpoint: ", err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleUpdateClick = (p: ReadingProgress) => {
    setEditingBookId(p.bookId);
    setNewPageVal(p.currentPage);
  };

  const submitUpdate = (p: ReadingProgress) => {
    onUpdateProgress(p.bookId, Math.min(newPageVal, p.totalPages));
    setEditingBookId(null);
  };

  const handleSaveGoals = () => {
    updateGoals({
      dailyTargetMinutes: dailyMinutes,
      yearlyTargetBooks: yearlyTarget
    });
    setShowConfig(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 text-left">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-[#274e37] uppercase font-bold bg-[#274e37]/5 px-3 py-1 rounded-full border border-[#274e37]/15">
            Literary Sanctuary
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#2a2927] tracking-tight mt-3">
            Reader Dashboard
          </h2>
          <p className="text-sm text-[#2a2927]/60 mt-2 font-sans max-w-lg">
            Trace your reading journeys, schedule chapters of philosophy, and configure your personalized study objectives.
          </p>
        </div>

        {/* Edit Goals button */}
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="flex items-center gap-2 px-4 py-2 bg-[#2a2927] hover:bg-[#274e37] text-white text-xs font-semibold uppercase tracking-wider rounded-full transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4" />
          <span>Configure Target Goals</span>
        </button>
      </div>

      {/* Goals Editor Expansion Draw */}
      <AnimatePresence>
        {showConfig && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="mb-8 p-6 bg-[#f6f3eb] rounded-3xl border border-[#ece7dc] text-left overflow-hidden"
          >
            <h4 className="font-serif text-base font-semibold text-[#2a2927] mb-4">
              Configure Reading Parameters
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              {/* Daily segment */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-[#2a2927]/60 uppercase">Daily target (Minutes):</span>
                  <span className="font-bold text-[#2a2927]">{dailyMinutes} mins</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="180"
                  step="5"
                  value={dailyMinutes}
                  onChange={(e) => setDailyMinutes(parseInt(e.target.value))}
                  className="w-full accent-[#274e37]"
                />
              </div>

              {/* Yearly segment */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-[#2a2927]/60 uppercase">Annual Books complete target:</span>
                  <span className="font-bold text-[#2a2927]">{yearlyTarget} books</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="1"
                  value={yearlyTarget}
                  onChange={(e) => setYearlyTarget(parseInt(e.target.value))}
                  className="w-full accent-[#274e37]"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSaveGoals}
                className="px-4 py-2 bg-[#274e37] hover:bg-[#1e3b2a] text-white text-xs font-semibold rounded-lg uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Apply Goals</span>
              </button>
              <button
                onClick={() => setShowConfig(false)}
                className="px-4 py-2 bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Block (Streak days, Goals achieved, Yearly completion) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 text-left">
        
        {/* Streak card */}
        <div className="bg-[#f6f3eb] p-6 rounded-2xl border border-[#ece7dc] flex items-center gap-4">
          <div className="w-12 h-12 bg-[#c15c3d]/10 rounded-full flex items-center justify-center text-[#c15c3d]">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-neutral-400 block font-bold">Reading Streak</span>
            <span className="text-2xl font-mono font-bold text-[#2a2927] mt-0.5 block">{streak} Days</span>
            <span className="text-[10px] text-green-700 font-medium">Daily target fulfilled today</span>
          </div>
        </div>

        {/* Target minutes card */}
        <div className="bg-[#f6f3eb] p-6 rounded-2xl border border-[#ece7dc] flex items-center gap-4">
          <div className="w-12 h-12 bg-[#274e37]/10 rounded-full flex items-center justify-center text-[#274e37]">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-neutral-400 block font-bold">Goal Daily Target</span>
            <span className="text-2xl font-mono font-bold text-[#2a2927] mt-0.5 block">{syncGoals.dailyTargetMinutes} Mins</span>
            <span className="text-[10px] text-stone-500 font-medium">Average read: 48 mins</span>
          </div>
        </div>

        {/* Accomplishments count */}
        <div className="bg-[#f6f3eb] p-6 rounded-2xl border border-[#ece7dc] flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-600">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-neutral-400 block font-bold">Milestones Met</span>
            <span className="text-2xl font-mono font-bold text-[#2a2927] mt-0.5 block">
              {achievements.filter(a => a.progressCurrent >= a.progressMax).length} / {achievements.length}
            </span>
            <span className="text-[10px] text-stone-500 font-medium">Bibliophile Status: Active</span>
          </div>
        </div>

        {/* Year aggregate count */}
        <div className="bg-[#f6f3eb] p-6 rounded-2xl border border-[#ece7dc] flex items-center gap-4">
          <div className="w-12 h-12 bg-[#1e3d59]/10 rounded-full flex items-center justify-center text-[#1e3d59]">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-neutral-400 block font-bold">Annual Target Completed</span>
            <span className="text-2xl font-mono font-bold text-[#2a2927] mt-0.5 block">
              {syncGoals.completedThisYear} / {syncGoals.yearlyTargetBooks} Books
            </span>
            <span className="text-[10px] text-green-700 font-medium">On pace to satisfy target</span>
          </div>
        </div>

      </div>

      {/* Middle Grid: Continuing Books progress + Schedule chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-10 text-left">
        
        {/* Progress tracks */}
        <div className="lg:col-span-7 bg-[#f6f3eb] p-8 rounded-3xl border border-[#ece7dc] space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-xl font-semibold text-[#2a2927]">Continue Reading</h3>
            <span className="text-xs font-mono text-neutral-400 font-bold">{progressList.length} In Progress</span>
          </div>

          <div className="space-y-6">
            {progressList.map((p) => (
              <div key={p.bookId} className="bg-[#fbf9f4] p-5 rounded-xl border border-stone-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-[#2a2927]">{p.bookTitle}</h4>
                    <p className="text-xs text-neutral-500 italic mt-0.5">by {p.author}</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#274e37] bg-[#274e37]/5 px-2.5 py-1 rounded">
                    {p.progressPercent}% Finished
                  </span>
                </div>

                <div className="w-full bg-stone-200/50 h-2 rounded-full overflow-hidden mb-4">
                  <div 
                    className="bg-gradient-to-r from-[#274e37] to-[#1e3d59] h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${p.progressPercent}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400 font-mono">
                    Page {p.currentPage} of {p.totalPages} (Lg. format)
                  </span>

                  {editingBookId === p.bookId ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={newPageVal}
                        onChange={(e) => setNewPageVal(parseInt(e.target.value) || 0)}
                        className="w-16 bg-white border border-[#ece7dc] outline-none text-xs text-center font-mono py-1 rounded"
                      />
                      <button
                        onClick={() => submitUpdate(p)}
                        className="bg-[#274e37] text-white px-3 py-1 rounded text-[11px] font-bold"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUpdateClick(p)}
                      className="text-xs font-mono font-bold text-[#2a2927] hover:text-[#274e37] underline"
                    >
                      Update Page Progress
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule chart (5 cols with Recharts) */}
        <div className="lg:col-span-5 bg-[#f6f3eb] p-8 rounded-3xl border border-[#ece7dc]">
          <h3 className="font-serif text-xl font-semibold text-[#2a2927] mb-6">Reading Calendar</h3>
          
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={schedule} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#2a2927" strokeOpacity={0.4} style={{ fontSize: "10px", fontFamily: "monospace" }} />
                <YAxis stroke="#2a2927" strokeOpacity={0.4} style={{ fontSize: "10px", fontFamily: "monospace" }} />
                <Tooltip cursor={{ fill: "rgba(39,78,55,0.05)" }} wrapperStyle={{ fontFamily: "monospace", fontSize: "11px" }} />
                <Bar dataKey="minutesRead" fill="#274e37" radius={[4, 4, 0, 0]} name="Minutes read" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-4 border-t border-[#ece7dc] flex justify-between text-xs font-mono text-[#2a2927]/60">
            <span>Average: 47.1 Mins/day</span>
            <span className="text-[#274e37] font-bold">Goal Success (6/7 days)</span>
          </div>
        </div>

      </div>

      {/* AI SUGGESTION CORNER (Full Server integration) */}
      <div className="bg-gradient-to-tr from-[#f6f3eb] to-[#f4ece0] p-8 rounded-3xl border border-[#ece7dc] text-left mb-10 z-10 relative">
        <div className="max-w-3xl">
          
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#274e37] animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-[#274e37] uppercase font-bold">
              Gemini Literary Assistant
            </span>
          </div>

          <h3 className="font-serif text-2xl font-semibold text-[#2a2927] mb-3">
            What style of universe do you seek next?
          </h3>

          <p className="text-xs text-[#2a2927]/70 font-sans leading-relaxed mb-6">
            Input any query or sensation index. The concierge will analyze your profile and query Gemini to locate matching volumes.
          </p>

          <div className="flex gap-2 max-w-xl">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. Find a wizardry manuscript with dark magic elements"
              className="flex-1 bg-white border border-[#ece7dc] outline-none rounded-xl px-4 py-3 text-xs text-[#2a2927]"
            />
            
            <button
              onClick={handleAISuggest}
              disabled={aiLoading}
              className="bg-[#2a2927] hover:bg-[#274e37] text-white font-mono text-xs font-bold px-6 rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              {aiLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              {aiLoading ? "Consulting..." : "Query AI"}
            </button>
          </div>

          {/* AI Result frame */}
          <AnimatePresence>
            {aiResult && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-6 p-5 bg-[#fbf9f4] rounded-2xl border border-dashed border-[#274e37]/30 max-w-xl"
              >
                <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                  <span className="text-[10px] font-mono text-[#274e37] font-semibold">Matched volume found</span>
                  <span className="text-[10px] font-mono text-neutral-400">Confidence: {(aiResult.confidence * 100).toFixed(0)}%</span>
                </div>

                <div className="mt-4 text-left">
                  {(() => {
                    const matchedBook = allBooks.find((b) => b.id === aiResult.suggestedBookId);
                    if (matchedBook) {
                      return (
                        <div 
                          onClick={() => onSelectBook(matchedBook)}
                          className="flex gap-4 items-start cursor-pointer hover:bg-neutral-100/50 p-2 rounded-xl transition-all mb-4"
                        >
                          <img
                            src={matchedBook.coverUrl}
                            alt={matchedBook.title}
                            className="w-8 h-12 object-cover rounded shadow"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="font-serif text-sm font-semibold text-[#2a2927]">{matchedBook.title}</h4>
                            <p className="text-[11px] font-mono text-stone-500 mt-0.5">by {matchedBook.author}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-neutral-400 self-center ml-auto" />
                        </div>
                      );
                    }
                    return null;
                  })()}

                  <p className="text-xs text-[#2a2927]/80 leading-relaxed italic pr-4">
                    &ldquo;{aiResult.analysis}&rdquo;
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

    </div>
  );
}
