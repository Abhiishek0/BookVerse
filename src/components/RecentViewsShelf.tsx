import React from "react";
import { Book } from "../types";
import { Eye, Clock, Bookmark } from "lucide-react";
import { mockBooks } from "../data/mockBooks";

interface RecentViewsShelfProps {
  recentViews: string[];
  allBooks: Book[];
  onSelectBook: (book: Book) => void;
}

export default function RecentViewsShelf({
  recentViews,
  allBooks,
  onSelectBook
}: RecentViewsShelfProps) {
  // Resolve books from IDs
  const resolvedBooks = recentViews
    .map((id) => allBooks.find((b) => b.id === id))
    .filter((b): b is Book => !!b);

  // If empty, supply fallback catalog curated selections as Archivist Picks
  const displayBooks = resolvedBooks.length > 0 
    ? resolvedBooks 
    : allBooks.slice(3, 6);

  const isFallback = resolvedBooks.length === 0;

  return (
    <div className="space-y-6 text-left my-10">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-[#ece7dc] rounded-full border border-stone-300">
          <Clock className="w-4 h-4 text-[#2a2927]/70" />
        </div>
        <div>
          <h3 className="font-serif text-2xl font-semibold text-[#2a2927]">
            {isFallback ? "Archivist Curated Picks" : "Recently Visited Manuscripts"}
          </h3>
          <p className="text-[10px] uppercase font-mono tracking-widest text-[#2a2927]/40">
            {isFallback ? "Curated collections from the vault" : "Your study session footsteps"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayBooks.map((book) => (
          <div
            key={book.id}
            onClick={() => onSelectBook(book)}
            className="group relative p-4 bg-[#f6f3eb] rounded-2xl border border-[#ece7dc] hover:border-[#ab9f8c] cursor-pointer transition-all flex items-start gap-4"
          >
            {/* Visual accent hover effect */}
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
            
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-14 h-20 object-cover rounded shadow group-hover:scale-102 transition-transform shrink-0"
              referrerPolicy="no-referrer"
            />
            
            <div className="flex flex-col justify-between min-w-0 h-20">
              <div>
                <span className="text-[8px] font-mono tracking-widest text-[#274e37] uppercase bg-[#274e37]/5 px-1.5 py-0.2 rounded border border-[#274e37]/10 block w-max max-w-full truncate mb-1">
                  {book.category}
                </span>
                <h4 className="font-serif text-xs font-semibold text-[#2a2927] group-hover:text-[#274e37] truncate mt-0.5">
                  {book.title}
                </h4>
                <p className="text-[10px] text-neutral-500 italic truncate">by {book.author}</p>
              </div>
              <span className="font-mono text-xs font-bold text-[#2a2927]/80">₹{book.price.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
