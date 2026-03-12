import { MOCK_TICKETS } from "@/lib/mockData";
import { TicketChatClient } from "@/components/features/TicketChat";

export function generateStaticParams() {
    return MOCK_TICKETS.map((t) => ({ id: t.id }));
}

export default function TicketChatPage() {
    return <TicketChatClient />;
}
