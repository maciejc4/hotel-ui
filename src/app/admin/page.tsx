"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = React.useState("admin@hotel.com");
    const [password, setPassword] = React.useState("admin");

    React.useEffect(() => {
        if (localStorage.getItem("adminSession")) {
            router.push("/admin/dashboard");
        }
    }, [router]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem("adminSession", JSON.stringify({ email }));
        router.push("/admin/dashboard");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-4">
                        <span className="font-black text-lg">H</span>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">HotelConnect Admin</h1>
                    <p className="text-sm text-gray-500 mt-1">Staff Management Panel</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                        <LogIn className="w-4 h-4" /> Sign In
                    </button>
                </form>
                <p className="text-center text-xs text-gray-400 mt-6">Any credentials will work for this demo</p>
            </div>
        </div>
    );
}
