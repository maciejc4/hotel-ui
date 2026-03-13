"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LockKeyhole, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useHotel } from "@/contexts/HotelContext";
import { LanguageSwitcher } from "@/components/features/LanguageSwitcher";

export default function OnboardingPage() {
  const router = useRouter();
  const { stays, rooms, branding, isLoading } = useHotel();
  const [dob, setDob] = React.useState("");
  const [error, setError] = React.useState("");
  const t = useTranslations("login");

  // The room comes from QR scan — for demo, default to room-204
  const roomId = "room-204";
  const room = rooms.find(r => r.id === roomId);
  const stay = stays.find(s => s.roomId === roomId);

  React.useEffect(() => {
    if (localStorage.getItem("guestSession")) {
      router.push("/guest");
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob.trim()) {
      setError(t("enterDob"));
      return;
    }
    localStorage.setItem("guestSession", JSON.stringify({
      roomId,
      roomNumber: room?.number || "204",
      guestName: stay?.guestName || "Guest",
      dob,
    }));
    router.push("/guest");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-mesh flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-primary/15 blur-[80px] animate-pulse" />
      <div className="absolute bottom-[15%] right-[10%] w-48 h-48 rounded-full bg-accent/15 blur-[60px] animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-panel-heavy p-8 rounded-[2.5rem] w-full max-w-sm relative z-10"
      >
        {/* Hotel logo placeholder */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg glow-primary">
            <span className="text-2xl font-black text-white">H</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-main)]">
            {t("welcomeToRoom", { roomNumber: room?.number || "204" })}
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-2 font-medium">
            {branding.name}
          </p>
        </div>

        {stay && (
          <div className="glass-panel rounded-2xl p-4 mb-6 text-center">
            <p className="text-sm text-[var(--color-text-muted)]">
              {t("verifyIdentity")}{" "}
              <span className="font-bold text-[var(--color-text-main)]">{stay.guestName}</span>
            </p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider font-bold text-[var(--color-text-muted)]">
              {t("dateOfBirth")}
            </label>
            <div className="relative">
              <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
              <input
                type="date"
                value={dob}
                onChange={(e) => { setDob(e.target.value); setError(""); }}
                className="w-full h-14 glass-panel rounded-2xl pl-12 pr-4 text-sm font-medium text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow bg-transparent"
              />
            </div>
            {error && <p className="text-xs text-red-500 mt-1 font-medium px-2">{error}</p>}
          </div>

          <Button type="submit" variant="default" size="lg" className="w-full h-14 text-base bg-gradient-to-r from-primary to-accent border-0 text-white glow-primary">
            {t("accessYourStay")}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </form>

        <div className="flex items-center justify-center mt-6">
          <LanguageSwitcher />
        </div>
      </motion.div>
    </div>
  );
}
