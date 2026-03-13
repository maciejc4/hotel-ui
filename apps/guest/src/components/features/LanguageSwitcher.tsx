"use client";

import * as React from "react";
import { Globe } from "lucide-react";

const LANGUAGES = [
    { code: "en", label: "EN", flag: "🇬🇧" },
    { code: "pl", label: "PL", flag: "🇵🇱" },
    { code: "de", label: "DE", flag: "🇩🇪" },
] as const;

export function LanguageSwitcher({ variant = "default" }: { variant?: "default" | "compact" }) {
    const [current, setCurrent] = React.useState("en");
    const [isOpen, setIsOpen] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const saved = localStorage.getItem("lang");
        if (saved) setCurrent(saved);
    }, []);

    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (code: string) => {
        setCurrent(code);
        localStorage.setItem("lang", code);
        setIsOpen(false);
        // Dispatch custom event for same-tab reactivity
        window.dispatchEvent(new CustomEvent("localeChange", { detail: code }));
    };

    const currentLang = LANGUAGES.find(l => l.code === current) || LANGUAGES[0];

    if (variant === "compact") {
        return (
            <div className="relative" ref={ref}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium text-[var(--color-text-muted)] hover:bg-white/40 transition-colors"
                    aria-label="Change language"
                >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{currentLang.flag} {currentLang.label}</span>
                </button>
                {isOpen && (
                    <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 min-w-[100px]">
                        {LANGUAGES.map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => handleSelect(lang.code)}
                                className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors ${current === lang.code ? "text-primary bg-primary/5" : "text-gray-600"}`}
                            >
                                <span>{lang.flag}</span>
                                <span>{lang.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full glass-panel text-sm font-medium text-[var(--color-text-muted)] hover:bg-white/40 transition-colors"
                aria-label="Change language"
            >
                <Globe className="w-4 h-4" />
                <span>{currentLang.flag} {currentLang.label}</span>
            </button>
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 min-w-[140px]">
                    {LANGUAGES.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => handleSelect(lang.code)}
                            className={`w-full px-4 py-2.5 text-left text-sm font-medium flex items-center gap-2.5 hover:bg-gray-50 transition-colors ${current === lang.code ? "text-primary bg-primary/5" : "text-gray-600"}`}
                        >
                            <span className="text-base">{lang.flag}</span>
                            <span>{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
