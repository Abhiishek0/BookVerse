import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface RouteTransitionOverlayProps {
  currentPage: string;
  selectedBookId?: string | null;
  children: React.ReactNode;
}

export default function RouteTransitionOverlay({
  currentPage,
  selectedBookId,
  children
}: RouteTransitionOverlayProps) {
  // We combine currentPage and selectedBookId as the transition key because a user
  // navigating from browse -> book detail should trigger a beautiful transition view.
  const routeKey = `${currentPage}-${selectedBookId || ""}`;
  const [displayKey, setDisplayKey] = useState(routeKey);

  useEffect(() => {
    // Update displayKey instantly so there is NO delay or lag on user clicks
    setDisplayKey(routeKey);
  }, [routeKey]);

  return (
    <div className="relative w-full h-full min-h-[60vh] flex flex-col">
      {/* Underlying Route Views with Smooth, Snappy Fades and Subtle Scale */}
      <div className="flex-1 w-full">
        <AnimatePresence mode="wait">
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return null;
            
            // Get the dynamic component identifier
            const childKey = child.key ? String(child.key) : "";
            const cleanChildKey = childKey.replace(/^\.\$/, "");
            const displayKeyBase = displayKey.split("-")[0];
            
            if (cleanChildKey === displayKeyBase || childKey === displayKeyBase) {
              return (
                <motion.div
                  key={displayKey}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="w-full h-full flex flex-col"
                >
                  {child}
                </motion.div>
              );
            }
            return null;
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

