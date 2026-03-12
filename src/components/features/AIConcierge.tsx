"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AI_RESPONSES } from "@/lib/mockData";

export function AIConcierge() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [messages, setMessages] = React.useState<{ text: string; isBot: boolean }[]>([
        { text: "Hi there! I'm your AI Concierge. Ask me about restaurants, activities, SPA, or anything else! ✨", isBot: true },
    ]);
    const [input, setInput] = React.useState("");
    const scrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [messages.length]);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages((prev) => [...prev, { text: input, isBot: false }]);
        setInput("");
        setTimeout(() => {
            const randomResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
            setMessages((prev) => [...prev, { text: randomResponse, isBot: true }]);
        }, 1200);
    };

    return (
        <>
            {/* FAB — positioned above bottom tab bar */}
            <div className="fixed bottom-28 right-4 z-50">
                <Button
                    variant="default"
                    size="icon"
                    className="w-14 h-14 rounded-full shadow-2xl bg-gradient-to-br from-primary to-accent border-0 glow-primary hover:scale-105 active:scale-95 transition-transform"
                    onClick={() => setIsOpen(true)}
                >
                    <Sparkles className="w-6 h-6 text-white" />
                </Button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-x-2 bottom-20 sm:bottom-28 sm:right-4 sm:left-auto sm:w-[380px] h-[500px] max-h-[70vh] glass-panel-heavy rounded-3xl overflow-hidden shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary to-accent p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                <h3 className="font-bold">AI Concierge</h3>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-900/50">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={idx}
                                    className={`flex gap-2 ${msg.isBot ? "flex-row" : "flex-row-reverse"}`}
                                >
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.isBot ? "bg-primary" : "bg-accent"}`}>
                                        {msg.isBot ? <Bot size={12} className="text-white" /> : <User size={12} className="text-white" />}
                                    </div>
                                    <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm ${msg.isBot
                                            ? "glass-panel text-white rounded-tl-sm"
                                            : "bg-primary text-white rounded-tr-sm"
                                        }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-3 glass-panel border-t border-white/10 flex gap-2">
                            <input
                                type="text"
                                placeholder="Ask me anything..."
                                className="flex-1 bg-white/5 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            />
                            <Button variant="default" size="icon" className="rounded-full shrink-0 bg-primary" onClick={handleSend} disabled={!input.trim()}>
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
