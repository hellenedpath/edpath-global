import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Item = { to: string; label: string };

const primary: Item = { to: "/meu-caminho", label: "Meu Caminho" };

const beforeYouGo: Item[] = [
  { to: "/canada/pgwp", label: "Verificador PGWP" },
  { to: "/canada/instituicoes", label: "Instituições" },
  { to: "/programas", label: "Explorar Programas" },
  { to: "/custos", label: "Simulador de Custos" },
  { to: "/antes-de-comecar", label: "Antes de Começar" },
];

const onArrival: Item[] = [
  { to: "/custos", label: "Custos" },
  { to: "/saude", label: "Saúde" },
  { to: "/familia", label: "Família" },
  { to: "/trabalho-moradia", label: "Trabalho e Moradia" },
];

function HoverDropdown({
  label,
  items,
  activePath,
}: {
  label: string;
  items: Item[];
  activePath: string;
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const closeTimer = useRef<number | null>(null);

  const isActive = items.some((it) => activePath === it.to);

  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => () => cancelClose(), []);

  return (
    <div
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "shrink-0 inline-flex items-center gap-1 px-1 py-1.5 text-sm transition-colors text-muted-foreground hover:text-[hsl(var(--azul))] focus:outline-none focus-visible:text-[hsl(var(--azul))]",
              (isActive || open) && "text-foreground",
            )}
          >
            {label}
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 opacity-60 transition-transform duration-200",
                open && "rotate-180 opacity-100",
              )}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={10}
          className="min-w-60 rounded-xl border-border/60 bg-background/95 backdrop-blur-md p-2 shadow-[0_20px_60px_-20px_hsl(var(--navy)/0.25)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          {items.map((it) => (
            <DropdownMenuItem
              key={it.to}
              onSelect={(e) => {
                e.preventDefault();
                setOpen(false);
                navigate(it.to);
              }}
              className={cn(
                "cursor-pointer rounded-lg px-3 py-2.5 text-sm text-muted-foreground focus:bg-muted/60 focus:text-foreground transition-colors",
                activePath === it.to && "text-foreground font-medium",
              )}
            >
              {it.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function CanadaNav() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const primaryActive = pathname === primary.to;

  return (
    <div className="border-b border-border bg-background sticky top-16 z-40">
      <div className="container flex items-center gap-6 py-3">
        <div className="flex items-center gap-1.5 shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground/80">
          <span className="text-sm leading-none">🇨🇦</span>
          <span className="hidden sm:inline">{t("countries.canadaMenuLabel")}</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7 flex-1">
          <NavLink
            to={primary.to}
            className={cn(
              "group relative shrink-0 text-sm font-semibold transition-colors",
              primaryActive
                ? "text-[hsl(var(--crimson))]"
                : "text-foreground hover:text-[hsl(var(--azul))]",
            )}
          >
            {primary.label}
            <span
              className={cn(
                "pointer-events-none absolute -bottom-1 left-0 h-[2px] rounded-full bg-[hsl(var(--crimson))] transition-all duration-300",
                primaryActive ? "w-full" : "w-4 group-hover:w-full group-hover:bg-[hsl(var(--azul))]",
              )}
            />
          </NavLink>

          <HoverDropdown label="Antes de ir" items={beforeYouGo} activePath={pathname} />
          <HoverDropdown label="Ao chegar" items={onArrival} activePath={pathname} />
        </nav>

        {/* Mobile trigger */}
        <div className="ml-auto md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Abrir menu"
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-border text-foreground hover:bg-muted"
              >
                <Menu className="h-4 w-4" />
                Menu
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Menu do Canadá</SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                <NavLink
                  to={primary.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block w-full px-2 py-3 text-base font-semibold border-b border-border transition-colors",
                    primaryActive
                      ? "text-[hsl(var(--crimson))]"
                      : "text-foreground hover:text-[hsl(var(--azul))]",
                  )}
                >
                  {primary.label}
                </NavLink>

                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="before">
                    <AccordionTrigger className="text-sm font-medium">
                      Antes de ir
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="flex flex-col">
                        {beforeYouGo.map((it) => (
                          <li key={it.to}>
                            <NavLink
                              to={it.to}
                              onClick={() => setMobileOpen(false)}
                              className={({ isActive }) =>
                                cn(
                                  "block px-2 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-muted",
                                  isActive && "bg-muted text-foreground font-medium",
                                )
                              }
                            >
                              {it.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="arrival">
                    <AccordionTrigger className="text-sm font-medium">
                      Ao chegar
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="flex flex-col">
                        {onArrival.map((it) => (
                          <li key={it.to}>
                            <NavLink
                              to={it.to}
                              onClick={() => setMobileOpen(false)}
                              className={({ isActive }) =>
                                cn(
                                  "block px-2 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-muted",
                                  isActive && "bg-muted text-foreground font-medium",
                                )
                              }
                            >
                              {it.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}