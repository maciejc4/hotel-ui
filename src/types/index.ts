// ═══════════════════════════════════════════════════════
// HotelConnect — Domain Types
// ═══════════════════════════════════════════════════════

export interface Room {
    id: string;
    number: string;
    floor: number;
    equipment: string[];
}

export interface Stay {
    id: string;
    roomId: string;
    guestName: string;
    guestDob: string;
    startDate: string;
    endDate: string;
}

export interface StaffMember {
    id: string;
    name: string;
    email: string;
    role: "Admin" | "Staff";
}

export interface Restaurant {
    id: string;
    name: string;
    type: "restaurant" | "bar";
    openTime: string;
    closeTime: string;
    allInclusiveStart?: string;
    allInclusiveEnd?: string;
    description: string;
    menuHighlights: string[];
}

export interface AlaCarteInfo {
    id: string;
    name: string;
    cuisine: string;
    dressCode: string;
    reservationRequired: boolean;
    description: string;
}

export interface ActivityEvent {
    time: string;
    name: string;
    location: string;
}

export interface Activity {
    id: string;
    title: string;
    type: "animation" | "sport" | "entertainment" | "kids";
    emoji: string;
    status: "open" | "busy" | "closed";
    busyLevel: "low" | "medium" | "high";
    openTime: string;
    closeTime: string;
    description: string;
    schedule: ActivityEvent[];
}

export interface SpaTreatment {
    id: string;
    name: string;
    duration: string;
    price: string;
    available: boolean;
    location: string;
    therapist: string;
}

export interface FitnessClass {
    id: string;
    name: string;
    time: string;
    duration: string;
    instructor: string;
    location: string;
    description: string;
}

export interface KidsClubInfo {
    openTime: string;
    closeTime: string;
    ageRange: string;
    dropOffPolicy: string;
    description: string;
    minidiscoTime: string;
    schedule: ActivityEvent[];
}

export interface CarRental {
    id: string;
    model: string;
    type: string;
    pricePerDay: string;
    available: boolean;
}

export interface ChatMessage {
    id: string;
    sender: "guest" | "staff" | "system";
    text: string;
    timestamp: string;
}

export interface Ticket {
    id: string;
    roomId: string;
    category: string;
    issue: string;
    status: "New" | "In Progress" | "Closed";
    assignedTo?: string;
    createdAt: string;
    messages: ChatMessage[];
}

export interface Conversation {
    id: string;
    roomId: string;
    guestName: string;
    messages: ChatMessage[];
    unread: number;
}

export interface HotelBranding {
    name: string;
    logoUrl: string;
    languages: string[];
}

export interface GuestSession {
    roomId: string;
    roomNumber: string;
    guestName: string;
    dob: string;
}
