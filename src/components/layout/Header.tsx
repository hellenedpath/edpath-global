import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Check, ChevronDown, Compass, Globe, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";

const navItems = [
  { key: "about", to: "/sobre", type: "link" as const },
  { key: "destinations", to: "/#destinos", type: "anchor" as const },
];

const langs = [
  { code: "pt", active: true },
  { code: "en", active: true },
  { code: "es", active: false },
  { code: "fr", active: false },
] as const;

export function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const showMyPath = location.pathname.startsWith("/canada");

  useEffect(() => {
    if (location.pathname === "/" && location.hash === "#destinos") {
      const el = document.getElementById("destinos");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location]);

  const goToDestinations = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    if (location.pathname === "/") {
      document.getElementById("destinos")?.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", "/#destinos");
    } else {
      navigate("/#destinos");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-navy text-primary-foreground border-b border-white/10">
      <div className="container flex items-center justify-between h-16 gap-6">
        <Link to="/" aria-label="EdPath Global">
          <Logo />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) =>
            item.type === "anchor" ? (
              <a
                key={item.key}
                href={item.to}
                onClick={goToDestinations}
                className="px-3 py-2.5 text-sm rounded-md transition-colors hover:bg-white/10 text-primary-foreground/90"
              >
                {t(`nav.${item.key}`)}
              </a>
            ) : (
              <NavLink
                key={item.key}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2.5 text-sm rounded-md transition-colors hover:bg-white/10 text-primary-foreground/90",
                    isActive && "bg-white/10 text-primary-foreground",
                  )
                }
              >
                {t(`nav.${item.key}`)}
              </NavLink>
            ),
          )}
        </nav>



        <div className="flex items-center gap-2">
          {showMyPath && (
            <Link
              to="/canada"
              className="hidden md:inline-flex items-center gap-1.5 rounded-md bg-crimson px-3.5 py-2 text-sm font-semibold text-white hover:bg-crimson/90 transition-colors"
            >
              <Compass className="w-4 h-4" />
              {t("nav.myPath")}
            </Link>
          )}
          <div className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 text-primary-foreground transition-all"
              aria-label={t("langs.label")}
            >
              <Globe className="w-4 h-4" />
              <span className="font-medium">
                {i18n.language.toUpperCase().slice(0, 2)}
              </span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 rounded-lg border border-white/10 bg-navy text-primary-foreground shadow-xl shadow-black/20 overflow-hidden py-1">
                {langs.map((l) => (
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
                          ? "bg-purple/15 text-white font-medium"
                          : "hover:bg-white/10 text-primary-foreground/90",
                      )}
                    >
                      <span>{t(`langs.${l.code}`)}</span>
                      {i18n.language === l.code && (
                        <Check className="w-4 h-4 text-crimson" />
                      )}
                    </button>
                  ) : (
                    <div
                      key={l.code}
                      className="flex items-center justify-between px-3 py-2.5 text-sm text-primary-foreground/60"
                    >
                      <span>{t(`langs.${l.code}`)}</span>
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-white/10 text-primary-foreground/80">
                        {t("langs.soon")}
                      </span>
                    </div>
                  )
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
            {showMyPath && (
              <NavLink
                to="/canada"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-3 text-sm rounded-md bg-crimson hover:bg-crimson/90 text-white font-semibold inline-flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                {t("nav.myPath")}
              </NavLink>
            )}
            {navItems.map((item) =>
              item.type === "anchor" ? (
                <a
                  key={item.key}
                  href={item.to}
                  onClick={goToDestinations}
                  className="px-3 py-3 text-sm rounded-md hover:bg-white/10"
                >
                  {t(`nav.${item.key}`)}
                </a>
              ) : (
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
              ),
            )}
          </div>
        </nav>
      )}
    </header>
  );
}