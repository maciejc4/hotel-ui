// ═══════════════════════════════════════════════════════
// HotelConnect — Comprehensive Mock Data
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
}

export interface FitnessClass {
    id: string;
    name: string;
    time: string;
    duration: string;
    instructor: string;
    location: string;
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

// ─── Hotel Branding ──────────────────────────────────
export const MOCK_BRANDING: HotelBranding = {
    name: "Azure Bay Resort & Spa",
    logoUrl: "",
    languages: ["en", "pl", "de"],
};

// ─── Staff ───────────────────────────────────────────
export const MOCK_STAFF: StaffMember[] = [
    { id: "staff-1", name: "Maria Kowalska", email: "maria@azurebay.com", role: "Admin" },
    { id: "staff-2", name: "Jan Nowak", email: "jan@azurebay.com", role: "Staff" },
];

// ─── Rooms ───────────────────────────────────────────
export const MOCK_ROOMS: Room[] = [
    { id: "room-101", number: "101", floor: 1, equipment: ["AC", "TV", "Mini-bar", "Safe"] },
    { id: "room-102", number: "102", floor: 1, equipment: ["AC", "TV", "Mini-bar", "Balcony"] },
    { id: "room-203", number: "203", floor: 2, equipment: ["AC", "TV", "Mini-bar", "Balcony", "Sea View"] },
    { id: "room-204", number: "204", floor: 2, equipment: ["AC", "TV", "Mini-bar", "Safe", "Balcony"] },
    { id: "room-305", number: "305", floor: 3, equipment: ["AC", "TV", "Mini-bar", "Balcony", "Jacuzzi", "Sea View"] },
    { id: "room-306", number: "306", floor: 3, equipment: ["AC", "TV", "Safe"] },
    { id: "room-401", number: "401", floor: 4, equipment: ["AC", "TV", "Mini-bar", "Balcony", "Sea View", "Jacuzzi", "Kitchen"] },
    { id: "room-402", number: "402", floor: 4, equipment: ["AC", "TV", "Mini-bar", "Balcony"] },
];

// ─── Stays ───────────────────────────────────────────
export const MOCK_STAYS: Stay[] = [
    { id: "stay-1", roomId: "room-204", guestName: "Thomas Mueller", guestDob: "1990-05-15", startDate: "2026-03-10", endDate: "2026-03-17" },
    { id: "stay-2", roomId: "room-305", guestName: "Anna Nowak", guestDob: "1985-11-22", startDate: "2026-03-11", endDate: "2026-03-18" },
    { id: "stay-3", roomId: "room-101", guestName: "John Smith", guestDob: "2000-01-01", startDate: "2026-03-12", endDate: "2026-03-15" },
];

// ─── Restaurants & Bars ──────────────────────────────
export const MOCK_RESTAURANTS: Restaurant[] = [
    {
        id: "rest-1", name: "Ocean Breeze Restaurant", type: "restaurant",
        openTime: "07:00", closeTime: "22:00",
        allInclusiveStart: "07:00", allInclusiveEnd: "21:00",
        description: "Main hotel restaurant with international buffet and live cooking stations.",
        menuHighlights: ["Breakfast Buffet", "Mediterranean Lunch", "Seafood Night"],
    },
    {
        id: "rest-2", name: "Sunset Pool Bar", type: "bar",
        openTime: "10:00", closeTime: "18:00",
        allInclusiveStart: "10:00", allInclusiveEnd: "17:00",
        description: "Refreshing cocktails and light snacks by the infinity pool.",
        menuHighlights: ["Mojitos", "Fruit Smoothies", "Club Sandwich"],
    },
    {
        id: "rest-3", name: "La Terrazza Rooftop Bar", type: "bar",
        openTime: "18:00", closeTime: "01:00",
        description: "Premium cocktails and tapas with panoramic sunset views.",
        menuHighlights: ["Craft Cocktails", "Tapas Selection", "Wine List"],
    },
];

// ─── A'la Carte ──────────────────────────────────────
export const MOCK_ALACARTE: AlaCarteInfo[] = [
    { id: "alc-1", name: "Sakura Japanese Kitchen", cuisine: "Japanese", dressCode: "Smart Casual", reservationRequired: true, description: "Authentic sushi and teppanyaki experience." },
    { id: "alc-2", name: "Il Giardino", cuisine: "Italian", dressCode: "Smart Casual", reservationRequired: true, description: "Handmade pasta and wood-fired pizza." },
    { id: "alc-3", name: "Mar y Fuego", cuisine: "Grill & Seafood", dressCode: "Elegant", reservationRequired: true, description: "Premium grilled meats and fresh seafood." },
];

// ─── Activities & Animations ─────────────────────────
export const MOCK_ACTIVITIES: Activity[] = [
    {
        id: "act-1", title: "Beach Volleyball", type: "sport", emoji: "🏐",
        status: "open", busyLevel: "medium", openTime: "08:00", closeTime: "18:00",
        description: "Join our daily beach volleyball tournaments! All skill levels welcome.",
        schedule: [
            { time: "09:00", name: "Morning Warm-up", location: "Main Beach" },
            { time: "11:00", name: "Open Tournament", location: "Main Beach" },
            { time: "16:00", name: "Sunset Match", location: "Main Beach" },
        ],
    },
    {
        id: "act-2", title: "Aqua Aerobics", type: "sport", emoji: "🏊",
        status: "open", busyLevel: "low", openTime: "08:00", closeTime: "12:00",
        description: "Fun water exercises in the main pool with our certified instructors.",
        schedule: [
            { time: "09:00", name: "Morning Aqua Fit", location: "Main Pool" },
            { time: "10:30", name: "Aqua Zumba", location: "Main Pool" },
        ],
    },
    {
        id: "act-3", title: "Live Music Nights", type: "entertainment", emoji: "🎵",
        status: "open", busyLevel: "high", openTime: "20:00", closeTime: "23:00",
        description: "Enjoy live performances every evening at the amphitheatre.",
        schedule: [
            { time: "20:00", name: "Acoustic Guitar Set", location: "Amphitheatre" },
            { time: "21:30", name: "Latin Dance Show", location: "Amphitheatre" },
        ],
    },
    {
        id: "act-4", title: "Yoga & Meditation", type: "sport", emoji: "🧘",
        status: "open", busyLevel: "low", openTime: "06:00", closeTime: "10:00",
        description: "Start your day with sunrise yoga on the rooftop terrace.",
        schedule: [
            { time: "06:30", name: "Sunrise Yoga", location: "Rooftop Terrace" },
            { time: "08:00", name: "Hatha Yoga", location: "Wellness Garden" },
            { time: "09:30", name: "Guided Meditation", location: "Wellness Garden" },
        ],
    },
    {
        id: "act-5", title: "Treasure Hunt", type: "kids", emoji: "🗺️",
        status: "open", busyLevel: "medium", openTime: "10:00", closeTime: "12:00",
        description: "An exciting adventure around the resort for kids and families!",
        schedule: [
            { time: "10:00", name: "Treasure Hunt Start", location: "Kids Club" },
        ],
    },
    {
        id: "act-6", title: "Cooking Class", type: "entertainment", emoji: "👨‍🍳",
        status: "open", busyLevel: "low", openTime: "15:00", closeTime: "17:00",
        description: "Learn to cook local dishes with our head chef.",
        schedule: [
            { time: "15:00", name: "Mediterranean Cooking", location: "Demo Kitchen" },
        ],
    },
];

// ─── SPA ─────────────────────────────────────────────
export const MOCK_SPA: SpaTreatment[] = [
    { id: "spa-1", name: "Balinese Massage", duration: "60 min", price: "€80", available: true },
    { id: "spa-2", name: "Hot Stone Therapy", duration: "75 min", price: "€95", available: true },
    { id: "spa-3", name: "Aromatherapy Facial", duration: "45 min", price: "€65", available: false },
    { id: "spa-4", name: "Couple's Retreat", duration: "90 min", price: "€160", available: true },
    { id: "spa-5", name: "Deep Tissue Massage", duration: "60 min", price: "€85", available: true },
];

// ─── Fitness ─────────────────────────────────────────
export const MOCK_FITNESS: FitnessClass[] = [
    { id: "fit-1", name: "Morning HIIT", time: "07:00", duration: "45 min", instructor: "Coach Alex", location: "Gym Studio" },
    { id: "fit-2", name: "Pilates", time: "09:00", duration: "50 min", instructor: "Lisa M.", location: "Gym Studio" },
    { id: "fit-3", name: "Spin Class", time: "10:30", duration: "40 min", instructor: "Coach Alex", location: "Gym Studio" },
    { id: "fit-4", name: "Stretch & Relax", time: "17:00", duration: "30 min", instructor: "Lisa M.", location: "Wellness Garden" },
];

// ─── Kids Club ───────────────────────────────────────
export const MOCK_KIDS_CLUB: KidsClubInfo = {
    openTime: "09:00",
    closeTime: "17:00",
    ageRange: "4–12 years",
    dropOffPolicy: "Parents may leave children for supervised sessions (max 3 hours). ID bracelet required.",
    description: "Fun-filled activities for kids including arts, games, and outdoor adventures. Supervised by certified professionals.",
    minidiscoTime: "19:00",
    schedule: [
        { time: "09:30", name: "Arts & Crafts", location: "Kids Club Room" },
        { time: "11:00", name: "Pool Games", location: "Kids Pool" },
        { time: "14:00", name: "Face Painting", location: "Kids Club Room" },
        { time: "15:30", name: "Treasure Hunt", location: "Garden" },
        { time: "19:00", name: "🪩 Minidisco", location: "Main Stage" },
    ],
};

// ─── Car Rental ──────────────────────────────────────
export const MOCK_CAR_RENTAL: CarRental[] = [
    { id: "car-1", model: "Fiat 500", type: "Economy", pricePerDay: "€35", available: true },
    { id: "car-2", model: "VW Golf", type: "Compact", pricePerDay: "€50", available: true },
    { id: "car-3", model: "Jeep Wrangler", type: "SUV", pricePerDay: "€85", available: false },
    { id: "car-4", model: "Mercedes E-Class", type: "Premium", pricePerDay: "€120", available: true },
];

// ─── Tickets ─────────────────────────────────────────
export const MOCK_TICKETS: Ticket[] = [
    {
        id: "TCK-001", roomId: "room-204", category: "AC",
        issue: "Air conditioning not cooling properly",
        status: "In Progress", assignedTo: "staff-2", createdAt: "2026-03-12T14:30:00Z",
        messages: [
            { id: "msg-t1-1", sender: "guest", text: "The AC in our room makes noise but doesn't cool.", timestamp: "2026-03-12T14:30:00Z" },
            { id: "msg-t1-2", sender: "staff", text: "Thank you for reporting. We'll send a technician within 30 minutes.", timestamp: "2026-03-12T14:35:00Z" },
            { id: "msg-t1-3", sender: "guest", text: "Thank you! We'll wait.", timestamp: "2026-03-12T14:36:00Z" },
        ],
    },
    {
        id: "TCK-002", roomId: "room-305", category: "Plumbing",
        issue: "Bathroom sink draining slowly",
        status: "New", createdAt: "2026-03-12T16:00:00Z",
        messages: [
            { id: "msg-t2-1", sender: "guest", text: "The sink in the bathroom is draining very slowly.", timestamp: "2026-03-12T16:00:00Z" },
        ],
    },
];

// ─── Messages (General Guest ↔ Reception) ────────────
export const MOCK_MESSAGES: Conversation[] = [
    {
        id: "conv-1", roomId: "room-204", guestName: "Thomas Mueller", unread: 1,
        messages: [
            { id: "msg-c1-1", sender: "guest", text: "Hello! Could we get extra towels?", timestamp: "2026-03-12T10:00:00Z" },
            { id: "msg-c1-2", sender: "staff", text: "Of course! We'll bring them to room 204 right away.", timestamp: "2026-03-12T10:02:00Z" },
            { id: "msg-c1-3", sender: "guest", text: "Also, is there a microwave we can use for baby food?", timestamp: "2026-03-12T11:15:00Z" },
        ],
    },
    {
        id: "conv-2", roomId: "room-305", guestName: "Anna Nowak", unread: 0,
        messages: [
            { id: "msg-c2-1", sender: "guest", text: "What time does the pool close?", timestamp: "2026-03-12T09:00:00Z" },
            { id: "msg-c2-2", sender: "staff", text: "The main pool is open until 20:00. Enjoy!", timestamp: "2026-03-12T09:05:00Z" },
        ],
    },
];

// ─── AI Concierge Responses ──────────────────────────
export const AI_RESPONSES = [
    "The nearest microwave is in the Family Room on the ground floor, next to the Kids Club. Available 24/7!",
    "You can book a table at our A'la Carte restaurants through this app or by visiting the reception. Smart casual dress code applies.",
    "Beach towels are available at the pool towel station between 8:00 AM and 7:00 PM. Just show your room keycard!",
    "The Kids Minidisco starts at 19:00 at the Main Stage. It's a hit with all the little ones! 🪩",
    "Our SPA is open from 8:00 to 20:00. I'd recommend booking the Balinese Massage — it's our most popular treatment!",
    "The gym is open 24/7 with keycard access. Group fitness classes run in the morning — check the Fitness tab for today's schedule.",
    "Car rental is available at the reception desk. The Fiat 500 is our most popular for exploring the coast!",
];

// ─── Ticket Categories ───────────────────────────────
export const TICKET_CATEGORIES = [
    "AC", "Plumbing", "Cleaning", "TV", "Wi-Fi", "Lighting", "Mini-bar", "Safe", "Other",
];
