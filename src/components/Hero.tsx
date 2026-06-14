import { Book } from "../types";
import ThreeDBook from "./ThreeDBook";
import { ArrowRight, Trophy, Sparkles, TrendingUp, Heart } from "lucide-react";
import { motion } from "motion/react";

interface HeroProps {
  featuredBook: Book;
  onExplore: () => void;
  onSelectBook: (book: Book) => void;
  streakDays: number;
}

export default function Hero({
  featuredBook,
  onExplore,
  onSelectBook,
  streakDays
}: HeroProps) {
  return (
    <section className="relative w-full py-12 lg:py-20 bg-gradient-to-b from-[#fbf9f4] via-[#f7f4ec] to-[#fbf9f4] overflow-hidden border-b border-[#ece7dc]">
      
      {/* Absolute background visual rings/accents */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-[#274e37]/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-80 h-80 bg-[#c15c3d]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side Content Column */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          
          {/* Top highlight indicator */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="inline-flex items-center gap-2 bg-[#274e37]/6 border border-[#274e37]/20 px-3.5 py-1.5 rounded-full mb-6"
          >
            <Trophy className="w-4 h-4 text-[#274e37]" />
            <span className="text-xs font-mono font-medium tracking-wide text-[#274e37]">
              Continuous Streak: {streakDays} days of mindful learning
            </span>
          </motion.div>

          {/* Happy Reading Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-5xl md:text-7xl font-semibold leading-[1.08] text-[#2a2927] tracking-tight mb-6"
          >
            Happy <br />
            <span className="italic text-[#274e37] font-medium font-serif">Reading</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#2a2927]/70 text-lg leading-relaxed max-w-xl mb-8 font-sans"
          >
            Step into a silent universe where words take form, and narratives lift into 3D. 
            BookVerse couples meticulous physical aesthetic design with smart curation 
            for the modern literary seeker.
          </motion.p>

          {/* Action buttons matching the glass capsule and micro interaction */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-4 items-center"
          >
            <button
              onClick={onExplore}
              className="px-8 py-4 bg-[#2a2927] text-white hover:bg-[#274e37] rounded-full font-serif font-medium tracking-wide flex items-center gap-2 shadow-lg hover:shadow-[#274e37]/15 transition-all duration-300"
            >
              Explore Catalog
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => onSelectBook(featuredBook)}
              className="px-6 py-4 rounded-full border border-[#ece7dc] hover:border-[#ab9f8c] bg-white hover:bg-[#fbf9f4] text-xs font-semibold tracking-widest uppercase transition-all duration-300"
            >
              Quick Sample Reader
            </button>
          </motion.div>

          {/* Quick Stats banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="grid grid-cols-3 gap-6 sm:gap-12 mt-12 pt-8 border-t border-[#ece7dc] w-full max-w-lg"
          >
            <div>
              <span className="font-serif text-3xl font-semibold text-[#2a2927]">6k+</span>
              <p className="text-xs font-mono text-[#2a2927]/50 mt-1 uppercase tracking-wider">Premium Items</p>
            </div>
            <div>
              <span className="font-serif text-3xl font-semibold text-[#2a2927]">240+</span>
              <p className="text-xs font-mono text-[#2a2927]/50 mt-1 uppercase tracking-wider">Luxe Publishers</p>
            </div>
            <div>
              <span className="font-serif text-3xl font-semibold text-[#274e37]">4.9★</span>
              <p className="text-xs font-mono text-[#2a2927]/50 mt-1 uppercase tracking-wider">Platform Score</p>
            </div>
          </motion.div>

        </div>

        {/* Right Side Book Column (The centerpiece) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          
          {/* Subtle floating background halo rings */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(39,78,55,0.04),transparent_60%)] animate-pulse" />

          {/* Beautiful decorative stars layout */}
          <div className="absolute top-2 left-6 text-[#274e37]/35 animate-bounce">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="absolute bottom-1 right-8 text-[#c15c3d]/25">
            <Sparkles className="w-5 h-5" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onSelectBook(featuredBook)}
            className="relative transform-gpu scale-102 hover:scale-105 active:scale-98 transition-all hover:brightness-105 duration-800"
          >
            {/* Float wrapper */}
            <motion.div 
              animate={{
                y: [0, -12, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 6,
                ease: "easeInOut"
              }}
            >
              <ThreeDBook 
                book={featuredBook} 
                interactive={true} 
                size="lg"
                isOpenState={false}
              />
            </motion.div>

            {/* Click callout badge */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-md border border-[#ece7dc] pointer-events-none flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#274e37] animate-ping" />
              <span className="text-[10px] font-mono tracking-wider text-[#2a2927]/70 uppercase">
                Hover to Open &bull; Click to View
              </span>
            </div>
          </motion.div>

        </div>

      </div>

    </section>
  );
}
