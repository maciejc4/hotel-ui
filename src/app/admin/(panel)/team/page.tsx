"use client";

import * as React from "react";
import { useHotel } from "@/contexts/HotelContext";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";
import { Plus, Trash2, UserPlus } from "lucide-react";

export default function AdminTeamPage() {
    const { staff, addStaff } = useHotel();
    const { showToast } = useToast();
    const [showInvite, setShowInvite] = React.useState(false);
    const [email, setEmail] = React.useState("");
    const [name, setName] = React.useState("");
    const [role, setRole] = React.useState<"Admin" | "Staff">("Staff");

    const handleInvite = () => {
        if (!email.trim() || !name.trim()) return;
        addStaff({ id: `staff-${Date.now()}`, name, email, role });
        setShowInvite(false);
        setEmail(""); setName("");
        showToast(`Invitation sent to ${email}`);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
                <button onClick={() => setShowInvite(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
                    <UserPlus className="w-4 h-4" /> Invite Member
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map(s => (
                            <tr key={s.id} className="border-b border-gray-100">
                                <td className="px-4 py-3 font-semibold text-gray-900">{s.name}</td>
                                <td className="px-4 py-3 text-gray-600">{s.email}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${s.role === "Admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>{s.role}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={showInvite} onClose={() => setShowInvite(false)} title="Invite Team Member" size="sm">
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Full Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-1">Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value as "Admin" | "Staff")}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800">
                            <option value="Staff">Staff</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <button onClick={handleInvite} className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-blue-700" disabled={!email.trim() || !name.trim()}>
                        Send Invitation
                    </button>
                </div>
            </Modal>
        </div>
    );
}
