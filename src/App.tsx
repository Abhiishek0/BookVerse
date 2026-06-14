/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Explore from "./components/Explore";
import DetailView from "./components/DetailView";
import Wishlist from "./components/Wishlist";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import { HelmetProvider } from "react-helmet-async";
import SEOMetadata from "./components/SEOMetadata";
import RouteTransitionOverlay from "./components/RouteTransitionOverlay";

// New high-impact features
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ContinueReading from "./components/ContinueReading";
import RecentViewsShelf from "./components/RecentViewsShelf";
import AIRecommendWidget from "./components/AIRecommendWidget";

import { mockBooks, mockFriendActivities, mockAchievements, mockReadingProgress, mockSchedule } from "./data/mockBooks";
import { Book, CartItem, ReadingProgress, Achievement } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { Activity, Flame, Shield, Heart } from "lucide-react";

// Creative simple React local navigation router export
export function Link({ to, children, className, onClick }: { to: string; children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <span onClick={onClick} className={`cursor-pointer ${className}`}>
      {children}
    </span>
  );
}

// Nested AppBody that consumes AuthContext correctly
function AppBody() {
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Consume Auth Context for live streaks & views
  const { streak, recentViews, goals } = useAuth();

  // Cart, Wishlist, Progress, Achievements state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("bv_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Book[]>(() => {
    const saved = localStorage.getItem("bv_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [readingProgress, setReadingProgress] = useState<ReadingProgress[]>(() => {
    const saved = localStorage.getItem("bv_progress");
    return saved ? JSON.parse(saved) : mockReadingProgress;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem("bv_achievements");
    return saved ? JSON.parse(saved) : mockAchievements;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("bv_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("bv_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("bv_progress", JSON.stringify(readingProgress));
  }, [readingProgress]);

  useEffect(() => {
    localStorage.setItem("bv_achievements", JSON.stringify(achievements));
  }, [achievements]);

  // Cart operations
  const handleAddToCart = (book: Book) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.book.id === book.id);
      if (existing) {
        return prev.map((item) =>
          item.book.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { book, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (bookId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.book.id === bookId) {
            return { ...item, quantity: Math.max(1, item.quantity + delta) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (bookId: string) => {
    setCart((prev) => prev.filter((item) => item.book.id !== bookId));
  };

  // Wishlist operations
  const handleAddToWishlist = (book: Book) => {
    setWishlist((prev) => {
      const exists = prev.some((b) => b.id === book.id);
      if (exists) {
        return prev.filter((b) => b.id !== book.id);
      }
      return [...prev, book];
    });
  };

  // Update progress handler
  const handleUpdateProgress = (bookId: string, page: number) => {
    setReadingProgress((prev) =>
      prev.map((p) => {
        if (p.bookId === bookId) {
          const finished = page >= p.totalPages;
          const percent = Math.round((page / p.totalPages) * 100);
          
          if (finished) {
            // Unlock scholar achievement
            unlockAchievement("ach-1");
          }

          return {
            ...p,
            currentPage: page,
            progressPercent: percent,
            lastRead: "Just now",
          };
        }
        return p;
      })
    );
  };

  const unlockAchievement = (id: string) => {
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id === id) {
          return {
            ...ach,
            progressCurrent: ach.progressMax,
            unlockedAt: new Date().toLocaleDateString(),
          };
        }
        return ach;
      })
    );
  };

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setCurrentPage("detail");
  };

  // Find Featured Book for Hero
  const featuredBook = books.find((b) => b.featured) || books[0];

  return (
    <div className="min-h-screen bg-[#fbf9f4] text-[#2a2927] flex flex-col font-sans">
      <SEOMetadata currentPage={currentPage} selectedBook={selectedBook} />
    
      {/* Header bar structure with user profile authentication hooks */}
      <Header
        currentPage={currentPage}
        setCurrentPage={(page) => {
          setCurrentPage(page);
          if (page !== "detail") {
            setSelectedBook(null);
          }
        }}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onSelectBook={handleSelectBook}
      />

      {/* Main Page Swapper viewports with slow smooth ease animations */}
      <main className="flex-1 w-full flex flex-col">
        <RouteTransitionOverlay currentPage={currentPage} selectedBookId={selectedBook?.id}>
          {currentPage === "home" && (
            <div key="home" className="w-full">
              {/* Hero showcasing streak days from dynamic context */}
              <Hero
                featuredBook={featuredBook}
                onExplore={() => setCurrentPage("explore")}
                onSelectBook={handleSelectBook}
                streakDays={streak}
              />

              {/* Interlocking dynamic segments dashboard */}
              <div className="max-w-7xl mx-auto px-6 py-6 text-left space-y-12">
                
                {/* 1. Continue Reading Section */}
                <ContinueReading
                  progressList={readingProgress}
                  allBooks={books}
                  onSelectBook={handleSelectBook}
                  onUpdateProgress={handleUpdateProgress}
                />

                {/* 2. AI Book Recommendation Widget (Literary Concierge) */}
                <AIRecommendWidget onSelectBook={handleSelectBook} />

                {/* 3. Recently Viewed Books Shelf */}
                <RecentViewsShelf
                  recentViews={recentViews}
                  allBooks={books}
                  onSelectBook={handleSelectBook}
                />

                {/* 4. Friends activity list & visual showcase */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-6 border-t border-stone-200">
                  {/* Popular Circles */}
                  <div className="md:col-span-8 space-y-6">
                    <h3 className="font-serif text-2xl font-semibold text-[#2a2927]">Popular In Premium Circles</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {books.slice(1, 3).map((book) => (
                        <div
                          key={book.id}
                          onClick={() => handleSelectBook(book)}
                          className="group p-5 bg-[#f6f3eb] rounded-2xl border border-[#ece7dc] hover:border-[#ab9f8c] cursor-pointer transition-all flex gap-4 text-left"
                        >
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-16 h-24 object-cover rounded shadow group-hover:scale-102 transition-transform shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex flex-col justify-between min-w-0">
                            <div>
                              <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
                                {book.category}
                              </span>
                              <h4 className="font-serif text-base font-semibold text-[#2a2927] truncate mt-0.5">
                                {book.title}
                              </h4>
                              <p className="text-xs text-neutral-500 italic">by {book.author}</p>
                            </div>
                            <span className="font-mono text-sm font-semibold mt-2 block">₹{book.price.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Friends Feed */}
                  <div className="md:col-span-4 bg-[#f6f3eb] p-6 rounded-2xl border border-[#ece7dc] text-left">
                    <h4 className="font-serif text-lg font-semibold text-[#2a2927] mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-[#274e37]" /> Reader Friends
                    </h4>
                    
                    <div className="space-y-4">
                      {mockFriendActivities.map((act) => (
                        <div key={act.id} className="flex gap-3 items-start text-xs">
                          <img
                            src={act.avatarUrl}
                            alt={act.name}
                            className="w-8 h-8 rounded-full border border-white"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <p className="text-[#2a2927]/80 leading-relaxed">
                              <strong className="text-[#2a2927]">{act.name}</strong> {act.action}{" "}
                              <span className="italic text-[#274e37] font-serif font-medium">{act.bookTitle}</span>
                            </p>
                            <span className="text-[10px] text-neutral-400 font-mono mt-0.5 block">{act.timeAgo}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {currentPage === "explore" && (
            <div key="explore" className="w-full">
              <Explore
                books={books}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                onSelectBook={handleSelectBook}
                wishlistIds={wishlist.map((b) => b.id)}
                cartIds={cart.map((i) => i.book.id)}
              />
            </div>
          )}

          {currentPage === "detail" && selectedBook && (
            <div key="detail" className="w-full">
              <DetailView
                book={selectedBook}
                onBack={() => {
                  setSelectedBook(null);
                  setCurrentPage("explore");
                }}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                isWishlisted={wishlist.some((b) => b.id === selectedBook.id)}
                isInCart={cart.some((i) => i.book.id === selectedBook.id)}
                relatedBooks={books.filter((b) => b.id !== selectedBook.id).slice(0, 3)}
                onSelectBook={handleSelectBook}
              />
            </div>
          )}

          {currentPage === "wishlist" && (
            <div key="wishlist" className="w-full">
              <Wishlist
                wishlist={wishlist}
                onRemoveFromWishlist={handleAddToWishlist}
                onAddToCart={handleAddToCart}
                onSelectBook={handleSelectBook}
                cartIds={cart.map((i) => i.book.id)}
              />
            </div>
          )}

          {currentPage === "cart" && (
            <div key="cart" className="w-full">
              <Cart
                cart={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveFromCart={handleRemoveFromCart}
                onCheckout={() => setCurrentPage("checkout")}
                onContinueReading={() => setCurrentPage("explore")}
              />
            </div>
          )}

          {currentPage === "checkout" && (
            <div key="checkout" className="w-full">
              <Checkout
                cart={cart}
                onSuccessClearCart={() => setCart([])}
                onGoHome={() => setCurrentPage("home")}
              />
            </div>
          )}

          {currentPage === "dashboard" && (
            <div key="dashboard" className="w-full">
              <Dashboard
                progressList={readingProgress}
                achievements={achievements}
                goals={goals}
                schedule={mockSchedule}
                allBooks={books}
                onSelectBook={handleSelectBook}
                onUpdateProgress={handleUpdateProgress}
              />
            </div>
          )}

          {currentPage === "profile" && (
            <div key="profile" className="w-full">
              <Profile
                achievements={achievements}
                history={readingProgress}
                onBack={() => setCurrentPage("home")}
              />
            </div>
          )}
        </RouteTransitionOverlay>
      </main>

      {/* Footer bar */}
      <footer className="py-12 border-t border-[#ece7dc] bg-[#f6f3eb] text-[#2a2927]/60 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-left space-y-1.5">
            <p className="font-serif font-semibold text-sm text-[#2a2927]">BookVerse</p>
            <p className="font-sans leading-relaxed">
              Meticulous craftsmanship in digital reading. Powered securely and persistently.
            </p>
          </div>
          <div className="flex gap-6 font-mono text-[10px] uppercase tracking-wider">
            <span>Catalogues</span>
            <span>Sanctuary Guides</span>
            <span>Security Boundaries</span>
          </div>
          <p className="text-stone-400 font-mono text-[10px]">
            &copy; 1419–2026 BookVerse Inc. All Archives Protected.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Shell wrapper to provide Helmet and AuthProvider to inner tree
export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <AppBody />
      </AuthProvider>
    </HelmetProvider>
  );
}
