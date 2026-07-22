import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5-20251001";

type Target = { name: string; url: string | null; note?: string };
type InstitutionCtx = {
  id?: string | null;
  name?: string | null;
  defaultEnglishTests?: Record<string, string> | null;
  notes?: string | null;
};

const TARGETS: Target[] = [
  { name: "Practical Nursing", url: "https://www.conestogac.on.ca/fulltime/practical-nursing" },
  { name: "Computer Programmer and Analyst", url: "https://www.conestogac.on.ca/fulltime/computer-programmer-and-analyst" },
  { name: "Business Administration - Accounting", url: "https://www.conestogac.on.ca/fulltime/business-administration-accounting" },
  { name: "Web Development", url: "https://www.conestogac.on.ca/fulltime/web-development" },
  { name: "Welding Techniques", url: "https://www.conestogac.on.ca/fulltime/welding-techniques" },
];

function buildSystemPrompt(inst: InstitutionCtx): string {
  const base = `You extract structured Canadian college program data from HTML. Return ONLY valid JSON matching the requested schema. Never invent values — if a field is not clearly stated on the page, use null.

IMPORTANT — PGWP: Post-graduation work permit eligibility is determined by IRCC rules and official CIP codes, NOT by you. Your only job is to report whether the program page itself makes a statement about PGWP. Never infer eligibility from credential type, program length, or any general immigration knowledge. If the page says nothing about PGWP, return pgwp_statement_on_page = null and pgwp_mentioned = false. If it does, quote or closely paraphrase that statement in under 25 words.

Graduate certificates typically require a prior diploma/degree — capture that in prerequisites when the page states it.`;

  const instName = inst.name ? ` (${inst.name})` : "";
  let englishRule: string;
  if (inst.defaultEnglishTests && Object.keys(inst.defaultEnglishTests).length > 0) {
    englishRule = `\n\nInstitutional context${instName}: The institutional default English requirements are ${JSON.stringify(inst.defaultEnglishTests)}. Prefer program-specific English requirements when the page states them. If the page does not state a program-specific requirement, you MAY apply the institutional default BUT mark field_confidence.english_admission_tests = "medium".`;
  } else {
    englishRule = `\n\nNo institutional English defaults are provided${instName}. If the page does not state an English requirement, return null for english_admission_tests — do not apply any default.`;
  }
  const notes = inst.notes ? `\n\nAdditional institutional notes: ${inst.notes}` : "";
  return base + englishRule + notes;
}

const USER_INSTRUCTIONS = `Extract the following fields as JSON:
{
  "name": string,
  "credential": "Ontario College Certificate" | "Ontario College Diploma" | "Ontario College Advanced Diploma" | "Ontario College Graduate Certificate" | "Bachelor Degree" | string | null,
  "campus_city": string | null,
  "field_area": string | null,
  "duration_months": number | null,
  "has_coop": boolean | null,
  "pgwp_statement_on_page": string | null,
  "pgwp_mentioned": boolean,
  "prerequisites": string | null,
  "english_admission_tests": { "IELTS_Academic"?: string, "TOEFL_iBT"?: string, "Duolingo"?: string, "PTE"?: string, "CAEL"?: string } | null,
  "min_grade": string | null,
  "tuition_intl_year": number | null,
  "application_url": string | null,
  "confidence": "high" | "medium" | "low",
  "field_confidence": { [field: string]: "high" | "medium" | "low" },
  "notes": string | null
}
pgwp_statement_on_page must be null unless the program page itself talks about the post-graduation work permit. Never infer.
Return ONLY the JSON object, no prose, no markdown fences.`;

async function fetchPage(url: string): Promise<string> {
  const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 EdPathBot/1.0" } });
  if (!r.ok) throw new Error(`fetch ${url} -> ${r.status}`);
  const html = await r.text();
  // Strip scripts/styles and tags to keep prompt small
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.slice(0, 18000);
}

