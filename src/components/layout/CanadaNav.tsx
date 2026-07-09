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

const tools: Item[] = [
  { to: "/canada/pgwp", label: "Verificador PGWP" },
  { to: "/canada/instituicoes", label: "Instituições" },
  { to: "/programas", label: "Explorar Programas" },
  { to: "/custos", label: "Simulador de Custos" },
];

const journey: Item[] = [
  { to: "/antes-de-comecar", label: "Antes de Começar" },
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
              "shrink-0 inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--azul))]",
              isActive && "bg-muted text-foreground font-medium",
            )}
          >
            {label}
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                open && "rotate-180",
              )}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={6}
          className="min-w-56"
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
                "cursor-pointer",
                activePath === it.to && "bg-muted font-medium text-foreground",
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
      <div className="container flex items-center gap-3 py-2">
        <div className="flex items-center gap-1.5 shrink-0 pr-3 mr-1 border-r border-border text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span className="text-base leading-none">🇨🇦</span>
          <span>{t("countries.canadaMenuLabel")}</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2 flex-1">
          <NavLink
            to={primary.to}
            className={cn(
              "shrink-0 inline-flex items-center px-3.5 py-1.5 text-sm rounded-md font-medium transition-colors border",
              primaryActive
                ? "bg-[hsl(var(--crimson))] text-white border-transparent hover:bg-[hsl(var(--crimson))]/90"
                : "bg-[hsl(var(--azul))] text-white border-transparent hover:bg-[hsl(var(--azul))]/90",
            )}
          >
            {primary.label}
          </NavLink>

          <HoverDropdown label="Ferramentas" items={tools} activePath={pathname} />
          <HoverDropdown label="Sua Jornada" items={journey} activePath={pathname} />
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
                    "block w-full text-center px-4 py-2.5 rounded-md font-medium transition-colors",
                    primaryActive
                      ? "bg-[hsl(var(--crimson))] text-white"
                      : "bg-[hsl(var(--azul))] text-white hover:bg-[hsl(var(--azul))]/90",
                  )}
                >
                  {primary.label}
                </NavLink>

                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="tools">
                    <AccordionTrigger className="text-sm font-medium">
                      Ferramentas
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="flex flex-col">
                        {tools.map((it) => (
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
                  <AccordionItem value="journey">
                    <AccordionTrigger className="text-sm font-medium">
                      Sua Jornada
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="flex flex-col">
                        {journey.map((it) => (
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