import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { Book } from "../types";

interface ThreeDBookProps {
  book: Book;
  interactive?: boolean;
  isOpenState?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function ThreeDBook({
  book,
  interactive = true,
  isOpenState = false,
  className = "",
  size = "md",
}: ThreeDBookProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Dimensions based on size
  const dimentions = {
    sm: { width: "130px", height: "190px", thickness: "18px" },
    md: { width: "200px", height: "290px", thickness: "28px" },
    lg: { width: "260px", height: "380px", thickness: "34px" },
  }[size];

  // Motion spring states for ultra-smooth 40% slower elegant rotation
  const rotateX = useSpring(useMotionValue(0), { damping: 40, stiffness: 60 });
  const rotateY = useSpring(useMotionValue(0), { damping: 40, stiffness: 60 });
  const [isOpening, setIsOpening] = useState(isOpenState);

  // Auto slow rotation if not moving cursor
  useEffect(() => {
    let angle = 0;
    let animId: number;
    
    const rotateSlowly = () => {
      if (!isHovered && !interactive) {
        angle += 0.2;
        rotateY.set(Math.sin((angle * Math.PI) / 180) * 8 - 12);
        rotateX.set(Math.cos((angle * Math.PI) / 180) * 3 + 6);
      }
      animId = requestAnimationFrame(rotateSlowly);
    };

    if (!interactive) {
      animId = requestAnimationFrame(rotateSlowly);
    }
    return () => cancelAnimationFrame(animId);
  }, [interactive]);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Normalizing angles to elegant, subtle tilt
    const angleY = (x / (rect.width / 2)) * 18; // cap tilt at 18deg
    const angleX = -(y / (rect.height / 2)) * 18;

    rotateY.set(angleY);
    rotateX.set(angleX);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!isOpenState) {
      setIsOpening(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isOpenState) {
      setIsOpening(false);
    }
    // Return gently to baseline look
    rotateX.set(10);
    rotateY.set(-15);
  };

