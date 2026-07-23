import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";

const destinations = [
  { code: "canada", to: "/canada", active: true },
  { code: "usa", to: null, active: false },
  { code: "uk", to: null, active: false },
  { code: "ireland", to: null, active: false },
  { code: "australia", to: null, active: false },
] as const;

const langs = [
  { code: "pt", active: true },
  { code: "en", active: true },
  { code: "es", active: false },
  { code: "fr", active: false },
] as const;

export function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const destCloseTimer = useRef<number | null>(null);

  useEffect(() => {
    if (location.pathname === "/" && location.hash === "#destinos") {
      const el = document.getElementById("destinos");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 text-primary-foreground border-b border-white/10",
        scrolled
          ? "bg-navy/95 backdrop-blur-md shadow-[0_4px_24px_-8px_rgba(0,0,0,0.35)]"
          : "bg-navy",
      )}
    >
      <div className="container flex items-center justify-between h-16 gap-6">
        <Logo />

        <nav className="hidden lg:flex items-center gap-1">
          <div
            className="relative"
            onMouseEnter={() => {
              if (destCloseTimer.current) window.clearTimeout(destCloseTimer.current);
              setDestOpen(true);
            }}
            onMouseLeave={() => {
              destCloseTimer.current = window.setTimeout(() => setDestOpen(false), 120);
            }}
          >
            <button
              type="button"
              onClick={() => setDestOpen((v) => !v)}
              className={cn(
                "nav-link-underline inline-flex items-center gap-1.5 px-4 py-2.5 text-[15px] font-medium rounded-md transition-colors",
                "text-white/90 hover:text-white hover:bg-white/10",
              )}
            >
              {t("nav.destinations")}
              <ChevronDown className={cn("w-3.5 h-3.5 opacity-70 transition-transform", destOpen && "rotate-180")} />
            </button>
            {destOpen && (
              <div className="absolute left-0 top-full mt-2 w-60 rounded-lg border border-white/10 bg-navy text-primary-foreground shadow-xl shadow-black/20 overflow-hidden py-1 z-50">
                {destinations.map((d) =>
                  d.active && d.to ? (
                    <Link
                      key={d.code}
                      to={d.to}
                      onClick={() => setDestOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 text-sm hover:bg-white/10 transition-colors"
                    >
                      <span className="font-medium">{t(`home.globeDestinations.${d.code}.label`)}</span>
                    </Link>
                  ) : (
                    <div
                      key={d.code}
                      className="flex items-center justify-between px-3 py-2.5 text-sm text-white/60"
                    >
                      <span>{t(`home.globeDestinations.${d.code}.label`)}</span>
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-white/10 text-white/80">
                        {t("countries.soon")}
                      </span>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
          <NavLink
            to="/sobre"
            className={({ isActive }) =>
              cn(
                "nav-link-underline px-4 py-2.5 text-[15px] font-medium rounded-md transition-colors",
                "text-white/90 hover:text-white hover:bg-white/10",
                isActive && "bg-white/10 text-white",
              )
            }
          >
            {t("nav.about")}
          </NavLink>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-all text-white/60 hover:text-white hover:bg-white/10"
              aria-label={t("langs.label")}
            >
              <Globe className="w-4 h-4" />
              <span>{i18n.language.toUpperCase().slice(0, 2)}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 rounded-lg border border-white/10 bg-navy text-primary-foreground shadow-xl shadow-black/20 overflow-hidden py-1">
                {langs.map((l) =>
                  l.active ? (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        i18n.changeLanguage(l.code);
                        setLangOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 text-sm text-left transition-colors",
                        i18n.language === l.code
                          ? "bg-azul/15 text-white font-medium"
                          : "hover:bg-white/10 text-white/90",
                      )}
                    >
                      <span>{t(`langs.${l.code}`)}</span>
                      {i18n.language === l.code && <Check className="w-4 h-4 text-crimson" />}
                    </button>
                  ) : (
                    <div
                      key={l.code}
                      className="flex items-center justify-between px-3 py-2.5 text-sm text-white/60"
                    >
                      <span>{t(`langs.${l.code}`)}</span>
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-white/10 text-white/80">
                        {t("langs.soon")}
                      </span>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>

          <Link
            to="/canada/meu-caminho?country=canada"
            className="hidden md:inline-flex items-center justify-center rounded-full bg-crimson px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-crimson/90 hover:shadow-md hover:-translate-y-0.5 hover:scale-105 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson/50"
          >
            {t("nav.discoverMyPath")}
          </Link>

          <button
            className="lg:hidden p-2 rounded-md text-white/90 hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden border-t border-white/10 bg-navy">
          <div className="container flex flex-col py-3">
            <Link
              to="/canada/meu-caminho?country=canada"
              onClick={() => setMobileOpen(false)}
              className="mb-2 px-4 py-3 text-sm font-semibold rounded-full bg-crimson text-white inline-flex items-center justify-center gap-2 shadow-sm hover:bg-crimson/90 transition-colors"
            >
              {t("nav.discoverMyPath")}
            </Link>
            <div className="px-3 pt-3 pb-1 text-xs uppercase tracking-wider text-white/60">
              {t("nav.destinations")}
            </div>
            {destinations.map((d) =>
              d.active && d.to ? (
                <NavLink
                  key={d.code}
                  to={d.to}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 text-sm rounded-md hover:bg-white/10 text-white/90"
                >
                  {t(`home.globeDestinations.${d.code}.label`)}
                </NavLink>
              ) : (
                <div
                  key={d.code}
                  className="flex items-center justify-between px-3 py-2.5 text-sm text-white/60"
                >
                  <span>{t(`home.globeDestinations.${d.code}.label`)}</span>
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-white/10">
                    {t("countries.soon")}
                  </span>
                </div>
              ),
            )}
            <NavLink
              to="/sobre"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  "nav-link-underline px-3 py-3 text-sm rounded-md hover:bg-white/10 mt-2 text-white/90",
                  isActive && "bg-white/10 text-white",
                )
              }
            >
              {t("nav.about")}
            </NavLink>
          </div>
        </nav>
      )}
    </header>
  );
}
