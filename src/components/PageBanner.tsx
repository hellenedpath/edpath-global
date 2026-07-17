import type { CSSProperties } from "react";

type Props = {
  image: string;
  alt: string;
  objectPosition?: string;
  className?: string;
};

/**
 * Slim, luminous top banner for internal pages.
 * Real photo with a subtle navy gradient at the bottom to blend into the page.
 */
export function PageBanner({ image, alt, objectPosition = "center 50%", className = "" }: Props) {
  const style: CSSProperties = { objectPosition };
  return (
    <div className={`relative w-full h-40 md:h-56 lg:h-64 overflow-hidden ${className}`}>
      <img
        src={image}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        style={style}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(228 55% 12% / 0.25) 0%, transparent 30%, transparent 65%, hsl(var(--background)) 100%)",
        }}
      />
    </div>
  );
}