import { useEffect, useMemo, useState } from "react";
import { Search, Building2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Institution = {
  id: string;
  name: string;
  province: string;
  type: string;
  country: string;
};

const PROVINCES = [
  { key: "all", label: "Todas" },
  { key: "Ontario", label: "Ontário" },
  { key: "British Columbia", label: "British Columbia" },
  { key: "Alberta", label: "Alberta" },
  { key: "Manitoba", label: "Manitoba" },
  { key: "Saskatchewan", label: "Saskatchewan" },
];

const provinceLabel = (p: string) =>
  PROVINCES.find((x) => x.key === p)?.label ?? p;

export default function Institutions() {
  const [items, setItems] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [province, setProvince] = useState<string>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("institutions")
        .select("id,name,province,type,country")
        .order("name", { ascending: true });
      if (!error && data) setItems(data as Institution[]);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (province !== "all" && it.province !== province) return false;
      if (q && !it.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, province, query]);

  const countLabel = useMemo(() => {
    const n = filtered.length;
    if (province === "all") return `${n} instituições no total`;
    return `${n} ${n === 1 ? "instituição" : "instituições"} em ${provinceLabel(province)}`;
  }, [filtered.length, province]);

  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="container py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/70 mb-4">
              <span className="text-lg leading-none">🇨🇦</span>
              <span>Canadá</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
              Instituições públicas no Canadá
            </h1>
            <p className="mt-5 text-lg text-white/80 leading-relaxed max-w-2xl">
              Universidades e colleges públicos reconhecidos, organizados por província.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="container py-10">
        <div className="flex flex-col gap-4">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome da instituição..."
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {PROVINCES.map((p) => {
              const active = province === p.key;
              return (
                <Button
                  key={p.key}
                  variant={active ? "default" : "outline"}
                  size="sm"
                  onClick={() => setProvince(p.key)}
                  className={
                    active
                      ? "bg-[hsl(var(--azul))] hover:bg-[hsl(var(--azul))]/90 text-white border-transparent"
                      : ""
                  }
                >
                  {p.label}
                </Button>
              );
            })}
          </div>

          <p className="text-sm text-muted-foreground">
            {loading ? "Carregando..." : countLabel}
          </p>
        </div>

        {/* List */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((it) => (
            <div
              key={it.id}
              className="rounded-xl border border-border bg-card p-5 hover:border-[hsl(var(--crimson))] hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--azul))]/10 text-[hsl(var(--azul))]">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground leading-snug">
                    {it.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {provinceLabel(it.province)}
                  </p>
                </div>
              </div>
              <a
                href={`https://duckduckgo.com/?q=${encodeURIComponent(
                  `${it.name} official website`,
                )}`}
                target="_blank"
                rel="noopener noreferrer external"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--azul))] hover:text-[hsl(var(--crimson))] transition-colors"
              >
                Visitar site oficial
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="mt-10 text-center text-muted-foreground">
            Nenhuma instituição encontrada com esses filtros.
          </div>
        )}

        <p className="mt-12 text-sm text-muted-foreground border-l-2 border-[hsl(var(--crimson))] pl-4 max-w-3xl">
          Lista de instituições públicas com base em dados oficiais do IRCC.
          Cobre as principais províncias de destino de estudantes e está sendo
          expandida. O botão leva a uma busca pelo site oficial da instituição —
          confirme sempre as informações diretamente com a instituição.
        </p>
      </section>
    </>
  );
}