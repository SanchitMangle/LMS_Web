import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export const BackgroundGradient = ({
    className,
}: {
    className?: string;
}) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updateMousePosition = (ev: MouseEvent) => {
            setMousePosition({ x: ev.clientX, y: ev.clientY });
        };
        window.addEventListener("mousemove", updateMousePosition);
        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
        };
    }, []);

    return (
        <div
            className={cn(
                "fixed inset-0 -z-50 h-full w-full bg-background transition-all duration-300",
                className
            )}
        >
            <div
                className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-background to-secondary/5 opacity-50 blur-[100px] animate-pulse"
            />
            <div
                className="absolute h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] transition-transform duration-1000 ease-out will-change-transform"
                style={{
                    transform: `translate(${mousePosition.x / 10}px, ${mousePosition.y / 10}px)`,
                }}
            />
            <div
                className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[120px] transition-transform duration-1000 ease-out will-change-transform"
                style={{
                    transform: `translate(-${mousePosition.x / 15}px, -${mousePosition.y / 15}px)`,
                }}
            />
        </div>
    );
};
