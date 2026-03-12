"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHotel } from "@/contexts/HotelContext";

const STAFF_REPLIES = [
    "Of course! We'll take care of that right away.",
    "Thank you for reaching out. Let me check on that for you.",
    "Absolutely! Is there anything else you need?",
    "We'll send someone to your room shortly.",
    "Great question! Let me get back to you with the details.",
];

export default function GuestMessagesPage() {
    const { conversations, addConversationMessage, getOrCreateConversation } = useHotel();
    const [input, setInput] = React.useState("");
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const session = React.useMemo(() => {
        if (typeof window === "undefined") return null;
        const data = localStorage.getItem("guestSession");
        return data ? JSON.parse(data) : null;
    }, []);

    const conversation = React.useMemo(() => {
        if (!session) return null;
        return conversations.find(c => c.roomId === session.roomId) || null;
    }, [session, conversations]);

    const convId = conversation?.id;

    React.useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [conversation?.messages.length]);

    const handleSend = () => {
        if (!input.trim() || !session) return;

        const conv = conversation || getOrCreateConversation(session.roomId, session.guestName);
        const msgId = `msg-${Date.now()}`;
        addConversationMessage(conv.id, {
            id: msgId, sender: "guest", text: input, timestamp: new Date().toISOString(),
        });
        setInput("");

        // Mock staff reply
        setTimeout(() => {
            addConversationMessage(conv.id, {
                id: `msg-${Date.now()}`,
                sender: "staff",
                text: STAFF_REPLIES[Math.floor(Math.random() * STAFF_REPLIES.length)],
                timestamp: new Date().toISOString(),
            });
        }, 2000);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] max-w-2xl mx-auto">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200/60">
                <h1 className="text-lg font-bold text-[var(--color-text-main)]">Chat with Reception</h1>
                <p className="text-xs text-[var(--color-text-muted)]">We typically reply within a few minutes</p>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {(conversation?.messages || []).map((msg, idx) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-2 ${msg.sender === "guest" ? "flex-row-reverse" : "flex-row"}`}
                    >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.sender === "guest" ? "bg-accent" : "bg-primary"
                            }`}>
                            {msg.sender === "guest" ? <User size={12} className="text-white" /> : <Bot size={12} className="text-white" />}
                        </div>
                        <div className={`px-4 py-2.5 rounded-2xl max-w-[75%] text-sm ${msg.sender === "guest"
                                ? "bg-primary text-white rounded-tr-sm"
                                : "glass-panel text-[var(--color-text-main)] rounded-tl-sm"
                            }`}>
                            {msg.text}
                        </div>
                    </motion.div>
                ))}
                {(!conversation || conversation.messages.length === 0) && (
                    <div className="text-center text-[var(--color-text-muted)] text-sm py-12">
                        <Bot className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>Send a message to the reception</p>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-3 glass-panel-heavy border-t border-gray-200/60 flex gap-2">
                <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 bg-white/50 border border-gray-200 rounded-full px-4 py-3 text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button variant="default" size="icon" className="rounded-full shrink-0 bg-primary text-white" onClick={handleSend} disabled={!input.trim()}>
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
