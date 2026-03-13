"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useHotel } from "@hotel-ui/shared/contexts/HotelContext";
import { useGuestSession } from "@hotel-ui/shared/hooks/useGuestSession";

export default function GuestMessagesPage() {
    const { getOrCreateConversation, addConversationMessage } = useHotel();
    const session = useGuestSession();
    const t = useTranslations("messages");
    const [input, setInput] = React.useState("");
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const conv = React.useMemo(() => {
        if (!session) return null;
        return getOrCreateConversation(session.roomId, session.guestName);
    }, [session, getOrCreateConversation]);

    // Get latest conversation state
    const { conversations } = useHotel();
    const currentConv = conversations.find(c => c.id === conv?.id) || conv;

    React.useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [currentConv?.messages.length]);

    const handleSend = () => {
        if (!input.trim() || !currentConv) return;
        addConversationMessage(currentConv.id, {
            id: `msg-${Date.now()}`, sender: "guest", text: input, timestamp: new Date().toISOString(),
        });
        setInput("");

        // Simulate staff reply
        setTimeout(() => {
            addConversationMessage(currentConv.id, {
                id: `msg-${Date.now() + 1}`, sender: "staff",
                text: "Thank you for your message! Our team will get back to you shortly.",
                timestamp: new Date().toISOString(),
            });
        }, 2000);
    };

    if (!currentConv) return null;

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Header */}
            <div className="px-4 py-3 glass-panel">
                <h2 className="text-lg font-bold text-[var(--color-text-main)]">{t("chatWithReception")}</h2>
                <p className="text-xs text-[var(--color-text-muted)]">{t("replyTime")}</p>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {currentConv.messages.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            <Bot className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-sm text-[var(--color-text-muted)]">{t("sendMessage")}</p>
                    </div>
                )}
                {currentConv.messages.map(msg => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-2 ${msg.sender === "guest" ? "flex-row-reverse" : "flex-row"}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === "guest" ? "bg-primary" : "bg-gray-400"}`}>
                            {msg.sender === "guest" ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
                        </div>
                        <div className={`px-4 py-3 rounded-2xl max-w-[75%] text-sm shadow-sm ${msg.sender === "guest"
                                ? "bg-primary text-white rounded-tr-sm"
                                : "glass-panel text-[var(--color-text-main)] rounded-tl-sm"
                            }`}
                        >
                            {msg.text}
                            <p className="text-[10px] mt-1 opacity-50">{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Input */}
            <div className="glass-panel-heavy p-4 flex gap-2">
                <input
                    type="text"
                    placeholder={t("typeMessage")}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1 glass-panel rounded-full px-4 py-3 text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-primary/50 bg-transparent"
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-50 shadow-md glow-primary"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