  // Set baseline tilt when mount
  useEffect(() => {
    rotateX.set(12);
    rotateY.set(-14);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`book-3d-container flex items-center justify-center p-6 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ width: "320px", height: "420px" }}
    >
      <motion.div
        className="book-3d relative cursor-grab active:cursor-grabbing select-none"
        style={{
          width: dimentions.width,
          height: dimentions.height,
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          y: isHovered ? -16 : 0,
        }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1], // cinematic smooth ease
        }}
      >
        {/* Shadow plane casting soft depth on the beige floor */}
        <div
          className="absolute opacity-45 pointer-events-none rounded-sm blur-md bg-[#231b14] transition-all duration-700"
          style={{
            width: dimentions.width,
            height: dimentions.height,
            transform: "translateZ(-30px) translateY(24px) scale(0.95)",
            filter: isHovered ? "blur(14px) opacity(0.35)" : "blur(8px)",
          }}
        />

        {/* Back Cover */}
        <div
          className="absolute rounded-r-xs border border-white/5"
          style={{
            width: dimentions.width,
            height: dimentions.height,
            backgroundColor: book.accentColor || "#2a2927",
            transform: `translateZ(-${dimentions.thickness}) rotateY(180deg)`,
            transformOrigin: "left center",
            boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
          }}
        />

        {/* Spine */}
        <div
          className="absolute"
          style={{
            width: dimentions.thickness,
            height: dimentions.height,
            backgroundColor: book.accentColor || "#1a1918",
            left: `calc(0px - ${parseFloat(dimentions.thickness) / 2}px)`,
            transform: "rotateY(-90deg) translateZ(0px)",
            transformOrigin: "center center",
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.4)",
            borderLeft: "1px solid rgba(255,255,255,0.1)",
            borderRight: "1px solid rgba(0,0,0,0.3)",
          }}
        >
          {/* Gold lettering/foil lines on spine */}
          <div className="w-full h-full py-6 flex flex-col justify-between items-center text-[8px] font-serif uppercase tracking-widest text-[#fcf8f2]/85 [writing-mode:vertical-rl]">
            <span className="opacity-50">BookVerse Premium</span>
            <span className="font-semibold text-center select-none">{book.title}</span>
            <span className="opacity-60 text-[6px]">{book.author}</span>
          </div>
        </div>

        {/* Pages (Stacking effect) */}
        <div
          className="absolute bg-[#faf8f4]"
          style={{
            width: `calc(${dimentions.width} - 4px)`,
            height: `calc(${dimentions.height} - 8px)`,
            right: "2px",
            left: "auto",
            top: "4px",
            transform: `translateZ(-${parseFloat(dimentions.thickness) - 1.5}px) rotateY(0deg)`,
            transformStyle: "preserve-3d",
            boxShadow: "inset -4px 0 8px rgba(0,0,0,0.1), 1px 0 3px rgba(0,0,0,0.2)",
            borderRadius: "0 2px 2px 0",
          }}
        >
          {/* Simulated page ridge stripes */}
          <div className="absolute inset-y-0 right-0 w-2 bg-gradient-to-r from-transparent to-neutral-200/40" />
          <div className="absolute inset-y-0 right-1 w-[1px] bg-neutral-300 opacity-60" />
          <div className="absolute inset-y-0 right-2 w-[1px] bg-neutral-300 opacity-60" />
          <div className="absolute inset-y-0 right-3 w-[1px] bg-neutral-300 opacity-60" />

          {/* Slight flipping inner page */}
          <motion.div
            className="absolute bg-[#fcfbf9] origin-left border-l border-neutral-200 h-full w-full"
            style={{
              transformStyle: "preserve-3d",
            }}
            animate={{
              rotateY: isOpening ? -14 : -3,
            }}
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className="w-full h-full p-4 flex flex-col justify-between select-none opacity-40">
              <div className="text-[5px] leading-relaxed font-serif text-neutral-800">
                <p className="font-semibold text-[6px] mb-1">{book.title}</p>
                <p>{book.description.substring(0, 160)}...</p>
              </div>
              <div className="text-[4px] text-right text-neutral-400">23</div>
            </div>
          </motion.div>
        </div>

        {/* Front Cover with page opening transition */}
        <motion.div
          className="absolute rounded-r-xs origin-left overflow-hidden border border-white/5"
          style={{
            width: dimentions.width,
            height: dimentions.height,
            backgroundColor: book.accentColor || "#2a2927",
            transformStyle: "preserve-3d",
            boxShadow: "5px 5px 15px rgba(0,0,0,0.3)",
          }}
          animate={{
            rotateY: isOpening ? -20 : 0,
            translateZ: isOpening ? 2 : 0,
          }}
          transition={{
            duration: 1.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* Subtle leather or vintage paper grain texture */}
          <div className="absolute inset-0 opacity-15 mix-blend-overlay bg-[radial-gradient(#fff_15%,transparent_16%)] [background-size:8px_8px]" />
          
          {/* Book illustration image with vintage soft filter */}
          <img
            src={book.coverUrl}
            alt={book.title}
            className="absolute inset-0 w-full h-full object-cover opacity-75 mix-blend-color-burn grayscale-15 brightness-95"
            referrerPolicy="no-referrer"
          />

          {/* Golden foil label inside front cover */}
          <div className="absolute inset-x-3 bottom-4 top-4 p-3 border border-[#f5ead5]/30 bg-gradient-to-b from-black/60 to-black/80 flex flex-col justify-between rounded-sm">
            <div>
              <div className="text-[6px] font-mono tracking-widest text-[#dfcb9f]/80 uppercase mb-1">
                {book.category}
              </div>
              <h1 className="text-sm font-serif font-medium leading-tight text-[#f9f3e5] tracking-wide mt-2">
                {book.title}
              </h1>
              <p className="text-[7px] font-sans text-neutral-300 italic mt-1">
                by {book.author}
              </p>
            </div>

            <div className="flex justify-between items-end border-t border-[#f5ead5]/15 pt-2">
              <span className="text-[7px] font-mono text-[#dfcb9f]">{book.rating} ★</span>
              <span className="text-[6px] font-sans text-neutral-400 uppercase tracking-widest">
                VERSET
              </span>
            </div>
          </div>

          {/* High luxury golden spine strip */}
          <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-r from-black/50 via-white/10 to-transparent" />
        </motion.div>
      </motion.div>
    </div>
  );
}
