import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import edpathLogo from "@/assets/edpath-logo-full.png.asset.json";

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
        src={edpathLogo.url}
        alt="EdPath Global"
        className="h-10 md:h-12 w-auto shrink-0 object-contain"
      />
    </Link>
  );
}