async function callAnthropic(apiKey: string, url: string, pageText: string, systemPrompt: string) {
  const body = {
    model: MODEL,
    max_tokens: 2000,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Source URL: ${url}\n\nPage text (cleaned):\n${pageText}\n\n${USER_INSTRUCTIONS}`,
      },
    ],
  };
  const r = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`anthropic ${r.status}: ${JSON.stringify(j).slice(0, 500)}`);
  const text = j?.content?.[0]?.text ?? "";
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("no json in response: " + text.slice(0, 300));
  return JSON.parse(m[0]);
}

async function upsertSource(supabase: any, url: string): Promise<string | null> {
  const today = new Date().toISOString().slice(0, 10);
  const due = new Date(Date.now() + 180 * 86400 * 1000).toISOString().slice(0, 10);
  const existing = await supabase.from("sources").select("id").eq("url", url).maybeSingle();
  if (existing.data?.id) {
    await supabase
      .from("sources")
      .update({ last_checked: today, valid_as_of: today, next_check_due: due, type: "institution_site" })
      .eq("id", existing.data.id);
    return existing.data.id;
  }
  const ins = await supabase
    .from("sources")
    .insert({ url, type: "institution_site", valid_as_of: today, last_checked: today, next_check_due: due })
    .select("id")
    .single();
  return ins.data?.id ?? null;
}

// -----------------------------------------------------------------------------
// CIP matching + PGWP determination
// -----------------------------------------------------------------------------
// IMPORTANT: our cip_codes table currently loads only 3 of the 6 IRCC PGWP
// field-of-study categories (STEM, trade, transport). Absence of a CIP from
// our table therefore does NOT mean the program is ineligible — it may simply
// belong to a category we haven't loaded yet (agriculture/agri-food,
// education, health care and social services). For that reason this function
// NEVER writes pgwp_eligible = "no". Only the downstream PGWP verifier,
// working from a complete official list, may assert ineligibility.
// -----------------------------------------------------------------------------

type CipRow = { code: string; title: string; description: string | null; category: string | null; area_group: string | null };

function keywordsFor(name: string, fieldArea: string | null): string[] {
  const stop = new Set([
    "and","of","the","a","an","in","for","to","with","or","de","da","do","dos","das","e","o","a",
    "college","ontario","certificate","diploma","advanced","graduate","bachelor","program","programs",
    "technician","technology","technologist","techniques","fundamentals","introduction","studies",
  ]);
  const raw = `${name} ${fieldArea ?? ""}`.toLowerCase().split(/[^a-zà-ÿ0-9]+/).filter(Boolean);
  const uniq = Array.from(new Set(raw)).filter((w) => w.length >= 4 && !stop.has(w));
  return uniq.slice(0, 8);
}

async function findCipCandidates(
  supabase: any,
  name: string,
  fieldArea: string | null,
): Promise<CipRow[]> {
  const kws = keywordsFor(name, fieldArea);
  if (kws.length === 0) return [];
  const seen = new Map<string, CipRow>();
  for (const kw of kws) {
    const pattern = `%${kw}%`;
    const r = await supabase
      .from("cip_codes")
      .select("code,title,description,category,area_group")
      .or(`title.ilike.${pattern},description.ilike.${pattern}`)
      .limit(10);
    for (const row of r.data ?? []) {
      if (!seen.has(row.code)) seen.set(row.code, row as CipRow);
      if (seen.size >= 25) break;
    }
    if (seen.size >= 25) break;
  }
  return Array.from(seen.values()).slice(0, 25);
}

async function pickCip(
  apiKey: string,
  program: { name: string; credential: string | null; field_area: string | null },
  candidates: CipRow[],
): Promise<{ cip_code: string | null; cip_confidence: "high" | "medium" | "low"; cip_reasoning: string }> {
  if (candidates.length === 0) {
    return { cip_code: null, cip_confidence: "low", cip_reasoning: "no candidates returned by keyword search" };
  }
  const allowed = new Set(candidates.map((c) => c.code));
  const system = `You match a Canadian college program to a single official CIP code from a supplied candidate list. You may ONLY return a code that appears verbatim in the candidate list. If no candidate is a genuine match, return null. Never invent, construct, or guess a CIP code. Return ONLY JSON: {"cip_code": string|null, "cip_confidence": "high"|"medium"|"low", "cip_reasoning": string}.`;
  const user = `Program: ${program.name}\nCredential: ${program.credential ?? "unknown"}\nField area: ${program.field_area ?? "unknown"}\n\nCandidates (code — title — category):\n${candidates.map((c) => `- ${c.code} — ${c.title} — ${c.category ?? ""}`).join("\n")}\n\nPick the single best match. If the candidates are only loosely related, return null with confidence "low".`;
  const r = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: MODEL, max_tokens: 400, system, messages: [{ role: "user", content: user }] }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`anthropic cip ${r.status}: ${JSON.stringify(j).slice(0, 300)}`);
  const text = j?.content?.[0]?.text ?? "";
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return { cip_code: null, cip_confidence: "low", cip_reasoning: "no json in cip response" };
  let parsed: any;
  try { parsed = JSON.parse(m[0]); } catch { return { cip_code: null, cip_confidence: "low", cip_reasoning: "cip json parse error" }; }
  const code = typeof parsed.cip_code === "string" ? parsed.cip_code : null;
  if (code && !allowed.has(code)) {
    return { cip_code: null, cip_confidence: "low", cip_reasoning: `model returned out-of-list code ${code}; discarded` };
  }
  const conf = parsed.cip_confidence === "high" || parsed.cip_confidence === "medium" ? parsed.cip_confidence : "low";
  return { cip_code: code, cip_confidence: conf, cip_reasoning: String(parsed.cip_reasoning ?? "") };
}

function isDegreeCredential(credential: string | null): boolean {
  if (!credential) return false;
  const c = credential.toLowerCase();
  return /(bachelor|master|doctoral|doctorate|phd|honours degree|honors degree|degree)/.test(c)
    // exclude "college diploma" false positive — "degree" regex won't hit diploma
    ;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "missing ANTHROPIC_API_KEY" }), {
      status: 500,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  }
  const supabase = createClient(supabaseUrl, serviceKey);

  let targets: Target[] = TARGETS;
  let mode: "insert" | "upsert_by_url" = "insert";
  let institution: InstitutionCtx = {};
  let dryRun = false;
  try {
    if (req.method === "POST") {
      const body = await req.json();
      if (Array.isArray(body?.targets) && body.targets.length > 0) targets = body.targets;
      if (body?.mode === "upsert_by_url") mode = "upsert_by_url";
      if (body?.institution && typeof body.institution === "object") institution = body.institution;
      if (body?.dry_run === true) dryRun = true;
    }
  } catch (_) { /* no body */ }

  const systemPrompt = buildSystemPrompt(institution);
  const notesPrefix = institution.name ? `${institution.name}. ` : "";

  const results: any[] = [];
  for (const t of targets) {
    const row: any = {
      name: t.name,
      institution_id: institution.id ?? null,
      raw_source_url: t.url,
      extracted_at: new Date().toISOString(),
      review_status: "needs_review",
      review_notes: notesPrefix,
    };
    let extractedOk = false;
    let parsed: any = null;
    try {
      if (!t.url) throw new Error("no url");
      const pageText = await fetchPage(t.url);
      const extracted = await callAnthropic(apiKey, t.url, pageText, systemPrompt);
      parsed = extracted;
      row.name = extracted.name ?? t.name;
      row.credential = extracted.credential ?? null;
      row.campus_city = extracted.campus_city ?? null;
      row.field_area = extracted.field_area ?? null;
      row.duration_months = extracted.duration_months ?? null;
      row.has_coop = extracted.has_coop ?? null;
      // PGWP: we only record what the page says. Eligibility itself is
      // determined downstream by EdPath's IRCC/CIP-based verifier.
      row.pgwp_eligible = null;
      row.pgwp_basis = extracted.pgwp_statement_on_page ?? null;
      row.prerequisites = extracted.prerequisites ?? null;
      row.english_admission_tests = extracted.english_admission_tests ?? null;
      row.min_grade = extracted.min_grade ?? null;
      row.tuition_intl_year = extracted.tuition_intl_year ?? null;
      row.application_url = extracted.application_url ?? null;
      row.confidence = extracted.confidence ?? "medium";
      row.field_confidence = extracted.field_confidence ?? null;
      const pgwpNote = extracted.pgwp_mentioned
        ? " PGWP mentioned on page (statement stored in pgwp_basis for human review; eligibility not decided by extractor)."
        : " Page did not mention PGWP.";
      row.review_notes += (extracted.notes ? `AI notes: ${extracted.notes}` : "extracted via Anthropic") + pgwpNote;
      // Preserve the page's PGWP statement (if any) as evidence in review_notes,
      // rather than as the pgwp_basis determination itself.
      const pageStatement = extracted.pgwp_statement_on_page ?? null;
      if (pageStatement) row.review_notes += ` Page PGWP statement: "${pageStatement}".`;

      // --- CIP matching + PGWP determination -----------------------------
      let cipInfo: { cip_code: string | null; cip_confidence: "high" | "medium" | "low"; cip_reasoning: string } = {
        cip_code: null, cip_confidence: "low", cip_reasoning: "not attempted",
      };
      try {
        const candidates = await findCipCandidates(supabase, row.name, row.field_area);
        cipInfo = await pickCip(apiKey, { name: row.name, credential: row.credential, field_area: row.field_area }, candidates);
      } catch (e) {
        row.review_notes += ` (cip matching failed: ${(e as Error).message})`;
      }
      row.cip_code = cipInfo.cip_code;
      row.field_confidence = { ...(row.field_confidence ?? {}), cip_code: cipInfo.cip_confidence };

      // Derive pgwp_eligible / pgwp_basis by strict rules.
      // NEVER set pgwp_eligible = "no" here — our CIP table is incomplete.
      row.pgwp_eligible = null;
      row.pgwp_basis = null;
      if (isDegreeCredential(row.credential)) {
        row.pgwp_eligible = "yes";
        row.pgwp_basis = "degree_exempt_from_field_requirement";
      } else if (cipInfo.cip_code && cipInfo.cip_confidence === "high") {
        // Confirm the code actually exists in cip_codes before asserting.
        const chk = await supabase.from("cip_codes").select("code").eq("code", cipInfo.cip_code).maybeSingle();
        if (chk.data?.code) {
          row.pgwp_eligible = "yes";
          row.pgwp_basis = "cip_on_list";
        } else {
          row.review_notes += ` (cip ${cipInfo.cip_code} not found in cip_codes on re-check)`;
        }
      } else if (cipInfo.cip_code) {
        row.review_notes += ` Tentative CIP match ${cipInfo.cip_code} (confidence ${cipInfo.cip_confidence}) — human review required. Reasoning: ${cipInfo.cip_reasoning}.`;
      } else {
        row.review_notes += ` No CIP match found. This is NOT a determination of ineligibility — our cip_codes table does not yet cover all 6 IRCC categories (missing: agriculture/agri-food, education, health care & social services). Human review required.`;
      }

      extractedOk = true;
    } catch (e) {
      row.confidence = "low";
      row.review_notes += `página não localizada automaticamente ou falha de extração — verificar URL. Erro: ${(e as Error).message}`;
    }

    if (dryRun) {
      results.push({ dry_run: true, name: row.name, url: t.url, extractedOk, row, parsed });
      continue;
    }

    // Only create a sources row for a successful extraction.
    if (extractedOk && t.url) {
      try {
        const sid = await upsertSource(supabase, t.url);
        if (sid) row.source_id = sid;
      } catch (e) {
        row.review_notes += ` (source upsert failed: ${(e as Error).message})`;
      }
    }

    let data: any = null;
    let error: any = null;
    if (mode === "upsert_by_url" && t.url) {
      await supabase.from("programs_staging").delete().eq("raw_source_url", t.url);
      // Also clear prior failed rows with the same name, but scoped to this
      // institution so we never wipe another college's rows that happen to
      // share a program name (e.g. "Practical Nursing").
      if (institution.id) {
        await supabase
          .from("programs_staging")
          .delete()
          .eq("name", t.name)
          .eq("institution_id", institution.id);
      }
      const r = await supabase.from("programs_staging").insert(row).select().single();
      data = r.data; error = r.error;
    } else {
      const r = await supabase.from("programs_staging").insert(row).select().single();
      data = r.data; error = r.error;
    }
    if (error) {
      results.push({ name: t.name, error: error.message });
    } else {
      results.push({
        id: data.id,
        name: data.name,
        credential: data.credential,
        campus_city: data.campus_city,
        english_admission_tests: data.english_admission_tests,
        confidence: data.confidence,
        field_confidence: data.field_confidence,
        source_id: data.source_id,
        cip_code: data.cip_code,
        cip_confidence: data.field_confidence?.cip_code ?? null,
        pgwp_eligible: data.pgwp_eligible,
        pgwp_basis: data.pgwp_basis,
        review_status: data.review_status,
        review_notes: data.review_notes,
      });
    }
  }

  return new Response(JSON.stringify({ ok: true, count: results.length, results }, null, 2), {
    headers: { ...corsHeaders, "content-type": "application/json" },
  });
});