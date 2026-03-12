"use client";

import * as React from "react";
import { useHotel } from "@/contexts/HotelContext";
import { Modal } from "@/components/ui/modal";
import { Send, Bot, User, MessageSquare } from "lucide-react";

export default function AdminMessagesPage() {
    const { conversations, addConversationMessage, rooms } = useHotel();
    const [selectedConv, setSelectedConv] = React.useState<string | null>(null);
    const [input, setInput] = React.useState("");
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const conv = conversations.find(c => c.id === selectedConv);
    const getRoomNum = (roomId: string) => rooms.find(r => r.id === roomId)?.number || "?";

    React.useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [conv?.messages.length]);

    const handleSend = () => {
        if (!input.trim() || !selectedConv) return;
        addConversationMessage(selectedConv, {
            id: `msg-${Date.now()}`, sender: "staff", text: input, timestamp: new Date().toISOString(),
        });
        setInput("");
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Guest Messages</h1>
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                {conversations.length === 0 && <p className="p-6 text-gray-400 text-sm text-center">No conversations yet</p>}
                {conversations.map(c => (
                    <button key={c.id} onClick={() => setSelectedConv(c.id)} className="w-full text-left px-4 py-4 hover:bg-gray-50 transition-colors flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900 text-sm">{c.guestName}</span>
                                <span className="text-xs text-gray-400">Room {getRoomNum(c.roomId)}</span>
                                {c.unread > 0 && <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">{c.unread}</span>}
                            </div>
                            <p className="text-xs text-gray-500 truncate">{c.messages[c.messages.length - 1]?.text || "No messages"}</p>
                        </div>
                    </button>
                ))}
            </div>

            <Modal isOpen={!!selectedConv} onClose={() => setSelectedConv(null)} title={`Chat with ${conv?.guestName}`} size="lg">
                {conv && (
                    <div className="flex flex-col h-[500px]">
                        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                            {conv.messages.map(msg => (
                                <div key={msg.id} className={`flex gap-2 ${msg.sender === "staff" ? "flex-row-reverse" : "flex-row"}`}>
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.sender === "staff" ? "bg-blue-600" : "bg-gray-400"}`}>
                                        {msg.sender === "staff" ? <Bot size={12} className="text-white" /> : <User size={12} className="text-white" />}
                                    </div>
                                    <div className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm ${msg.sender === "staff" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-gray-100 text-gray-800 rounded-tl-sm"}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t flex gap-2">
                            <input type="text" placeholder="Reply..." value={input} onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800" />
                            <button onClick={handleSend} disabled={!input.trim()} className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
