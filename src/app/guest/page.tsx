"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Clock, Key, Map, MessageCircle, AlertTriangle, Utensils, Dumbbell, Baby, Car, Sparkles, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useHotel } from "@/contexts/HotelContext";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";
import { MOCK_ACTIVITIES, MOCK_KIDS_CLUB, type Activity } from "@/lib/mockData";
import { KidsModeToggle } from "@/components/features/KidsModeToggle";
import { AIConcierge } from "@/components/features/AIConcierge";
import { ResortMap } from "@/components/features/ResortMap";
import { useRouter } from "next/navigation";

export default function GuestDashboard() {
    const router = useRouter();
    const { tickets, lateCheckoutStatus, requestLateCheckout, stays, rooms, addToSchedule, userSchedule } = useHotel();
    const { showToast } = useToast();
    const [showCheckoutModal, setShowCheckoutModal] = React.useState(false);
    const [showMapModal, setShowMapModal] = React.useState(false);
    const [selectedTime, setSelectedTime] = React.useState("");
    const [selectedActivity, setSelectedActivity] = React.useState<Activity | null>(null);
    const [isKidsMode, setIsKidsMode] = React.useState(false);

    React.useEffect(() => {
        const checkKidsMode = () => {
            setIsKidsMode(document.body.classList.contains("kids-mode"));
        };
        checkKidsMode();
        const observer = new MutationObserver(checkKidsMode);
        observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    const session = React.useMemo(() => {
        if (typeof window === "undefined") return null;
        const data = localStorage.getItem("guestSession");
        return data ? JSON.parse(data) : null;
    }, []);

    const currentStay = stays.find(s => s.roomId === session?.roomId);
    const myTickets = tickets.filter(t => t.roomId === session?.roomId);

    const handleLateCheckout = () => {
        if (selectedTime) {
            requestLateCheckout();
            setShowCheckoutModal(false);
            showToast(`Late checkout requested until ${selectedTime}!`);
        }
    };

    // Today's upcoming activities
    const now = new Date();
    const currentHour = now.getHours();
    const upcomingActivities = MOCK_ACTIVITIES.flatMap(a =>
        a.schedule.filter(e => parseInt(e.time) > currentHour).map(e => ({ ...e, emoji: a.emoji, activityTitle: a.title, activityId: a.id }))
    ).sort((a, b) => a.time.localeCompare(b.time)).slice(0, 4);

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08 } }
    };
    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <>
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="px-4 py-6 space-y-6 max-w-2xl mx-auto"
            >
                {/* Kids Mode + Welcome */}
                <motion.div variants={item} className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">
                            {isKidsMode
                                ? `Hey ${session?.guestName?.split(" ")[0]}! 🎉🌟`
                                : `Hello, ${session?.guestName?.split(" ")[0]} 👋`
                            }
                        </h1>
                        <p className="text-sm text-[var(--color-text-muted)] mt-1">
                            {isKidsMode ? "Let's explore and have fun! 🧸" : "What can we help you with today?"}
                        </p>
                    </div>
                    <KidsModeToggle />
                </motion.div>

                {/* Your Stay Card */}
                <motion.div variants={item} className="glass-panel-heavy rounded-3xl p-5">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-[var(--color-text-main)]">Your Stay</h3>
                        <Badge variant="glass" className="text-[var(--color-text-muted)]">
                            <Clock className="w-3 h-3 mr-1" />
                            {currentStay ? `Until ${new Date(currentStay.endDate).toLocaleDateString("en", { month: "short", day: "numeric" })}` : "5 nights"}
                        </Badge>
                    </div>
                    <p className="text-sm text-[var(--color-text-muted)] mb-4">
                        Checkout at 11:00 AM. Leave keycards on the table when departing.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            variant="glass"
                            size="sm"
                            className="text-[var(--color-text-main)] border-[var(--color-surface-base)]"
                            onClick={() => setShowCheckoutModal(true)}
                        >
                            <Key className="w-4 h-4 mr-1" />
                            {lateCheckoutStatus === "pending" ? "Pending…" : lateCheckoutStatus === "approved" ? "Approved ✓" : "Late Checkout"}
                        </Button>
                        <Button variant="glass" size="sm" className="text-[var(--color-text-main)] border-[var(--color-surface-base)]" onClick={() => setShowMapModal(true)}>
                            <Map className="w-4 h-4 mr-1" /> Resort Map
                        </Button>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={item} className="grid grid-cols-2 gap-3">
                    <button onClick={() => router.push("/guest/messages")} className="glass-panel rounded-2xl p-4 flex flex-col items-start gap-2 hover:bg-white/70 transition-colors text-left">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-blue-500" />
                        </div>
                        <span className="text-sm font-bold text-[var(--color-text-main)]">Chat with Reception</span>
                        <span className="text-xs text-[var(--color-text-muted)]">Ask anything</span>
                    </button>

                    <button onClick={() => router.push("/guest/tickets")} className="glass-panel rounded-2xl p-4 flex flex-col items-start gap-2 hover:bg-white/70 transition-colors text-left">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-rose-500" />
                        </div>
                        <span className="text-sm font-bold text-[var(--color-text-main)]">Report Issue</span>
                        {myTickets.length > 0 && (
                            <span className="text-xs text-accent font-semibold">{myTickets.filter(t => t.status !== "Closed").length} open</span>
                        )}
                    </button>
                </motion.div>

                {/* Today's Highlights */}
                {upcomingActivities.length > 0 && (
                    <motion.div variants={item}>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-base font-bold text-[var(--color-text-main)] flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" /> Coming Up Today
                            </h3>
                            <button onClick={() => router.push("/guest/info")} className="text-xs font-bold text-primary">View All</button>
                        </div>
                        <div className="space-y-2">
                            {upcomingActivities.map((ev, i) => {
                                const activity = MOCK_ACTIVITIES.find(a => a.id === ev.activityId);
                                return (
                                    <button
                                        key={i}
                                        className="w-full text-left glass-panel rounded-2xl px-4 py-3 flex items-center justify-between hover:bg-white/70 transition-colors"
                                        onClick={() => activity && setSelectedActivity(activity)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{ev.emoji}</span>
                                            <div>
                                                <p className="text-sm font-semibold text-[var(--color-text-main)]">{ev.name}</p>
                                                <p className="text-xs text-[var(--color-text-muted)]">{ev.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-primary">{ev.time}</span>
                                            <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* Explore Resort Grid */}
                <motion.div variants={item}>
                    <h3 className="text-base font-bold text-[var(--color-text-main)] mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-accent" /> Explore Resort
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { icon: Utensils, label: "Dining", color: "from-orange-400 to-red-400", tab: "dining" },
                            { icon: Calendar, label: "Activities", color: "from-blue-400 to-cyan-400", tab: "activities" },
                            { icon: Dumbbell, label: "Fitness", color: "from-emerald-400 to-teal-400", tab: "fitness" },
                            { icon: Sparkles, label: "SPA", color: "from-purple-400 to-pink-400", tab: "spa" },
                            { icon: Baby, label: "Kids Club", color: "from-yellow-400 to-orange-400", tab: "kids" },
                            { icon: Car, label: "Car Rental", color: "from-gray-400 to-slate-400", tab: "cars" },
                        ].map((item) => (
                            <button
                                key={item.label}
                                onClick={() => router.push(`/guest/info?tab=${item.tab}`)}
                                className="glass-panel rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-white/70 transition-all hover:scale-[1.03] active:scale-95"
                            >
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                                    <item.icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xs font-bold text-[var(--color-text-main)]">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Minidisco Banner */}
                <motion.div variants={item}>
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 p-5">
                        <div className="absolute top-0 right-0 text-6xl opacity-20 rotate-12 translate-x-2 -translate-y-2">🪩</div>
                        <h3 className="text-lg font-black text-white">Minidisco Tonight! 🎶</h3>
                        <p className="text-sm text-white/80 mt-1">Starts at {MOCK_KIDS_CLUB.minidiscoTime} • Main Stage</p>
                        <p className="text-xs text-white/60 mt-2">All kids welcome — dance, games, and fun!</p>
                    </div>
                </motion.div>
            </motion.div>

            {/* Late Checkout Modal */}
            <Modal isOpen={showCheckoutModal} onClose={() => setShowCheckoutModal(false)} title="Request Late Checkout" size="sm">
                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-600">Select your preferred checkout time:</p>
                    <div className="grid grid-cols-3 gap-2">
                        {["12:00", "13:00", "14:00"].map(t => (
                            <button
                                key={t}
                                onClick={() => setSelectedTime(t)}
                                className={`py-3 rounded-2xl text-sm font-bold border-2 transition-all ${selectedTime === t ? "border-primary bg-primary/10 text-primary" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <Button variant="default" className="w-full bg-primary hover:bg-primary/90 text-white" onClick={handleLateCheckout} disabled={!selectedTime}>
                        Submit Request
                    </Button>
                    <p className="text-xs text-gray-400 text-center">Subject to availability. You&apos;ll receive a confirmation.</p>
                </div>
            </Modal>

            {/* Map Modal */}
            <Modal isOpen={showMapModal} onClose={() => setShowMapModal(false)} title="Resort Map" size="lg">
                <div className="p-4 sm:p-6">
                    <ResortMap />
                    <p className="text-xs text-gray-400 text-center mt-3">Tap a location for details</p>
                </div>
            </Modal>

            {/* Activity Details Modal */}
            <Modal isOpen={!!selectedActivity} onClose={() => setSelectedActivity(null)} title={selectedActivity?.title} size="md">
                {selectedActivity && (
                    <div className="p-6 space-y-5">
                        <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center">
                            <span className="text-6xl">{selectedActivity.emoji}</span>
                        </div>
                        <p className="text-sm text-gray-600">{selectedActivity.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {selectedActivity.openTime} – {selectedActivity.closeTime}</span>
                            <Badge variant={selectedActivity.busyLevel === "high" ? "warning" : selectedActivity.busyLevel === "medium" ? "secondary" : "success"} className="text-[10px]">
                                {selectedActivity.busyLevel === "high" ? "Busy" : selectedActivity.busyLevel === "medium" ? "Moderate" : "Available"}
                            </Badge>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-800 mb-3">Today&apos;s Schedule</h4>
                            <div className="space-y-2">
                                {selectedActivity.schedule.map((ev, i) => {
                                    const isBooked = userSchedule.includes(selectedActivity.id);
                                    return (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-bold text-primary w-12">{ev.time}</span>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{ev.name}</p>
                                                    <p className="text-xs text-gray-400">{ev.location}</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant={isBooked ? "outline" : "default"}
                                                size="sm"
                                                onClick={() => {
                                                    addToSchedule(selectedActivity.id);
                                                    showToast(`Added ${ev.name} to your schedule!`);
                                                }}
                                                disabled={isBooked}
                                                className="text-xs"
                                            >
                                                {isBooked ? "Booked ✓" : "Book"}
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <AIConcierge />
        </>
    );
}
