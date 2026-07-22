import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  BadgeCheck,
  Briefcase,
  Building2,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  MapPin,
  Search,
  ShieldCheck,
  TrendingUp,
  Info,
  Shield,
  ShieldOff,
  Clock,
  Users,
  Languages,
  MessageCircle,
  ArrowRight,
  DollarSign,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import SourceBadge from "@/components/SourceBadge";
import VerificationNote from "@/components/VerificationNote";
import CostDisclosure from "@/components/CostDisclosure";

type Program = {
  id: string;
  name: string;
  credential: string | null;
  field_area: string | null;
  campus_city: string | null;
  min_grade: string | null;
  prerequisites: string | null;
  english_admission_tests: Record<string, unknown> | null;
  duration_months: number | null;
  tuition_intl_year: string | null;
  has_coop: boolean;
  pgwp_eligible: string | null;
  pgwp_basis: string | null;
  application_url: string | null;
  intl_office_url: string | null;
  book_meeting_url: string | null;
  source_id: string | null;
  cip_code: string | null;
  sources: {
    id: string;
    url: string | null;
    valid_as_of: string | null;
  } | null;
  occupation_ids: string[] | null;
  institution_id: string;
  institutions: {
    id: string;
    name: string;
    display_name: string | null;
    city: string | null;
    province: string | null;
  } | null;
};

type Occupation = {
  id: string;
  noc_code: string | null;
  title: string | null;
  salary_low: string | null;
  salary_median: string | null;
  salary_high: string | null;
  outlook: string | null;
};

const AREA_LABELS: Record<string, { en: string; pt: string }> = {
  health: { en: "Health", pt: "Saúde" },
  it: { en: "IT / Advanced technology", pt: "TI / Tecnologia avançada" },
  trades: { en: "Trades", pt: "Trades / Ofícios técnicos" },
  business: { en: "Business", pt: "Business" },
  other: { en: "Community & Services", pt: "Comunidade & Serviços" },
};

function areaKey(raw: string | null | undefined): string | null {
  if (!raw) return null;
  return raw.toLowerCase().trim();
}

