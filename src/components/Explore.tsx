import { useState, useMemo } from "react";
import { Book } from "../types";
import BookCard from "./BookCard";
import { Search, SlidersHorizontal, ArrowUpDown, Layers, Palette, RefreshCw } from "lucide-react";

interface ExploreProps {
  books: Book[];
  onAddToCart: (book: Book) => void;
  onAddToWishlist: (book: Book) => void;
  onSelectBook: (book: Book) => void;
  wishlistIds: string[];
  cartIds: string[];
}

export default function Explore({
  books,
  onAddToCart,
  onAddToWishlist,
  onSelectBook,
  wishlistIds,
  cartIds,
}: ExploreProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState<"title" | "price-asc" | "price-desc" | "rating">("title");
  const [visibleCount, setVisibleCount] = useState(6);

  // Get unique categories and genres
  const categories = useMemo(() => {
    const list = new Set(books.map((b) => b.category));
    return ["All", ...Array.from(list)];
  }, [books]);

  const genres = useMemo(() => {
    const list = new Set(books.flatMap((b) => b.genre));
    return ["All", ...Array.from(list)];
  }, [books]);

  // Filters + sorting computed state
  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    // Search query matching
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter((b) => b.category === selectedCategory);
    }

    // Genre filter
    if (selectedGenre !== "All") {
      result = result.filter((b) => b.genre.includes(selectedGenre));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

    return result;
  }, [books, searchQuery, selectedCategory, selectedGenre, sortBy]);

  const displayedBooks = filteredAndSortedBooks.slice(0, visibleCount);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedGenre("All");
    setSortBy("title");
    setVisibleCount(6);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Page Header */}
      <div className="flex flex-col items-start mb-10 text-left">
        <span className="text-[11px] font-mono tracking-widest text-[#274e37] uppercase font-bold bg-[#274e37]/5 px-3 py-1 rounded-full border border-[#274e37]/15">
          Curated Catalog
        </span>
        <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#2a2927] tracking-tight mt-3">
          Explore Books
        </h2>
        <p className="text-sm text-[#2a2927]/60 mt-2 font-sans max-w-lg">
          Browse luxury-grade literature bound in traditional French boards, physical texture mockups, and smart modern translations.
        </p>
      </div>

      {/* Modern Filter Bar Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-10 bg-[#f6f3eb] p-6 rounded-2xl border border-[#ece7dc]">
        
        {/* Search Input */}
        <div className="lg:col-span-5 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#2a2927]/40 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, authors, genres..."
            className="w-full bg-[#fbf9f4] border border-[#ece7dc] focus:border-[#ab9f8c] outline-none text-sm text-[#2a2927] pl-12 pr-4 py-3.5 rounded-full transition-all"
          />
        </div>

        {/* Sorting Dropdown */}
        <div className="lg:col-span-3 relative flex items-center gap-2">
          <ArrowUpDown className="text-[#2a2927]/40 w-4 h-4 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full bg-[#fbf9f4] border border-[#ece7dc] outline-none text-xs font-medium tracking-wide text-[#2a2927] px-4 py-3.5 rounded-full appearance-none cursor-pointer"
          >
            <option value="title">Sort: Alphabetical</option>
            <option value="price-asc">Sort: Price Low to High</option>
            <option value="price-desc">Sort: Price High to Low</option>
            <option value="rating">Sort: High Rating First</option>
          </select>
        </div>

        {/* Category Selector */}
        <div className="lg:col-span-2 relative flex items-center gap-2">
          <Layers className="text-[#2a2927]/40 w-4 h-4 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#fbf9f4] border border-[#ece7dc] outline-none text-xs font-medium tracking-wide text-[#2a2927] px-4 py-3.5 rounded-full appearance-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "All" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Genre Selector */}
        <div className="lg:col-span-2 relative flex items-center gap-2">
          <Palette className="text-[#2a2927]/40 w-4 h-4 shrink-0" />
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full bg-[#fbf9f4] border border-[#ece7dc] outline-none text-xs font-medium tracking-wide text-[#2a2927] px-4 py-3.5 rounded-full appearance-none cursor-pointer"
          >
            {genres.map((g) => (
              <option key={g} value={g}>
                {g === "All" ? "All Genres" : g}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Filter Stats & Reset */}
      {(searchQuery || selectedCategory !== "All" || selectedGenre !== "All") && (
        <div className="flex items-center gap-3 mb-8 text-xs font-mono">
          <span className="text-[#2a2927]/50">Filtered results: {filteredAndSortedBooks.length} items</span>
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-[#c15c3d] hover:underline font-bold"
          >
            <RefreshCw className="w-3 h-3" />
            Reset all filters
          </button>
        </div>
      )}

      {/* Book Grid */}
      {displayedBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
              onSelectBook={onSelectBook}
              isWishlisted={wishlistIds.includes(book.id)}
              isInCart={cartIds.includes(book.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-[#f6f3eb] rounded-3xl border border-dashed border-[#ece7dc]">
          <SlidersHorizontal className="w-10 h-10 text-neutral-400 mx-auto mb-4" />
          <p className="font-serif text-lg font-medium text-[#2a2927]">No exquisite volumes found</p>
          <p className="text-xs text-neutral-500 mt-1">Try relaxing terms or reset your filters.</p>
          <button
            onClick={resetFilters}
            className="mt-4 px-5 py-2 bg-[#2a2927] text-white text-xs font-semibold rounded-full hover:bg-[#274e37] transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Simulate Infinite Scroll/Loading More with Elegant Micro Interaction */}
      {filteredAndSortedBooks.length > displayedBooks.length && (
        <div className="flex justify-center mt-12 pt-6">
          <button
            onClick={() => setVisibleCount((prev) => prev + 3)}
            className="px-8 py-3.5 rounded-full border border-[#ece7dc] bg-[#f6f3eb] text-xs font-semibold uppercase tracking-widest text-[#2a2927] hover:bg-[#ece7dc] hover:border-[#ab9f8c] transition-all duration-300"
          >
            Load Next Vintage Stack
          </button>
        </div>
      )}
    </div>
  );
}
