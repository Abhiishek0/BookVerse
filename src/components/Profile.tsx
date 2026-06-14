import { Achievement, ReadingProgress } from "../types";
import { User, Shield, Trophy, Flame, Compass, Check, BookOpen } from "lucide-react";
import { motion } from "motion/react";

interface ProfileProps {
  achievements: Achievement[];
  history: ReadingProgress[];
  onBack: () => void;
}

export default function Profile({
  achievements,
  history,
  onBack,
}: ProfileProps) {
  
  // Icon selector mapping
  const getIcon = (name: string) => {
    if (name === "BookOpen") return BookOpen;
    if (name === "Flame") return Flame;
    if (name === "Heart") return Trophy;
    return Compass;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-left">
      
      {/* Upper Bio banner */}
      <div className="bg-[#f6f3eb] rounded-3xl border border-[#ece7dc] p-8 md:p-10 mb-10 relative overflow-hidden">
        
        {/* Glow visual behind avatar */}
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-[#274e37]/4 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
          
          {/* Avatar representation matching cream theme */}
          <div className="w-24 h-24 rounded-full bg-[#2a2927] text-white flex items-center justify-center shadow-lg border-2 border-white relative shrink-0">
            <span className="text-3xl font-serif font-medium uppercase text-[#fbf9f4]">A</span>
            <div className="absolute -bottom-1.5 -right-1.5 bg-[#274e37] text-white p-1 rounded-full border border-white" title="Premium Scholar status">
              <Shield className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Bio details and text */}
          <div className="text-center md:text-left space-y-2">
            <div className="flex flex-wrap gap-2.5 items-center justify-center md:justify-start">
              <h2 className="font-serif text-3xl font-semibold text-[#2a2927]">Arthur Pendragon</h2>
              <span className="text-[10px] font-mono tracking-widest text-[#274e37] uppercase bg-[#274e37]/5 px-2.5 py-0.5 rounded border border-[#274e37]/15 font-semibold">
                Gold Scholar
              </span>
            </div>
            
            <p className="text-sm text-neutral-500 font-sans max-w-md">
              Meticulous collector of fine mythology, wizardry maps, and modern economics narratives. Joined Fellowship in Winter 2024.
            </p>

            <div className="flex gap-4 pt-3 text-xs font-mono text-neutral-400">
              <span>Member #83921</span>
              <span>&bull;</span>
              <span>Credits: 1,420 pts</span>
            </div>
          </div>

        </div>

      </div>

      {/* Main achievements list */}
      <h3 className="font-serif text-2xl font-semibold text-[#2a2927] mb-6">Unlocked Milestones</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {achievements.map((ach) => {
          const Icon = getIcon(ach.iconName);
          const isUnlocked = ach.progressCurrent >= ach.progressMax;
          return (
            <div 
              key={ach.id}
              className={`p-5 rounded-2xl border flex items-start gap-4 transition-all ${
                isUnlocked 
                  ? "bg-[#274e37]/5 border-[#274e37]/20" 
                  : "bg-[#f6f3eb] border-[#ece7dc]"
              }`}
            >
              {/* Icon frame */}
              <div className={`p-3 rounded-full shrink-0 ${
                isUnlocked ? "bg-[#274e37]/10 text-[#274e37]" : "bg-stone-200 text-stone-400"
              }`}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Text metadata */}
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-serif text-base font-semibold text-[#2a2927]">{ach.title}</h4>
                  {isUnlocked && (
                    <span className="text-[9px] font-mono text-[#274e37] uppercase font-bold tracking-widest flex items-center gap-1">
                      <Check className="w-3 h-3" /> Unlocked
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-500 leading-normal">{ach.description}</p>

                {/* Tracking bar */}
                <div className="pt-2">
                  <div className="w-full bg-stone-200/50 h-1.5 rounded-full overflow-hidden mb-1">
                    <div 
                      className="bg-[#274e37] h-full rounded-full transition-all"
                      style={{ width: `${(ach.progressCurrent / ach.progressMax) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between font-mono text-[9px] text-neutral-400">
                    <span>Progress: {ach.progressCurrent} / {ach.progressMax}</span>
                    <span>{((ach.progressCurrent / ach.progressMax) * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
