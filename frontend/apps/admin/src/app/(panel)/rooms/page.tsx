"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useHotel } from "@hotel-ui/shared/contexts/HotelContext";
import { useToast } from "@hotel-ui/shared/components/ui/toast";
import { Modal } from "@hotel-ui/shared/components/ui/modal";
import { Plus, Trash2, Search, QrCode, Printer } from "lucide-react";

export default function AdminRoomsPage() {
    const { rooms, addRoom, deleteRoom } = useHotel();
    const { showToast } = useToast();
    const t = useTranslations("admin");
    const tCommon = useTranslations("common");
    const [search, setSearch] = React.useState("");
    const [showAdd, setShowAdd] = React.useState(false);
    const [showDetail, setShowDetail] = React.useState<string | null>(null);
    const [newNum, setNewNum] = React.useState("");
    const [newFloor, setNewFloor] = React.useState("1");
    const [newEquip, setNewEquip] = React.useState<string[]>([]);

    const allEquipment = ["AC", "TV", "Mini-bar", "Safe", "Balcony", "Sea View", "Jacuzzi", "Kitchen"];
    const filtered = rooms.filter(r => r.number.includes(search) || r.equipment.some(e => e.toLowerCase().includes(search.toLowerCase())));
    const detailRoom = rooms.find(r => r.id === showDetail);

    const handleAdd = () => {
        if (!newNum.trim()) return;
        addRoom({ id: `room-${newNum}`, number: newNum, floor: parseInt(newFloor), equipment: newEquip });
        setShowAdd(false);
        setNewNum("");
        setNewFloor("1");
        setNewEquip([]);
        showToast(t("roomAdded", { number: newNum }));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{t("roomManagement")}</h1>
                <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" /> {t("addRoom")}
                </button>
            </div>

            <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder={t("searchRooms")} value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800" />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600">{tCommon("room")}</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600">{tCommon("floor")}</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600">{tCommon("equipment")}</th>
                            <th className="text-right px-4 py-3 font-semibold text-gray-600">{tCommon("actions")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(room => (
                            <tr key={room.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => setShowDetail(room.id)}>
                                <td className="px-4 py-3 font-bold text-gray-900">{room.number}</td>
                                <td className="px-4 py-3 text-gray-600">{room.floor}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1 flex-wrap">
                                        {room.equipment.map(eq => (
                                            <span key={eq} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">{eq}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={(e) => { e.stopPropagation(); deleteRoom(room.id); showToast(t("roomDeleted", { number: room.number })); }}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Room Modal */}
            <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title={t("addNewRoom")} size="sm">
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-1">{t("roomNumber")}</label>
                        <input type="text" value={newNum} onChange={(e) => setNewNum(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-1">{tCommon("floor")}</label>
                        <input type="number" value={newFloor} onChange={(e) => setNewFloor(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-2">{tCommon("equipment")}</label>
                        <div className="flex flex-wrap gap-2">
                            {allEquipment.map(eq => (
                                <button key={eq} onClick={() => setNewEquip(prev => prev.includes(eq) ? prev.filter(e => e !== eq) : [...prev, eq])}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${newEquip.includes(eq) ? "bg-blue-50 border-blue-300 text-blue-700" : "border-gray-200 text-gray-500"}`}>
                                    {eq}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleAdd} className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-blue-700" disabled={!newNum.trim()}>
                        {t("addRoom")}
                    </button>
                </div>
            </Modal>

            {/* Room Detail Modal */}
            <Modal isOpen={!!showDetail} onClose={() => setShowDetail(null)} title={`${tCommon("room")} ${detailRoom?.number}`} size="md">
                {detailRoom && (
                    <div className="p-6 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div><span className="text-xs text-gray-500 font-semibold">{t("roomNumber")}</span><p className="text-lg font-bold text-gray-900">{detailRoom.number}</p></div>
                            <div><span className="text-xs text-gray-500 font-semibold">{tCommon("floor")}</span><p className="text-lg font-bold text-gray-900">{detailRoom.floor}</p></div>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 font-semibold block mb-2">{tCommon("equipment")}</span>
                            <div className="flex flex-wrap gap-2">
                                {detailRoom.equipment.map(eq => (
                                    <span key={eq} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">{eq}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 font-semibold block mb-2">{t("qrCodeAccess")}</span>
                            <div className="w-48 h-48 mx-auto bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                                <QrCode className="w-24 h-24 text-gray-400" />
                            </div>
                            <p className="text-xs text-gray-400 text-center mt-2">{t("scanToAccess", { number: detailRoom.number })}</p>
                        </div>
                        <button onClick={() => { showToast(t("roomCardSent")); }}
                            className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                            <Printer className="w-4 h-4" /> {t("printRoomCard")}
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
}
