"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import {
    Ticket, Conversation, ChatMessage, Room, Stay, StaffMember, HotelBranding,
    MOCK_TICKETS, MOCK_MESSAGES, MOCK_ROOMS, MOCK_STAYS, MOCK_STAFF, MOCK_BRANDING,
} from "@/lib/mockData";

interface HotelState {
    branding: HotelBranding;
    rooms: Room[];
    stays: Stay[];
    staff: StaffMember[];
    tickets: Ticket[];
    conversations: Conversation[];
    lateCheckoutStatus: null | "pending" | "approved";
    userSchedule: string[];
}

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

const HotelContext = createContext<HotelContextType | null>(null);

export function HotelProvider({ children }: { children: React.ReactNode }) {
    const [branding, setBranding] = useState<HotelBranding>(() => ({ ...MOCK_BRANDING }));
    const [rooms, setRooms] = useState<Room[]>(() => [...MOCK_ROOMS]);
    const [stays, setStays] = useState<Stay[]>(() => [...MOCK_STAYS]);
    const [staff, setStaff] = useState<StaffMember[]>(() => [...MOCK_STAFF]);
    const [tickets, setTickets] = useState<Ticket[]>(() => MOCK_TICKETS.map(t => ({ ...t, messages: [...t.messages] })));
    const [conversations, setConversations] = useState<Conversation[]>(() => MOCK_MESSAGES.map(c => ({ ...c, messages: [...c.messages] })));
    const [lateCheckoutStatus, setLateCheckoutStatus] = useState<null | "pending" | "approved">(null);
    const [userSchedule, setUserSchedule] = useState<string[]>([]);

    const updateBranding = useCallback((b: Partial<HotelBranding>) => {
        setBranding(prev => ({ ...prev, ...b }));
    }, []);

    const addRoom = useCallback((room: Room) => {
        setRooms(prev => [...prev, room]);
    }, []);

    const deleteRoom = useCallback((id: string) => {
        setRooms(prev => prev.filter(r => r.id !== id));
    }, []);

    const addStay = useCallback((stay: Stay) => {
        setStays(prev => [...prev, stay]);
    }, []);

    const deleteStay = useCallback((id: string) => {
        setStays(prev => prev.filter(s => s.id !== id));
    }, []);

    const addStaff = useCallback((s: StaffMember) => {
        setStaff(prev => [...prev, s]);
    }, []);

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

    const addConversationMessage = useCallback((convId: string, msg: ChatMessage) => {
        setConversations(prev => prev.map(c =>
            c.id === convId ? { ...c, messages: [...c.messages, msg], unread: msg.sender === "guest" ? c.unread + 1 : 0 } : c
        ));
    }, []);

    // Fixed: uses functional setState to avoid stale closure over `conversations`
    const getOrCreateConversation = useCallback((roomId: string, guestName: string): Conversation => {
        let result: Conversation | undefined;
        setConversations(prev => {
            const existing = prev.find(c => c.roomId === roomId);
            if (existing) {
                result = existing;
                return prev; // no state change
            }
            const newConv: Conversation = {
                id: `conv-${Date.now()}`, roomId, guestName, messages: [], unread: 0,
            };
            result = newConv;
            return [...prev, newConv];
        });
        return result!;
    }, []);

    const requestLateCheckout = useCallback(() => {
        setLateCheckoutStatus("pending");
        setTimeout(() => setLateCheckoutStatus("approved"), 5000);
    }, []);

    const addToSchedule = useCallback((activityId: string) => {
        setUserSchedule(prev => prev.includes(activityId) ? prev : [...prev, activityId]);
    }, []);

    const removeFromSchedule = useCallback((activityId: string) => {
        setUserSchedule(prev => prev.filter(id => id !== activityId));
    }, []);

    // Memoize context value to prevent unnecessary re-renders
    const value = useMemo<HotelContextType>(() => ({
        branding, rooms, stays, staff, tickets, conversations, lateCheckoutStatus, userSchedule,
        updateBranding, addRoom, deleteRoom, addStay, deleteStay, addStaff,
        addTicket, updateTicketStatus, assignTicket, addTicketMessage,
        addConversationMessage, getOrCreateConversation,
        requestLateCheckout, addToSchedule, removeFromSchedule,
    }), [
        branding, rooms, stays, staff, tickets, conversations, lateCheckoutStatus, userSchedule,
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
