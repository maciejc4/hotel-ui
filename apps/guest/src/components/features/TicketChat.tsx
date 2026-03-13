"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, ArrowLeft, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useHotel } from "@hotel-ui/shared/contexts/HotelContext";
import { Badge } from "@hotel-ui/shared/components/ui/badge";
import { getTicketStatusVariant } from "@hotel-ui/shared/lib/statusColor";
import { useRouter } from "next/navigation";

export default function TicketChatClient({ ticketId }: { ticketId: string }) {
    const { tickets, addTicketMessage } = useHotel();
    const router = useRouter();
    const t = useTranslations("tickets");
    const [input, setInput] = React.useState("");
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const ticket = tickets.find(t => t.id === ticketId);

    React.useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [ticket?.messages.length]);

    const handleSend = () => {
        if (!input.trim() || !ticket || ticket.status === "Closed") return;
        addTicketMessage(ticketId, {
            id: `msg-${Date.now()}`, sender: "guest", text: input, timestamp: new Date().toISOString(),
        });
        setInput("");

        // Simulate staff reply
        setTimeout(() => {
            addTicketMessage(ticketId, {
                id: `msg-${Date.now() + 1}`, sender: "staff",
                text: "Thanks for the update. We're working on it and will keep you posted.",
                timestamp: new Date().toISOString(),
            });
        }, 2500);
    };

    if (!ticket) {
        return (
            <div className="px-4 py-12 text-center">
                <p className="text-sm text-[var(--color-text-muted)]">{t("ticketNotFound")}</p>
                <button onClick={() => router.push("/guest/tickets")} className="text-sm text-primary font-bold mt-2">
                    {t("backToTickets")}
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Header */}
            <div className="px-4 py-3 glass-panel flex items-center gap-3">
                <button onClick={() => router.push("/guest/tickets")} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-bold text-[var(--color-text-main)] truncate">
                        {t("ticketChat", { category: ticket.category })}
                    </h2>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-mono text-[var(--color-text-muted)]">{ticket.id}</span>
                        <Badge variant={getTicketStatusVariant(ticket.status)} className="text-[10px]">{ticket.status}</Badge>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {ticket.messages.map(msg => (
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

            {/* Input / Closed notice */}
            {ticket.status === "Closed" ? (
                <div className="glass-panel-heavy p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-text-muted)]">
                        <Lock className="w-4 h-4" />
                        {t("ticketClosed")}
                    </div>
                </div>
            ) : (
                <div className="glass-panel-heavy p-4 flex gap-2">
                    <input
                        type="text"
                        placeholder={t("messageAboutIssue")}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        className="flex-1 glass-panel rounded-full px-4 py-3 text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-primary/50 bg-transparent"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-50 shadow-md"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
