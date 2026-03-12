import { cn } from "@/lib/utils";
import React from "react";

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
    colSpan,
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
    colSpan?: 1 | 2 | 3;
}) => {
    return (
        <div
            className={cn(
                "row-span-1 rounded-3xl group/bento transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent flex flex-col space-y-4",
                "glass-panel hover:glass-panel-heavy hover:-translate-y-1 cursor-pointer",
                {
                    "md:col-span-1": colSpan === 1 || !colSpan,
                    "md:col-span-2": colSpan === 2,
                    "md:col-span-3 lg:col-span-2": colSpan === 3,
                },
                className
            )}
        >
            {header}
            <div className="group-hover/bento:translate-x-2 transition duration-200">
                {icon}
                <div className="font-sans font-bold text-primary mb-2 mt-2">
                    {title}
                </div>
                <div className="font-sans font-normal text-primary/70 text-xs">
                    {description}
                </div>
            </div>
        </div>
    );
};
