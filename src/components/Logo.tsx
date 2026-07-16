import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn(
        "flex flex-col leading-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#396CD8]/50 rounded-sm",
        className
      )}
      aria-label="EdPath Global"
    >
      <span className="font-display text-lg md:text-xl tracking-tight">
        <span className="text-white">Ed</span>
        <span className="text-[#E0405B]">Path</span>
      </span>
      <span
        className="font-sans text-[10px] md:text-xs font-light tracking-[0.16em] uppercase"
        style={{ color: "#396CD8" }}
      >
        Global
      </span>
    </Link>
  );
}

