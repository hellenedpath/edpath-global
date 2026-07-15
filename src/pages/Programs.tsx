import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ArrowRight, CheckCircle2, ExternalLink, Info, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type CipRow = {
  id: string;
  code: string;
  title: string;
  description: string | null;
  category: string | null;
};

const CATEGORIES = ["stem", "trade", "transport"] as const;
type Category = (typeof CATEGORIES)[number];

function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function statusFrom(desc: string | null): "eligible" | "conditional" | "unknown" {
  const d = (desc ?? "").toLowerCase();
  if (d.includes("conditional")) return "conditional";
  if (d.includes("eligible")) return "eligible";
  return "unknown";
}

export default function Programs() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["cip_codes", "programs-page"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cip_codes")
        .select("id, code, title, description, category")
        .range(0, 999)
        .order("title", { ascending: true });
      if (error) throw error;
      return data as CipRow[];
    },
  });

  const filtered = useMemo(() => {
    const q = normalize(query);
    return (data ?? []).filter((r) => {
      if (category !== "all" && r.category !== category) return false;
      if (!q) return true;
      return normalize(r.title).includes(q);
    });
  }, [data, query, category]);

  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/70 mb-4">
              <span className="text-lg leading-none">🇨🇦</span>
              <span>{t("programs.hero.badge")}</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
              {t("programs.hero.title")}
            </h1>
            <p className="mt-5 text-lg text-white/80 leading-relaxed max-w-2xl">
              {t("programs.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      <section className="container py-10 md:py-14">
        {/* Search + categories */}
        <div className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("programs.search.placeholder")}
              className="pl-9 h-11"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant={category === "all" ? "default" : "outline"}
              onClick={() => setCategory("all")}
            >
              {t("programs.search.allCategories")}
            </Button>
            {CATEGORIES.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={category === c ? "default" : "outline"}
                onClick={() => setCategory(c)}
              >
                {t(`programs.category.${c}`)}
              </Button>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0 text-amber-700" />
          <div className="text-sm text-amber-950 leading-relaxed">
            <p className="font-semibold text-amber-900 mb-1">
              {t("programs.disclaimer.title")}
            </p>
            <p>{t("programs.disclaimer.body")}</p>
            <a
              href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/eligibility.html"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 font-medium text-amber-900 underline hover:text-amber-950"
            >
              {t("programs.disclaimer.linkLabel")}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Results */}
        <div className="mt-6">
          {isLoading && (
            <p className="text-muted-foreground text-sm py-10 text-center">
              {t("programs.search.loading")}
            </p>
          )}
          {error && (
            <p className="text-crimson text-sm py-10 text-center">
              {t("programs.search.error")}
            </p>
          )}

          {!isLoading && !error && (
            <>
              <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
                <span>
                  {t("programs.search.resultsCount", {
                    count: filtered.length,
                    total: data?.length ?? 0,
                  })}
                </span>
              </div>

              <ul className="space-y-3">
                {filtered.map((r) => {
                  const status = statusFrom(r.description);
                  return (
                    <li
                      key={r.id}
                      className="rounded-xl border border-border bg-card p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <span className="font-mono">{r.code}</span>
                          {r.category && (
                            <>
                              <span>•</span>
                              <span>{t(`programs.category.${r.category}`)}</span>
                            </>
                          )}
                        </div>
                        <h3 className="font-medium text-foreground leading-snug">
                          {r.title}
                        </h3>
                      </div>
                      <div className="shrink-0">
                        {status === "eligible" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {t("programs.status.eligible")}
                          </span>
                        )}
                        {status === "conditional" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-900 px-3 py-1 text-xs font-medium">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            {t("programs.status.conditional")}
                          </span>
                        )}
                        {status === "unknown" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted text-muted-foreground px-3 py-1 text-xs font-medium">
                            <Info className="h-3.5 w-3.5" />
                            {r.description ?? "—"}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
                {filtered.length === 0 && (
                  <li className="text-center text-muted-foreground py-10 text-sm">
                    {t("programs.search.empty")}
                  </li>
                )}
              </ul>
            </>
          )}
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <Button asChild size="lg" className="bg-crimson hover:bg-crimson/90 text-white px-8">
            <Link to="/canada/pgwp">
              {t("programs.cta.check")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
