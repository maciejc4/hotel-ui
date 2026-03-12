"use client";

import * as React from "react";
import { useHotel } from "@/contexts/HotelContext";
import { useToast } from "@/components/ui/toast";
import { Upload, Eye } from "lucide-react";

export default function AdminBrandingPage() {
    const { branding, updateBranding } = useHotel();
    const { showToast } = useToast();
    const [name, setName] = React.useState(branding.name);
    const [logoPreview, setLogoPreview] = React.useState(branding.logoUrl);

    const handleSave = () => {
        updateBranding({ name, logoUrl: logoPreview });
        showToast("Branding updated!");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Branding</h1>
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 max-w-lg">
                <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-2">Hotel Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800" />
                </div>
                <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-2">Hotel Logo</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                        {logoPreview ? (
                            <img src={logoPreview} alt="Logo preview" className="w-32 h-32 object-contain mx-auto mb-3" />
                        ) : (
                            <Upload className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        )}
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="logo-upload" />
                        <label htmlFor="logo-upload" className="cursor-pointer text-sm text-blue-600 font-semibold hover:text-blue-800">
                            {logoPreview ? "Change logo" : "Upload logo"}
                        </label>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700">
                        Save Changes
                    </button>
                </div>
                <div className="border-t pt-4">
                    <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> Guest App Preview</p>
                    <div className="bg-gray-900 rounded-xl p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center">
                            {logoPreview ? <img src={logoPreview} className="w-full h-full object-cover rounded-xl" alt="" /> : <span className="text-white font-bold text-sm">{name.charAt(0)}</span>}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">{name}</p>
                            <p className="text-[10px] text-white/50">Room 204 • Thomas Mueller</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
