import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import edpathIcon from "@/assets/edpath-icon.png.asset.json";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn(
        "flex items-center gap-2.5 leading-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--azul)/0.5)] rounded-sm",
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
      <span className="font-display font-bold text-2xl md:text-[26px] tracking-tight leading-none">
        <span className="text-[hsl(var(--crimson))]">Ed</span>
        <span className="text-[hsl(var(--azul))]">Path</span>
      </span>
    </Link>
  );
}