function normalize(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function inferArea(p: Program): string | null {
  if (p.field_area) {
    const f = p.field_area.toLowerCase();
    if (f.includes("health")) return "health";
    if (f.includes("trade")) return "trades";
    if (f.includes("it") || f.includes("tech") || f.includes("comput") || f.includes("cyber"))
      return "it";
  }
  const name = (p.name || "").toLowerCase();
  if (/nurs|health|dental|paramedic|radiation|medic|pharma|therap/.test(name)) return "health";
  if (/comput|program|cyber|network|software|data|it |game|web/.test(name)) return "it";
  if (/electric|hvac|heating|plumb|mechan|construc|weld|carpent|technician|automot|refriger/.test(name))
    return "trades";
  return null;
}

function outlookMeta(outlook: string | null, lang: string) {
  const o = (outlook || "").toLowerCase();
  if (o.includes("good") || o.includes("very good")) {
    return {
      label: lang === "pt" ? "Perspectiva boa" : "Good outlook",
      className: "bg-emerald-100 text-emerald-800",
    };
  }
  if (o.includes("moderate") || o.includes("fair")) {
    return {
      label: lang === "pt" ? "Perspectiva moderada" : "Moderate outlook",
      className: "bg-amber-100 text-amber-900",
    };
  }
  if (o.includes("limited") || o.includes("undetermined")) {
    return {
      label: lang === "pt" ? "Perspectiva limitada" : "Limited outlook",
      className: "bg-rose-100 text-rose-800",
    };
  }
  return null;
}

function formatEnglishTests(tests: Record<string, unknown> | null): string[] {
  if (!tests || typeof tests !== "object") return [];
  return Object.entries(tests).map(([k, v]) => {
    if (v && typeof v === "object") {
      const obj = v as Record<string, unknown>;
      const parts = Object.entries(obj)
        .map(([kk, vv]) => `${kk}: ${vv}`)
        .join(", ");
      return `${k.toUpperCase()} — ${parts}`;
    }
    return `${k.toUpperCase()}: ${String(v)}`;
  });
}

// ---------- Tuition display ----------
// Values in `tuition_intl_year` may be: numeric-only strings (e.g. "15000",
// "$15,000", "15000.00"), longer text (estimated ranges in PT/EN), or null.
function parseNumericTuition(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const cleaned = raw.trim();
  // If it contains any alphabetic letters, treat as text (estimate/range).
  if (/[A-Za-zÀ-ÿ]/.test(cleaned)) return null;
  const digits = cleaned.replace(/[^\d.,-]/g, "").replace(/,/g, "");
  const n = parseFloat(digits);
  return isFinite(n) && n > 0 ? n : null;
}

function formatTuitionNumber(n: number, lang: "pt" | "en"): string {
  try {
    return new Intl.NumberFormat(lang === "pt" ? "pt-BR" : "en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `CAD $${Math.round(n).toLocaleString()}`;
  }
}

// ---------- Eligibility screening ----------
type EnglishTestKey = "IELTS_Academic" | "TOEFL_iBT" | "Duolingo" | "PTE" | "CAEL";

const ENGLISH_TEST_OPTIONS: {
  key: EnglishTestKey | "none";
  labelPt: string;
  labelEn: string;
}[] = [
  { key: "IELTS_Academic", labelPt: "IELTS Academic", labelEn: "IELTS Academic" },
  { key: "TOEFL_iBT", labelPt: "TOEFL iBT", labelEn: "TOEFL iBT" },
  { key: "Duolingo", labelPt: "Duolingo English Test", labelEn: "Duolingo English Test" },
  { key: "PTE", labelPt: "PTE Academic", labelEn: "PTE Academic" },
  { key: "CAEL", labelPt: "CAEL", labelEn: "CAEL" },
  { key: "none", labelPt: "Ainda não fiz", labelEn: "Not taken yet" },
];

const CLOSE_THRESHOLDS: Record<EnglishTestKey, number> = {
  IELTS_Academic: 0.5,
  TOEFL_iBT: 6,
  Duolingo: 10,
  PTE: 5,
  CAEL: 10,
};

type Profile = {
  test: EnglishTestKey | "none" | "";
  score: string;
  hsDone: "yes" | "no" | "";
  postSec: "yes" | "no" | "";
};

function isProfileActive(p: Profile) {
  return p.test !== "" || p.hsDone !== "" || p.postSec !== "";
}

function parseRequiredOverall(raw: unknown): number | null {
  if (typeof raw !== "string") return null;
  const m = raw.match(/(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  return isFinite(n) ? n : null;
}

type Eligibility =
  | { status: "green"; reason: string }
  | { status: "yellow"; reason: string; gap: number; testLabel: string }
  | { status: "gray"; reason: string }
  | { status: "neutral"; reason: string }
  | null;

function computeEligibility(
  p: Program,
  profile: Profile,
  lang: "pt" | "en"
): Eligibility {
  if (!isProfileActive(profile)) return null;
  const T = (pt: string, en: string) => (lang === "pt" ? pt : en);

  const isGradCert = p.credential === "Ontario College Graduate Certificate";

  // Formation gating first
  if (isGradCert) {
    if (profile.postSec !== "yes") {
      return {
        status: "gray",
        reason: T("Requer formação prévia (pós-secundário)", "Requires prior post-secondary credential"),
      };
    }
  } else {
    if (profile.hsDone === "no") {
      return {
        status: "gray",
        reason: T("Requer ensino médio concluído", "Requires completed secondary school"),
      };
    }
    if (profile.hsDone === "") {
      // No answer yet on HS — treat as neutral, keep evaluating english
    }
  }

  // English
  if (profile.test === "" || profile.test === "none") {
    return {
      status: "green",
      reason: T("Você atende (inglês a verificar)", "You may qualify (English to verify)"),
    };
  }

  const scoreNum = parseFloat(profile.score);
  if (!isFinite(scoreNum)) {
    return {
      status: "neutral",
      reason: T("Informe seu score para avaliar", "Enter your score to evaluate"),
    };
  }

  const tests = p.english_admission_tests as Record<string, unknown> | null;
  const raw = tests ? tests[profile.test] : undefined;
  const required = parseRequiredOverall(raw);

  if (raw == null) {
    return {
      status: "neutral",
      reason: T("Verifique outros testes aceitos", "Check other accepted tests"),
    };
  }
  if (required == null) {
    return {
      status: "neutral",
      reason: T("Verifique na fonte oficial", "Check the official source"),
    };
  }

  if (scoreNum >= required) {
    return {
      status: "green",
      reason: T("Você atende aos requisitos de admissão", "You may qualify for admission"),
    };
  }

  const gap = required - scoreNum;
  const threshold = CLOSE_THRESHOLDS[profile.test];
  const testLabel =
    ENGLISH_TEST_OPTIONS.find((o) => o.key === profile.test)?.[lang === "pt" ? "labelPt" : "labelEn"] ??
    profile.test;
  if (gap <= threshold) {
    return {
      status: "yellow",
      reason: T(
        `Faltam ${gap.toFixed(1)} pontos no ${testLabel}`,
        `${gap.toFixed(1)} points short on ${testLabel}`
      ),
      gap,
      testLabel,
    };
  }

  return {
    status: "gray",
    reason: T("Score de inglês abaixo do exigido", "English score below requirement"),
  };
}

function EligibilityBadge({ e }: { e: Eligibility }) {
  if (!e) return null;
  const cls =
    e.status === "green"
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : e.status === "yellow"
      ? "bg-amber-100 text-amber-900 border-amber-200"
      : e.status === "gray"
      ? "bg-slate-100 text-slate-700 border-slate-200"
      : "bg-sky-50 text-sky-800 border-sky-200";
  const dot =
    e.status === "green"
      ? "bg-emerald-500"
      : e.status === "yellow"
      ? "bg-amber-500"
      : e.status === "gray"
      ? "bg-slate-400"
      : "bg-sky-500";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${cls}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {e.reason}
    </span>
  );
}

// PGWP visual state — never green unless data explicitly says "yes".
function PgwpBadge({
  status,
  labels,
}: {
  status: string | null;
  labels: { eligible: string; notEligible: string; unconfirmed: string };
}) {
  const v = (status ?? "").toLowerCase();
  if (v === "yes") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
        <ShieldCheck className="h-3 w-3" strokeWidth={1.5} />
        {labels.eligible}
      </span>
    );
  }
  if (v === "no") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[hsl(var(--crimson))]/25 bg-[hsl(var(--crimson))]/10 px-2 py-0.5 text-[11px] font-medium text-[hsl(var(--crimson))]">
        <ShieldOff className="h-3 w-3" strokeWidth={1.5} />
        {labels.notEligible}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      <Shield className="h-3 w-3" strokeWidth={1.5} />
      {labels.unconfirmed}
    </span>
  );
}

