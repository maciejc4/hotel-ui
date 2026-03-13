"use client";

import * as React from "react";
import { BedDouble, CalendarRange, Ticket, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { useHotel } from "@hotel-ui/shared/contexts/HotelContext";

export default function AdminDashboard() {
    const { rooms, stays, tickets, conversations } = useHotel();
    const t = useTranslations("admin");

    const stats = React.useMemo(() => [
        { label: t("totalRooms"), value: rooms.length, icon: BedDouble, color: "bg-blue-50 text-blue-600" },
        { label: t("activeStays"), value: stays.length, icon: CalendarRange, color: "bg-emerald-50 text-emerald-600" },
        { label: t("openTickets"), value: tickets.filter(t => t.status !== "Closed").length, icon: Ticket, color: "bg-red-50 text-red-600" },
        { label: t("unreadMessages"), value: conversations.reduce((acc, c) => acc + c.unread, 0), icon: MessageSquare, color: "bg-amber-50 text-amber-600" },
    ], [rooms.length, stays.length, tickets, conversations, t]);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("dashboard")}</h1>
            <div className="grid grid-cols-4 gap-4">
                {stats.map(stat => (
                    <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-semibold text-gray-500">{stat.label}</span>
                        </div>
                        <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
