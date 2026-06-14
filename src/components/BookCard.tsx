import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { useState } from "react";
import { Book } from "../types";
import { motion } from "motion/react";

interface BookCardProps {
  key?: string;
  book: Book;
  onAddToCart: (book: Book) => void;
  onAddToWishlist: (book: Book) => void;
  onSelectBook: (book: Book) => void;
  isWishlisted: boolean;
  isInCart: boolean;
}

export default function BookCard({
  book,
  onAddToCart,
  onAddToWishlist,
  onSelectBook,
  isWishlisted,
  isInCart
}: BookCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group relative flex flex-col justify-between bg-[#f6f3eb] rounded-2xl border border-[#ece7dc] overflow-hidden p-4 transition-all duration-700 ease-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered 
          ? "0 22px 40px -15px rgba(42,41,39,0.12)" 
          : "0 4px 12px -5px rgba(42,41,39,0.04)"
      }}
      animate={{
        y: isHovered ? -8 : 0
      }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      {/* Favorite absolute button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddToWishlist(book);
        }}
        className="absolute top-6 right-6 z-10 p-2 rounded-full cursor-pointer glass-button hover:bg-[#c15c3d]/10 hover:border-[#c15c3d]/20 transition-all duration-300"
      >
        <Heart
          className={`w-4 h-4 transition-transform group-hover:scale-110 ${
            isWishlisted ? "fill-[#c15c3d] text-[#c15c3d]" : "text-[#2a2927]/60"
          }`}
        />
      </button>

      {/* Book artwork / visual stage */}
      <div 
        onClick={() => onSelectBook(book)}
        className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer bg-[#e9e4d9] flex justify-center items-center group-hover:bg-[#e2ddd0] transition-colors duration-700 mb-4 shadow-inner"
      >
        {/* Soft radial glare behind book */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.45),transparent_75%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Scaled/skewed cover mockup representation */}
        <motion.div
          className="relative w-[110px] h-[160px] transform-gpu transition-all duration-700 ease-out"
          animate={{
            scale: isHovered ? 1.08 : 1,
            rotateY: isHovered ? -10 : 0,
            z: isHovered ? 20 : 0
          }}
          style={{
            perspective: 600,
            transformStyle: "preserve-3d"
          }}
        >
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover rounded-sm shadow-md"
            referrerPolicy="no-referrer"
          />
          {/* Subtle page paper white accent edge */}
          <div className="absolute top-[2px] bottom-[2px] right-[-2px] w-[2px] bg-neutral-200 shadow-inner" />
          <div className="absolute top-[1px] bottom-[1px] right-[-3px] w-[1px] bg-neutral-300" />
        </motion.div>

        {/* Hover overlay icons */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectBook(book);
            }}
            className="glass-button px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-[11px] font-medium text-[#2a2927] hover:bg-[#2a2927] hover:text-white"
          >
            <Eye className="w-3.5 h-3.5" />
            Detail
          </button>
        </div>
      </div>

      {/* Descriptive texts */}
      <div className="flex flex-col flex-grow">
        <span className="text-[10px] font-mono tracking-widest text-[#2a2927]/50 uppercase mb-1">
          {book.category}
        </span>
        <h3 
          onClick={() => onSelectBook(book)}
          className="font-serif text-base font-semibold leading-snug text-[#2a2927] hover:text-[#274e37] cursor-pointer transition-colors line-clamp-1"
        >
          {book.title}
        </h3>
        <p className="text-xs text-[#2a2927]/60 mt-1 line-clamp-1 italic">
          by {book.author}
        </p>

        {/* Rating stars line */}
        <div className="flex items-center gap-1 mt-2.5">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(book.rating) ? "fill-amber-500 text-amber-500" : "text-neutral-300"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono text-[#2a2927]/50 font-medium">
            {book.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Bottom price and action block */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#ece7dc]">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-[#2a2927]/40 uppercase leading-none">Price</span>
          <span className="font-mono text-sm font-semibold text-[#2a2927] mt-1">
            ₹{book.price.toFixed(2)}
          </span>
        </div>

        {/* Dynamic add to cart action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(book);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-500 ${
            isInCart
              ? "bg-[#274e37] text-white"
              : "bg-[#2a2927] text-white hover:bg-[#274e37] hover:shadow-md"
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          {isInCart ? "In Cart" : "Buy Now"}
        </button>
      </div>
    </motion.div>
  );
}
