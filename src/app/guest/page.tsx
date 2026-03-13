"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Clock, Key, Map, MessageCircle, AlertTriangle, Utensils, Dumbbell, Baby, Car, Sparkles, Calendar, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useHotel } from "@/contexts/HotelContext";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";
import { useGuestSession } from "@/hooks/useGuestSession";
import { KidsModeToggle } from "@/components/features/KidsModeToggle";
import { ResortMap } from "@/components/features/ResortMap";
import { AIConcierge } from "@/components/features/AIConcierge";
import { useRouter } from "next/navigation";
import type { Activity } from "@/types";
import { fetchActivities, fetchKidsClub } from "@/services/api";
import type { KidsClubInfo } from "@/types";

export default function GuestDashboard() {
    const router = useRouter();
    const { tickets, lateCheckoutStatus, requestLateCheckout, stays, addToSchedule, userSchedule } = useHotel();
    const { showToast } = useToast();
    const t = useTranslations("guest");
    const tMsg = useTranslations("messages");
    const tCommon = useTranslations("common");
    const session = useGuestSession();

    const [showCheckoutModal, setShowCheckoutModal] = React.useState(false);
    const [showMapModal, setShowMapModal] = React.useState(false);
    const [selectedTime, setSelectedTime] = React.useState("");
    const [selectedActivity, setSelectedActivity] = React.useState<Activity | null>(null);
    const [isKidsMode, setIsKidsMode] = React.useState(false);
    const [activities, setActivities] = React.useState<Activity[]>([]);
    const [kidsClub, setKidsClub] = React.useState<KidsClubInfo | null>(null);

    // Load activities and kids club from service
    React.useEffect(() => {
        fetchActivities().then(setActivities).catch(console.error);
        fetchKidsClub().then(setKidsClub).catch(console.error);
    }, []);

    React.useEffect(() => {
        const checkKidsMode = () => {
            setIsKidsMode(document.body.classList.contains("kids-mode"));
        };
        checkKidsMode();
        const observer = new MutationObserver(checkKidsMode);
        observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    const currentStay = stays.find(s => s.roomId === session?.roomId);
    const myTickets = tickets.filter(t => t.roomId === session?.roomId);

    const handleLateCheckout = () => {
        if (selectedTime) {
            requestLateCheckout();
            setShowCheckoutModal(false);
            showToast(tMsg("lateCheckoutRequested", { time: selectedTime }));
        }
    };

    // Today's upcoming activities — filtered for kids mode
    const now = new Date();
    const upcomingActivities = React.useMemo(() => {
        const currentHour = new Date().getHours();
        const filteredActivities = isKidsMode
            ? activities.filter(a => a.type === "kids")
            : activities;
        return filteredActivities.flatMap(a =>
            a.schedule.filter(e => parseInt(e.time) > currentHour).map(e => ({ ...e, emoji: a.emoji, activityTitle: a.title, activityId: a.id }))
        ).sort((a, b) => a.time.localeCompare(b.time)).slice(0, 4);
    }, [isKidsMode, activities]);

    // Explore resort items
    const EXPLORE_ITEMS_ADULT = React.useMemo(() => [
        { icon: Utensils, label: t("dining"), color: "from-orange-400 to-red-400", tab: "dining" },
        { icon: Calendar, label: t("activities"), color: "from-blue-400 to-cyan-400", tab: "activities" },
        { icon: Dumbbell, label: t("fitness"), color: "from-emerald-400 to-teal-400", tab: "fitness" },
        { icon: Sparkles, label: t("spa"), color: "from-purple-400 to-pink-400", tab: "spa" },
        { icon: Baby, label: t("kidsClub"), color: "from-yellow-400 to-orange-400", tab: "kids" },
        { icon: Car, label: t("carRental"), color: "from-gray-400 to-slate-400", tab: "cars" },
    ], [t]);

    const EXPLORE_ITEMS_KIDS = React.useMemo(() => [
        { icon: Baby, label: t("kidsClub"), color: "from-yellow-400 to-orange-400", tab: "kids" },
        { icon: Calendar, label: t("activities"), color: "from-blue-400 to-cyan-400", tab: "activities" },
    ], [t]);

    const exploreItems = isKidsMode ? EXPLORE_ITEMS_KIDS : EXPLORE_ITEMS_ADULT;

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
                                ? t("helloKids", { name: session?.guestName?.split(" ")[0] || "" })
                                : t("hello", { name: session?.guestName?.split(" ")[0] || "" })
                            }
                        </h1>
                        <p className="text-sm text-[var(--color-text-muted)] mt-1">
                            {isKidsMode ? t("subtitleKids") : t("subtitle")}
                        </p>
                    </div>
                    <KidsModeToggle />
                </motion.div>

                {/* Your Stay Card */}
                <motion.div variants={item} className="glass-panel-heavy rounded-3xl p-5">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-[var(--color-text-main)]">{t("yourStay")}</h3>
                        <Badge variant="glass" className="text-[var(--color-text-muted)]">
                            <Clock className="w-3 h-3 mr-1" />
                            {currentStay ? t("until", { date: new Date(currentStay.endDate).toLocaleDateString("en", { month: "short", day: "numeric" }) }) : t("nights")}
                        </Badge>
                    </div>
                    <p className="text-sm text-[var(--color-text-muted)] mb-4">
                        {t("checkoutInfo")}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                        {!isKidsMode && (
                            <Button
                                variant="glass"
                                size="sm"
                                className="text-[var(--color-text-main)] border-[var(--color-surface-base)]"
                                onClick={() => setShowCheckoutModal(true)}
                            >
                                <Key className="w-4 h-4 mr-1" />
                                {lateCheckoutStatus === "pending" ? t("pending") : lateCheckoutStatus === "approved" ? t("approved") : t("lateCheckout")}
                            </Button>
                        )}
                        <Button variant="glass" size="sm" className="text-[var(--color-text-main)] border-[var(--color-surface-base)]" onClick={() => setShowMapModal(true)}>
                            <Map className="w-4 h-4 mr-1" /> {t("resortMap")}
                        </Button>
                    </div>
                </motion.div>

                {/* Explore Resort Grid */}
                <motion.div variants={item}>
                    <h3 className="text-base font-bold text-[var(--color-text-main)] mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-accent" /> {t("exploreResort")}
                    </h3>
                    <div className={`grid gap-3 ${isKidsMode ? "grid-cols-2" : "grid-cols-3"}`}>
                        {exploreItems.map((it) => (
                            <button
                                key={it.label}
                                onClick={() => router.push(`/guest/info?tab=${it.tab}`)}
                                className="glass-panel rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-white/70 transition-all hover:scale-[1.03] active:scale-95"
                            >
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${it.color} flex items-center justify-center shadow-lg`}>
                                    <it.icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xs font-bold text-[var(--color-text-main)]">{it.label}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Actions — only in adult mode */}
                {!isKidsMode && (
                    <motion.div variants={item} className="grid grid-cols-2 gap-3">
                        <button onClick={() => router.push("/guest/messages")} className="glass-panel rounded-2xl p-4 flex flex-col items-start gap-2 hover:bg-white/70 transition-colors text-left">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                                <MessageCircle className="w-5 h-5 text-blue-500" />
                            </div>
                            <span className="text-sm font-bold text-[var(--color-text-main)]">{t("chatWithReception")}</span>
                            <span className="text-xs text-[var(--color-text-muted)]">{t("askAnything")}</span>
                        </button>

                        <button onClick={() => router.push("/guest/tickets")} className="glass-panel rounded-2xl p-4 flex flex-col items-start gap-2 hover:bg-white/70 transition-colors text-left">
                            <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-rose-500" />
                            </div>
                            <span className="text-sm font-bold text-[var(--color-text-main)]">{t("reportIssue")}</span>
                            {myTickets.length > 0 && (
                                <span className="text-xs text-accent font-semibold">{t("openCount", { count: myTickets.filter(t => t.status !== "Closed").length })}</span>
                            )}
                        </button>
                    </motion.div>
                )}

                {/* Kids Mode: Kids Club Schedule */}
                {isKidsMode && kidsClub && (
                    <motion.div variants={item}>
                        <h3 className="text-base font-bold text-[var(--color-text-main)] mb-3 flex items-center gap-2">
                            🧒 {t("todayKidsClub")}
                        </h3>
                        <div className="space-y-2">
                            {kidsClub.schedule.map((ev, i) => (
                                <div key={i} className="glass-panel rounded-2xl px-4 py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-primary text-sm w-12">{ev.time}</span>
                                        <div>
                                            <p className="text-sm font-semibold text-[var(--color-text-main)]">{ev.name}</p>
                                            <p className="text-xs text-[var(--color-text-muted)]">{ev.location}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Today's Highlights */}
                {upcomingActivities.length > 0 && (
                    <motion.div variants={item}>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-base font-bold text-[var(--color-text-main)] flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" /> {t("comingUpToday")}
                            </h3>
                            <button onClick={() => router.push("/guest/info")} className="text-xs font-bold text-primary">{tCommon("viewAll")}</button>
                        </div>
                        <div className="space-y-2">
                            {upcomingActivities.map((ev, i) => {
                                const activity = activities.find(a => a.id === ev.activityId);
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

                {/* Minidisco Banner */}
                {kidsClub && (
                    <motion.div variants={item}>
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 p-5">
                            <div className="absolute top-0 right-0 text-6xl opacity-20 rotate-12 translate-x-2 -translate-y-2">🪩</div>
                            <h3 className="text-lg font-black text-white">{t("minidiscoTonight")}</h3>
                            <p className="text-sm text-white/80 mt-1">{t("startsAt", { time: kidsClub.minidiscoTime })}</p>
                            <p className="text-xs text-white/60 mt-2">{t("minidiscoDesc")}</p>
                        </div>
                    </motion.div>
                )}
            </motion.div>

            {/* Late Checkout Modal */}
            <Modal isOpen={showCheckoutModal} onClose={() => setShowCheckoutModal(false)} title={t("lateCheckoutTitle")} size="sm">
                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-600">{t("selectCheckoutTime")}</p>
                    <div className="grid grid-cols-3 gap-2">
                        {["12:00", "13:00", "14:00"].map(time => (
                            <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`py-3 rounded-2xl text-sm font-bold border-2 transition-all ${selectedTime === time ? "border-primary bg-primary/10 text-primary" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                    <Button variant="default" className="w-full bg-primary hover:bg-primary/90 text-white" onClick={handleLateCheckout} disabled={!selectedTime}>
                        {t("submitRequest")}
                    </Button>
                    <p className="text-xs text-gray-400 text-center">{t("checkoutNote")}</p>
                </div>
            </Modal>

            {/* Map Modal */}
            <Modal isOpen={showMapModal} onClose={() => setShowMapModal(false)} title={t("resortMapTitle")} size="lg">
                <div className="p-4 sm:p-6">
                    <ResortMap />
                    <p className="text-xs text-gray-400 text-center mt-3">{t("tapForDetails")}</p>
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
                                {selectedActivity.busyLevel === "high" ? tCommon("busy") : selectedActivity.busyLevel === "medium" ? tCommon("moderate") : tCommon("available")}
                            </Badge>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-800 mb-3">{t("todaysSchedule")}</h4>
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
                                                    showToast(tMsg("addedToSchedule", { name: ev.name }));
                                                }}
                                                disabled={isBooked}
                                                className="text-xs"
                                            >
                                                {isBooked ? tCommon("booked") : tCommon("book")}
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
