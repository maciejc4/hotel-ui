"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, MapPin } from "lucide-react";

interface MapLocation {
    id: string;
    name: string;
    emoji: string;
    x: number;
    y: number;
    color: string;
    hours?: string;
    description?: string;
}

const LOCATIONS: MapLocation[] = [
    { id: "beach", name: "Beach", emoji: "🏖️", x: 50, y: 8, color: "#3b82f6", hours: "Open access", description: "Sandy beach with sunbeds & umbrellas" },
    { id: "pool", name: "Main Pool", emoji: "🏊", x: 50, y: 35, color: "#06b6d4", hours: "08:00 – 20:00", description: "Infinity pool with panoramic views" },
    { id: "pool-bar", name: "Pool Bar", emoji: "🍸", x: 76, y: 35, color: "#f43f5e", hours: "10:00 – 18:00", description: "Cocktails & light snacks poolside" },
    { id: "spa", name: "SPA & Wellness", emoji: "🧘", x: 82, y: 14, color: "#a855f7", hours: "08:00 – 20:00", description: "Massages, facials & thermal circuits" },
    { id: "restaurant", name: "Ocean Breeze Restaurant", emoji: "🍽️", x: 18, y: 60, color: "#f97316", hours: "07:00 – 22:00", description: "International buffet & live cooking" },
    { id: "kids-club", name: "Kids Club", emoji: "🧒", x: 78, y: 62, color: "#22c55e", hours: "09:00 – 17:00", description: "Supervised play (ages 4–12)" },
    { id: "gym", name: "Fitness Center", emoji: "🏋️", x: 82, y: 80, color: "#64748b", hours: "24/7 keycard", description: "Full gym + group fitness studio" },
    { id: "main-building", name: "Main Building", emoji: "🏨", x: 40, y: 70, color: "#6366f1", description: "Reception, lobby & your room" },
    { id: "amphitheatre", name: "Amphitheatre", emoji: "🎵", x: 18, y: 82, color: "#ec4899", hours: "20:00 – 23:00", description: "Live entertainment every evening" },
    { id: "parking", name: "Parking / Car Rental", emoji: "🚗", x: 60, y: 90, color: "#78716c", hours: "24/7", description: "Free parking & rental desk" },
];

