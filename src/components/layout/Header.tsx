import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Globe, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "about", to: "/sobre" },
  { key: "programs", to: "/programas" },
  { key: "before", to: "/antes-de-comecar" },
  { key: "costs", to: "/custos" },
  { key: "family", to: "/familia" },
  { key: "work", to: "/trabalho-moradia" },
] as const;

const langs = [
  { code: "pt", active: true },
  { code: "en", active: false },
  { code: "es", active: false },
  { code: "fr", active: false },
] as const;

export function Header() {
  const { t } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy text-primary-foreground border-b border-white/10">
      <div className="container flex items-center justify-between h-18 gap-6">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
          <span className="inline-block w-2 h-2 rounded-full bg-crimson" />
          EdPath Global
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 text-sm rounded-md transition-colors hover:bg-white/10 text-primary-foreground/90",
                  isActive && "bg-white/10 text-primary-foreground",
                )
              }
            >
              {t(`nav.${item.key}`)}
            </NavLink>
          ))}
        </nav>


        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-colors"
              aria-label={t("langs.label")}
            >
              <Globe className="w-4 h-4" />
              PT
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 min-w-[180px] rounded-md border border-border bg-popover text-popover-foreground shadow-lg overflow-hidden">
                {langs.map((l) => (
                  <div
                    key={l.code}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 text-sm",
                      l.active ? "bg-muted font-medium" : "text-muted-foreground",
                    )}
                  >
                    <span>{t(`langs.${l.code}`)}</span>
                    {!l.active && (
                      <span className="text-xs uppercase tracking-wide text-muted-foreground/80">
                        {t("langs.soon")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            className="lg:hidden p-2 rounded-md hover:bg-white/10"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden border-t border-white/10 bg-navy">
          <div className="container flex flex-col py-2">
            {navItems.map((item) => (
              <NavLink
                key={item.key}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-3 text-sm rounded-md hover:bg-white/10",
                    isActive && "bg-white/10",
                  )
                }
              >
                {t(`nav.${item.key}`)}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}