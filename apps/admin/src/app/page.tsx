"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@hotel-ui/shared/components/ui/button";

export default function AdminLoginPage() {
    const router = useRouter();
    const t = useTranslations("admin");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    React.useEffect(() => {
        if (localStorage.getItem("adminSession")) {
            router.push("/dashboard");
        }
    }, [router]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem("adminSession", "true");
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-xl font-black text-white">H</span>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">{t("hotelConnect")}</h1>
                    <p className="text-sm text-gray-500 mt-1">{t("staffManagementPanel")}</p>
                </div>

                <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-1">{t("email")}</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@hotel.com"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-1">{t("password")}</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800" />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                        {t("signIn")}
                    </Button>
                </form>
            </div>
        </div>
    );
}
