import fs from "fs";
import path from "path";
import TicketChatPageClient from "./client";

interface Ticket {
    id: string;
}

export function generateStaticParams() {
    const filePath = path.join(process.cwd(), "public", "data", "tickets.json");
    const tickets: Ticket[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return tickets.map((t) => ({ id: t.id }));
}

export default function TicketChatPage({ params }: { params: Promise<{ id: string }> }) {
    return <TicketChatPageClient params={params} />;
}
