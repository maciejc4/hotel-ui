"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import type {
    Ticket, Conversation, ChatMessage, Room, Stay, StaffMember, HotelBranding,
} from "@/types";
import {
    fetchBranding, fetchRooms, fetchStays, fetchStaff,
    fetchTickets, fetchConversations,
} from "@/services/api";

// ─── State Shape ─────────────────────────────────────
interface HotelState {
    isLoading: boolean;
    branding: HotelBranding;
    rooms: Room[];
    stays: Stay[];
    staff: StaffMember[];
    tickets: Ticket[];
    conversations: Conversation[];
    lateCheckoutStatus: null | "pending" | "approved";
    userSchedule: string[];
}

// ─── Context Interface ───────────────────────────────
interface HotelContextType extends HotelState {
    updateBranding: (b: Partial<HotelBranding>) => void;
    addRoom: (room: Room) => void;
    deleteRoom: (id: string) => void;
    addStay: (stay: Stay) => void;
    deleteStay: (id: string) => void;
    addStaff: (s: StaffMember) => void;
    addTicket: (t: Ticket) => void;
    updateTicketStatus: (id: string, status: Ticket["status"]) => void;
    assignTicket: (id: string, staffId: string) => void;
    addTicketMessage: (ticketId: string, msg: ChatMessage) => void;
    addConversationMessage: (convId: string, msg: ChatMessage) => void;
    getOrCreateConversation: (roomId: string, guestName: string) => Conversation;
    requestLateCheckout: () => void;
    addToSchedule: (activityId: string) => void;
    removeFromSchedule: (activityId: string) => void;
}

const DEFAULT_BRANDING: HotelBranding = { name: "", logoUrl: "", languages: ["en"] };

const HotelContext = createContext<HotelContextType | null>(null);

export function HotelProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [branding, setBranding] = useState<HotelBranding>(DEFAULT_BRANDING);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [stays, setStays] = useState<Stay[]>([]);
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [lateCheckoutStatus, setLateCheckoutStatus] = useState<null | "pending" | "approved">(null);
    const [userSchedule, setUserSchedule] = useState<string[]>([]);

    // ─── Load data from mock backend on mount ─────────
    useEffect(() => {
        let cancelled = false;

        async function loadAll() {
            try {
                const [brandingData, roomsData, staysData, staffData, ticketsData, convsData] =
                    await Promise.all([
                        fetchBranding(),
                        fetchRooms(),
                        fetchStays(),
                        fetchStaff(),
                        fetchTickets(),
                        fetchConversations(),
                    ]);

                if (cancelled) return;

                setBranding(brandingData);
                setRooms(roomsData);
                setStays(staysData);
                setStaff(staffData);
                setTickets(ticketsData);
                setConversations(convsData);
            } catch (error) {
                console.error("Failed to load hotel data:", error);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        loadAll();
        return () => { cancelled = true; };
    }, []);

    // ─── Branding ─────────────────────────────────────
    const updateBranding = useCallback((b: Partial<HotelBranding>) => {
        setBranding(prev => ({ ...prev, ...b }));
    }, []);

    // ─── Rooms ────────────────────────────────────────
    const addRoom = useCallback((room: Room) => {
        setRooms(prev => [...prev, room]);
    }, []);

    const deleteRoom = useCallback((id: string) => {
        setRooms(prev => prev.filter(r => r.id !== id));
    }, []);

    // ─── Stays ────────────────────────────────────────
    const addStay = useCallback((stay: Stay) => {
        setStays(prev => [...prev, stay]);
    }, []);

    const deleteStay = useCallback((id: string) => {
        setStays(prev => prev.filter(s => s.id !== id));
    }, []);

    // ─── Staff ────────────────────────────────────────
    const addStaff = useCallback((s: StaffMember) => {
        setStaff(prev => [...prev, s]);
    }, []);

    // ─── Tickets ──────────────────────────────────────
    const addTicket = useCallback((t: Ticket) => {
        setTickets(prev => [...prev, t]);
    }, []);

    const updateTicketStatus = useCallback((id: string, status: Ticket["status"]) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    }, []);

    const assignTicket = useCallback((id: string, staffId: string) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, assignedTo: staffId } : t));
    }, []);

    const addTicketMessage = useCallback((ticketId: string, msg: ChatMessage) => {
        setTickets(prev => prev.map(t =>
            t.id === ticketId ? { ...t, messages: [...t.messages, msg] } : t
        ));
    }, []);

    // ─── Conversations ────────────────────────────────
    const addConversationMessage = useCallback((convId: string, msg: ChatMessage) => {
        setConversations(prev => prev.map(c =>
            c.id === convId ? { ...c, messages: [...c.messages, msg], unread: msg.sender === "guest" ? c.unread + 1 : 0 } : c
        ));
    }, []);

    // Use a ref to avoid the anti-pattern of returning a value from setState
    const conversationsRef = React.useRef(conversations);
    conversationsRef.current = conversations;

    const getOrCreateConversation = useCallback((roomId: string, guestName: string): Conversation => {
        const existing = conversationsRef.current.find(c => c.roomId === roomId);
        if (existing) return existing;

        const newConv: Conversation = {
            id: `conv-${Date.now()}`, roomId, guestName, messages: [], unread: 0,
        };
        setConversations(prev => [...prev, newConv]);
        return newConv;
    }, []);

    // ─── Late Checkout ────────────────────────────────
    const requestLateCheckout = useCallback(() => {
        setLateCheckoutStatus("pending");
    }, []);

    // Handle late checkout approval with proper cleanup
    useEffect(() => {
        if (lateCheckoutStatus !== "pending") return;
        const timer = setTimeout(() => setLateCheckoutStatus("approved"), 5000);
        return () => clearTimeout(timer);
    }, [lateCheckoutStatus]);

    // ─── Schedule ─────────────────────────────────────
    const addToSchedule = useCallback((activityId: string) => {
        setUserSchedule(prev => prev.includes(activityId) ? prev : [...prev, activityId]);
    }, []);

    const removeFromSchedule = useCallback((activityId: string) => {
        setUserSchedule(prev => prev.filter(id => id !== activityId));
    }, []);

    // ─── Memoized context value ───────────────────────
    const value = useMemo<HotelContextType>(() => ({
        isLoading, branding, rooms, stays, staff, tickets, conversations, lateCheckoutStatus, userSchedule,
        updateBranding, addRoom, deleteRoom, addStay, deleteStay, addStaff,
        addTicket, updateTicketStatus, assignTicket, addTicketMessage,
        addConversationMessage, getOrCreateConversation,
        requestLateCheckout, addToSchedule, removeFromSchedule,
    }), [
        isLoading, branding, rooms, stays, staff, tickets, conversations, lateCheckoutStatus, userSchedule,
        updateBranding, addRoom, deleteRoom, addStay, deleteStay, addStaff,
        addTicket, updateTicketStatus, assignTicket, addTicketMessage,
        addConversationMessage, getOrCreateConversation,
        requestLateCheckout, addToSchedule, removeFromSchedule,
    ]);

    return (
        <HotelContext.Provider value={value}>
            {children}
        </HotelContext.Provider>
    );
}

export function useHotel() {
    const context = useContext(HotelContext);
    if (!context) throw new Error("useHotel must be used within HotelProvider");
    return context;
}
