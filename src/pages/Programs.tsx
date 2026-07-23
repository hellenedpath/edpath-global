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
  outlook: string | null;
  province: string | null;
  sources: {
    url: string | null;
    valid_as_of: string | null;
  } | null;
};

type Wage = {
  noc_code: string;
  geo_level: string;
  prov_code: string | null;
  region_name_en: string | null;
  wage_low: number | null;
  wage_median: number | null;
  wage_high: number | null;
  wage_unit: string | null;
  reference_period: string | null;
  wage_comment_en: string | null;
};

const WAGES_SOURCE_ID = "3a0322a5-c3f3-4186-815c-171f7b058c47";
const WAGES_SOURCE_URL =
  "https://ouvert.canada.ca/data/dataset/adad580f-76b0-4502-bd05-20c125de9116";
const WAGES_SOURCE_VALID_AS_OF = "2025-11-19";

const PROVINCE_NAME_TO_CODE: Record<string, string> = {
  Alberta: "AB",
  "British Columbia": "BC",
  Manitoba: "MB",
  "New Brunswick": "NB",
  "Newfoundland and Labrador": "NL",
  "Nova Scotia": "NS",
  "Northwest Territories": "NT",
  Nunavut: "NU",
  Ontario: "ON",
  "Prince Edward Island": "PE",
  Quebec: "QC",
  Québec: "QC",
  Saskatchewan: "SK",
  Yukon: "YT",
};

const PROVINCE_CODE_TO_LABEL: Record<string, { en: string; pt: string }> = {
  AB: { en: "Alberta", pt: "Alberta" },
  BC: { en: "British Columbia", pt: "Colúmbia Britânica" },
  MB: { en: "Manitoba", pt: "Manitoba" },
  NB: { en: "New Brunswick", pt: "New Brunswick" },
  NL: { en: "Newfoundland and Labrador", pt: "Terra Nova e Labrador" },
  NS: { en: "Nova Scotia", pt: "Nova Escócia" },
  NT: { en: "Northwest Territories", pt: "Territórios do Noroeste" },
  NU: { en: "Nunavut", pt: "Nunavut" },
  ON: { en: "Ontario", pt: "Ontário" },
  PE: { en: "Prince Edward Island", pt: "Ilha do Príncipe Eduardo" },
  QC: { en: "Quebec", pt: "Quebec" },
  SK: { en: "Saskatchewan", pt: "Saskatchewan" },
  YT: { en: "Yukon", pt: "Yukon" },
};

function formatWageValue(value: number, unit: string | null, lang: string): string {
  const isHourly = (unit || "").toLowerCase().startsWith("hour") || unit === "h";
  const locale = lang === "pt" ? "pt-BR" : "en-CA";
  if (isHourly) {
    const formatted = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
    return lang === "pt" ? `${formatted}/hora` : `${formatted}/hour`;
  }
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
  return lang === "pt" ? `${formatted}/ano` : `${formatted}/year`;
}

function pickWageForOccupation(
  nocCode: string | null,
  wagesByNoc: Map<string, Wage[]>,
  provinceName: string | null | undefined
): Wage | null {
  if (!nocCode) return null;
  const rows = wagesByNoc.get(nocCode);
  if (!rows || rows.length === 0) return null;
  const provCode = provinceName ? PROVINCE_NAME_TO_CODE[provinceName] ?? null : null;
  if (provCode) {
    const provRow = rows.find(
      (w) => w.geo_level === "provincial" && w.prov_code === provCode
    );
    if (provRow) return provRow;
  }
  const onRow = rows.find(
    (w) => w.geo_level === "provincial" && w.prov_code === "ON"
  );
  if (onRow) return onRow;
  const nat = rows.find((w) => w.geo_level === "national");
  return nat ?? null;
}

// ---------- Funnel: area groups ----------
// Groups raw field_area values from the DB into a handful of student-facing areas.
type AreaGroup =
  | "health"
  | "it"
  | "business"
  | "engineering"
  | "science"
  | "trades"
  | "social"
  | "education"
  | "other";

