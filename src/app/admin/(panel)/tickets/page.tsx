"use client";

import * as React from "react";
import { useHotel } from "@/contexts/HotelContext";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";
import { Send, Bot, User } from "lucide-react";

export default function AdminTicketsPage() {
    const { tickets, staff, updateTicketStatus, assignTicket, addTicketMessage } = useHotel();
    const { showToast } = useToast();
    const [selectedTicket, setSelectedTicket] = React.useState<string | null>(null);
    const [input, setInput] = React.useState("");
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const ticket = tickets.find(t => t.id === selectedTicket);

    React.useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [ticket?.messages.length]);

    const handleSend = () => {
        if (!input.trim() || !selectedTicket) return;
        addTicketMessage(selectedTicket, {
            id: `msg-${Date.now()}`, sender: "staff", text: input, timestamp: new Date().toISOString(),
        });
        setInput("");
    };

    const statusColors: Record<string, string> = {
        New: "bg-red-100 text-red-700",
        "In Progress": "bg-yellow-100 text-yellow-700",
        Closed: "bg-green-100 text-green-700",
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Ticket Management</h1>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600">ID</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600">Issue</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600">Assigned</th>
                            <th className="text-right px-4 py-3 font-semibold text-gray-600">Chat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map(t => (
                            <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50" onClick={() => setSelectedTicket(t.id)}>
                                <td className="px-4 py-3 font-mono font-bold text-gray-500 text-xs">{t.id}</td>
                                <td className="px-4 py-3 font-semibold text-gray-900 truncate max-w-[200px]">{t.issue}</td>
                                <td className="px-4 py-3"><span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">{t.category}</span></td>
                                <td className="px-4 py-3">
                                    <select
                                        value={t.status}
                                        onChange={(e) => { e.stopPropagation(); updateTicketStatus(t.id, e.target.value as "New" | "In Progress" | "Closed"); showToast(`Status updated to ${e.target.value}`); }}
                                        onClick={(e) => e.stopPropagation()}
                                        className={`px-2 py-1 rounded-full text-xs font-bold border-0 cursor-pointer ${statusColors[t.status]}`}
                                    >
                                        <option value="New">New</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </td>
                                <td className="px-4 py-3">
                                    <select
                                        value={t.assignedTo || ""}
                                        onChange={(e) => { e.stopPropagation(); assignTicket(t.id, e.target.value); showToast("Ticket assigned!"); }}
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600"
                                    >
                                        <option value="">Unassigned</option>
                                        {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-blue-600 hover:text-blue-800 text-xs font-semibold" onClick={() => setSelectedTicket(t.id)}>
                                        Open ({t.messages.length})
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Ticket Chat Modal */}
            <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title={`${ticket?.id} — ${ticket?.issue}`} size="lg">
                {ticket && (
                    <div className="flex flex-col h-[500px]">
                        <div className="px-6 py-3 bg-gray-50 border-b flex items-center gap-4 text-sm">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColors[ticket.status]}`}>{ticket.status}</span>
                            <span className="text-gray-500">Cat: {ticket.category}</span>
                            <span className="text-gray-500">Room: {ticket.roomId.replace("room-", "")}</span>
                        </div>
                        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                            {ticket.messages.map(msg => (
                                <div key={msg.id} className={`flex gap-2 ${msg.sender === "staff" ? "flex-row-reverse" : "flex-row"}`}>
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.sender === "staff" ? "bg-blue-600" : "bg-gray-400"}`}>
                                        {msg.sender === "staff" ? <Bot size={12} className="text-white" /> : <User size={12} className="text-white" />}
                                    </div>
                                    <div className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm ${msg.sender === "staff" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-gray-100 text-gray-800 rounded-tl-sm"}`}>
                                        {msg.text}
                                        <p className="text-[10px] opacity-50 mt-1">{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t flex gap-2">
                            <input type="text" placeholder="Reply to guest..." value={input} onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800" />
                            <button onClick={handleSend} disabled={!input.trim()} className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
