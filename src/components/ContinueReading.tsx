import React, { useState } from "react";
import { Book, ReadingProgress } from "../types";
import { Play, CheckCircle, BookOpen, ChevronRight, Award } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { mockBooks } from "../data/mockBooks";

interface ContinueReadingProps {
  progressList: ReadingProgress[];
  allBooks: Book[];
  onSelectBook: (book: Book) => void;
  onUpdateProgress: (bookId: string, page: number) => void;
}

export default function ContinueReading({
  progressList,
  allBooks,
  onSelectBook,
  onUpdateProgress
}: ContinueReadingProps) {
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [pageValue, setPageValue] = useState<number>(0);

  // Filter out completed ones, keep active reading progress records, maximum 3
  const activeProgress = progressList
    .filter((p) => p.progressPercent < 100)
    .slice(0, 3);

  const startTracking = (p: ReadingProgress) => {
    setEditingBookId(p.bookId);
    setPageValue(p.currentPage);
  };

  const submitTracking = (bookId: string, totalPages: number) => {
    const parsedPage = Math.min(totalPages, Math.max(0, pageValue));
    onUpdateProgress(bookId, parsedPage);
    setEditingBookId(null);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <h3 className="font-serif text-2xl font-semibold text-[#2a2927]">
          Continue Reading
        </h3>
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#274e37] bg-[#274e37]/5 px-2.5 py-1 rounded border border-[#274e37]/15">
          Active Studies
        </span>
      </div>

      {activeProgress.length === 0 ? (
        <div className="p-8 bg-[#f6f3eb] rounded-2xl border border-[#ece7dc] flex flex-col items-center justify-center text-center gap-3">
          <div className="p-3 bg-white rounded-full border border-stone-200 text-[#274e37]">
            <BookOpen className="w-6 h-6" />
          </div>
          <p className="text-xs text-neutral-500 max-w-sm italic">
            Your ledger is currently clean. Select any luxury volume in our catalogue to initiate reading and record page milestones!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeProgress.map((item) => {
            const correspondingBook = allBooks.find((b) => b.id === item.bookId) || mockBooks[0];
            const isEditing = editingBookId === item.bookId;

            return (
              <div
                key={item.bookId}
                className="group relative p-5 bg-[#fbf9f4] hover:bg-white rounded-2xl border border-[#ece7dc] hover:border-[#ab9f8c] shadow-sm transition-all flex flex-col justify-between gap-4"
              >
                <div className="flex gap-4 items-start">
                  <img
                    src={correspondingBook?.coverUrl || ""}
                    alt={item.bookTitle}
                    onClick={() => onSelectBook(correspondingBook)}
                    className="w-16 h-24 object-cover rounded shadow cursor-pointer hover:scale-103 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 
                      onClick={() => onSelectBook(correspondingBook)}
                      className="font-serif text-sm font-semibold text-[#2a2927] hover:text-[#274e37] cursor-pointer truncate"
                    >
                      {item.bookTitle}
                    </h4>
                    <p className="text-xs text-neutral-500 italic truncate mb-2">by {item.author}</p>
                    
                    {/* Read percentage counter */}
                    <div className="flex justify-between text-[10px] text-neutral-400 font-mono mb-1">
                      <span>Progress</span>
                      <span className="font-bold text-[#2a2927]">{item.progressPercent}%</span>
                    </div>
                    {/* Tiny micro progress bar */}
                    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#274e37] h-full" 
                        style={{ width: `${item.progressPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono mt-2 block">
                      Page {item.currentPage} of {item.totalPages}
                    </span>
                  </div>
                </div>

                {/* Tracking inputs drawer */}
                <div className="border-t border-neutral-100/50 pt-3">
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-[#2a2927]/60 uppercase">Amended Page:</span>
                          <input
                            type="number"
                            value={pageValue}
                            onChange={(e) => setPageValue(parseInt(e.target.value, 10))}
                            min={0}
                            max={item.totalPages}
                            className="w-16 px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-xs font-semibold text-center font-mono outline-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => submitTracking(item.bookId, item.totalPages)}
                            className="flex-1 py-1 bg-[#274e37] hover:bg-[#1e3b2a] text-white text-[10px] font-semibold uppercase rounded tracking-wider transition-colors cursor-pointer"
                          >
                            Save Entries
                          </button>
                          <button
                            onClick={() => setEditingBookId(null)}
                            className="px-2 py-1 bg-[#c15c3d]/10 hover:bg-[#c15c3d]/15 text-[#c15c3d] text-[10px] font-semibold uppercase rounded tracking-wider transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <button
                        onClick={() => startTracking(item)}
                        className="w-full py-1.5 bg-[#f6f3eb] hover:bg-[#2a2927]/10 text-[#2a2927] text-[10px] font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Log Reading Pages</span>
                      </button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
