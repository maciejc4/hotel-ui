"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Bot, User, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useHotel } from "@/contexts/HotelContext";

const STAFF_TICKET_REPLIES = [
    "Thank you for the update. A technician has been dispatched to your room.",
    "We understand the inconvenience. We're working on resolving this as quickly as possible.",
    "Could you provide a bit more detail? This will help us fix it faster.",
    "The issue has been escalated to our maintenance team. We'll keep you posted.",
    "We apologize for the inconvenience. Someone will be at your room within 15 minutes.",
];

export function TicketChatClient() {
    const params = useParams();
    const router = useRouter();
    const ticketId = params.id as string;
    const { tickets, addTicketMessage } = useHotel();
    const [input, setInput] = React.useState("");
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const ticket = tickets.find(t => t.id === ticketId);

    React.useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [ticket?.messages.length]);

    if (!ticket) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-white/30">
                <p>Ticket not found</p>
                <Button variant="ghost" className="mt-4 text-primary" onClick={() => router.push("/guest/tickets")}>
                    Back to Tickets
                </Button>
            </div>
        );
    }

    const handleSend = () => {
        if (!input.trim()) return;
        addTicketMessage(ticketId, {
            id: `msg-${Date.now()}`,
            sender: "guest",
            text: input,
            timestamp: new Date().toISOString(),
        });
        setInput("");

        setTimeout(() => {
            addTicketMessage(ticketId, {
                id: `msg-${Date.now()}`,
                sender: "staff",
                text: STAFF_TICKET_REPLIES[Math.floor(Math.random() * STAFF_TICKET_REPLIES.length)],
                timestamp: new Date().toISOString(),
            });
        }, 2000);
    };

    const statusColor = (status: string) => {
        switch (status) {
            case "New": return "destructive";
            case "In Progress": return "warning";
            case "Closed": return "success";
            default: return "secondary";
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] max-w-2xl mx-auto">
            <div className="px-4 py-3 border-b border-white/10 glass-panel-heavy">
                <div className="flex items-center gap-3 mb-2">
                    <button onClick={() => router.push("/guest/tickets")} className="text-white/50 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-white/50">{ticket.id}</span>
                            <Badge variant={statusColor(ticket.status)} className="text-[10px]">{ticket.status}</Badge>
                        </div>
                        <p className="text-sm font-bold text-white truncate">{ticket.issue}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/30 ml-8">
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{ticket.category}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                <div className="text-center">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-wider">Ticket Chat — {ticket.category}</span>
                </div>

                {ticket.messages.map((msg) => (
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
                            : "glass-panel text-white rounded-tl-sm"
                            }`}>
                            {msg.text}
                            <p className="text-[10px] opacity-40 mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {ticket.status !== "Closed" ? (
                <div className="p-3 glass-panel-heavy border-t border-white/10 flex gap-2">
                    <input
                        type="text"
                        placeholder="Message about this issue..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <Button variant="default" size="icon" className="rounded-full shrink-0 bg-primary" onClick={handleSend} disabled={!input.trim()}>
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            ) : (
                <div className="p-4 text-center text-white/30 text-sm border-t border-white/10">
                    This ticket has been closed. Create a new one if the issue persists.
                </div>
            )}
        </div>
    );
}
