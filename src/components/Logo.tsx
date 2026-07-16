import { cn } from "@/lib/utils";
import logoAsset from "@/assets/edpath-logo.png.asset.json";

export function Logo({ className }: { className?: string }) {
  return (
    <img
      src={logoAsset.url}
      alt="EdPath Global"
      className={cn("h-10 md:h-12 w-auto object-contain select-none", className)}
      draggable={false}
    />
  );
}

