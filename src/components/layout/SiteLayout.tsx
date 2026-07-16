import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CanadaNav } from "./CanadaNav";

export default function SiteLayout() {
  const location = useLocation();
  const canadaPaths = [
    "/canada",
    "/programas",
    "/instituicoes",
    "/antes-de-comecar",
    "/custos",
    "/custos-reais",
    "/saude",
    "/familia",
    "/trabalho-moradia",
    "/diagnostico",
    "/simulador-financeiro",
  ];
  const isCanadaContext = canadaPaths.some((p) => location.pathname === p || location.pathname.startsWith(p + "/"));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      {isCanadaContext && <CanadaNav />}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
