import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CanadaNav } from "./CanadaNav";

export default function SiteLayout() {
  const location = useLocation();
  const { t } = useTranslation();
  const isHome = location.pathname === "/";
  const canadaPaths = [
    "/canada",
    "/programas",
    "/antes-de-comecar",
    "/custos",
    "/saude",
    "/familia",
    "/trabalho-moradia",
  ];
  const isCanadaContext = canadaPaths.some((p) => location.pathname === p || location.pathname.startsWith(p + "/"));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      {isCanadaContext && <CanadaNav />}
      {!isHome && !isCanadaContext && (
        <div className="border-b border-border bg-muted/30">
          <div className="container py-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="text-base leading-none">🇨🇦</span>
            <span>
              {t("countries.currentLabel")}{" "}
              <span className="font-medium text-foreground">{t("countries.list.canada")}</span>
            </span>
          </div>
        </div>
      )}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}