export function ResortMap() {
    const [selected, setSelected] = React.useState<MapLocation | null>(null);

    return (
        <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
            {/* SVG Map */}
            <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Sky gradient */}
                <defs>
                    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#bae6fd" />
                        <stop offset="100%" stopColor="#e0f2fe" />
                    </linearGradient>
                    <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.3" />
                    </linearGradient>
                    <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fde68a" />
                        <stop offset="100%" stopColor="#fcd34d" />
                    </linearGradient>
                    <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#86efac" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#4ade80" stopOpacity="0.3" />
                    </linearGradient>
                    <linearGradient id="poolWater" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#67e8f9" />
                        <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                    <filter id="shadow">
                        <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.15" />
                    </filter>
                </defs>

                {/* Background */}
                <rect width="400" height="300" fill="url(#sky)" rx="16" />

                {/* Sea / water area (top) */}
                <rect x="0" y="0" width="400" height="55" fill="url(#water)" rx="16" />
                {/* Wave lines */}
                <path d="M0 45 Q50 40 100 45 T200 45 T300 45 T400 45" stroke="#fff" strokeWidth="1" fill="none" opacity="0.4" />
                <path d="M0 50 Q50 45 100 50 T200 50 T300 50 T400 50" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.3" />

                {/* Beach / sand strip */}
                <rect x="0" y="50" width="400" height="25" fill="url(#sand)" opacity="0.7" />
                {/* Palm trees on beach */}
                <g opacity="0.6" transform="translate(30, 52)">
                    <line x1="5" y1="20" x2="5" y2="5" stroke="#92400e" strokeWidth="2" />
                    <ellipse cx="5" cy="3" rx="8" ry="4" fill="#16a34a" />
                </g>
                <g opacity="0.6" transform="translate(120, 55)">
                    <line x1="5" y1="18" x2="5" y2="5" stroke="#92400e" strokeWidth="2" />
                    <ellipse cx="5" cy="3" rx="7" ry="3.5" fill="#16a34a" />
                </g>
                <g opacity="0.6" transform="translate(340, 53)">
                    <line x1="5" y1="19" x2="5" y2="5" stroke="#92400e" strokeWidth="2" />
                    <ellipse cx="5" cy="3" rx="8" ry="4" fill="#16a34a" />
                </g>

                {/* Grass / garden areas */}
                <rect x="0" y="75" width="400" height="225" fill="#f0fdf4" rx="0" />
                <ellipse cx="100" cy="220" rx="70" ry="30" fill="url(#grass)" />
                <ellipse cx="320" cy="160" rx="50" ry="25" fill="url(#grass)" />
                <ellipse cx="200" cy="280" rx="80" ry="25" fill="url(#grass)" />

                {/* Paths */}
                <path d="M160 210 L160 105 L250 105 L250 210 L160 210" stroke="#d1d5db" strokeWidth="3" fill="none" strokeDasharray="6 4" opacity="0.5" />
                <path d="M200 105 L200 75" stroke="#d1d5db" strokeWidth="3" fill="none" strokeDasharray="6 4" opacity="0.5" />
                <path d="M250 160 L340 160" stroke="#d1d5db" strokeWidth="2" fill="none" strokeDasharray="6 4" opacity="0.4" />
                <path d="M160 160 L70 180" stroke="#d1d5db" strokeWidth="2" fill="none" strokeDasharray="6 4" opacity="0.4" />

                {/* Pool */}
                <rect x="170" y="90" width="80" height="40" rx="12" fill="url(#poolWater)" stroke="#06b6d4" strokeWidth="1" opacity="0.8" />
                {/* Pool lane lines */}
                <line x1="190" y1="95" x2="190" y2="125" stroke="white" strokeWidth="0.5" opacity="0.5" />
                <line x1="210" y1="95" x2="210" y2="125" stroke="white" strokeWidth="0.5" opacity="0.5" />
                <line x1="230" y1="95" x2="230" y2="125" stroke="white" strokeWidth="0.5" opacity="0.5" />

                {/* Main building */}
                <rect x="135" y="190" width="80" height="45" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" filter="url(#shadow)" />
                <rect x="140" y="195" width="10" height="10" rx="1" fill="#bfdbfe" />
                <rect x="155" y="195" width="10" height="10" rx="1" fill="#bfdbfe" />
                <rect x="170" y="195" width="10" height="10" rx="1" fill="#bfdbfe" />
                <rect x="185" y="195" width="10" height="10" rx="1" fill="#bfdbfe" />
                <rect x="200" y="195" width="10" height="10" rx="1" fill="#bfdbfe" />
                <rect x="140" y="210" width="10" height="10" rx="1" fill="#bfdbfe" />
                <rect x="155" y="210" width="10" height="10" rx="1" fill="#bfdbfe" />
                <rect x="170" y="210" width="10" height="10" rx="1" fill="#bfdbfe" />
                <rect x="185" y="210" width="10" height="10" rx="1" fill="#bfdbfe" />
                <rect x="200" y="210" width="10" height="10" rx="1" fill="#bfdbfe" />
                {/* Door */}
                <rect x="168" y="225" width="14" height="10" rx="2" fill="#f97316" />

                {/* Restaurant building */}
                <rect x="40" y="165" width="55" height="30" rx="4" fill="#fed7aa" stroke="#f97316" strokeWidth="1" filter="url(#shadow)" />

                {/* Kids club */}
                <rect x="290" y="170" width="50" height="28" rx="8" fill="#bbf7d0" stroke="#22c55e" strokeWidth="1" filter="url(#shadow)" />

                {/* SPA building */}
                <rect x="310" y="28" width="50" height="25" rx="6" fill="#e9d5ff" stroke="#a855f7" strokeWidth="1" filter="url(#shadow)" />

                {/* Gym */}
                <rect x="310" y="225" width="45" height="25" rx="4" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" filter="url(#shadow)" />

                {/* Amphitheatre (semicircle) */}
                <path d="M45 240 A25 25 0 0 1 95 240" fill="#fce7f3" stroke="#ec4899" strokeWidth="1" filter="url(#shadow)" />
                <path d="M55 240 A18 18 0 0 1 85 240" fill="#fbcfe8" stroke="#ec4899" strokeWidth="0.5" />

                {/* Parking */}
                <rect x="220" y="260" width="50" height="22" rx="3" fill="#f1f5f9" stroke="#9ca3af" strokeWidth="1" strokeDasharray="4 2" />

                {/* Trees / vegetation dots */}
                <circle cx="130" cy="150" r="6" fill="#86efac" opacity="0.7" />
                <circle cx="120" cy="140" r="5" fill="#4ade80" opacity="0.5" />
                <circle cx="270" cy="140" r="6" fill="#86efac" opacity="0.7" />
                <circle cx="280" cy="135" r="5" fill="#4ade80" opacity="0.5" />
                <circle cx="100" cy="260" r="7" fill="#86efac" opacity="0.6" />
                <circle cx="350" cy="150" r="5" fill="#86efac" opacity="0.5" />
            </svg>

            {/* Interactive location markers */}
            {LOCATIONS.map((loc) => (
                <button
                    key={loc.id}
                    onClick={() => setSelected(selected?.id === loc.id ? null : loc)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                    style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                    aria-label={loc.name}
                >
                    <motion.div
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="relative"
                    >
                        {/* Pulse ring */}
                        <div
                            className="absolute inset-0 rounded-full animate-ping opacity-30"
                            style={{ backgroundColor: loc.color, animationDuration: "3s" }}
                        />
                        <div
                            className="relative w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg border-2 border-white/80 cursor-pointer"
                            style={{ backgroundColor: loc.color }}
                        >
                            <span className="drop-shadow-sm">{loc.emoji}</span>
                        </div>
                    </motion.div>
                </button>
            ))}

            {/* Info popup */}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-20 left-1/2 -translate-x-1/2 bottom-2 w-[90%] max-w-xs"
                    >
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm"
                                        style={{ backgroundColor: selected.color + "22" }}
                                    >
                                        {selected.emoji}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{selected.name}</h4>
                                        {selected.description && (
                                            <p className="text-xs text-gray-500 mt-0.5">{selected.description}</p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelected(null)}
                                    className="text-gray-400 hover:text-gray-600 mt-0.5"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            {selected.hours && (
                                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    <span>{selected.hours}</span>
                                    <span className="ml-auto flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        Resort
                                    </span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
