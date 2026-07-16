import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import { Link } from "react-router-dom";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn(
        "flex items-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#396CD8]/50 rounded-sm",
        className
      )}
      aria-label="EdPath Global"
    >
      <Globe
        className="h-6 w-6 md:h-7 md:w-7 shrink-0"
        style={{ color: "#396CD8" }}
        strokeWidth={1.5}
      />
      <div className="flex flex-col leading-none">
        <span className="font-sans text-lg md:text-xl font-bold tracking-tight">
          <span className="text-white">Ed</span>
          <span className="text-[#E0405B]">Path</span>
        </span>
        <span
          className="font-sans text-[10px] md:text-xs font-medium tracking-[0.12em] uppercase"
          style={{ color: "#396CD8" }}
        >
          Global
        </span>
      </div>
    </Link>
  );
}

