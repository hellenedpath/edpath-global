import { cn } from "@/lib/utils";

const BRAND_BLUE = "#3C7BE0";
const BRAND_RED = "#E0405B";

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      {/* Globe */}
      <circle cx="20" cy="21" r="14" stroke={BRAND_BLUE} strokeWidth="2" fill="none" />
      <ellipse cx="20" cy="21" rx="6" ry="14" stroke={BRAND_BLUE} strokeWidth="1.5" fill="none" />
      <line x1="6" y1="21" x2="34" y2="21" stroke={BRAND_BLUE} strokeWidth="1.5" />
      <path
        d="M9 14.5C12.5 17.5 27.5 17.5 31 14.5"
        stroke={BRAND_BLUE}
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M9 27.5C12.5 24.5 27.5 24.5 31 27.5"
        stroke={BRAND_BLUE}
        strokeWidth="1.5"
        fill="none"
      />

      {/* Graduation cap */}
      <path
        d="M20 4L30 9L20 14L10 9L20 4Z"
        fill={BRAND_RED}
      />
      <path
        d="M10 9V15.5C10 15.5 14 18 20 18C26 18 30 15.5 30 15.5V9"
        stroke={BRAND_RED}
        strokeWidth="1.5"
        fill="none"
      />
      <line x1="30" y1="9" x2="34" y2="6" stroke={BRAND_RED} strokeWidth="1.5" />
      <circle cx="34" cy="5" r="1.5" fill={BRAND_RED} />
      <line x1="20" y1="14" x2="20" y2="17" stroke={BRAND_RED} strokeWidth="1.5" />
    </svg>
  );
}

export function Logo({ className, iconClassName }: { className?: string; iconClassName?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoIcon className={cn("h-8 w-8 md:h-9 md:w-9", iconClassName)} />
      <span className="font-sans text-lg md:text-xl font-semibold tracking-tight whitespace-nowrap">
        <span style={{ color: BRAND_BLUE }}>Ed</span>
        <span style={{ color: BRAND_RED }}>Path</span>
        <span className="text-white font-medium"> Global</span>
      </span>
    </div>
  );
}
