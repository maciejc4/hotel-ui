"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Clock } from "lucide-react";
import {
    fetchRestaurants, fetchAlaCarte, fetchActivities, fetchSpa,
    fetchFitness, fetchKidsClub, fetchCarRental,
} from "@/services/api";
import type {
    Restaurant, AlaCarteInfo, Activity, SpaTreatment,
    FitnessClass, KidsClubInfo, CarRental,
} from "@/types";

const tabs = ["Gastronomy", "Activities", "Kids Club", "SPA", "Fitness", "A'la Carte", "Car Rental"];

export default function AdminInfoPage() {
    const t = useTranslations("admin");
    const tCommon = useTranslations("common");
    const [activeTab, setActiveTab] = React.useState("Gastronomy");

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

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("hotelInfo")} CMS</h1>
            <p className="text-sm text-gray-500 mb-6">Manage content displayed to guests in the app.</p>

            <div className="flex gap-2 overflow-x-auto mb-6 border-b border-gray-200 pb-px">
                {tabs.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === "Gastronomy" && (
                <div className="space-y-3">
                    {restaurants.map(r => (
                        <div key={r.id} className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{r.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{r.description}</p>
                                </div>
                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded capitalize">{r.type}</span>
                            </div>
                            <div className="flex gap-4 mt-3 text-xs text-gray-400">
                                <span><Clock className="w-3 h-3 inline mr-1" />{r.openTime}–{r.closeTime}</span>
                                {r.allInclusiveStart && <span className="text-green-600 font-semibold">AI: {r.allInclusiveStart}–{r.allInclusiveEnd}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "Activities" && (
                <div className="space-y-3">
                    {activities.map(a => (
                        <div key={a.id} className="bg-white rounded-lg border border-gray-200 p-4">
                            <h3 className="font-semibold text-gray-900">{a.emoji} {a.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">{a.description}</p>
                            <div className="mt-3 space-y-1">
                                {a.schedule.map((ev, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                                        <span className="font-mono font-bold w-12">{ev.time}</span>
                                        <span>{ev.name}</span>
                                        <span className="text-gray-400 ml-auto">{ev.location}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "Kids Club" && kidsClub && (
                <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div><span className="text-xs text-gray-500 block">Hours</span><span className="font-semibold text-gray-900">{kidsClub.openTime}–{kidsClub.closeTime}</span></div>
                        <div><span className="text-xs text-gray-500 block">Age Range</span><span className="font-semibold text-gray-900">{kidsClub.ageRange}</span></div>
                        <div><span className="text-xs text-gray-500 block">Minidisco</span><span className="font-semibold text-gray-900">{kidsClub.minidiscoTime}</span></div>
                    </div>
                    <div><span className="text-xs text-gray-500 block">Drop-off Policy</span><p className="text-sm text-gray-700">{kidsClub.dropOffPolicy}</p></div>
                    <div className="space-y-1">
                        {kidsClub.schedule.map((ev, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-gray-600"><span className="font-mono font-bold w-12">{ev.time}</span><span>{ev.name}</span><span className="text-gray-400 ml-auto">{ev.location}</span></div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === "SPA" && (
                <div className="space-y-3">
                    {spa.map(s => (
                        <div key={s.id} className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-center">
                            <div><h3 className="font-semibold text-gray-900">{s.name}</h3><p className="text-xs text-gray-500 mt-1">{s.duration} — {s.price}</p></div>
                            <span className={`text-xs font-bold ${s.available ? "text-green-600" : "text-red-500"}`}>{s.available ? tCommon("available") : tCommon("full")}</span>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "Fitness" && (
                <div className="space-y-3">
                    {fitness.map(f => (
                        <div key={f.id} className="bg-white rounded-lg border border-gray-200 p-4">
                            <h3 className="font-semibold text-gray-900">{f.name}</h3>
                            <div className="flex gap-4 mt-1 text-xs text-gray-500">
                                <span>{f.time} ({f.duration})</span><span>{f.instructor}</span><span className="text-gray-400">{f.location}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "A'la Carte" && (
                <div className="space-y-3">
                    {alacarte.map(a => (
                        <div key={a.id} className="bg-white rounded-lg border border-gray-200 p-4">
                            <h3 className="font-semibold text-gray-900">{a.name}</h3>
                            <p className="text-xs text-blue-600 font-semibold">{a.cuisine}</p>
                            <p className="text-xs text-gray-500 mt-1">{a.description}</p>
                            <div className="flex gap-4 mt-2 text-xs text-gray-400">
                                <span>Dress: {a.dressCode}</span>
                                {a.reservationRequired && <span className="text-orange-600 font-semibold">Reservation Required</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "Car Rental" && (
                <div className="space-y-3">
                    {carRental.map(c => (
                        <div key={c.id} className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-center">
                            <div><h3 className="font-semibold text-gray-900">{c.model}</h3><p className="text-xs text-gray-500">{c.type} — {c.pricePerDay}/day</p></div>
                            <span className={`text-xs font-bold ${c.available ? "text-green-600" : "text-red-500"}`}>{c.available ? tCommon("available") : tCommon("unavailable")}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
