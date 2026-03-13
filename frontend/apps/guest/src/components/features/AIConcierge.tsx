"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { fetchAIResponses } from "@hotel-ui/shared/services/api";

export function AIConcierge() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [messages, setMessages] = React.useState<{ id: string; role: "user" | "ai"; text: string }[]>([]);
    const [input, setInput] = React.useState("");
    const [aiResponses, setAiResponses] = React.useState<string[]>([]);
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const t = useTranslations("ai");

    React.useEffect(() => {
        fetchAIResponses().then(setAiResponses).catch(console.error);
    }, []);

    React.useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [messages.length]);

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg = { id: `u-${Date.now()}`, role: "user" as const, text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");

        setTimeout(() => {
            const randomResponse = aiResponses.length > 0
                ? aiResponses[Math.floor(Math.random() * aiResponses.length)]
                : "I'm happy to help! Could you please provide more details?";
            setMessages(prev => [...prev, { id: `a-${Date.now()}`, role: "ai", text: randomResponse }]);
        }, 1200);
    };

    return (
        <>
            {/* FAB */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center shadow-xl glow-primary"
            >
                <Sparkles className="w-6 h-6" />
            </button>

            {/* Fullscreen Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">{t("aiConcierge")}</h3>
                                    <p className="text-[10px] text-gray-400">AI Powered</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.length === 0 && (
                                <div className="text-center py-8">
                                    <Sparkles className="w-10 h-10 text-primary/30 mx-auto mb-3" />
                                    <p className="text-sm text-gray-500">{t("greeting")}</p>
                                </div>
                            )}
                            {messages.map(msg => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm ${msg.role === "user"
                                            ? "bg-primary text-white rounded-tr-sm"
                                            : "bg-gray-100 text-gray-800 rounded-tl-sm"
                                        }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-100 flex gap-2">
                            <input
                                type="text"
                                placeholder={t("askAnything")}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-50 shadow-md"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
