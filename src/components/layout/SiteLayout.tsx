import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CanadaNav } from "./CanadaNav";

export default function SiteLayout() {
  const location = useLocation();
  const isCanadaContext =
    location.pathname === "/canada" || location.pathname.startsWith("/canada/");

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
