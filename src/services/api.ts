// ═══════════════════════════════════════════════════════
// API Service Layer — Mock Backend REST Clients
// ═══════════════════════════════════════════════════════
//
// Each function simulates a real REST API call by fetching
// from static JSON files. When a real backend is ready,
// only the base URL and fetch options need to change.

import type {
    Room, Stay, StaffMember, Restaurant, AlaCarteInfo,
    Activity, SpaTreatment, FitnessClass, KidsClubInfo,
    CarRental, Ticket, Conversation, HotelBranding,
} from "@/types";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "/hotel-ui";
const SIMULATED_DELAY_MS = 150;

async function fetchData<T>(path: string): Promise<T> {
    // Simulate realistic network latency
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY_MS));

    const url = `${BASE_PATH}/data/${path}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText} for ${url}`);
    }

    return response.json() as Promise<T>;
}

// ─── Branding ────────────────────────────────────────
export function fetchBranding(): Promise<HotelBranding> {
    return fetchData<HotelBranding>("branding.json");
}

// ─── Staff ───────────────────────────────────────────
export function fetchStaff(): Promise<StaffMember[]> {
    return fetchData<StaffMember[]>("staff.json");
}

// ─── Rooms ───────────────────────────────────────────
export function fetchRooms(): Promise<Room[]> {
    return fetchData<Room[]>("rooms.json");
}

// ─── Stays ───────────────────────────────────────────
export function fetchStays(): Promise<Stay[]> {
    return fetchData<Stay[]>("stays.json");
}

// ─── Restaurants & Bars ──────────────────────────────
export function fetchRestaurants(): Promise<Restaurant[]> {
    return fetchData<Restaurant[]>("restaurants.json");
}

// ─── A'la Carte ──────────────────────────────────────
export function fetchAlaCarte(): Promise<AlaCarteInfo[]> {
    return fetchData<AlaCarteInfo[]>("alacarte.json");
}

// ─── Activities ──────────────────────────────────────
export function fetchActivities(): Promise<Activity[]> {
    return fetchData<Activity[]>("activities.json");
}

// ─── SPA ─────────────────────────────────────────────
export function fetchSpa(): Promise<SpaTreatment[]> {
    return fetchData<SpaTreatment[]>("spa.json");
}

// ─── Fitness ─────────────────────────────────────────
export function fetchFitness(): Promise<FitnessClass[]> {
    return fetchData<FitnessClass[]>("fitness.json");
}

// ─── Kids Club ───────────────────────────────────────
export function fetchKidsClub(): Promise<KidsClubInfo> {
    return fetchData<KidsClubInfo>("kids-club.json");
}

// ─── Car Rental ──────────────────────────────────────
export function fetchCarRental(): Promise<CarRental[]> {
    return fetchData<CarRental[]>("car-rental.json");
}

// ─── Tickets ─────────────────────────────────────────
export function fetchTickets(): Promise<Ticket[]> {
    return fetchData<Ticket[]>("tickets.json");
}

// ─── Conversations ───────────────────────────────────
export function fetchConversations(): Promise<Conversation[]> {
    return fetchData<Conversation[]>("conversations.json");
}

// ─── AI Responses ────────────────────────────────────
export function fetchAIResponses(): Promise<string[]> {
    return fetchData<string[]>("ai-responses.json");
}

// ─── Ticket Categories ───────────────────────────────
export function fetchTicketCategories(): Promise<string[]> {
    return fetchData<string[]>("ticket-categories.json");
}
