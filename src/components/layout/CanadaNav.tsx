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

type Item = { to: string; label: string; primary?: boolean };
type Group = { title: string; items: Item[] };

const primaryTo = "/canada/meu-caminho?country=canada";

const discoverDefs = [
  { to: primaryTo, key: "myPath", primary: true },
  { to: "/canada/programas", key: "programs" },
  { to: "/canada/instituicoes", key: "institutions" },
  { to: "/canada/pgwp", key: "pgwp" },
] as const;

const planDefs = [
  { to: "/canada/custos", key: "costs" },
  { to: "/canada/study-permit", key: "studyPermit" },
] as const;

const prepareDefs = [
  { to: "/canada/verificacao", key: "verify" },
  { to: "/canada/alugar", key: "renting" },
  { to: "/canada/golpes-de-aluguel", key: "rentalScams" },
] as const;

const liveDefs = [
  { to: "/canada/saude", key: "health" },
  { to: "/canada/familia", key: "family" },
  { to: "/canada/trabalho-moradia", key: "work" },
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

  const pathOf = (to: string) => to.split("?")[0];
  const allItems: Item[] = groups
    ? groups.flatMap((g) => g.items)
    : items ?? [];
  const isActive = allItems.some((it) => activePath === pathOf(it.to));

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
                       activePath === pathOf(it.to) && "text-foreground font-medium",
                       it.primary && "text-[hsl(var(--crimson))] font-semibold focus:text-[hsl(var(--crimson))]",
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
                  activePath === pathOf(it.to) && "text-foreground font-medium",
                  it.primary && "text-[hsl(var(--crimson))] font-semibold focus:text-[hsl(var(--crimson))]",
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

  const toItems = (
    defs: readonly { to: string; key: string; primary?: boolean }[],
  ): Item[] =>
    defs.map((d) => ({
      to: d.to,
      label: t(`canadaNav.items.${d.key}`),
      primary: d.primary,
    }));
  const discover = toItems(discoverDefs);
  const plan = toItems(planDefs);
  const prepare = toItems(prepareDefs);
  const live = toItems(liveDefs);

  const refundsPath = (t("refunds.path") as string) || "/refunds";
  plan.push({ to: refundsPath, label: t("canadaNav.items.refunds") });

  return (
    <div className="border-b border-border bg-background sticky top-16 z-40">
      <div className="container flex items-center gap-6 py-3">
        <div className="flex items-center gap-2 shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground/80">
          <span className="hidden sm:inline">{t("countries.canadaMenuLabel")}</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7 flex-1">
          <HoverDropdown label={t("canadaNav.discover")} items={discover} activePath={pathname} />
          <HoverDropdown label={t("canadaNav.planPhase")} items={plan} activePath={pathname} />
          <HoverDropdown label={t("canadaNav.preparePhase")} items={prepare} activePath={pathname} />
          <HoverDropdown label={t("canadaNav.live")} items={live} activePath={pathname} />

          <NavLink
            to="/canada/ensino-medio"
            className={({ isActive }) =>
              cn(
                "shrink-0 inline-flex items-center gap-1.5 px-1 py-1.5 text-sm font-medium transition-colors text-navy hover:text-[hsl(var(--crimson))]",
                isActive && "text-[hsl(var(--crimson))]",
              )
            }
          >
            {t("canadaNav.highSchoolsFeatured")}
            <span className="inline-flex items-center rounded-full bg-[hsl(var(--crimson))]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[hsl(var(--crimson))]">
              {t("canadaNav.forParents")}
            </span>
          </NavLink>

          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("edpath:open-assistant"))
            }
            className="shrink-0 ml-auto text-sm text-muted-foreground hover:text-[hsl(var(--azul))] transition-colors"
          >
            {t("canadaNav.askEdpath")}
          </button>
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
                  to="/canada/ensino-medio"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "block px-2 py-3 text-sm rounded-md text-navy font-semibold hover:text-[hsl(var(--crimson))] hover:bg-muted",
                      isActive && "text-[hsl(var(--crimson))]",
                    )
                  }
                >
                  {t("canadaNav.highSchoolsFeatured")}
                  <span className="ml-2 inline-flex items-center rounded-full bg-[hsl(var(--crimson))]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[hsl(var(--crimson))]">
                    {t("canadaNav.forParents")}
                  </span>
                </NavLink>

                <Accordion type="multiple" className="w-full">
                  {[
                    { value: "discover", label: t("canadaNav.discover"), items: discover },
                    { value: "plan", label: t("canadaNav.planPhase"), items: plan },
                    { value: "prepare", label: t("canadaNav.preparePhase"), items: prepare },
                    { value: "live", label: t("canadaNav.live"), items: live },
                  ].map((section) => (
                    <AccordionItem key={section.value} value={section.value}>
                      <AccordionTrigger className="text-sm font-medium">
                        {section.label}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="flex flex-col">
                          {section.items.map((it) => (
                            <li key={it.to}>
                              <NavLink
                                to={it.to}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                  cn(
                                    "block px-2 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-muted",
                                    isActive && "bg-muted text-foreground font-medium",
                                    it.primary && "text-[hsl(var(--crimson))] font-semibold",
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
                  ))}
                </Accordion>

                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    window.dispatchEvent(new CustomEvent("edpath:open-assistant"));
                  }}
                  className="mt-4 block w-full px-2 py-3 text-left text-base font-medium border-t border-border text-foreground hover:text-[hsl(var(--azul))] transition-colors"
                >
                  {t("canadaNav.askEdpath")}
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}