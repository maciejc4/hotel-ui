"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, AlertTriangle, Clock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useHotel } from "@/contexts/HotelContext";
import { useToast } from "@/components/ui/toast";
import { TICKET_CATEGORIES } from "@/lib/mockData";
import { useRouter } from "next/navigation";

export default function GuestTicketsPage() {
    const router = useRouter();
    const { tickets, addTicket } = useHotel();
    const { showToast } = useToast();
    const [showReportModal, setShowReportModal] = React.useState(false);
    const [category, setCategory] = React.useState("");
    const [description, setDescription] = React.useState("");

    const session = React.useMemo(() => {
        if (typeof window === "undefined") return null;
        const data = localStorage.getItem("guestSession");
        return data ? JSON.parse(data) : null;
    }, []);

    const myTickets = tickets.filter(t => t.roomId === session?.roomId);

    const handleSubmitTicket = () => {
        if (!category || !description.trim()) return;
        const newTicket = {
            id: `TCK-${String(tickets.length + 1).padStart(3, "0")}`,
            roomId: session?.roomId || "",
            category,
            issue: description,
            status: "New" as const,
            createdAt: new Date().toISOString(),
            messages: [{
                id: `msg-${Date.now()}`,
                sender: "guest" as const,
                text: description,
                timestamp: new Date().toISOString(),
            }],
        };
        addTicket(newTicket);
        setShowReportModal(false);
        setCategory("");
        setDescription("");
        showToast("Issue reported! Our team has been notified.");
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
        <div className="px-4 py-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl font-bold text-[var(--color-text-main)]">My Tickets</h1>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">Report and track issues</p>
                </div>
                <Button
                    variant="default"
                    size="sm"
                    className="bg-gradient-to-r from-primary to-accent border-0 text-white glow-primary"
                    onClick={() => setShowReportModal(true)}
                >
                    <Plus className="w-4 h-4 mr-1" /> Report Issue
                </Button>
            </div>

            {myTickets.length === 0 ? (
                <div className="text-center text-[var(--color-text-muted)] py-16">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No issues reported</p>
                    <p className="text-xs mt-1">Everything working? Great!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {myTickets.map((ticket, idx) => (
                        <motion.button
                            key={ticket.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => router.push(`/guest/tickets/${ticket.id}`)}
                            className="w-full text-left glass-panel rounded-2xl p-4 hover:bg-white/70 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono font-bold text-[var(--color-text-muted)]">{ticket.id}</span>
                                    <Badge variant={statusColor(ticket.status)} className="text-[10px]">{ticket.status}</Badge>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />
                            </div>
                            <p className="text-sm font-semibold text-[var(--color-text-main)]">{ticket.issue}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-[var(--color-text-muted)]">
                                <Clock className="w-3 h-3" />
                                <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                                <Badge variant="glass" className="text-[10px] text-[var(--color-text-muted)] ml-auto">{ticket.category}</Badge>
                            </div>
                        </motion.button>
                    ))}
                </div>
            )}

            {/* Report Issue Modal */}
            <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Report an Issue" size="md">
                <div className="p-6 space-y-5">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Category</label>
                        <div className="grid grid-cols-3 gap-2">
                            {TICKET_CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`py-2.5 rounded-xl text-xs font-semibold border-2 transition-all ${category === cat
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Description</label>
                        <textarea
                            rows={3}
                            placeholder="Describe the issue..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-gray-800"
                        />
                    </div>
                    <Button
                        variant="default"
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                        onClick={handleSubmitTicket}
                        disabled={!category || !description.trim()}
                    >
                        Submit Report
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
