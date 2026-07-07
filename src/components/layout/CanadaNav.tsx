import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const items = [
  { key: "path", to: "/canada/meu-caminho", label: "Meu Caminho" },
  { key: "programs", to: "/programas" },
  { key: "pgwp", to: "/canada/pgwp", label: "Verificador PGWP" },
  { key: "before", to: "/antes-de-comecar" },
  { key: "costs", to: "/custos" },
  { key: "health", to: "/saude" },
  { key: "family", to: "/familia" },
  { key: "work", to: "/trabalho-moradia" },
];

export function CanadaNav() {
  const { t } = useTranslation();
  return (
    <div className="border-b border-border bg-background sticky top-16 z-40">
      <div className="container flex items-center gap-3 py-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0 pr-3 mr-1 border-r border-border text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span className="text-base leading-none">🇨🇦</span>
          <span>{t("countries.canadaMenuLabel")}</span>
        </div>
        <nav className="flex items-center gap-1">
          {items.map((it) => (
            <NavLink
              key={it.key}
              to={it.to}
              className={({ isActive }) =>
                cn(
                  "shrink-0 px-3 py-1.5 text-sm rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted",
                  isActive && "bg-muted text-foreground font-medium",
                )
              }
            >
              {it.label ?? t(`nav.${it.key}`)}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}