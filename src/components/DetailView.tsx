import React, { useState, useEffect } from "react";
import { Book } from "../types";
import ThreeDBook from "./ThreeDBook";
import { Star, ShoppingBag, ArrowLeft, Heart, BookOpen, Quote, ChevronRight, FileText, ShoppingCart, User, Send, Edit, BarChart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../contexts/AuthContext";

interface DetailViewProps {
  book: Book;
  onBack: () => void;
  onAddToCart: (book: Book) => void;
  onAddToWishlist: (book: Book) => void;
  isWishlisted: boolean;
  isInCart: boolean;
  relatedBooks: Book[];
  onSelectBook: (book: Book) => void;
}

export default function DetailView({
  book,
  onBack,
  onAddToCart,
  onAddToWishlist,
  isWishlisted,
  isInCart,
  relatedBooks,
  onSelectBook
}: DetailViewProps) {
  const { user, addToRecentViews, loadReviews, submitReview, reviews } = useAuth();
  
  const [showSample, setShowSample] = useState(false);
  const [activeTab, setActiveTab] = useState<"about" | "specifications" | "quotes" | "reviews">("about");
  
  // Review form state
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");
  const [customNameInput, setCustomNameInput] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [successReviewMsg, setSuccessReviewMsg] = useState("");

  // Record viewed book in history & load ratings
  useEffect(() => {
    if (book) {
      addToRecentViews(book.id);
      loadReviews(book.id);
    }
  }, [book]);

  const activeBookReviews = reviews[book.id] || [];

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    setSubmittingReview(true);
    let writerName = user?.displayName || customNameInput || "Anonymous Scholar";

    try {
      await submitReview(book.id, writerName, ratingInput, commentInput);
      setCommentInput("");
      setSuccessReviewMsg("Your precious review has been etched in our archives!");
      setTimeout(() => setSuccessReviewMsg(""), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Simulated ratings breakdown stats
  const breakdownStats = [
    { stars: 5, pct: 75 },
    { stars: 4, pct: 15 },
    { stars: 3, pct: 7 },
    { stars: 2, pct: 3 },
    { stars: 1, pct: 0 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      
      {/* Back navigation and Favorite absolute control header */}
      <div className="flex justify-between items-center mb-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#2a2927]/60 hover:text-[#2a2927] uppercase group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
          Back to Catalogue
        </button>

        <button
          onClick={() => onAddToWishlist(book)}
          className="flex items-center gap-2 px-4 py-2 border border-[#ece7dc] hover:border-[#ab9f8c] rounded-full text-xs font-semibold tracking-wide bg-[#f6f3eb] cursor-pointer transition-colors"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-[#c15c3d] text-[#c15c3d]" : "text-[#2a2927]/60"}`} />
          {isWishlisted ? "In Wishlist" : "Wishlist"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left column: rotating 3D Book representation */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative p-8 bg-[#f6f3eb] rounded-3xl border border-[#ece7dc]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.5),transparent_70%)] pointer-events-none" />
          
          <ThreeDBook 
            book={book} 
            size="lg" 
            interactive={true} 
            isOpenState={true}
          />
          
          <div className="text-center mt-6 z-10">
            <span className="text-[10px] font-mono tracking-widest text-[#2a2927]/40 uppercase block mb-1">Interactive Cover</span>
            <p className="text-xs text-[#2a2927]/60 italic font-sans">Hover your cursor to rotate in 3D. Pages open beautifully.</p>
          </div>
        </div>

        {/* Right column: Specs and metadata */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          
          <div className="flex flex-wrap gap-2.5 mb-5 items-center">
            <span className="text-[10px] font-mono tracking-widest text-[#274e37] uppercase font-bold bg-[#274e37]/5 px-3 py-1 rounded-full border border-[#274e37]/15">
              {book.category}
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">&bull;</span>
            <span className="text-[10px] font-mono text-[#2a2927]/60 uppercase tracking-widest bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
              Gold Edition
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl font-semibold leading-tight text-[#2a2927] tracking-tight mb-3">
            {book.title}
          </h1>

          <p className="text-lg font-serif italic text-[#274e37] font-medium mb-6">
            by {book.author}
          </p>

          {/* Numerical statistics panel */}
          <div className="grid grid-cols-4 gap-4 py-5 mb-8 border-y border-[#ece7dc] w-full bg-[#f6f3eb]/60 rounded-xl px-4">
            <div className="text-center border-r border-[#ece7dc]">
              <span className="text-xs font-mono text-[#2a2927]/40 uppercase tracking-wide block">Rating</span>
              <span className="font-serif text-lg font-semibold text-[#2a2927] mt-1 inline-flex items-center gap-1">
                {book.rating} <Star className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" />
              </span>
            </div>
            <div className="text-center border-r border-[#ece7dc]">
              <span className="text-xs font-mono text-[#2a2927]/40 uppercase tracking-wide block">Reviews</span>
              <span className="font-serif text-lg font-semibold text-[#2a2927] mt-1 block">
                {book.reviewsCount + activeBookReviews.length - 2}
              </span>
            </div>
            <div className="text-center border-r border-[#ece7dc]">
              <span className="text-xs font-mono text-[#2a2927]/40 uppercase tracking-wide block">Pages</span>
              <span className="font-serif text-lg font-semibold text-[#2a2927] mt-1 block">
                {book.pagesCount}
              </span>
            </div>
            <div className="text-center">
              <span className="text-xs font-mono text-[#2a2927]/40 uppercase tracking-wide block">Release</span>
              <span className="text-xs font-serif font-medium text-[#2a2927] mt-1.5 block leading-tight">
                {book.originalReleaseDate.split(",")[1]?.trim() || book.originalReleaseDate}
              </span>
            </div>
          </div>

          {/* Details Segment tabs */}
          <div className="flex gap-6 border-b border-[#ece7dc] w-full mb-6">
            {(["about", "specifications", "quotes", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2.5 text-xs font-semibold tracking-widest uppercase transition-all relative ${
                  activeTab === tab ? "text-[#2a2927]" : "text-[#2a2927]/40 hover:text-[#2a2927]"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="detailTabLine"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#274e37]"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content renders */}
          <div className="w-full text-[#2a2927]/75 font-sans leading-relaxed mb-8 text-sm min-h-[140px]">
            {activeTab === "about" && (
              <p>{book.description}</p>
            )}

            {activeTab === "specifications" && (
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-neutral-100 py-1.5">
                  <span className="text-[#2a2927]/40">ISBN:</span>
                  <span className="font-semibold text-[#2a2927]">978-3-16-148410-0</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 py-1.5">
                  <span className="text-[#2a2927]/40">Material:</span>
                  <span className="font-semibold text-[#2a2927]">Cloth Binding, Cream Paper</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 py-1.5">
                  <span className="text-[#2a2927]/40">Dimensions:</span>
                  <span className="font-semibold text-[#2a2927]">140mm x 210mm x 32mm</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 py-1.5">
                  <span className="text-[#2a2927]/40">Genres:</span>
                  <span className="font-semibold text-[#2a2927] truncate select-none">
                    {book.genre.join(", ")}
                  </span>
                </div>
              </div>
            )}

            {activeTab === "quotes" && (
              <div className="italic p-4 bg-amber-50/20 border-l-2 border-[#274e37] rounded-r-xl">
                <Quote className="w-5 h-5 text-[#274e37]/40 mb-2" />
                <p className="font-serif text-[#2a2927]/90 leading-relaxed">
                  &ldquo;A narrative of singular elegance that challenges the mind and fills the room with ancient static.&rdquo;
                </p>
                <span className="block mt-2 font-mono text-[10px] uppercase font-bold text-[#2a2927]/50">
                  &mdash; Daily Literary Review
                </span>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* Visual stats breakout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4 bg-stone-50 rounded-xl border border-stone-100">
                  <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-serif font-bold text-[#2a2927]">{book.rating}</span>
                    <div className="flex gap-1 text-amber-500 my-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(book.rating) ? "fill-amber-500" : "text-stone-300"}`} />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#2a2927]/50">
                      Overall Score
                    </span>
                  </div>
                  <div className="md:col-span-8 space-y-1.5">
                    {breakdownStats.map((item) => (
                      <div key={item.stars} className="flex items-center gap-3 text-xs text-[#2a2927]/60">
                        <span className="w-8 font-mono">{item.stars} ★</span>
                        <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                          <div className="bg-[#274e37] h-full" style={{ width: `${item.pct}%` }} />
                        </div>
                        <span className="w-8 text-right font-mono text-[10px]">{item.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submited reviews list */}
                <div className="space-y-4">
                  {activeBookReviews.length === 0 ? (
                    <p className="text-center text-xs text-neutral-400 italic py-6">
                      This rare volume has no reader reflections logged yet. Be the first to annotate!
                    </p>
                  ) : (
                    activeBookReviews.map((rev: any) => (
                      <div key={rev.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200/50 space-y-2">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#274e37]/10 text-[#274e37] flex items-center justify-center text-[10px] font-mono uppercase font-semibold">
                              {rev.userName.slice(0, 2)}
                            </div>
                            <div>
                              <h5 className="text-xs font-semibold text-[#2a2927]">{rev.userName}</h5>
                              <span className="text-[9px] text-[#2a2927]/40 font-mono">{rev.date}</span>
                            </div>
                          </div>
                          <div className="flex gap-0.5 text-amber-500">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? "fill-amber-500" : "text-neutral-300"}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-[#2a2927]/80 pl-8 leading-relaxed whitespace-pre-wrap italic">
                          &ldquo;{rev.comment}&rdquo;
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Composition form */}
                <form onSubmit={handleReviewSubmit} className="p-5 bg-[#f6f3eb] rounded-xl border border-[#ece7dc] space-y-4">
                  <div className="flex items-center gap-2">
                    <Edit className="w-4 h-4 text-[#274e37]" />
                    <span className="font-serif text-sm font-semibold text-[#2a2927]">Write Reflection</span>
                  </div>

                  {successReviewMsg && (
                    <div className="text-xs text-[#274e37] bg-[#274e37]/10 px-3 py-2 rounded-lg border border-[#274e37]/20 font-medium">
                      {successReviewMsg}
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Star feedback selector */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#2a2927]/60 font-mono">Assigned rating:</span>
                      <div className="flex gap-1 text-neutral-300">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setRatingInput(s)}
                            className="focus:outline-none scale-102 hover:scale-110 active:scale-95 transition-transform"
                          >
                            <Star className={`w-5 h-5 cursor-pointer ${s <= ratingInput ? "fill-amber-500 text-amber-500" : "text-stone-300"}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Anonymous author fill if signedout */}
                    {!user && (
                      <input
                        type="text"
                        placeholder="Enter your pen name..."
                        value={customNameInput}
                        onChange={(e) => setCustomNameInput(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-[#ece7dc] bg-white outline-none focus:border-[#ab9f8c]"
                      />
                    )}

                    {/* Text area */}
                    <textarea
                      placeholder="Pen your literary notes or commentary here..."
                      rows={3}
                      required
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="w-full text-xs p-3 rounded-lg border border-[#ece7dc] bg-white outline-none focus:border-[#ab9f8c] placeholder:text-stone-400"
                    />

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full py-2.5 bg-[#2a2927] hover:bg-[#274e37] text-white disabled:bg-neutral-400 text-xs font-semibold rounded-lg uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Log Reflexion</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Purchasing card */}
          <div className="flex flex-wrap gap-4 items-center w-full p-4 bg-[#f6f3eb] rounded-2xl border border-[#ece7dc] mb-8">
            <div className="flex flex-col pr-6 border-r border-[#ece7dc]">
              <span className="text-[10px] font-mono text-[#2a2927]/40 uppercase tracking-wider block">Investment</span>
              <span className="text-2xl font-mono font-bold text-[#2a2927] mt-0.5">
                ₹{book.price.toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => onAddToCart(book)}
              className={`flex-1 min-w-[200px] py-4 rounded-full font-serif font-medium tracking-wide flex items-center justify-center gap-2.5 transition-all text-sm ${
                isInCart
                  ? "bg-[#274e37] text-white shadow-md shadow-[#274e37]/10"
                  : "bg-[#2a2927] text-white hover:bg-[#274e37] hover:shadow-lg"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {isInCart ? "Already Added (Modify in Cart)" : "Add Volume to Cart"}
            </button>

            <button
              onClick={() => setShowSample(true)}
              className="px-5 py-4 rounded-full border border-[#ece7dc] hover:border-[#ab9f8c] bg-white hover:bg-[#fbf9f4] text-xs font-semibold tracking-wider uppercase transition-all"
            >
              Sample Excerpts
            </button>
          </div>

        </div>

      </div>

      {/* Related Books collection */}
      {relatedBooks.length > 0 && (
        <div className="mt-20 pt-10 border-t border-[#ece7dc]">
          <h3 className="font-serif text-2xl font-semibold text-[#2a2927] text-left mb-6">
            Related Collections
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {relatedBooks.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectBook(rel)}
                className="group p-4 bg-[#f6f3eb] rounded-2xl border border-[#ece7dc] hover:border-[#ab9f8c] cursor-pointer transition-all flex items-center gap-4"
              >
                <img
                  src={rel.coverUrl}
                  alt={rel.title}
                  className="w-12 h-16 object-cover rounded shadow"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <h4 className="font-serif text-sm font-semibold truncate text-[#2a2927] group-hover:text-[#274e37]">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-neutral-500 italic mt-0.5 truncate">
                    by {rel.author}
                  </p>
                  <span className="font-mono text-xs text-neutral-600 font-bold block mt-1">₹{rel.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popover reader sheet for sampling text excerpts */}
      <AnimatePresence>
        {showSample && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#2a2927]/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 30 }}
              className="bg-[#fbf9f4] rounded-3xl border border-[#ece7dc] max-w-2xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl"
            >
              
              {/* Reader Header */}
              <div className="bg-[#f6f3eb] p-6 border-b border-[#ece7dc] flex justify-between items-center">
                <div className="text-left">
                  <span className="text-[10px] font-mono text-[#274e37] uppercase tracking-widest font-bold">Sample Reading Room</span>
                  <h4 className="font-serif text-lg font-semibold text-[#2a2927] mt-0.5">{book.title}</h4>
                </div>
                <button
                  onClick={() => setShowSample(false)}
                  className="px-4 py-2 bg-[#2a2927] text-white hover:bg-[#c15c3d] text-xs font-bold rounded-full transition-colors"
                >
                  Close Room
                </button>
              </div>

              {/* Textured Reading Canvas */}
              <div className="flex-1 p-8 sm:p-12 overflow-y-auto text-left leading-relaxed text-sm bg-stone-50 text-stone-800 font-serif relative">
                <div className="absolute inset-0 opacity-4 mix-blend-multiply bg-[radial-gradient(#000_15%,transparent_16%)] [background-size:2px_2px]" />
                
                <div className="max-w-xl mx-auto space-y-6 select-none leading-8">
                  <div className="flex justify-center mb-8">
                    <span className="text-xs font-mono tracking-widest text-[#2a2927]/30 uppercase border-y border-stone-200 py-2 px-8">
                      Exclusive Extract
                    </span>
                  </div>

                  <p className="whitespace-pre-line leading-7 text-[#2a2927]/90 text-sm sm:text-base">
                    {book.sampleText || "This volume is currently waiting for full transcription. Please refer to library support bards to acquire physical microfiche copies."}
                  </p>
                  
                  <div className="h-40" />
                </div>
              </div>

              {/* Reader Footer */}
              <div className="bg-[#f6f3eb] p-5 border-t border-[#ece7dc] flex justify-between items-center text-xs font-mono">
                <span className="text-stone-400">Section 1 &mdash; Page 1 of 4</span>
                <span className="text-stone-400 flex items-center gap-1">
                  BookVerse Publisher Vault <BookOpen className="w-3.5 h-3.5" />
                </span>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