const AREA_GROUP_ORDER: AreaGroup[] = [
  "health",
  "it",
  "business",
  "engineering",
  "science",
  "trades",
  "social",
  "education",
  "other",
];

// raw field_area (lower-cased) -> group
const AREA_TO_GROUP: Record<string, AreaGroup> = {
  health: "health",
  it: "it",
  business: "business",
  engineering: "engineering",
  science: "science",
  trades: "trades",
  "social services": "social",
  education: "education",
  environment: "other",
  design: "other",
  aviation: "other",
  agriculture: "other",
  general: "other",
  media: "other",
  hospitality: "other",
  transport: "other",
  other: "other",
};

const AREA_LABELS: Record<AreaGroup, { en: string; pt: string }> = {
  health: { en: "Health", pt: "Saúde" },
  it: { en: "Technology (IT)", pt: "Tecnologia (TI)" },
  business: { en: "Business", pt: "Negócios" },
  engineering: { en: "Engineering", pt: "Engenharia" },
  science: { en: "Sciences", pt: "Ciências" },
  trades: { en: "Trades", pt: "Ofícios e Trades" },
  social: { en: "Social services", pt: "Serviços sociais" },
  education: { en: "Education", pt: "Educação" },
  other: { en: "Other areas", pt: "Outras áreas" },
};

function areaGroupOf(raw: string | null | undefined): AreaGroup | null {
  if (!raw) return null;
  return AREA_TO_GROUP[raw.toLowerCase().trim()] ?? null;
}

// ---------- Funnel: 4 level buckets from raw credential text ----------
type LevelBucket = "certificate" | "diploma" | "bachelor" | "pos";

const LEVEL_ORDER: LevelBucket[] = ["certificate", "diploma", "bachelor", "pos"];

const LEVEL_LABELS: Record<LevelBucket, { en: string; pt: string }> = {
  certificate: { en: "Certificate", pt: "Certificado" },
  diploma: { en: "Diploma", pt: "Diploma" },
  bachelor: { en: "Bachelor", pt: "Bacharelado" },
  pos: { en: "Graduate", pt: "Pós" },
};

function credentialToLevel(c: string | null | undefined): LevelBucket | null {
  if (!c) return null;
  const s = c.toLowerCase();
  // Order matters: graduate-level phrases first, then bachelor, diploma, certificate.
  if (
    /master|graduate certificate|post[- ]?baccalaureate|post[- ]?graduate|post[- ]?degree|post[- ]?diploma/.test(
      s,
    )
  )
    return "pos";
  if (/bachelor|baccalaureate|honours|applied degree|associate|(^|\s)degree(\s|$)/.test(s))
    return "bachelor";
  if (/diploma/.test(s)) return "diploma";
  if (/certificate|citation/.test(s)) return "certificate";
  return null;
}

