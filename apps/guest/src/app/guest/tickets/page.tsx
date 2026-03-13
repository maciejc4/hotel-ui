"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, AlertTriangle, Clock, CheckCircle2, MessageCircle, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useHotel } from "@hotel-ui/shared/contexts/HotelContext";
import { useToast } from "@hotel-ui/shared/components/ui/toast";
import { Badge } from "@hotel-ui/shared/components/ui/badge";
import { Button } from "@hotel-ui/shared/components/ui/button";
import { Modal } from "@hotel-ui/shared/components/ui/modal";
import { useGuestSession } from "@hotel-ui/shared/hooks/useGuestSession";
import { getTicketStatusVariant } from "@hotel-ui/shared/lib/statusColor";
import { fetchTicketCategories } from "@hotel-ui/shared/services/api";
import { useRouter } from "next/navigation";

export default function GuestTicketsPage() {
    const { tickets, addTicket } = useHotel();
    const { showToast } = useToast();
    const session = useGuestSession();
    const router = useRouter();
    const t = useTranslations("tickets");

    const [showReport, setShowReport] = React.useState(false);
    const [category, setCategory] = React.useState("");
    const [issue, setIssue] = React.useState("");
    const [categories, setCategories] = React.useState<string[]>([]);

    React.useEffect(() => {
        fetchTicketCategories().then(setCategories).catch(console.error);
    }, []);

    const myTickets = tickets.filter(t => t.roomId === session?.roomId);

    const handleReport = () => {
        if (!category || !issue.trim()) return;
        addTicket({
            id: `TCK-${Date.now().toString().slice(-6)}`,
            roomId: session?.roomId || "",
            category,
            issue,
            status: "New",
            createdAt: new Date().toISOString(),
            messages: [{ id: `msg-${Date.now()}`, sender: "guest", text: issue, timestamp: new Date().toISOString() }],
        });
        setShowReport(false);
        setCategory("");
        setIssue("");
        showToast(t("issueReported"), "success");
    };

    const statusIcons: Record<string, typeof AlertTriangle> = {
        New: AlertTriangle,
        "In Progress": Clock,
        Closed: CheckCircle2,
    };

    return (
        <div className="px-4 py-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl font-bold text-[var(--color-text-main)]">{t("myTickets")}</h1>
                    <p className="text-sm text-[var(--color-text-muted)]">{t("reportAndTrack")}</p>
                </div>
                <Button variant="default" size="sm" className="bg-primary text-white" onClick={() => setShowReport(true)}>
                    <Plus className="w-4 h-4 mr-1" />
                    {t("reportIssue")}
                </Button>
            </div>

            {/* Ticket List */}
            <div className="space-y-3">
                <AnimatePresence>
                    {myTickets.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="glass-panel rounded-2xl p-8 text-center"
                        >
                            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                            <p className="text-sm font-medium text-[var(--color-text-main)]">{t("noIssuesReported")}</p>
                            <p className="text-xs text-[var(--color-text-muted)] mt-1">{t("everythingWorking")}</p>
                        </motion.div>
                    )}
                    {myTickets.map((ticket) => {
                        const StatusIcon = statusIcons[ticket.status] || AlertTriangle;
                        return (
                            <motion.button
                                key={ticket.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => router.push(`/guest/tickets/${ticket.id}`)}
                                className="w-full text-left glass-panel rounded-2xl p-4 hover:bg-white/70 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ticket.status === "New" ? "bg-red-50" : ticket.status === "In Progress" ? "bg-yellow-50" : "bg-emerald-50"}`}>
                                        <StatusIcon className={`w-5 h-5 ${ticket.status === "New" ? "text-red-500" : ticket.status === "In Progress" ? "text-yellow-500" : "text-emerald-500"}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-[10px] font-mono font-bold text-[var(--color-text-muted)]">{ticket.id}</span>
                                            <Badge variant={getTicketStatusVariant(ticket.status)} className="text-[10px]">{ticket.status}</Badge>
                                        </div>
                                        <p className="text-sm font-semibold text-[var(--color-text-main)] truncate">{ticket.issue}</p>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-[var(--color-text-muted)]">
                                            <span>{ticket.category}</span>
                                            <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{ticket.messages.length}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)] mt-2" />
                                </div>
                            </motion.button>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Report Issue Modal */}
            <Modal isOpen={showReport} onClose={() => setShowReport(false)} title={t("reportAnIssue")} size="sm">
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-2">{t("selectCategory")}</label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${category === cat ? "bg-primary/10 border-primary text-primary" : "border-gray-200 text-gray-500"}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <textarea
                            rows={3}
                            placeholder={t("describeIssue")}
                            value={issue}
                            onChange={(e) => setIssue(e.target.value)}
                            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        />
                    </div>
                    <Button variant="default" className="w-full bg-primary text-white" onClick={handleReport} disabled={!category || !issue.trim()}>
                        {t("submitReport")}
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
