"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, BedDouble, Users, CalendarDays, FileText, MessageSquare, Palette, UserPlus, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/rooms", icon: BedDouble, label: "Rooms" },
    { href: "/admin/stays", icon: CalendarDays, label: "Stays" },
    { href: "/admin/info", icon: FileText, label: "Hotel Info" },
    { href: "/admin/tickets", icon: FileText, label: "Tickets" },
    { href: "/admin/messages", icon: MessageSquare, label: "Messages" },
    { href: "/admin/branding", icon: Palette, label: "Branding" },
    { href: "/admin/team", icon: UserPlus, label: "Team" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    React.useEffect(() => {
        if (!localStorage.getItem("adminSession")) {
            router.push("/admin");
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("adminSession");
        router.push("/admin");
    };

    return (
        <div className="admin-theme min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0 sticky top-0 h-screen">
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                            <span className="font-black text-xs">HC</span>
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-gray-900">HotelConnect</h2>
                            <p className="text-[10px] text-gray-400">Admin Panel</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-0.5">
                    {navItems.map(item => (
                        <button
                            key={item.href}
                            onClick={() => router.push(item.href)}
                            className={cn(
                                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left",
                                pathname === item.href || pathname.startsWith(item.href + "/")
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <item.icon className="w-4 h-4 shrink-0" />
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div className="p-3 border-t border-gray-100">
                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-gray-50 overflow-y-auto">
                <div className="max-w-6xl mx-auto p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
