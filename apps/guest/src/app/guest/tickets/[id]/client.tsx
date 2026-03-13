"use client";

import * as React from "react";
import { use } from "react";
import TicketChatClient from "@/components/features/TicketChat";

export default function TicketChatPageClient({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return <TicketChatClient ticketId={id} />;
}
