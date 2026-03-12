"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, Info, MessageCircle, AlertTriangle, User } from "lucide-react";
import { motion } from "framer-motion";
import { useHotel } from "@/contexts/HotelContext";
import { cn } from "@/lib/utils";

const tabs = [
    { href: "/guest", icon: Home, label: "Home" },
    { href: "/guest/info", icon: Info, label: "Info" },
    { href: "/guest/messages", icon: MessageCircle, label: "Chat" },
    { href: "/guest/tickets", icon: AlertTriangle, label: "Tickets" },
];

export default function GuestLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { branding } = useHotel();
    const [session, setSession] = React.useState<{ roomNumber: string; guestName: string } | null>(null);

    React.useEffect(() => {
        const data = localStorage.getItem("guestSession");
        if (!data) {
            router.push("/");
        } else {
            setSession(JSON.parse(data));
        }
    }, [router]);

    if (!session) return null;

    return (
        <div className="min-h-screen gradient-mesh flex flex-col relative">
            {/* Header */}
            <header className="sticky top-0 z-40 glass-panel-heavy px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                        <span className="text-sm font-black text-white">
                            {branding.name.charAt(0)}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white leading-tight truncate max-w-[180px]">{branding.name}</h2>
                        <p className="text-[11px] text-white/50 font-medium">Room {session.roomNumber} • {session.guestName}</p>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto pb-24">
                {children}
            </main>

            {/* Bottom Tab Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 glass-panel-heavy">
                <div className="flex items-center justify-around py-2 px-2 max-w-lg mx-auto">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href || (tab.href !== "/guest" && pathname.startsWith(tab.href));
                        return (
                            <button
                                key={tab.href}
                                onClick={() => router.push(tab.href)}
                                className={cn(
                                    "flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200 relative",
                                    isActive ? "text-primary" : "text-white/40 hover:text-white/70"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary/10 rounded-2xl"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <tab.icon className="w-5 h-5 relative z-10" />
                                <span className="text-[10px] font-bold relative z-10">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
