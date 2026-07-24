import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import edpathIcon from "@/assets/edpath-icon.png.asset.json";

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
      <img
        src={edpathIcon.url}
        alt=""
        aria-hidden="true"
        className="h-9 md:h-11 w-auto shrink-0 object-contain"
      />
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
