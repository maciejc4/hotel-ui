"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Smile, Sparkles } from "lucide-react";
import { cn } from "@hotel-ui/shared/lib/utils";

export function KidsModeToggle() {
    const [isKidsMode, setIsKidsMode] = React.useState(false);
    const [justToggled, setJustToggled] = React.useState(false);

    React.useEffect(() => {
        const saved = localStorage.getItem("kidsMode");
        if (saved === "true") {
            setIsKidsMode(true);
            document.body.classList.add("kids-mode");
        }
    }, []);

    const toggleMode = () => {
        const nextMode = !isKidsMode;
        setIsKidsMode(nextMode);
        setJustToggled(true);
        setTimeout(() => setJustToggled(false), 500);

        localStorage.setItem("kidsMode", String(nextMode));
        if (nextMode) {
            document.body.classList.add("kids-mode");
        } else {
            document.body.classList.remove("kids-mode");
        }
    };

    return (
        <div className="flex items-center gap-2">
            <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider transition-colors duration-300",
                isKidsMode ? "text-amber-600" : "text-[var(--color-text-muted)]"
            )}>
                {isKidsMode ? "🧒 Kids" : "Kids"}
            </span>
            <button
                onClick={toggleMode}
                className={cn(
                    "relative flex h-10 w-20 cursor-pointer items-center rounded-full p-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    isKidsMode
                        ? "bg-gradient-to-r from-yellow-400 to-emerald-400 shadow-[0_0_20px_rgba(250,204,21,0.4)]"
                        : "bg-gray-200 hover:bg-gray-300"
                )}
                aria-label="Toggle Kids Mode"
            >
                {/* Background icons */}
                <span className="absolute left-2 flex items-center justify-center text-white text-xs opacity-70">
                    {isKidsMode ? "✨" : <Smile size={14} />}
                </span>
                <span className="absolute right-2 flex items-center justify-center text-white text-xs opacity-70">
                    {isKidsMode ? <Smile size={14} /> : "✨"}
                </span>

                <motion.div
                    layout
                    className={cn(
                        "z-10 flex h-8 w-8 items-center justify-center rounded-full shadow-md",
                        isKidsMode ? "bg-white" : "bg-white",
                        justToggled && "kids-bounce"
                    )}
                    animate={{
                        x: isKidsMode ? 40 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 700, damping: 30 }}
                >
                    {isKidsMode ? (
                        <span className="text-base">🧒</span>
                    ) : (
                        <Smile size={16} className="text-primary" />
                    )}
                </motion.div>
            </button>
        </div>
    );
}
