import React, { useState, useRef, useEffect } from "react";
import { 
  ShoppingCart, 
  Heart, 
  Compass, 
  BookOpen, 
  Sparkles, 
  Search, 
  Flame, 
  LogOut, 
  LogIn, 
  ChevronDown 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Book } from "../types";
import { mockBooks } from "../data/mockBooks";
import { useAuth } from "../contexts/AuthContext";

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  cartCount: number;
  wishlistCount: number;
  onSelectBook: (book: Book) => void;
}

export default function Header({
  currentPage,
  setCurrentPage,
  cartCount,
  wishlistCount,
  onSelectBook
}: HeaderProps) {
  const { user, loginWithGoogle, logout, streak, isRealFirebase } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter book suggestions based on input
  const suggestions = searchQuery.trim() 
    ? mockBooks.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleSuggestionClick = (book: Book) => {
    onSelectBook(book);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const navItems = [
    { id: "home", label: "Home", icon: BookOpen },
    { id: "explore", label: "Explore", icon: Compass },
    { id: "wishlist", label: "Wishlist", icon: Heart, badge: wishlistCount },
    { id: "dashboard", label: "Dashboard", icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-40 w-full px-6 py-4 bg-[#fbf9f4]/85 backdrop-blur-md border-b border-[#ece7dc] transition-all">
      <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
        
        {/* Left: Brand Logo & Streak Flame */}
        <div className="w-full md:w-auto flex items-center justify-between gap-4">
          <div 
            onClick={() => setCurrentPage("home")}
            className="cursor-pointer flex items-center gap-2"
          >
            <span className="font-serif italic text-2xl font-semibold tracking-tight text-[#2a2927]">
              Book<span className="text-[#274e37] not-italic font-bold">Verse</span>
            </span>
            <div className="hidden sm:block text-[9px] font-mono tracking-widest text-[#274e37] uppercase bg-[#274e37]/5 px-2 py-0.5 rounded border border-[#274e37]/15">
              Luxe Reading
            </div>
          </div>

          {/* Core Streak Tracking Quick Badge */}
          {user && (
            <motion.div 
              whileHover={{ scale: 1.05 }}
              onClick={() => setCurrentPage("dashboard")}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#c15c3d]/10 hover:bg-[#c15c3d]/15 border border-[#c15c3d]/20 rounded-full text-xs font-semibold text-[#c15c3d] cursor-pointer"
              title="Daily Reading Streak"
            >
              <Flame className="w-4 h-4 fill-[#c15c3d] animate-pulse" />
              <span>{streak} Day Streak</span>
            </motion.div>
          )}
        </div>

        {/* Center: Search suggestions with thumbs & Capsule Nav */}
        <div className="flex-1 max-w-md w-full relative" ref={suggestionsRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search rare manuscripts, classic works..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full pl-10 pr-4 py-2 bg-[#f6f3eb] rounded-full border border-[#ece7dc] focus:border-[#ab9f8c] text-xs outline-none placeholder:text-[#2a2927]/40 text-[#2a2927] transition-all"
            />
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-neutral-400" />
          </div>

          {/* Autocomplete Search suggestions template */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute left-0 right-0 mt-2 bg-[#fbf9f4] rounded-xl border border-[#ece7dc] shadow-xl overflow-hidden z-50 p-2 space-y-1 text-left"
              >
                <div className="px-3 py-1 text-[10px] uppercase font-mono tracking-wider text-neutral-400 border-b border-[#ece7dc] mb-1">
                  Book Suggestions
                </div>
                {suggestions.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => handleSuggestionClick(book)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-[#f6f3eb] rounded-lg transition-colors text-left"
                  >
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-8 h-11 object-cover rounded shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-xs font-semibold text-[#2a2927] truncate">
                        {book.title}
                      </h4>
                      <p className="text-[10px] text-neutral-500 truncate">by {book.author}</p>
                    </div>
                    <span className="text-[10px] font-mono text-[#274e37] bg-[#274e37]/5 px-2 py-0.5 rounded border border-[#274e37]/10">
                      ₹{book.price.toFixed(2)}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Nav Options (Capsule, Cart, Google Profile Context) */}
        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3 shrink-0">
          
          {/* Central Nav Capsule */}
          <nav className="flex items-center gap-1 bg-[#f6f3eb] p-1 rounded-full border border-[#ece7dc] shadow-sm">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className="relative px-3 py-1.5 rounded-full text-xs font-medium tracking-wide flex items-center gap-1 transition-all duration-350"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabGlow"
                      className="absolute inset-0 bg-[#2a2927] rounded-full shadow"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                  <span className={`relative z-10 flex items-center gap-1 ${isActive ? "text-[#fbf9f4]" : "text-[#2a2927]/70 hover:text-[#2a2927]"}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`text-[9px] px-1 py-0.2 rounded-full font-mono leading-none ${isActive ? "bg-[#fbf9f4] text-[#2a2927]" : "bg-[#274e37] text-white"}`}>
                        {item.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Quick Icons */}
          <div className="flex items-center gap-3">
            {/* Cart Icon */}
            <button
              onClick={() => setCurrentPage("cart")}
              className="relative p-2 rounded-full bg-[#f6f3eb] hover:bg-[#ece7dc] border border-[#ece7dc] text-[#2a2927] transition-all group"
              title="Cart"
            >
              <ShoppingCart className="w-4 h-4 group-hover:scale-105 transition-transform" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={cartCount}
                  className="absolute -top-1 -right-1 bg-[#274e37] text-[#fbf9f4] text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center font-mono shadow border border-[#fbf9f4]"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {/* Profile Sign-in / Dropdown menu */}
            <div className="relative" ref={userMenuRef}>
              {user ? (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 p-1 bg-[#f6f3eb] hover:bg-[#ece7dc] border border-[#ece7dc] rounded-full transition-all cursor-pointer"
                >
                  <img
                    src={user.photoURL || ""}
                    alt={user.displayName || "User"}
                    className="w-6 h-6 rounded-full object-cover border border-white"
                    referrerPolicy="no-referrer"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-[#2a2927]/60 mr-1" />
                </button>
              ) : (
                <button
                  onClick={loginWithGoogle}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#274e37] hover:bg-[#203f2c] active:scale-95 text-xs text-white rounded-full transition-all cursor-pointer font-medium"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* User Dropdown */}
              <AnimatePresence>
                {showUserMenu && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-[#fbf9f4] border border-[#ece7dc] rounded-xl shadow-xl overflow-hidden z-50 py-1 text-left"
                  >
                    <div className="px-4 py-2 border-b border-[#ece7dc] bg-[#f6f3eb]/40">
                      <p className="text-xs font-semibold text-[#2a2927] truncate">{user.displayName}</p>
                      <p className="text-[10px] text-neutral-400 truncate mt-0.5">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentPage("profile");
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-xs text-left text-[#2a2927] hover:bg-[#f6f3eb] transition-colors"
                    >
                      Personal Dossier
                    </button>

                    <button
                      onClick={() => {
                        setCurrentPage("dashboard");
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-xs text-left text-[#2a2927] hover:bg-[#f6f3eb] transition-colors"
                    >
                      Study Goals
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-xs text-left text-[#c15c3d] hover:bg-[#c15c3d]/5 transition-colors border-t border-[#ece7dc] flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
