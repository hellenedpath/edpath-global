import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  Menu,
  Compass,
  GraduationCap,
  Calculator,
  ClipboardCheck,
  Home,
  MessageCircle,
  BookOpen,
  Building2,
  Briefcase,
  School,
  Languages,
  Coins,
  ShieldCheck,
  KeyRound,
  HeartPulse,
  Users,
  type LucideIcon,
} from "lucide-react";
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

type Badge = { label: string; tone: "crimson" | "gold" };
type Item = {
  to: string;
  label: string;
  primary?: boolean;
  icon?: LucideIcon;
  badge?: Badge;
};
type Group = { title: string; items: Item[] };

const primaryTo = "/canada/meu-caminho?country=canada";

const planDefs = [
  { to: "/canada/custos", key: "costs", icon: Coins },
  { to: "/canada/study-permit", key: "studyPermit", icon: KeyRound },
] as const;

const prepareDefs = [
  { to: "/canada/verificacao", key: "verify", icon: ShieldCheck },
  { to: "/canada/alugar", key: "renting", icon: Home },
] as const;

const liveDefs = [
  { to: "/canada/saude", key: "health", icon: HeartPulse },
  { to: "/canada/familia", key: "family", icon: Users },
  { to: "/canada/trabalho-moradia", key: "work", icon: Briefcase },
] as const;

function BadgePill({ badge }: { badge: Badge }) {
  const tone =
    badge.tone === "gold"
      ? "bg-[hsl(var(--amber))]/15 text-[hsl(var(--amber))]"
      : "bg-[hsl(var(--crimson))]/10 text-[hsl(var(--crimson))]";
  return (
    <span
      className={cn(
        "ml-auto inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
        tone,
      )}
    >
      {badge.label}
    </span>
  );
}

function DropdownItemRow({
  item,
  active,
  onSelect,
}: {
  item: Item;
  active: boolean;
  onSelect: () => void;
}) {
  const Icon = item.icon;
  return (
    <DropdownMenuItem
      onSelect={(e) => {
        e.preventDefault();
        onSelect();
      }}
      className={cn(
        "group cursor-pointer rounded-lg px-3 py-2.5 text-sm text-navy/80 transition-colors",
        "focus:bg-[hsl(var(--azul))]/10 focus:text-[hsl(var(--azul))]",
        active && "bg-[hsl(var(--azul))]/10 text-[hsl(var(--crimson))] font-semibold",
        item.primary && "text-[hsl(var(--crimson))] font-semibold focus:text-[hsl(var(--crimson))]",
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            "h-4 w-4 mr-2 shrink-0 text-[hsl(var(--azul))]/70 transition-colors group-hover:text-[hsl(var(--azul))]",
            active && "text-[hsl(var(--crimson))]",
          )}
        />
      )}
      <span className="truncate">{item.label}</span>
      {item.badge && <BadgePill badge={item.badge} />}
    </DropdownMenuItem>
  );
}