export default function Programs() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith("pt") ? "pt" : "en";
  const T = (pt: string, en: string) => (lang === "pt" ? pt : en);

  const [query, setQuery] = useState("");
  const [area, setArea] = useState<string>("all");
  const [credential, setCredential] = useState<string>("all");
  const [province, setProvince] = useState<string>("all");
  const [onlyPgwp, setOnlyPgwp] = useState(false);
  const [onlyCoop, setOnlyCoop] = useState(false);
  const [selected, setSelected] = useState<Program | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const cipParam = searchParams.get("cip");

  // Profile (front-only, not persisted)
  const [profile, setProfile] = useState<Profile>({
    test: "",
    score: "",
    hsDone: "",
    postSec: "",
  });
  const [eligFilter, setEligFilter] = useState<"all" | "green" | "yellow">("all");
  const [gradesMet, setGradesMet] = useState<Record<string, boolean>>({});
  const profileActive = isProfileActive(profile);

  const { data: programs, isLoading, error } = useQuery({
    queryKey: ["programs-full"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select(
          "id, name, credential, field_area, campus_city, min_grade, prerequisites, english_admission_tests, duration_months, tuition_intl_year, has_coop, pgwp_eligible, pgwp_basis, application_url, intl_office_url, book_meeting_url, source_id, cip_code, sources!source_id(id, url, valid_as_of), occupation_ids, institution_id, institutions(id, name, display_name, city, province)"
        )
        .order("name", { ascending: true });
      if (error) throw error;
      return data as unknown as Program[];
    },
  });

  const { data: cipInfo } = useQuery({
    queryKey: ["cip_lookup", cipParam],
    enabled: !!cipParam,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cip_codes")
        .select("code, title")
        .eq("code", cipParam as string)
        .maybeSingle();
      if (error) throw error;
      return data as { code: string; title: string } | null;
    },
  });

  const clearCipFilter = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("cip");
    setSearchParams(next, { replace: true });
  };

  const { data: occupations } = useQuery({
    queryKey: ["occupations-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("occupations")
        .select("id, noc_code, title, salary_low, salary_median, salary_high, outlook");
      if (error) throw error;
      return data as Occupation[];
    },
  });

  const occById = useMemo(() => {
    const m = new Map<string, Occupation>();
    (occupations ?? []).forEach((o) => m.set(o.id, o));
    return m;
  }, [occupations]);

  const areaOptions = useMemo(() => {
    const set = new Set<string>();
    (programs ?? []).forEach((p) => {
      const k = areaKey(p.field_area);
      if (k) set.add(k);
    });
    const known = ["health", "it", "trades", "business", "other"];
    return Array.from(set).sort(
      (a, b) => (known.indexOf(a) === -1 ? 99 : known.indexOf(a)) - (known.indexOf(b) === -1 ? 99 : known.indexOf(b))
    );
  }, [programs]);

  const showPgwpToggle = useMemo(
    () => (programs ?? []).some((p) => p.pgwp_eligible !== "yes"),
    [programs]
  );

  const provinceOptions = useMemo(() => {
    const set = new Set<string>();
    (programs ?? []).forEach((p) => {
      const prov = p.institutions?.province;
      if (prov) set.add(prov);
    });
    return Array.from(set).sort();
  }, [programs]);

  const showCoopToggle = useMemo(
    () => (programs ?? []).some((p) => p.has_coop),
    [programs]
  );

  const credentials = useMemo(() => {
    const set = new Set<string>();
    (programs ?? []).forEach((p) => p.credential && set.add(p.credential));
    return Array.from(set).sort();
  }, [programs]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return (programs ?? []).filter((p) => {
      if (cipParam && p.cip_code !== cipParam) return false;
      if (onlyPgwp && p.pgwp_eligible !== "yes") return false;
      if (onlyCoop && !p.has_coop) return false;
      if (province !== "all" && p.institutions?.province !== province) return false;
      if (credential !== "all" && p.credential !== credential) return false;
      if (area !== "all") {
        const k = areaKey(p.field_area) ?? inferArea(p);
        if (k !== area) return false;
      }
      if (profileActive && eligFilter !== "all") {
        const e = computeEligibility(p, profile, lang as "pt" | "en");
        if (eligFilter === "green" && e?.status !== "green") return false;
        if (eligFilter === "yellow" && e?.status !== "yellow") return false;
      }
      if (!q) return true;
      const hay = `${p.name} ${p.institutions?.name ?? ""} ${p.institutions?.display_name ?? ""} ${p.campus_city ?? ""}`;
      return normalize(hay).includes(q);
    });
  }, [programs, query, area, credential, province, onlyPgwp, onlyCoop, profile, profileActive, eligFilter, lang, cipParam]);

  const isComplete = (p: Program) => !!p.tuition_intl_year;

  const salaryRange = (p: Program) => {
    const ids = p.occupation_ids ?? [];
    for (const id of ids) {
      const o = occById.get(id);
      if (o && (o.salary_low || o.salary_high || o.salary_median)) return o;
    }
    return null;
  };

  const selectedOccupations: Occupation[] = useMemo(() => {
    if (!selected) return [];
    return (selected.occupation_ids ?? [])
      .map((id) => occById.get(id))
      .filter((x): x is Occupation => !!x);
  }, [selected, occById]);

  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-[1320px] px-6 py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/70 mb-4">
              <span>{T("Programas", "Programs")}</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
              {T("Encontre o programa certo para seu caminho", "Find the program that fits your path")}
            </h1>
            <p className="mt-5 text-lg text-white/80 leading-relaxed max-w-2xl">
              {T(
                "Programas verificados em fontes oficiais das instituições, com informações de admissão, custos e mercado de trabalho.",
                "Programs verified against official institution sources, with admission, cost and labour-market information."
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-6 py-10 md:py-14">
        {/* Honest coverage notice */}
        {!isLoading && !error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-navy/15 bg-navy/[0.03] p-5">
            <ShieldCheck
              className="h-5 w-5 mt-0.5 shrink-0 text-navy"
              strokeWidth={1.5}
            />
            <div className="text-sm leading-relaxed text-navy/90">
              <p className="font-display font-semibold text-navy">
                {t("programsPage.coverage.title")}
              </p>
              <p className="mt-1 text-muted-foreground">
                {t("programsPage.coverage.body")}
              </p>
              <p className="mt-2 text-xs font-medium uppercase tracking-wider text-navy/80">
                {t("programsPage.coverage.count", {
                  count: programs?.length ?? 0,
                })}
              </p>
            </div>
          </div>
        )}

        {/* Eligibility profile panel */}
        <div className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-sm mb-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-navy">
                {T("Verifique sua elegibilidade", "Check your eligibility")}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {T(
                  "Preencha seu perfil e veja em quais programas você se encaixa. Grátis, nada salvo.",
                  "Fill in your profile and see which programs fit. Free, nothing stored."
                )}
              </p>
            </div>
            {profileActive && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  setProfile({ test: "", score: "", hsDone: "", postSec: "" })
                }
              >
                {T("Limpar", "Clear")}
              </Button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                {T("Teste de inglês", "English test")}
              </label>
              <select
                value={profile.test}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, test: e.target.value as Profile["test"] }))
                }
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">{T("Selecione…", "Select…")}</option>
                {ENGLISH_TEST_OPTIONS.map((o) => (
                  <option key={o.key} value={o.key}>
                    {lang === "pt" ? o.labelPt : o.labelEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                {T("Score (overall)", "Score (overall)")}
              </label>
              <Input
                type="number"
                step="0.1"
                inputMode="decimal"
                value={profile.score}
                onChange={(e) => setProfile((p) => ({ ...p, score: e.target.value }))}
                disabled={profile.test === "" || profile.test === "none"}
                placeholder={T("Ex: 6.5", "e.g. 6.5")}
                className="h-10"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                {T("Ensino médio concluído?", "Secondary school completed?")}
              </label>
              <div className="flex gap-2">
                {(["yes", "no"] as const).map((v) => (
                  <Button
                    key={v}
                    size="sm"
                    variant={profile.hsDone === v ? "default" : "outline"}
                    onClick={() => setProfile((p) => ({ ...p, hsDone: v }))}
                    className="flex-1"
                  >
                    {v === "yes" ? T("Sim", "Yes") : T("Não", "No")}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                {T("Já tem diploma pós-secundário?", "Already have a post-secondary diploma?")}
              </label>
              <div className="flex gap-2">
                {(["yes", "no"] as const).map((v) => (
                  <Button
                    key={v}
                    size="sm"
                    variant={profile.postSec === v ? "default" : "outline"}
                    onClick={() => setProfile((p) => ({ ...p, postSec: v }))}
                    className="flex-1"
                  >
                    {v === "yes" ? T("Sim", "Yes") : T("Não", "No")}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {profileActive && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">
                {T("Elegibilidade", "Eligibility")}
              </span>
              {([
                ["all", T("Todos", "All")],
                ["green", T("Você atende", "You may qualify")],
                ["yellow", T("Quase lá", "Almost there")],
              ] as const).map(([v, label]) => (
                <Button
                  key={v}
                  size="sm"
                  variant={eligFilter === v ? "default" : "outline"}
                  onClick={() => setEligFilter(v)}
                >
                  {label}
                </Button>
              ))}
            </div>
          )}

          <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            {T(
              "Esta é uma orientação de elegibilidade acadêmica baseada em fontes oficiais. Não confirma admissão nem sua situação de imigração. A decisão final é sempre da instituição.",
              "This is an academic eligibility guide based on official sources. It does not confirm admission or your immigration status. Final decisions rest with the institution."
            )}
          </p>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={T("Buscar por nome, instituição ou cidade", "Search by name, institution or city")}
              className="pl-9 h-11"
            />
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {T("Área", "Field")}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={area === "all" ? "default" : "outline"}
                  onClick={() => setArea("all")}
                >
                  {T("Todas", "All")}
                </Button>
                {areaOptions.map((k) => {
                  const label = AREA_LABELS[k]?.[lang as "pt" | "en"] ?? k;
                  return (
                    <Button
                      key={k}
                      size="sm"
                      variant={area === k ? "default" : "outline"}
                      onClick={() => setArea(k)}
                    >
                      {label}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {T("Credencial", "Credential")}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={credential === "all" ? "default" : "outline"}
                  onClick={() => setCredential("all")}
                >
                  {T("Todas", "All")}
                </Button>
                {credentials.map((c) => (
                  <Button
                    key={c}
                    size="sm"
                    variant={credential === c ? "default" : "outline"}
                    onClick={() => setCredential(c)}
                    className="max-w-[220px] truncate"
                  >
                    {c}
                  </Button>
                ))}
              </div>
            </div>

            {showPgwpToggle && (
              <label className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 cursor-pointer">
                <Switch checked={onlyPgwp} onCheckedChange={setOnlyPgwp} />
                <span className="text-sm font-medium">
                  {T("Só elegíveis a PGWP", "PGWP-eligible only")}
                </span>
              </label>
            )}
          </div>

          {(provinceOptions.length > 0 || showCoopToggle) && (
            <div className="mt-5 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
              {provinceOptions.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    {t("programsPage.filters.provinceLabel")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={province === "all" ? "default" : "outline"}
                      onClick={() => setProvince("all")}
                    >
                      {t("programsPage.filters.allProvinces")}
                    </Button>
                    {provinceOptions.map((prov) => (
                      <Button
                        key={prov}
                        size="sm"
                        variant={province === prov ? "default" : "outline"}
                        onClick={() => setProvince(prov)}
                      >
                        {prov}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              {showCoopToggle && (
                <label className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 cursor-pointer">
                  <Switch checked={onlyCoop} onCheckedChange={setOnlyCoop} />
                  <span className="text-sm font-medium">
                    {t("programsPage.filters.coopOnly")}
                  </span>
                </label>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mt-6">
          {isLoading && (
            <p className="text-muted-foreground text-sm py-10 text-center">
              {T("Carregando programas…", "Loading programs…")}
            </p>
          )}
          {error && (
            <p className="text-crimson text-sm py-10 text-center">
              {T("Não foi possível carregar os programas.", "Could not load programs.")}
            </p>
          )}

          {!isLoading && !error && (
            <>
              {cipParam && (
                <div className="mb-4 flex items-start gap-3 rounded-xl border border-navy/20 bg-navy/[0.04] p-4">
                  <BadgeCheck className="h-5 w-5 mt-0.5 shrink-0 text-navy" strokeWidth={1.5} />
                  <div className="flex-1 min-w-0 text-sm text-navy">
                    <p className="font-medium">
                      {T("Mostrando programas com o código CIP", "Showing programs with CIP code")}{" "}
                      <span className="font-mono">{cipParam}</span>
                      {cipInfo?.title ? <> — {cipInfo.title}</> : null}
                    </p>
                    <Link
                      to="/canada/pgwp"
                      className="mt-1 inline-flex items-center gap-1 text-xs text-navy/80 hover:text-[hsl(var(--crimson))] underline-offset-4 hover:underline"
                    >
                      {T("Voltar ao verificador PGWP", "Back to PGWP checker")}
                      <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={clearCipFilter}
                    aria-label={T("Limpar filtro CIP", "Clear CIP filter")}
                    className="shrink-0 rounded-md p-1 text-navy/70 hover:text-navy hover:bg-navy/5 transition-colors"
                  >
                    <X className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
              )}
              <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                <span>
                  {T(
                    `${filtered.length} de ${programs?.length ?? 0} programas`,
                    `${filtered.length} of ${programs?.length ?? 0} programs`
                  )}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((p) => {
                  const inst = p.institutions;
                  const elig = computeEligibility(p, profile, lang as "pt" | "en");
                  const stop = (e: React.MouseEvent) => e.stopPropagation();
                  const englishLines = formatEnglishTests(p.english_admission_tests);
                  const pgwpLabels = {
                    eligible: t("programsPage.card.pgwp.eligible"),
                    notEligible: t("programsPage.card.pgwp.notEligible"),
                    unconfirmed: t("programsPage.card.pgwp.unconfirmed"),
                  };
                  const locationParts = [p.campus_city, inst?.province].filter(Boolean);
                  return (
                    <article
                      key={p.id}
                      className="group rounded-2xl border border-border bg-card p-5 flex flex-col gap-3 transition-all hover:border-crimson hover:shadow-md"
                    >
                      {elig && (
                        <div>
                          <EligibilityBadge e={elig} />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelected(p)}
                        className="text-left flex items-start justify-between gap-3 cursor-pointer"
                      >
                        <div className="min-w-0">
                          <h3 className="font-display font-semibold text-navy leading-snug line-clamp-2">
                            {p.name}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">
                              {inst?.display_name || inst?.name || "—"}
                            </span>
                          </p>
                        </div>
                        <PgwpBadge status={p.pgwp_eligible} labels={pgwpLabels} />
                      </button>

                      <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
                        {locationParts.length > 0 && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" strokeWidth={1.5} />
                            {locationParts.join(", ")}
                          </span>
                        )}
                        {p.credential && (
                          <span className="inline-flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" strokeWidth={1.5} />
                            {p.credential}
                          </span>
                        )}
                        {p.duration_months != null && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" strokeWidth={1.5} />
                            {t(
                              p.duration_months === 1
                                ? "programsPage.card.durationMonth"
                                : "programsPage.card.durationMonths",
                              { count: p.duration_months },
                            )}
                          </span>
                        )}
                        {p.has_coop && (
                          <span className="inline-flex items-center gap-1">
                            <Users className="h-3 w-3" strokeWidth={1.5} />
                            {t("programsPage.card.coop")}
                          </span>
                        )}
                      </div>

                      {(p.tuition_intl_year || englishLines.length > 0) && (
                        <dl className="grid gap-1.5 text-xs">
                          {p.tuition_intl_year && (
                            <div className="flex items-start gap-1.5">
                              <DollarSign
                                className="h-3 w-3 mt-0.5 shrink-0 text-navy"
                                strokeWidth={1.5}
                              />
                              <dt className="text-muted-foreground">
                                {t("programsPage.card.tuitionLabel")}:
                              </dt>
                              {(() => {
                                const num = parseNumericTuition(p.tuition_intl_year);
                                if (num != null) {
                                  return (
                                    <dd className="font-medium text-navy">
                                      {formatTuitionNumber(num, lang as "pt" | "en")}
                                    </dd>
                                  );
                                }
                                return (
                                  <dd className="min-w-0 flex flex-wrap items-baseline gap-1.5 text-muted-foreground">
                                    <span className="uppercase tracking-wider text-[10px] font-semibold text-navy border border-navy/25 rounded px-1 py-px">
                                      {t("costDisclosure.officialTag")}
                                    </span>
                                    <span className="text-[11px] leading-snug">
                                      {p.tuition_intl_year}
                                    </span>
                                  </dd>
                                );
                              })()}
                            </div>
                          )}
                          {englishLines.length > 0 && (
                            <div className="flex items-start gap-1.5">
                              <Languages
                                className="h-3 w-3 mt-0.5 shrink-0 text-navy"
                                strokeWidth={1.5}
                              />
                              <dt className="text-muted-foreground">
                                {t("programsPage.card.englishLabel")}:
                              </dt>
                              <dd className="text-foreground line-clamp-2">
                                {englishLines.join(" · ")}
                              </dd>
                            </div>
                          )}
                        </dl>
                      )}

                      {/* Direct actions */}
                      {(p.application_url || p.intl_office_url || p.book_meeting_url) && (
                        <div className="flex flex-wrap gap-x-3 gap-y-1.5 pt-1 text-xs">
                          {p.application_url && (
                            <a
                              href={p.application_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={stop}
                              className="inline-flex items-center gap-1 font-medium text-[hsl(var(--crimson))] hover:underline"
                            >
                              {t("programsPage.card.applyDirect")}
                              <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
                            </a>
                          )}
                          {p.intl_office_url && (
                            <a
                              href={p.intl_office_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={stop}
                              className="inline-flex items-center gap-1 text-navy hover:underline"
                            >
                              {t("programsPage.card.intlOffice")}
                              <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
                            </a>
                          )}
                          {p.book_meeting_url && (
                            <a
                              href={p.book_meeting_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={stop}
                              className="inline-flex items-center gap-1 text-navy hover:underline"
                            >
                              {t("programsPage.card.bookMeeting")}
                              <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
                            </a>
                          )}
                        </div>
                      )}

                      {/* Verified source line */}
                      <div className="mt-auto pt-3 border-t border-border/60 text-[11px] text-muted-foreground">
                        <span onClick={stop} onMouseDown={stop}>
                          <SourceBadge
                            url={p.sources?.url}
                            validAsOf={p.sources?.valid_as_of}
                          />
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>

              {filtered.length === 0 && (
                <div className="mt-6 rounded-2xl border border-navy/15 bg-navy/[0.03] p-8 text-center">
                  <h3 className="font-display text-lg font-semibold text-navy">
                    {t("programsPage.empty.title")}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
                    {t("programsPage.empty.body")}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        window.dispatchEvent(
                          new CustomEvent("edpath:open-assistant"),
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-md bg-[hsl(var(--crimson))] px-4 py-2 text-sm font-medium text-white hover:bg-[hsl(var(--crimson))]/90 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                      {t("programsPage.empty.askAssistant")}
                    </button>
                    <Link
                      to="/canada/pgwp"
                      className="inline-flex items-center gap-1.5 text-sm text-navy hover:text-[hsl(var(--azul))] transition-colors underline-offset-4 hover:underline"
                    >
                      {t("programsPage.empty.pgwpCta")}
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </Link>
                  </div>
                </div>
              )}

              {/* Persistent PGWP checker link */}
              {filtered.length > 0 && (
                <div className="mt-8 text-center text-sm">
                  <Link
                    to="/canada/pgwp"
                    className="inline-flex items-center gap-1.5 text-navy hover:text-[hsl(var(--azul))] transition-colors underline-offset-4 hover:underline"
                  >
                    {t("programsPage.empty.pgwpCta")}
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </Link>
                </div>
              )}
            </>
          )}

          <div className="mt-12">
            <VerificationNote />
          </div>
        </div>
      </section>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <DialogTitle className="font-display text-2xl text-navy">
                      {selected.name}
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-base">
                      {selected.institutions?.display_name || selected.institutions?.name}
                      {selected.campus_city ? ` · ${selected.campus_city}` : ""}
                    </DialogDescription>
                  </div>
                  {selected.pgwp_eligible === "yes" && (
                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-0 gap-1">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      PGWP
                    </Badge>
                  )}
                </div>
              </DialogHeader>

              <div className="mt-4 space-y-6 text-sm">
                <div className="grid gap-3 sm:grid-cols-3">
                  {selected.credential && (
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {T("Credencial", "Credential")}
                      </p>
                      <p className="font-medium text-navy mt-0.5">{selected.credential}</p>
                    </div>
                  )}
                  {selected.duration_months && (
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {T("Duração", "Duration")}
                      </p>
                      <p className="font-medium text-navy mt-0.5">
                        {selected.duration_months} {T("meses", "months")}
                      </p>
                    </div>
                  )}
                  {selected.tuition_intl_year && (
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {T("Anuidade internacional", "International tuition / year")}
                      </p>
                      {(() => {
                        const tuitionNum = parseNumericTuition(selected.tuition_intl_year);
                        const isAlgonquin = selected.institutions?.name
                          ?.toLowerCase()
                          .includes("algonquin");
                        if (tuitionNum != null) {
                          return (
                            <p className="font-medium text-navy mt-0.5">
                              {formatTuitionNumber(tuitionNum, lang as "pt" | "en")}
                            </p>
                          );
                        }
                        return (
                          <div className="mt-1 space-y-1">
                            <span className="inline-block uppercase tracking-wider text-[10px] font-semibold text-navy border border-navy/25 rounded px-1.5 py-0.5">
                              {t("costDisclosure.officialTag")}
                            </span>
                            <p className="text-sm text-foreground leading-relaxed">
                              {selected.tuition_intl_year}
                            </p>
                            {isAlgonquin ? (
                              <a
                                href="https://www.algonquincollege.com/ro/pay/fee-estimator/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-medium text-navy underline hover:text-crimson"
                              >
                                {T("Ver estimador oficial de taxas", "See official fee estimator")}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            ) : selected.sources?.url && (
                              <a
                                href={`${selected.sources.url}#fees-expenses`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-medium text-navy underline hover:text-crimson"
                              >
                                {T("Ver tuition no site oficial", "See tuition on official site")}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        );
                      })()}
                      <p className="text-xs text-muted-foreground mt-1.5">
                        {T(
                          "Valores aproximados; custos extras (livros, seguro, taxas etc.) costumam adicionar US$500–US$1.000/ano.",
                          "Approximate values; extra costs (books, insurance, fees, etc.) typically add $500–$1,000/year."
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {(selected.min_grade || selected.prerequisites) && (
                  <div>
                    <h4 className="font-display font-semibold text-navy mb-2">
                      {T("Requisitos de admissão", "Admission requirements")}
                    </h4>
                    {selected.min_grade && (
                      <p className="mb-2 leading-relaxed">
                        <span className="font-medium">{T("Nota mínima: ", "Minimum grade: ")}</span>
                        {selected.min_grade}
                      </p>
                    )}
                    {selected.prerequisites && (
                      <p className="leading-relaxed text-muted-foreground">{selected.prerequisites}</p>
                    )}
                    {selected.min_grade && (
                      <label className="mt-3 flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                        <Checkbox
                          checked={!!gradesMet[selected.id]}
                          onCheckedChange={(v) =>
                            setGradesMet((g) => ({ ...g, [selected.id]: v === true }))
                          }
                        />
                        <span>
                          {T(
                            "Eu atendo a estes requisitos de notas",
                            "I meet these grade requirements"
                          )}
                        </span>
                      </label>
                    )}
                  </div>
                )}

                {selected.institutions?.name?.toLowerCase().includes("algonquin") && (
                  <div className="rounded-lg border border-border bg-card p-4">
                    <h4 className="font-display font-semibold text-navy mb-1">
                      {T("Requisitos de admissão por país", "Admission requirements by country")}
                    </h4>
                    <p className="text-muted-foreground mb-3 leading-relaxed">
                      {T(
                        "Veja o que o Algonquin exige do diploma do seu país de origem.",
                        "See what Algonquin requires for your home country's diploma."
                      )}
                    </p>
                    <a
                      href="https://www.algonquincollege.com/international/admissions-apply/#country"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-medium text-navy underline hover:text-crimson"
                    >
                      {T("Requisitos de admissão por país", "Admission requirements by country")}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}

                {formatEnglishTests(selected.english_admission_tests).length > 0 && (
                  <div>
                    <h4 className="font-display font-semibold text-navy mb-2">
                      {T("Testes de inglês aceitos", "Accepted English tests")}
                    </h4>
                    <ul className="space-y-1">
                      {formatEnglishTests(selected.english_admission_tests).map((line) => (
                        <li key={line} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selected.pgwp_eligible && (
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
                    <div className="flex items-center gap-2 font-medium text-emerald-900">
                      <ShieldCheck className="h-4 w-4" />
                      {T("Elegibilidade PGWP", "PGWP eligibility")}: {selected.pgwp_eligible}
                    </div>
                    {selected.pgwp_basis && (
                      <p className="mt-1 text-sm text-emerald-900/80">{selected.pgwp_basis}</p>
                    )}
                  </div>
                )}

                {selectedOccupations.length > 0 && (
                  <div>
                    <h4 className="font-display font-semibold text-navy mb-2">
                      {T("Mercado de trabalho", "Labour market")}
                    </h4>
                    <div className="space-y-2">
                      {selectedOccupations.map((o) => {
                        const out = outlookMeta(o.outlook, lang);
                        return (
                          <div
                            key={o.id}
                            className="rounded-lg border border-border p-3 flex flex-wrap items-center justify-between gap-2"
                          >
                            <div>
                              <p className="font-medium text-navy">
                                {o.title}
                                {o.noc_code && (
                                  <span className="ml-2 text-xs text-muted-foreground font-mono">
                                    NOC {o.noc_code}
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {o.salary_low && o.salary_high
                                  ? `${o.salary_low} – ${o.salary_high}`
                                  : o.salary_median || "—"}
                              </p>
                            </div>
                            {out && (
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${out.className}`}>
                                {out.label}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {selected.application_url && (
                    <Button asChild className="bg-crimson hover:bg-crimson/90 text-white">
                      <a href={selected.application_url} target="_blank" rel="noopener noreferrer">
                        {t("programsPage.card.applyDirect")}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {selected.intl_office_url && (
                    <Button asChild variant="outline">
                      <a href={selected.intl_office_url} target="_blank" rel="noopener noreferrer">
                        {t("programsPage.card.intlOffice")}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {selected.book_meeting_url && (
                    <Button asChild variant="outline">
                      <a href={selected.book_meeting_url} target="_blank" rel="noopener noreferrer">
                        {t("programsPage.card.bookMeeting")}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {selected.institutions?.name?.toLowerCase().includes("algonquin") && (
                    <Button asChild variant="outline">
                      <a
                        href="https://www.algonquincollege.com/international/recruitment-team/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {T("Falar com um recruiter", "Talk to a recruiter")}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
                {(selected.application_url ||
                  selected.intl_office_url ||
                  selected.book_meeting_url) && (
                  <p className="text-xs text-muted-foreground italic">
                    {t("programsPage.card.directNote")}
                  </p>
                )}

                <CostDisclosure
                  institutionName={
                    selected.institutions?.display_name ??
                    selected.institutions?.name ??
                    null
                  }
                  officialFeesUrl={selected.intl_office_url ?? null}
                />

                <SourceBadge
                  variant="block"
                  url={selected.sources?.url}
                  validAsOf={selected.sources?.valid_as_of}
                />

                <div className="rounded-lg bg-muted/60 border border-border p-3 flex items-start gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    {T(
                      "Informação verificada em fonte oficial — não confirma seu caso de imigração.",
                      "Information verified against official sources — does not confirm your immigration case."
                    )}
                  </span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
