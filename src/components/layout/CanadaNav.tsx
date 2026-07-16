import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
type Group = { title: string; items: Item[] };

const primaryTo = "/meu-caminho";

const beforeYouGoGroupDefs = [
  {
    key: "startHere",
    items: [{ to: "/meu-caminho", key: "myPath" }],
  },
  {
    key: "chooseSchool",
    items: [
      { to: "/canada/pgwp", key: "pgwp" },
      { to: "/canada/instituicoes", key: "institutions" },
      { to: "/programas", key: "programs" },
      { to: "/canada/ensino-medio", key: "highSchools" },
    ],
  },
  {
    key: "planCosts",
    items: [
      { to: "/simulador-financeiro", key: "costsSimulator" },
      { to: "/custos", key: "costs" },
    ],
  },
  {
    key: "prepareMove",
    items: [
      { to: "/alugar-no-canada", key: "renting" },
      { to: "/golpes-de-aluguel", key: "rentalScams" },
    ],
  },
] as const;

const onArrivalDefs = [
  { to: "/custos", key: "costs" },
  { to: "/saude", key: "health" },
  { to: "/familia", key: "family" },
  { to: "/trabalho-moradia", key: "work" },
] as const;

function HoverDropdown({
  label,
  items,
  groups,
  activePath,
}: {
  label: string;
  items?: Item[];
  groups?: Group[];
  activePath: string;
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const closeTimer = useRef<number | null>(null);

  const allItems: Item[] = groups
    ? groups.flatMap((g) => g.items)
    : items ?? [];
  const isActive = allItems.some((it) => activePath === it.to);

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
          {groups
            ? groups.map((g, gi) => (
                <div key={g.title}>
                  {gi > 0 && <DropdownMenuSeparator className="my-1" />}
                  <DropdownMenuLabel className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                    {g.title}
                  </DropdownMenuLabel>
                  {g.items.map((it) => (
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
                </div>
              ))
            : (items ?? []).map((it) => (
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

  const primary: Item = { to: primaryTo, label: t("nav.myPath") };
  const primaryActive = pathname === primary.to;
  const beforeYouGoGroups: Group[] = beforeYouGoGroupDefs.map((g) => ({
    title: t(`canadaNav.groups.${g.key}`),
    items: g.items.map((it) => ({
      to: it.to,
      label: t(`canadaNav.items.${it.key}`),
    })),
  }));
  const onArrival: Item[] = onArrivalDefs.map((d) => ({
    to: d.to,
    label: t(`canadaNav.items.${d.key}`),
  }));

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

          <HoverDropdown label={t("canadaNav.beforeYouGo")} groups={beforeYouGoGroups} activePath={pathname} />
          <HoverDropdown label={t("canadaNav.onArrival")} items={onArrival} activePath={pathname} />
        </nav>

        {/* Mobile trigger */}
        <div className="ml-auto md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label={t("canadaNav.openMenu")}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-border text-foreground hover:bg-muted"
              >
                <Menu className="h-4 w-4" />
                {t("canadaNav.menu")}
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>{t("canadaNav.canadaMenu")}</SheetTitle>
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
                      {t("canadaNav.beforeYouGo")}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-4">
                        {beforeYouGoGroups.map((g) => (
                          <div key={g.title}>
                            <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                              {g.title}
                            </div>
                            <ul className="flex flex-col">
                              {g.items.map((it) => (
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
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="arrival">
                    <AccordionTrigger className="text-sm font-medium">
                      {t("canadaNav.onArrival")}
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