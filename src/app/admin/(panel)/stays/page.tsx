"use client";

import * as React from "react";
import { useHotel } from "@/contexts/HotelContext";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";
import { Plus, Trash2, MessageSquare } from "lucide-react";

export default function AdminStaysPage() {
    const { stays, rooms, addStay, deleteStay } = useHotel();
    const { showToast } = useToast();
    const [showAdd, setShowAdd] = React.useState(false);
    const [newRoom, setNewRoom] = React.useState("");
    const [newName, setNewName] = React.useState("");
    const [newDob, setNewDob] = React.useState("");
    const [newStart, setNewStart] = React.useState(new Date().toISOString().split("T")[0]);
    const [newEnd, setNewEnd] = React.useState(new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]);

    const handleAdd = () => {
        if (!newRoom || !newName.trim() || !newDob) return;
        addStay({
            id: `stay-${Date.now()}`, roomId: newRoom, guestName: newName, guestDob: newDob,
            startDate: newStart, endDate: newEnd,
        });
        setShowAdd(false);
        setNewName(""); setNewDob(""); setNewRoom("");
        showToast("Stay added!");
    };

    const getRoomNumber = (roomId: string) => rooms.find(r => r.id === roomId)?.number || "?";

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Stay Management</h1>
                <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
                    <Plus className="w-4 h-4" /> Add Stay
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600">Guest</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600">Room</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600">Check-in</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600">Check-out</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600">DOB</th>
                            <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stays.map(s => (
                            <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="px-4 py-3 font-semibold text-gray-900">{s.guestName}</td>
                                <td className="px-4 py-3"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">{getRoomNumber(s.roomId)}</span></td>
                                <td className="px-4 py-3 text-gray-600">{s.startDate}</td>
                                <td className="px-4 py-3 text-gray-600">{s.endDate}</td>
                                <td className="px-4 py-3 text-gray-400 text-xs">{s.guestDob}</td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => { deleteStay(s.id); showToast("Stay removed."); }} className="text-gray-400 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Register New Stay" size="md">
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Guest Name</label>
                            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Full name"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Date of Birth</label>
                            <input type="date" value={newDob} onChange={(e) => setNewDob(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Room</label>
                        <select value={newRoom} onChange={(e) => setNewRoom(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800">
                            <option value="">Select room...</option>
                            {rooms.map(r => <option key={r.id} value={r.id}>Room {r.number} (Floor {r.floor})</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Check-in</label>
                            <input type="date" value={newStart} onChange={(e) => setNewStart(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Check-out</label>
                            <input type="date" value={newEnd} onChange={(e) => setNewEnd(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800" />
                        </div>
                    </div>
                    <button onClick={handleAdd} className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-blue-700" disabled={!newRoom || !newName.trim()}>
                        Register Stay
                    </button>
                </div>
            </Modal>
        </div>
    );
}
