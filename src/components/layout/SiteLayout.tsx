import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CanadaNav } from "./CanadaNav";
import EdPathAssistant from "@/components/assistant/EdPathAssistant";

export default function SiteLayout() {
  const location = useLocation();
  const isCanadaContext =
    location.pathname === "/canada" || location.pathname.startsWith("/canada/");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    let rafId = 0;
    const raf = (t: number) => {
      lenis.raf(t);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      {isCanadaContext && <CanadaNav />}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <EdPathAssistant />
    </div>
  );
}
