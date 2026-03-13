/**
 * Returns a Badge variant string for the given ticket status.
 * Shared between guest ticket list, ticket chat, and admin tickets.
 */
export function getTicketStatusVariant(status: string): "destructive" | "warning" | "success" | "secondary" {
    switch (status) {
        case "New": return "destructive";
        case "In Progress": return "warning";
        case "Closed": return "success";
        default: return "secondary";
    }
}

/**
 * Returns Tailwind class string for admin ticket status dropdowns.
 */
export function getTicketStatusColor(status: string): string {
    switch (status) {
        case "New": return "bg-red-100 text-red-700";
        case "In Progress": return "bg-yellow-100 text-yellow-700";
        case "Closed": return "bg-green-100 text-green-700";
        default: return "bg-gray-100 text-gray-700";
    }
}