function HoverDropdown({
  label,
  icon: Icon,
  items,
  groups,
  activePath,
}: {
  label: string;
  icon?: LucideIcon;
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
              "relative shrink-0 inline-flex items-center gap-1.5 px-2 py-1.5 text-sm font-medium transition-colors text-navy/80 hover:text-[hsl(var(--azul))] focus:outline-none focus-visible:text-[hsl(var(--azul))]",
              "after:absolute after:left-2 after:right-2 after:-bottom-0.5 after:h-[2px] after:rounded-full after:bg-[hsl(var(--crimson))] after:origin-left after:scale-x-0 after:transition-transform after:duration-300",
              (isActive || open) && "text-[hsl(var(--crimson))] after:scale-x-100",
            )}
          >
            {Icon && <Icon className="h-4 w-4 opacity-80" />}
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
          className="min-w-64 rounded-xl border-border/60 bg-background/95 backdrop-blur-md p-2 shadow-[0_20px_60px_-20px_hsl(var(--navy)/0.25)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          {groups
            ? groups.map((g, gi) => (
                <div key={g.title}>
                  {gi > 0 && <DropdownMenuSeparator className="my-1" />}
                  <DropdownMenuLabel className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--azul))]/80">
                    {g.title}
                  </DropdownMenuLabel>
                  {g.items.map((it) => (
                    <DropdownItemRow
                      key={it.to}
                      item={it}
                      active={activePath === pathOf(it.to)}
                      onSelect={() => {
                        setOpen(false);
                        navigate(it.to);
                      }}
                    />
                  ))}
                </div>
              ))
            : (items ?? []).map((it) => (
                <DropdownItemRow
                  key={it.to}
                  item={it}
                  active={activePath === pathOf(it.to)}
                  onSelect={() => {
                    setOpen(false);
                    navigate(it.to);
                  }}
                />
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
    defs: readonly {
      to: string;
      key: string;
      primary?: boolean;
      icon?: LucideIcon;
    }[],
  ): Item[] =>
    defs.map((d) => ({
      to: d.to,
      label: t(`canadaNav.items.${d.key}`),
      primary: d.primary,
      icon: d.icon,
    }));
  const plan = toItems(planDefs);
  const prepare = toItems(prepareDefs);
  const live = toItems(liveDefs);

  const studyGroups: Group[] = [
    {
      title: t("canadaNav.studyGroups.university"),
      items: [
        { to: "/canada/programas", label: t("canadaNav.items.programs"), icon: BookOpen },
        { to: "/canada/instituicoes", label: t("canadaNav.items.institutions"), icon: Building2 },
        { to: "/canada/pgwp", label: t("canadaNav.items.pgwp"), icon: Briefcase },
      ],
    },
    {
      title: t("canadaNav.studyGroups.other"),
      items: [
        {
          to: "/canada/ensino-medio",
          label: t("canadaNav.items.highSchools"),
          icon: School,
          badge: { label: t("canadaNav.forParents"), tone: "crimson" },
        },
        {
          to: "/canada/escolas-de-ingles",
          label: t("canadaNav.items.englishSchools"),
          icon: Languages,
          badge: { label: t("canadaNav.newBadge"), tone: "gold" },
        },
      ],
    },
  ];

  const flatStudy: Item[] = studyGroups.flatMap((g) => g.items);

  return (
    <div className="sticky top-16 z-40 border-b border-[hsl(var(--azul))]/20 bg-gradient-to-r from-background via-[hsl(var(--azul))]/[0.04] to-[hsl(var(--navy))]/[0.05] backdrop-blur-md">
      <div className="container flex items-center gap-5 py-3">
        <div className="flex items-center gap-2 shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-navy/70">
          <span className="hidden sm:inline">{t("canadaNav.canadaMenu")}</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5 flex-1">
          <NavLink
            to={primaryTo}
            className={({ isActive }) =>
              cn(
                "shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold text-white bg-[hsl(var(--crimson))] shadow-[0_6px_18px_-6px_hsl(var(--crimson)/0.6)] hover:shadow-[0_10px_24px_-6px_hsl(var(--crimson)/0.75)] hover:-translate-y-0.5 transition-all duration-200",
                isActive && "ring-2 ring-[hsl(var(--crimson))]/40 ring-offset-2 ring-offset-background",
              )
            }
          >
            <Compass className="h-4 w-4" />
            {t("canadaNav.items.myPath")}
          </NavLink>

          <HoverDropdown label={t("canadaNav.study")} icon={GraduationCap} groups={studyGroups} activePath={pathname} />
          <HoverDropdown label={t("canadaNav.planPhase")} icon={Calculator} items={plan} activePath={pathname} />
          <HoverDropdown label={t("canadaNav.preparePhase")} icon={ClipboardCheck} items={prepare} activePath={pathname} />
          <HoverDropdown label={t("canadaNav.live")} icon={Home} items={live} activePath={pathname} />

          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("edpath:open-assistant"))
            }
            className="shrink-0 ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--azul))] hover:text-[hsl(var(--navy))] transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
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
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-[hsl(var(--azul))]/30 text-navy hover:bg-[hsl(var(--azul))]/10"
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
                  to={primaryTo}
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[hsl(var(--crimson))] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_6px_18px_-6px_hsl(var(--crimson)/0.6)]"
                >
                  <Compass className="h-4 w-4" />
                  {t("canadaNav.items.myPath")}
                </NavLink>

                <Accordion type="multiple" className="w-full">
                  {[
                    { value: "study", label: t("canadaNav.study"), icon: GraduationCap, items: flatStudy },
                    { value: "plan", label: t("canadaNav.planPhase"), icon: Calculator, items: plan },
                    { value: "prepare", label: t("canadaNav.preparePhase"), icon: ClipboardCheck, items: prepare },
                    { value: "live", label: t("canadaNav.live"), icon: Home, items: live },
                  ].map((section) => {
                    const SIcon = section.icon;
                    return (
                      <AccordionItem key={section.value} value={section.value}>
                        <AccordionTrigger className="text-sm font-medium">
                          <span className="inline-flex items-center gap-2">
                            <SIcon className="h-4 w-4 text-[hsl(var(--azul))]" />
                            {section.label}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="flex flex-col">
                            {section.items.map((it) => {
                              const ItIcon = it.icon;
                              return (
                                <li key={it.to}>
                                  <NavLink
                                    to={it.to}
                                    onClick={() => setMobileOpen(false)}
                                    className={({ isActive }) =>
                                      cn(
                                        "flex items-center gap-2 px-2 py-2 text-sm rounded-md text-navy/80 hover:text-[hsl(var(--azul))] hover:bg-[hsl(var(--azul))]/10 transition-colors",
                                        isActive && "bg-[hsl(var(--crimson))]/10 text-[hsl(var(--crimson))] font-semibold",
                                        it.primary && "text-[hsl(var(--crimson))] font-semibold",
                                      )
                                    }
                                  >
                                    {ItIcon && <ItIcon className="h-4 w-4 opacity-80" />}
                                    <span className="truncate">{it.label}</span>
                                    {it.badge && <BadgePill badge={it.badge} />}
                                  </NavLink>
                                </li>
                              );
                            })}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>

                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    window.dispatchEvent(new CustomEvent("edpath:open-assistant"));
                  }}
                  className="mt-4 inline-flex items-center gap-2 w-full px-2 py-3 text-left text-base font-medium border-t border-border text-[hsl(var(--azul))] hover:text-[hsl(var(--navy))] transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
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