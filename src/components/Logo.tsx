import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn(
        "flex items-center gap-2.5 leading-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#396CD8]/50 rounded-sm",
        className
      )}
      aria-label="EdPath Global"
    >
      <svg
        viewBox="0 0 48 44"
        fill="none"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-8 md:h-[34px] w-auto shrink-0"
      >
        <g stroke="hsl(var(--navy))">
          <circle cx="24" cy="12" r="9.5" />
          <ellipse cx="24" cy="12" rx="4" ry="9.5" />
          <line x1="14.5" y1="12" x2="33.5" y2="12" />
          <line x1="16.5" y1="6.5" x2="31.5" y2="6.5" />
          <line x1="16.5" y1="17.5" x2="31.5" y2="17.5" />
        </g>
        <g stroke="hsl(var(--crimson))">
          <path d="M24 29c-4.5-3-10.5-3-15-1.6v9.2c4.5-1.4 10.5-1.4 15 1.6 4.5-3 10.5-3 15-1.6v-9.2c-4.5-1.4-10.5-1.4-15 1.6z" />
          <line x1="24" y1="29" x2="24" y2="38.2" />
        </g>
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display font-bold text-2xl md:text-[26px] tracking-tight leading-none">
          <span className="text-[hsl(var(--navy))]">Ed</span>
          <span className="text-[hsl(var(--crimson))]">Path</span>
        </span>
        <span className="font-sans text-[11px] md:text-xs font-medium tracking-[0.18em] uppercase text-[#55608a] mt-1.5">
          Global Student Navigator
        </span>
      </span>
    </Link>
  );
}
