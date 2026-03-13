"use client";

import { useMemo } from "react";
import type { GuestSession } from "@/types";

/**
 * Reads and parses the guest session from localStorage.
 * Returns null if no session exists or on the server.
 */
export function useGuestSession(): GuestSession | null {
    return useMemo(() => {
        if (typeof window === "undefined") return null;
        const data = localStorage.getItem("guestSession");
        if (!data) return null;
        try {
            return JSON.parse(data) as GuestSession;
        } catch {
            return null;
        }
    }, []);
}
