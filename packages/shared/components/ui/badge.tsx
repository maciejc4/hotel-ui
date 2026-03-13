import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive" | "glass";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                {
                    "border-transparent bg-primary text-white": variant === "default",
                    "border-transparent bg-primary/10 text-primary": variant === "secondary",
                    "border-transparent bg-green-500/15 text-green-700": variant === "success",
                    "border-transparent bg-orange-500/15 text-orange-700": variant === "warning",
                    "border-transparent bg-red-500/15 text-red-700": variant === "destructive",
                    "glass-panel border-white/50 text-primary font-medium": variant === "glass",
                    "text-primary border-primary/20": variant === "outline",
                },
                className
            )}
            {...props}
        />
    )
}

export { Badge }
