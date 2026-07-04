import { cn } from "@/lib/utils";

const BRAND_BLUE = "#3C7BE0";
const BRAND_RED = "#E0405B";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-sans text-lg md:text-xl font-semibold tracking-tight whitespace-nowrap",
        className,
      )}
    >
      <span style={{ color: BRAND_BLUE }}>Ed</span>
      <span style={{ color: BRAND_RED }}>Path</span>
      <span className="text-white font-medium"> Global</span>
    </span>
  );
}

