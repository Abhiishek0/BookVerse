import { useState, useEffect } from "react";
import { Book } from "../types";
import { Heart, Trash2, ShoppingCart, Info, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface WishlistProps {
  wishlist: Book[];
  onRemoveFromWishlist: (book: Book) => void;
  onAddToCart: (book: Book) => void;
  onSelectBook: (book: Book) => void;
  cartIds: string[];
}

export default function Wishlist({
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
  onSelectBook,
  cartIds,
}: WishlistProps) {
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);

  // Periodically generate a tiny floating amber/soft heart particle for sensory atmosphere
  useEffect(() => {
    if (wishlist.length === 0) return;
    const interval = setInterval(() => {
      setHearts((prev) => [
        ...prev.slice(-15), // keep last 15 hearts
        {
          id: Date.now() + Math.random(),
          x: Math.random() * 90 + 5, // percentage
          y: Math.random() * 40 + 60, // percentage
          delay: Math.random() * 0.5,
        },
      ]);
    }, 1800);

    return () => clearInterval(interval);
  }, [wishlist.length]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative min-h-[70vh]">
      
      {/* Atmosphere Heart Particles container */}
      <div className="absolute inset-x-0 bottom-0 top-20 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {hearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{ opacity: 0, scale: 0.5, y: "100%" }}
              animate={{ opacity: [0, 0.7, 0.7, 0], scale: [0.6, 1.2, 1, 0.6], y: "-30%", x: `${heart.x + Math.sin(heart.id) * 4}%` }}
              exit={{ opacity: 0 }}
              transition={{ duration: 7, ease: "easeOut", delay: heart.delay }}
              className="absolute text-[#c15c3d]/20 text-xs text-[#c15c3d]"
              style={{ left: `${heart.x}%`, bottom: "0%" }}
            >
              ♥
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Page header */}
      <div className="flex flex-col items-start mb-10 text-left z-10 relative">
        <span className="text-[11px] font-mono tracking-widest text-[#c15c3d] uppercase font-bold bg-[#c15c3d]/5 px-3 py-1 rounded-full border border-[#c15c3d]/15">
          Favorites Shelf
        </span>
        <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#2a2927] tracking-tight mt-3">
          Saved Collections
        </h2>
        <p className="text-sm text-[#2a2927]/60 mt-2 font-sans max-w-lg">
          Volumes you intend to read, study, or add to your permanent family archives in the near future.
        </p>
      </div>

      {/* Wishlist count overview */}
      <div className="z-10 relative">
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {wishlist.map((book) => {
                const isInCart = cartIds.includes(book.id);
                return (
                  <motion.div
                    key={book.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4 }}
                    className="group bg-[#f6f3eb] rounded-2xl border border-[#ece7dc] overflow-hidden p-5 flex flex-col justify-between"
                  >
                    
                    {/* Upper side content and thumbnail */}
                    <div>
                      <div className="flex gap-4 items-start pb-4 border-b border-[#ece7dc] mb-4">
                        <div 
                          onClick={() => onSelectBook(book)}
                          className="w-16 h-24 rounded overflow-hidden shadow cursor-pointer shrink-0 bg-neutral-200"
                        >
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="text-left min-w-0">
                          <span className="text-[9px] font-mono tracking-widest text-[#2a2927]/40 uppercase">
                            {book.category}
                          </span>
                          <h4 
                            onClick={() => onSelectBook(book)}
                            className="font-serif text-base font-semibold text-[#2a2927] hover:text-[#274e37] cursor-pointer transition-colors truncate mt-0.5"
                          >
                            {book.title}
                          </h4>
                          <p className="text-xs text-neutral-500 italic mt-0.5">by {book.author}</p>
                          <span className="font-mono text-sm font-semibold text-[#2a2927] block mt-1.5">
                            ₹{book.price.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-[#2a2927]/60 text-left line-clamp-2 leading-relaxed mb-4">
                        {book.description}
                      </p>
                    </div>

                    {/* Operational controls footer */}
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => onAddToCart(book)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                          isInCart
                            ? "bg-[#274e37] text-white"
                            : "bg-[#2a2927] hover:bg-[#274e37] text-white"
                        }`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {isInCart ? "In Cart" : "Buy / Add"}
                      </button>

                      <button
                        onClick={() => onSelectBook(book)}
                        className="p-2.5 rounded-full border border-[#ece7dc] hover:bg-[#ece7dc] text-[#2a2927]/60 hover:text-[#2a2927] transition-all"
                        title="View Details"
                      >
                        <Info className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onRemoveFromWishlist(book)}
                        className="p-2.5 rounded-full border border-[#ece7dc] hover:bg-[#c15c3d]/10 text-neutral-400 hover:text-[#c15c3d] transition-all"
                        title="Remove Volume"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-24 text-center bg-[#f6f3eb] rounded-3xl border border-dashed border-[#ece7dc] max-w-xl mx-auto mt-6">
            <Heart className="w-12 h-12 text-[#c15c3d]/30 mx-auto mb-4 animate-pulse" />
            <p className="font-serif text-lg font-medium text-[#2a2927]">Your reading wishlist is empty</p>
            <p className="text-xs text-neutral-500 mt-1">Add volumes from our collection to track your desired archives.</p>
          </div>
        )}
      </div>

    </div>
  );
}
