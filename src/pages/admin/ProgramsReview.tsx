import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Row = {
  id: string;
  name: string | null;
  credential: string | null;
  campus_city: string | null;
  cip_code: string | null;
  pgwp_eligible: boolean | null;
  pgwp_basis: string | null;
  confidence: string | null;
  field_confidence: Record<string, string> | null;
  raw_source_url: string | null;
  review_notes: string | null;
  extracted_at: string | null;
  institution_id: string | null;
  institutions?: { name: string | null } | null;
};

export default function ProgramsReview() {
  const [q, setQ] = useState("");
  const [confFilter, setConfFilter] = useState<string>("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["programs_staging_review"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs_staging")
        .select(
          "id,name,credential,campus_city,cip_code,pgwp_eligible,pgwp_basis,confidence,field_confidence,raw_source_url,review_notes,extracted_at,institution_id,institutions(name)"
        )
        .eq("review_status", "needs_review")
        .order("extracted_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  const filtered = useMemo(() => {
    const rows = data ?? [];
    return rows.filter((r) => {
      const cipConf = r.field_confidence?.cip_code ?? "none";
      if (confFilter !== "all" && cipConf !== confFilter) return false;
      if (!q.trim()) return true;
      const hay = [
        r.name,
        r.credential,
        r.campus_city,
        r.cip_code,
        r.institutions?.name,
        r.raw_source_url,
        r.review_notes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [data, q, confFilter]);

  return (
    <main className="max-w-7xl mx-auto p-6 space-y-4">
      <header>
        <h1 className="font-display text-2xl font-semibold text-navy">
          Revisão de programas (staging)
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ferramenta interna. Lista linhas de <code>programs_staging</code> com{" "}
          <code>review_status = "needs_review"</code>.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome, instituição, CIP, URL, notas…"
            className="pl-8"
          />
        </div>
        <Select value={confFilter} onValueChange={setConfFilter}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Confiança CIP" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as confianças CIP</SelectItem>
            <SelectItem value="high">CIP alta</SelectItem>
            <SelectItem value="medium">CIP média</SelectItem>
            <SelectItem value="low">CIP baixa</SelectItem>
            <SelectItem value="none">Sem confiança CIP</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-xs text-muted-foreground ml-auto">
          {filtered.length} de {data?.length ?? 0} linhas
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}
      {error && <p className="text-sm text-[hsl(var(--crimson))]">Erro: {(error as Error).message}</p>}

      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">Programa</th>
              <th className="p-3">Instituição</th>
              <th className="p-3">Credencial</th>
              <th className="p-3">CIP</th>
              <th className="p-3">PGWP</th>
              <th className="p-3">Fonte</th>
              <th className="p-3">Notas</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const cipConf = r.field_confidence?.cip_code ?? null;
              return (
                <tr key={r.id} className="border-t border-border align-top">
                  <td className="p-3 font-medium text-navy">
                    {r.name}
                    <div className="text-xs text-muted-foreground font-normal">
                      {r.campus_city ?? "—"}
                    </div>
                  </td>
                  <td className="p-3">{r.institutions?.name ?? "—"}</td>
                  <td className="p-3">{r.credential ?? "—"}</td>
                  <td className="p-3">
                    <div className="font-mono text-xs">{r.cip_code ?? "—"}</div>
                    {cipConf && (
                      <div className="text-[10px] uppercase tracking-wide text-muted-foreground mt-0.5">
                        {cipConf}
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <div>
                      {r.pgwp_eligible === true
                        ? "yes"
                        : r.pgwp_eligible === false
                        ? "no"
                        : "—"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {r.pgwp_basis ?? "—"}
                    </div>
                  </td>
                  <td className="p-3">
                    {r.raw_source_url ? (
                      <a
                        href={r.raw_source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-navy hover:text-[hsl(var(--crimson))] underline break-all"
                      >
                        abrir <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-3 text-xs text-muted-foreground max-w-md whitespace-pre-wrap">
                    {r.review_notes ?? "—"}
                  </td>
                </tr>
              );
            })}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-sm text-muted-foreground">
                  Nenhuma linha para revisar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}