"use client";

import { useHotel } from "@/contexts/HotelContext";
import { BedDouble, CalendarDays, AlertTriangle, MessageSquare } from "lucide-react";

export default function AdminDashboard() {
    const { rooms, stays, tickets, conversations } = useHotel();
    const openTickets = tickets.filter(t => t.status !== "Closed").length;
    const unreadMessages = conversations.reduce((n, c) => n + c.unread, 0);

    const stats = [
        { label: "Total Rooms", value: rooms.length, icon: BedDouble, color: "bg-blue-50 text-blue-600" },
        { label: "Active Stays", value: stays.length, icon: CalendarDays, color: "bg-green-50 text-green-600" },
        { label: "Open Tickets", value: openTickets, icon: AlertTriangle, color: "bg-red-50 text-red-600" },
        { label: "Unread Messages", value: unreadMessages, icon: MessageSquare, color: "bg-purple-50 text-purple-600" },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(s => (
                    <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
                            <s.icon className="w-5 h-5" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                        <p className="text-sm text-gray-500">{s.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
