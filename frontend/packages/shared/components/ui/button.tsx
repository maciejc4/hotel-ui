import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "glass" | "glass-heavy" | "accent"
    size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 duration-200",
                    {
                        "bg-primary text-white hover:bg-primary/90 shadow-md": variant === "default",
                        "bg-accent text-white hover:bg-accent/90 shadow-md": variant === "accent",
                        "border border-primary text-primary hover:bg-primary/5": variant === "outline",
                        "hover:bg-primary/10 text-primary": variant === "ghost",
                        "glass-panel hover:bg-white/40 text-primary": variant === "glass",
                        "glass-panel-heavy hover:bg-white/50 text-primary": variant === "glass-heavy",

                        "h-10 px-4 py-2": size === "default",
                        "h-9 rounded-full px-3": size === "sm",
                        "h-12 rounded-full px-8 text-base": size === "lg",
                        "h-10 w-10": size === "icon",
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
