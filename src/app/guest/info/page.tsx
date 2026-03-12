"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Utensils, Calendar, Dumbbell, Sparkles, Baby, Car, Clock, MapPin, DollarSign, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useHotel } from "@/contexts/HotelContext";
import { useToast } from "@/components/ui/toast";
import {
    MOCK_RESTAURANTS, MOCK_ALACARTE, MOCK_ACTIVITIES, MOCK_SPA,
    MOCK_FITNESS, MOCK_KIDS_CLUB, MOCK_CAR_RENTAL, type Activity
} from "@/lib/mockData";

const tabs = [
    { id: "dining", label: "Dining", icon: Utensils },
    { id: "activities", label: "Activities", icon: Calendar },
    { id: "spa", label: "SPA", icon: Sparkles },
    { id: "fitness", label: "Fitness", icon: Dumbbell },
    { id: "kids", label: "Kids", icon: Baby },
    { id: "cars", label: "Cars", icon: Car },
];

export default function GuestInfoPage() {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get("tab") || "dining";
    const [activeTab, setActiveTab] = React.useState(initialTab);
    const [selectedActivity, setSelectedActivity] = React.useState<Activity | null>(null);
    const { addToSchedule, userSchedule } = useHotel();
    const { showToast } = useToast();

    return (
        <div className="px-4 py-6 max-w-2xl mx-auto">
            <h1 className="text-xl font-bold text-white mb-4">Hotel Information</h1>

            {/* Tab Bar */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab.id
                                ? "bg-primary text-white shadow-md glow-primary"
                                : "glass-panel text-white/60 hover:text-white"
                            }`}
                    >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Dining Tab */}
            {activeTab === "dining" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <h2 className="text-base font-bold text-white/80">Restaurants & Bars</h2>
                    {MOCK_RESTAURANTS.map(r => (
                        <div key={r.id} className="glass-panel rounded-2xl p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-white">{r.name}</h3>
                                <Badge variant={r.type === "bar" ? "secondary" : "default"} className="text-xs capitalize">{r.type}</Badge>
                            </div>
                            <p className="text-sm text-white/50 mb-3">{r.description}</p>
                            <div className="flex items-center gap-4 text-xs text-white/40">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.openTime} – {r.closeTime}</span>
                                {r.allInclusiveStart && (
                                    <span className="text-emerald-400 font-semibold">AI: {r.allInclusiveStart}–{r.allInclusiveEnd}</span>
                                )}
                            </div>
                            {r.menuHighlights.length > 0 && (
                                <div className="flex gap-1.5 mt-3 flex-wrap">
                                    {r.menuHighlights.map(h => (
                                        <span key={h} className="px-2 py-0.5 rounded-full bg-white/5 text-white/50 text-xs">{h}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    <h2 className="text-base font-bold text-white/80 mt-6">A&apos;la Carte Restaurants</h2>
                    {MOCK_ALACARTE.map(a => (
                        <div key={a.id} className="glass-panel rounded-2xl p-4">
                            <h3 className="font-bold text-white">{a.name}</h3>
                            <p className="text-xs text-primary font-semibold">{a.cuisine}</p>
                            <p className="text-sm text-white/50 mt-1">{a.description}</p>
                            <div className="flex items-center gap-4 mt-3 text-xs text-white/40">
                                <span>Dress: {a.dressCode}</span>
                                {a.reservationRequired && <Badge variant="warning" className="text-[10px]">Reservation Required</Badge>}
                            </div>
                        </div>
                    ))}
                </motion.div>
            )}

            {/* Activities Tab */}
            {activeTab === "activities" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <h2 className="text-base font-bold text-white/80">Daily Activities & Animations</h2>
                    {MOCK_ACTIVITIES.map(a => (
                        <button key={a.id} onClick={() => setSelectedActivity(a)} className="w-full text-left glass-panel rounded-2xl p-4 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">{a.emoji}</span>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white">{a.title}</h3>
                                    <p className="text-xs text-white/40">{a.openTime} – {a.closeTime}</p>
                                </div>
                                {userSchedule.includes(a.id) && <Badge variant="success" className="text-[10px]">Booked</Badge>}
                            </div>
                            <p className="text-sm text-white/50">{a.description}</p>
                            <div className="mt-3 space-y-1.5">
                                {a.schedule.map((ev, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs">
                                        <span className="font-bold text-primary w-12">{ev.time}</span>
                                        <span className="text-white/60">{ev.name}</span>
                                        <span className="text-white/30 ml-auto flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.location}</span>
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
                    <h2 className="text-base font-bold text-white/80">SPA & Wellness</h2>
                    <p className="text-sm text-white/40">Open 08:00–20:00 • Pre-booking required</p>
                    {MOCK_SPA.map(s => (
                        <div key={s.id} className="glass-panel rounded-2xl p-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-white">{s.name}</h3>
                                <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                                    <span><Clock className="w-3 h-3 inline mr-1" />{s.duration}</span>
                                    <span className="font-bold text-primary">{s.price}</span>
                                </div>
                            </div>
                            {s.available ? (
                                <Button variant="glass" size="sm" className="text-white border-white/20" onClick={() => showToast(`${s.name} booked!`)}>Book</Button>
                            ) : (
                                <Badge variant="destructive" className="text-[10px]">Full</Badge>
                            )}
                        </div>
                    ))}
                </motion.div>
            )}

            {/* Fitness Tab */}
            {activeTab === "fitness" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <h2 className="text-base font-bold text-white/80">Fitness & Classes</h2>
                    <p className="text-sm text-white/40">Gym open 24/7 with keycard access</p>
                    {MOCK_FITNESS.map(f => (
                        <div key={f.id} className="glass-panel rounded-2xl p-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-white">{f.name}</h3>
                                <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                                    <span className="font-bold text-primary">{f.time}</span>
                                    <span>{f.duration}</span>
                                    <span>{f.instructor}</span>
                                </div>
                                <p className="text-xs text-white/30 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{f.location}</p>
                            </div>
                            <Button variant="glass" size="sm" className="text-white border-white/20" onClick={() => showToast(`Joined ${f.name}!`)}>Join</Button>
                        </div>
                    ))}
                </motion.div>
            )}

            {/* Kids Tab */}
            {activeTab === "kids" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <h2 className="text-base font-bold text-white/80">Kids Club</h2>
                    <div className="glass-panel-heavy rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl">🧒</span>
                            <div>
                                <h3 className="font-bold text-white">Dolphin Kids Club</h3>
                                <p className="text-xs text-white/40">{MOCK_KIDS_CLUB.ageRange} • {MOCK_KIDS_CLUB.openTime}–{MOCK_KIDS_CLUB.closeTime}</p>
                            </div>
                        </div>
                        <p className="text-sm text-white/50 mb-3">{MOCK_KIDS_CLUB.description}</p>
                        <div className="glass-panel rounded-xl p-3 mb-3">
                            <p className="text-xs font-bold text-amber-400 mb-1">📋 Drop-off Policy</p>
                            <p className="text-xs text-white/50">{MOCK_KIDS_CLUB.dropOffPolicy}</p>
                        </div>
                    </div>

                    <h3 className="text-sm font-bold text-white/70">Daily Schedule</h3>
                    {MOCK_KIDS_CLUB.schedule.map((ev, i) => (
                        <div key={i} className="glass-panel rounded-2xl px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-primary text-sm w-12">{ev.time}</span>
                                <div>
                                    <p className="text-sm font-semibold text-white">{ev.name}</p>
                                    <p className="text-xs text-white/30">{ev.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="rounded-3xl bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 p-4 mt-4">
                        <h3 className="text-base font-black text-white">🪩 Minidisco at {MOCK_KIDS_CLUB.minidiscoTime}!</h3>
                        <p className="text-sm text-white/80 mt-1">Dance party at the Main Stage — all kids welcome!</p>
                    </div>
                </motion.div>
            )}

            {/* Car Rental Tab */}
            {activeTab === "cars" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <h2 className="text-base font-bold text-white/80">Car Rental</h2>
                    <p className="text-sm text-white/40">Available at the reception desk</p>
                    {MOCK_CAR_RENTAL.map(c => (
                        <div key={c.id} className="glass-panel rounded-2xl p-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-white">{c.model}</h3>
                                <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                                    <Badge variant="glass" className="text-[10px] text-white/60">{c.type}</Badge>
                                    <span className="font-bold text-primary">{c.pricePerDay}/day</span>
                                </div>
                            </div>
                            {c.available ? (
                                <Button variant="glass" size="sm" className="text-white border-white/20" onClick={() => showToast(`${c.model} reserved!`)}>Reserve</Button>
                            ) : (
                                <Badge variant="destructive" className="text-[10px]">Unavailable</Badge>
                            )}
                        </div>
                    ))}
                </motion.div>
            )}

            {/* Activity Details Modal */}
            <Modal isOpen={!!selectedActivity} onClose={() => setSelectedActivity(null)} title={selectedActivity?.title} size="md">
                {selectedActivity && (
                    <div className="p-6 space-y-5">
                        <div className={`w-full h-32 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center`}>
                            <span className="text-6xl">{selectedActivity.emoji}</span>
                        </div>
                        <p className="text-sm text-gray-600">{selectedActivity.description}</p>
                        <div>
                            <h4 className="text-sm font-bold text-gray-800 mb-3">Today&apos;s Schedule</h4>
                            <div className="space-y-2">
                                {selectedActivity.schedule.map((ev, i) => {
                                    const isBooked = userSchedule.includes(selectedActivity.id);
                                    return (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-bold text-blue-600 w-12">{ev.time}</span>
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
        </div>
    );
}