function normalize(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

// (area inference removed — funnel uses explicit AREA_TO_GROUP mapping only)

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
  const [area, setArea] = useState<AreaGroup | "all">("all");
  const [level, setLevel] = useState<LevelBucket | "all">("all");
  const [province, setProvince] = useState<string>("all");
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
    queryKey: ["programs-eligible"],
    queryFn: async () => {
      // PostgREST caps at 1000 rows/request. Use a page size BELOW the cap so
      // .range() actually advances past 1000 and fetches the complete pool.
      const PAGE = 500;
      const all: Program[] = [];
      for (let from = 0; ; from += PAGE) {
        const { data, error } = await supabase
          .from("programs")
          .select(
            "id, name, credential, field_area, campus_city, min_grade, prerequisites, english_admission_tests, duration_months, tuition_intl_year, has_coop, pgwp_eligible, pgwp_basis, application_url, intl_office_url, book_meeting_url, source_id, cip_code, sources!source_id(id, url, valid_as_of), occupation_ids, institution_id, institutions(id, name, display_name, city, province)"
          )
          // HARD FILTER — the funnel never shows programs a student can't actually use.
          .eq("study_permit_eligible", "yes")
          .eq("pgwp_eligible", "yes")
          .order("name", { ascending: true })
          .range(from, from + PAGE - 1);
        if (error) throw error;
        const batch = (data ?? []) as unknown as Program[];
        all.push(...batch);
        if (batch.length < PAGE) break;
      }
      return all;
    },
  });

  // Server-side exact counts — immune to the 1000-row cap. Drives the top
  // badge and the area picker buttons so numbers reflect the DB, not a
  // truncated fetch.
  const { data: areaCountsServer } = useQuery({
    queryKey: ["programs-area-counts"],
    queryFn: async () => {
      const RAW_AREAS: { group: AreaGroup; raw: string }[] = [
        { group: "health", raw: "health" },
        { group: "it", raw: "IT" },
        { group: "business", raw: "business" },
        { group: "engineering", raw: "engineering" },
        { group: "science", raw: "science" },
        { group: "trades", raw: "trades" },
        { group: "social", raw: "social services" },
        { group: "education", raw: "education" },
        { group: "other", raw: "environment" },
        { group: "other", raw: "design" },
        { group: "other", raw: "aviation" },
        { group: "other", raw: "agriculture" },
        { group: "other", raw: "general" },
        { group: "other", raw: "media" },
        { group: "other", raw: "hospitality" },
        { group: "other", raw: "transport" },
        { group: "other", raw: "other" },
      ];
      const counts: Record<AreaGroup, number> = {
        health: 0, it: 0, business: 0, engineering: 0, science: 0,
        trades: 0, social: 0, education: 0, other: 0,
      };
      const { count: totalCount, error: totalErr } = await supabase
        .from("programs")
        .select("*", { count: "exact", head: true })
        .eq("study_permit_eligible", "yes")
        .eq("pgwp_eligible", "yes");
      if (totalErr) throw totalErr;
      await Promise.all(
        RAW_AREAS.map(async ({ group, raw }) => {
          const { count, error } = await supabase
            .from("programs")
            .select("*", { count: "exact", head: true })
            .eq("study_permit_eligible", "yes")
            .eq("pgwp_eligible", "yes")
            .eq("field_area", raw);
          if (error) throw error;
          counts[group] += count ?? 0;
        }),
      );
      return { counts, total: totalCount ?? 0 };
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
        .select(
          "id, noc_code, title, outlook, province, sources(url, valid_as_of)"
        );
      if (error) throw error;
      return data as Occupation[];
    },
  });

  const { data: wages } = useQuery({
    queryKey: ["wages-provincial-national"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wages")
        .select(
          "noc_code, geo_level, prov_code, region_name_en, wage_low, wage_median, wage_high, wage_unit, reference_period, wage_comment_en"
        )
        .in("geo_level", ["provincial", "national"]);
      if (error) throw error;
      return data as Wage[];
    },
  });

  const wagesByNoc = useMemo(() => {
    const m = new Map<string, Wage[]>();
    (wages ?? []).forEach((w) => {
      if (!w.noc_code) return;
      const arr = m.get(w.noc_code) ?? [];
      arr.push(w);
      m.set(w.noc_code, arr);
    });
    return m;
  }, [wages]);

  const occById = useMemo(() => {
    const m = new Map<string, Occupation>();
    (occupations ?? []).forEach((o) => m.set(o.id, o));
    return m;
  }, [occupations]);

  // Prefer server-side exact counts (never truncated); fall back to the
  // fetched array only while the count query is loading.
  const areaCounts = useMemo<Record<AreaGroup, number>>(() => {
    if (areaCountsServer) return areaCountsServer.counts;
    const counts: Record<AreaGroup, number> = {
      health: 0, it: 0, business: 0, engineering: 0, science: 0,
      trades: 0, social: 0, education: 0, other: 0,
    };
    (programs ?? []).forEach((p) => {
      const g = areaGroupOf(p.field_area);
      if (g) counts[g]++;
    });
    return counts;
  }, [areaCountsServer, programs]);

  // Badge total must ONLY come from the server-side exact count so it stays
  // consistent with the area buttons (which also use exact counts). Never
  // fall back to programs.length — that array streams in and would show a
  // partial number during loading.
  const totalEligible: number | null = areaCountsServer?.total ?? null;

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

  const filtered = useMemo(() => {
    const q = normalize(query);
    return (programs ?? []).filter((p) => {
      if (cipParam && p.cip_code !== cipParam) return false;
      if (onlyCoop && !p.has_coop) return false;
      if (province !== "all" && p.institutions?.province !== province) return false;
      if (level !== "all" && credentialToLevel(p.credential) !== level) return false;
      if (area !== "all") {
        if (areaGroupOf(p.field_area) !== area) return false;
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
  }, [programs, query, area, level, province, onlyCoop, profile, profileActive, eligFilter, lang, cipParam]);

  const isComplete = (p: Program) => !!p.tuition_intl_year;

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
        {/* Trust chip — kept but small so it doesn't dominate the funnel */}
        {!error && (
          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 bg-navy/[0.03] px-2.5 py-1 text-navy">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
              {totalEligible == null ? (
                <span className="inline-block h-3 w-16 animate-pulse rounded bg-navy/10" aria-hidden />
              ) : (
                T(
                  `${totalEligible} programas elegíveis a Study Permit e PGWP`,
                  `${totalEligible} programs eligible for Study Permit and PGWP`,
                )
              )}
            </span>
          </div>
        )}

        {/* STEP 1 — Area picker. Shown when no area is selected and no CIP filter is active. */}
        {area === "all" && !cipParam && !isLoading && !error && (
          <div className="rounded-2xl border border-border bg-card p-6 md:p-10 shadow-sm">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-navy tracking-tight">
              {T("O que você quer estudar?", "What do you want to study?")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              {T(
                "Escolha uma área para ver apenas os programas que se encaixam. Todos já são elegíveis para permissão de estudo e PGWP.",
                "Pick an area to see only programs that fit. Every one already qualifies for study permit and PGWP.",
              )}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {AREA_GROUP_ORDER.map((g) => {
                const count = areaCounts[g];
                if (count === 0) return null;
                const label = AREA_LABELS[g][lang as "pt" | "en"];
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setArea(g)}
                    className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-background px-5 py-5 text-left transition-all hover:border-crimson hover:shadow-md"
                  >
                    <span className="font-display text-lg font-semibold text-navy group-hover:text-crimson">
                      {label}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2 — Refine filters (shown once an area is picked or a CIP filter is active) */}
        {(area !== "all" || cipParam) && (
        <>
        <div className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <button
                type="button"
                onClick={() => {
                  setArea("all");
                  setLevel("all");
                  setProvince("all");
                  setOnlyCoop(false);
                  setQuery("");
                }}
                className="inline-flex items-center gap-1 text-navy hover:text-crimson underline-offset-4 hover:underline"
              >
                ← {T("Ver todas as áreas", "All areas")}
              </button>
              {area !== "all" && (
                <span className="text-muted-foreground">
                  · <span className="font-medium text-navy">{AREA_LABELS[area as AreaGroup][lang as "pt" | "en"]}</span>
                </span>
              )}
            </div>
          </div>

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
            {/* Level (4 clean buckets replace the 30+ credential wall) */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {T("Nível", "Level")}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={level === "all" ? "default" : "outline"}
                  onClick={() => setLevel("all")}
                >
                  {T("Todos", "All")}
                </Button>
                {LEVEL_ORDER.map((lv) => (
                  <Button
                    key={lv}
                    size="sm"
                    variant={level === lv ? "default" : "outline"}
                    onClick={() => setLevel(lv)}
                  >
                    {LEVEL_LABELS[lv][lang as "pt" | "en"]}
                  </Button>
                ))}
              </div>
            </div>

            {/* Province */}
            {provinceOptions.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {t("programsPage.filters.provinceLabel")}
                </p>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="all">{t("programsPage.filters.allProvinces")}</option>
                  {provinceOptions.map((prov) => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
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
        </div>

        {/* Advanced eligibility profile — collapsed by default to keep the funnel clean */}
        <details className="mt-4 rounded-2xl border border-border bg-card shadow-sm">
          <summary className="cursor-pointer list-none px-5 py-4 md:px-6 flex items-center justify-between gap-3">
            <span className="font-display text-sm font-semibold text-navy">
              {T("Verificar minha elegibilidade (opcional)", "Check my eligibility (optional)")}
            </span>
            <span className="text-xs text-muted-foreground">
              {T("Inglês, ensino médio, formação prévia", "English, high school, prior credential")}
            </span>
          </summary>
          <div className="border-t border-border p-5 md:p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
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
        </details>
        </>
        )}

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

          {!isLoading && !error && (area !== "all" || cipParam) && (
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
                  {area !== "all"
                    ? T(
                        `${filtered.length} programas em ${AREA_LABELS[area as AreaGroup].pt}`,
                        `${filtered.length} programs in ${AREA_LABELS[area as AreaGroup].en}`,
                      )
                    : T(
                        `${filtered.length} programas`,
                        `${filtered.length} programs`,
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
                        const wage = pickWageForOccupation(
                          o.noc_code,
                          wagesByNoc,
                          selected.institutions?.province ?? null
                        );
                        const hasSalary =
                          !!wage &&
                          (wage.wage_low != null ||
                            wage.wage_median != null ||
                            wage.wage_high != null);
                        const regionLabel = wage
                          ? wage.geo_level === "national"
                            ? T("no Canadá", "in Canada")
                            : wage.prov_code &&
                              PROVINCE_CODE_TO_LABEL[wage.prov_code]
                            ? T(
                                `em ${PROVINCE_CODE_TO_LABEL[wage.prov_code].pt}`,
                                `in ${PROVINCE_CODE_TO_LABEL[wage.prov_code].en}`
                              )
                            : wage.region_name_en
                            ? T(`em ${wage.region_name_en}`, `in ${wage.region_name_en}`)
                            : ""
                          : "";
                        return (
                          <div
                            key={o.id}
                            className="rounded-lg border border-border p-3 flex flex-wrap items-center justify-between gap-2"
                          >
                            <div className="min-w-0">
                              <p className="font-medium text-navy">
                                {o.title}
                                {o.noc_code && (
                                  <span className="ml-2 text-xs text-muted-foreground font-mono">
                                    NOC {o.noc_code}
                                  </span>
                                )}
                              </p>
                              {hasSalary && wage ? (
                                <>
                                  {wage.wage_median != null && (
                                    <p className="text-sm font-medium text-navy mt-0.5">
                                      {T("Mediana", "Median")}:{" "}
                                      {formatWageValue(
                                        wage.wage_median,
                                        wage.wage_unit,
                                        lang
                                      )}
                                    </p>
                                  )}
                                  {wage.wage_low != null && wage.wage_high != null && (
                                    <p className="text-xs text-muted-foreground">
                                      {T("Faixa", "Range")}:{" "}
                                      {formatWageValue(wage.wage_low, wage.wage_unit, lang)}{" "}
                                      –{" "}
                                      {formatWageValue(wage.wage_high, wage.wage_unit, lang)}
                                    </p>
                                  )}
                                  {regionLabel && (
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {regionLabel}
                                    </p>
                                  )}
                                  {wage.reference_period && (
                                    <p className="text-xs text-muted-foreground">
                                      {T(
                                        `Dados de referência: ${wage.reference_period}`,
                                        `Reference period: ${wage.reference_period}`
                                      )}
                                    </p>
                                  )}
                                  <SourceBadge
                                    url={WAGES_SOURCE_URL}
                                    validAsOf={WAGES_SOURCE_VALID_AS_OF}
                                    variant="inline"
                                    className="mt-1"
                                  />
                                </>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  {T(
                                    "Sem dado salarial publicado para esta ocupação nesta região.",
                                    "No published wage data for this occupation in this region."
                                  )}
                                </p>
                              )}
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
                  officialFeesUrl={null}
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
