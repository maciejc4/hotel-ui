"use client";

import { Badge } from "@/components/ui/badge";
import { BentoGridItem } from "@/components/layout/BentoGrid";
import { Clock, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { Activity } from "@/lib/mockData";

export function ActivityCard({ item }: { item: Activity }) {
    const getStatusBadge = () => {
        if (item.status === "closed") {
            return <Badge variant="destructive">Closed</Badge>;
        }
        if (item.busyLevel === "high") {
            return (
                <Badge variant="warning" className="animate-pulse">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Busy
                </Badge>
            );
        }
        if (item.busyLevel === "medium") {
            return <Badge variant="secondary">Moderate</Badge>;
        }
        return (
            <Badge variant="success">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Available
            </Badge>
        );
    };

    return (
        <BentoGridItem
            title={item.title}
            description={
                <div className="flex flex-col gap-2 mt-1">
                    <p className="line-clamp-2">{item.description}</p>
                    <div className="flex items-center text-xs opacity-70 gap-1 font-medium mt-1">
                        <Clock className="w-3 h-3" />
                        {item.openTime} - {item.closeTime}
                    </div>
                </div>
            }
            header={
                <div className="flex justify-end w-full h-8">
                    {getStatusBadge()}
                </div>
            }
            icon={<span className="text-3xl mb-2">{item.emoji}</span>}
        />
    );
}
