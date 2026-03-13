"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, BedDouble, CalendarRange, Info, Ticket, MessageSquare, Palette, Users, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations("admin");

    React.useEffect(() => {
        if (!localStorage.getItem("adminSession")) {
            router.push("/admin");
        }
    }, [router]);

    const links = React.useMemo(() => [
        { href: "/admin/dashboard", icon: LayoutDashboard, label: t("dashboard") },
        { href: "/admin/rooms", icon: BedDouble, label: t("rooms") },
        { href: "/admin/stays", icon: CalendarRange, label: t("stays") },
        { href: "/admin/tickets", icon: Ticket, label: t("ticketsNav") },
        { href: "/admin/messages", icon: MessageSquare, label: t("messagesNav") },
    ], [t]);

    const handleLogout = React.useCallback(() => {
        localStorage.removeItem("adminSession");
        router.push("/admin");
    }, [router]);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-5">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                            <span className="text-xs font-black text-white">H</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{t("hotelConnect")}</span>
                    </div>
                </div>

                <nav className="flex-1 px-3 space-y-1">
                    {links.map(link => {
                        const isActive = pathname === link.href;
                        return (
                            <button
                                key={link.href}
                                onClick={() => router.push(link.href)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}
                            >
                                <link.icon className="w-4 h-4" />
                                {link.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-3 mt-auto">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" />
                        {t("logout")}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
