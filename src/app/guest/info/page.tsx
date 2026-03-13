"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Utensils, Calendar, Dumbbell, Sparkles, Baby, Car, Clock, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useHotel } from "@/contexts/HotelContext";
import { useToast } from "@/components/ui/toast";
import {
    fetchRestaurants, fetchAlaCarte, fetchActivities, fetchSpa,
    fetchFitness, fetchKidsClub, fetchCarRental,
} from "@/services/api";
import type {
    Restaurant, AlaCarteInfo, Activity, SpaTreatment,
    FitnessClass, KidsClubInfo, CarRental,
} from "@/types";

const tabs = [
    { id: "dining", icon: Utensils },
    { id: "activities", icon: Calendar },
    { id: "spa", icon: Sparkles },
    { id: "fitness", icon: Dumbbell },
    { id: "kids", icon: Baby },
    { id: "cars", icon: Car },
] as const;

export default function GuestInfoPage() {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get("tab") || "dining";
    const [activeTab, setActiveTab] = React.useState(initialTab);
    const [selectedActivity, setSelectedActivity] = React.useState<Activity | null>(null);
    const { addToSchedule, userSchedule } = useHotel();
    const { showToast } = useToast();
    const t = useTranslations("info");
    const tCommon = useTranslations("common");
    const tMsg = useTranslations("messages");
    const tGuest = useTranslations("guest");

    // Service-loaded data
    const [restaurants, setRestaurants] = React.useState<Restaurant[]>([]);
    const [alacarte, setAlacarte] = React.useState<AlaCarteInfo[]>([]);
    const [activities, setActivities] = React.useState<Activity[]>([]);
    const [spa, setSpa] = React.useState<SpaTreatment[]>([]);
    const [fitness, setFitness] = React.useState<FitnessClass[]>([]);
    const [kidsClub, setKidsClub] = React.useState<KidsClubInfo | null>(null);
    const [carRental, setCarRental] = React.useState<CarRental[]>([]);

    React.useEffect(() => {
        fetchRestaurants().then(setRestaurants).catch(console.error);
        fetchAlaCarte().then(setAlacarte).catch(console.error);
        fetchActivities().then(setActivities).catch(console.error);
        fetchSpa().then(setSpa).catch(console.error);
        fetchFitness().then(setFitness).catch(console.error);
        fetchKidsClub().then(setKidsClub).catch(console.error);
        fetchCarRental().then(setCarRental).catch(console.error);
    }, []);

    const tabLabels: Record<string, string> = {
        dining: tGuest("dining"),
        activities: tGuest("activities"),
        spa: tGuest("spa"),
        fitness: tGuest("fitness"),
        kids: tGuest("kids"),
        cars: tGuest("carRental"),
    };

    return (
        <div className="px-4 py-6 max-w-2xl mx-auto">
            <h1 className="text-xl font-bold text-[var(--color-text-main)] mb-4">{t("hotelInformation")}</h1>

            {/* Tab Bar */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab.id
                                ? "bg-primary text-white shadow-md glow-primary"
                                : "glass-panel text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
                            }`}
                    >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tabLabels[tab.id]}
                    </button>
                ))}
            </div>

            {/* Dining Tab */}
            {activeTab === "dining" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <h2 className="text-base font-bold text-[var(--color-text-main)]">{t("restaurantsAndBars")}</h2>
                    {restaurants.map(r => (
                        <div key={r.id} className="glass-panel rounded-2xl p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-[var(--color-text-main)]">{r.name}</h3>
                                <Badge variant={r.type === "bar" ? "secondary" : "default"} className="text-xs capitalize">{r.type}</Badge>
                            </div>
                            <p className="text-sm text-[var(--color-text-muted)] mb-3">{r.description}</p>
                            <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.openTime} – {r.closeTime}</span>
                                {r.allInclusiveStart && (
                                    <span className="text-emerald-600 font-semibold">AI: {r.allInclusiveStart}–{r.allInclusiveEnd}</span>
                                )}
                            </div>
                            {r.menuHighlights.length > 0 && (
                                <div className="flex gap-1.5 mt-3 flex-wrap">
                                    {r.menuHighlights.map(h => (
                                        <span key={h} className="px-2 py-0.5 rounded-full bg-gray-100 text-[var(--color-text-muted)] text-xs">{h}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    <h2 className="text-base font-bold text-[var(--color-text-main)] mt-6">{t("alaCarteRestaurants")}</h2>
                    {alacarte.map(a => (
                        <div key={a.id} className="glass-panel rounded-2xl p-4">
                            <h3 className="font-bold text-[var(--color-text-main)]">{a.name}</h3>
                            <p className="text-xs text-primary font-semibold">{a.cuisine}</p>
                            <p className="text-sm text-[var(--color-text-muted)] mt-1">{a.description}</p>
                            <div className="flex items-center gap-4 mt-3 text-xs text-[var(--color-text-muted)]">
                                <span>{t("dress", { dressCode: a.dressCode })}</span>
                                {a.reservationRequired && <Badge variant="warning" className="text-[10px]">{t("reservationRequired")}</Badge>}
                            </div>
                        </div>
                    ))}
                </motion.div>
            )}

            {/* Activities Tab */}
            {activeTab === "activities" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <h2 className="text-base font-bold text-[var(--color-text-main)]">{t("dailyActivities")}</h2>
                    {activities.map(a => (
                        <button key={a.id} onClick={() => setSelectedActivity(a)} className="w-full text-left glass-panel rounded-2xl p-4 hover:bg-white/70 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">{a.emoji}</span>
                                <div className="flex-1">
                                    <h3 className="font-bold text-[var(--color-text-main)]">{a.title}</h3>
                                    <p className="text-xs text-[var(--color-text-muted)]">{a.openTime} – {a.closeTime}</p>
                                </div>
                                {userSchedule.includes(a.id) && <Badge variant="success" className="text-[10px]">{tCommon("booked")}</Badge>}
                            </div>
                            <p className="text-sm text-[var(--color-text-muted)]">{a.description}</p>
                            <div className="mt-3 space-y-1.5">
                                {a.schedule.map((ev, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs">
                                        <span className="font-bold text-primary w-12">{ev.time}</span>
                                        <span className="text-[var(--color-text-main)]">{ev.name}</span>
                                        <span className="text-[var(--color-text-muted)] ml-auto flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.location}</span>
                                    </div>
                                ))}
                            </div>
                        </button>
                    ))}
                </motion.div>
            )}

            {/* SPA Tab */}
            {activeTab === "spa" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <h2 className="text-base font-bold text-[var(--color-text-main)]">{t("spaAndWellness")}</h2>
                    <p className="text-sm text-[var(--color-text-muted)]">{t("spaHours")}</p>
                    {spa.map(s => (
                        <div key={s.id} className="glass-panel rounded-2xl p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="font-bold text-[var(--color-text-main)]">{s.name}</h3>
                                    <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--color-text-muted)]">
                                        <span><Clock className="w-3 h-3 inline mr-1" />{s.duration}</span>
                                        <span className="font-bold text-primary">{s.price}</span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--color-text-muted)]">
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{s.location}</span>
                                        <span className="flex items-center gap-1">👤 {s.therapist}</span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    {s.available ? (
                                        <Button variant="glass" size="sm" className="text-[var(--color-text-main)] border-gray-200" onClick={() => showToast(`${s.name} booked!`)}>{tCommon("book")}</Button>
                                    ) : (
                                        <Badge variant="destructive" className="text-[10px]">{tCommon("full")}</Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            )}

            {/* Fitness Tab */}
            {activeTab === "fitness" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <h2 className="text-base font-bold text-[var(--color-text-main)]">{t("fitnessAndClasses")}</h2>
                    <p className="text-sm text-[var(--color-text-muted)]">{t("gymHours")}</p>
                    {fitness.map(f => (
                        <div key={f.id} className="glass-panel rounded-2xl p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-[var(--color-text-main)]">{f.name}</h3>
                                        <span className="text-sm font-bold text-primary">{f.time}</span>
                                    </div>
                                    <p className="text-xs text-[var(--color-text-muted)] mt-1">{f.description}</p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-[var(--color-text-muted)]">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{f.duration}</span>
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{f.location}</span>
                                        <span className="flex items-center gap-1">🏋️ {f.instructor}</span>
                                    </div>
                                </div>
                                <Button variant="glass" size="sm" className="text-[var(--color-text-main)] border-gray-200 ml-3" onClick={() => showToast(`Joined ${f.name}!`)}>{tCommon("join")}</Button>
                            </div>
                        </div>
                    ))}
                </motion.div>
            )}

            {/* Kids Tab */}
            {activeTab === "kids" && kidsClub && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <h2 className="text-base font-bold text-[var(--color-text-main)]">{t("kidsClub")}</h2>
                    <div className="glass-panel-heavy rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl">🧒</span>
                            <div>
                                <h3 className="font-bold text-[var(--color-text-main)]">{t("dolphinKidsClub")}</h3>
                                <p className="text-xs text-[var(--color-text-muted)]">{kidsClub.ageRange} • {kidsClub.openTime}–{kidsClub.closeTime}</p>
                            </div>
                        </div>
                        <p className="text-sm text-[var(--color-text-muted)] mb-3">{kidsClub.description}</p>
                        <div className="glass-panel rounded-xl p-3 mb-3">
                            <p className="text-xs font-bold text-amber-600 mb-1">{t("dropOffPolicy")}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">{kidsClub.dropOffPolicy}</p>
                        </div>
                    </div>

                    <h3 className="text-sm font-bold text-[var(--color-text-muted)]">{t("dailySchedule")}</h3>
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

                    <div className="rounded-3xl bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 p-4 mt-4">
                        <h3 className="text-base font-black text-white">{t("minidiscoAt", { time: kidsClub.minidiscoTime })}</h3>
                        <p className="text-sm text-white/80 mt-1">{t("minidiscoDanceParty")}</p>
                    </div>
                </motion.div>
            )}

            {/* Car Rental Tab */}
            {activeTab === "cars" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <h2 className="text-base font-bold text-[var(--color-text-main)]">{t("carRental")}</h2>
                    <p className="text-sm text-[var(--color-text-muted)]">{t("availableAtReception")}</p>
                    {carRental.map(c => (
                        <div key={c.id} className="glass-panel rounded-2xl p-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-[var(--color-text-main)]">{c.model}</h3>
                                <div className="flex items-center gap-3 mt-1 text-xs text-[var(--color-text-muted)]">
                                    <Badge variant="glass" className="text-[10px] text-[var(--color-text-muted)]">{c.type}</Badge>
                                    <span className="font-bold text-primary">{c.pricePerDay}{t("perDay")}</span>
                                </div>
                            </div>
                            {c.available ? (
                                <Button variant="glass" size="sm" className="text-[var(--color-text-main)] border-gray-200" onClick={() => showToast(`${c.model} reserved!`)}>{tCommon("reserve")}</Button>
                            ) : (
                                <Badge variant="destructive" className="text-[10px]">{tCommon("unavailable")}</Badge>
                            )}
                        </div>
                    ))}
                </motion.div>
            )}

            {/* Activity Details Modal */}
            <Modal isOpen={!!selectedActivity} onClose={() => setSelectedActivity(null)} title={selectedActivity?.title} size="md">
                {selectedActivity && (
                    <div className="p-6 space-y-5">
                        <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center">
                            <span className="text-6xl">{selectedActivity.emoji}</span>
                        </div>
                        <p className="text-sm text-gray-600">{selectedActivity.description}</p>
                        <div>
                            <h4 className="text-sm font-bold text-gray-800 mb-3">{tGuest("todaysSchedule")}</h4>
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
        </div>
    );
}
