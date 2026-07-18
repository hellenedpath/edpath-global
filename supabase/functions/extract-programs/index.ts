import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5-20251001";

type Target = { name: string; url: string | null; note?: string };

const TARGETS: Target[] = [
  { name: "Practical Nursing", url: "https://www.conestogac.on.ca/fulltime/practical-nursing" },
  { name: "Computer Programmer and Analyst", url: "https://www.conestogac.on.ca/fulltime/computer-programmer-and-analyst" },
  { name: "Business Administration - Accounting", url: "https://www.conestogac.on.ca/fulltime/business-administration-accounting" },
  { name: "Web Development", url: "https://www.conestogac.on.ca/fulltime/web-development" },
  { name: "Welding Techniques", url: "https://www.conestogac.on.ca/fulltime/welding-techniques" },
];

const SYSTEM_PROMPT = `You extract structured Canadian college program data from HTML. Return ONLY valid JSON matching the requested schema. Never invent values — if a field is not clearly stated on the page, use null.

Context about Conestoga College: The institutional default English requirement is IELTS Academic 6.5 (no band below 6.0), TOEFL iBT 88, Duolingo 120, PTE 58, CAEL 60. IT and engineering programs may require different scores. Use program-specific English requirements when the page states them. If the page does not state a program-specific requirement, you MAY apply the institutional default BUT mark field_confidence.english_admission_tests = "medium". Graduate certificates require a prior diploma/degree — capture that in prerequisites.`;

const USER_INSTRUCTIONS = `Extract the following fields as JSON:
{
  "name": string,
  "credential": "Ontario College Certificate" | "Ontario College Diploma" | "Ontario College Advanced Diploma" | "Ontario College Graduate Certificate" | "Bachelor Degree" | string | null,
  "campus_city": string | null,
  "field_area": string | null,
  "duration_months": number | null,
  "has_coop": boolean | null,
  "pgwp_eligible": "yes" | "no" | "unclear" | null,
  "pgwp_basis": string | null,
  "prerequisites": string | null,
  "english_admission_tests": { "IELTS_Academic"?: string, "TOEFL_iBT"?: string, "Duolingo"?: string, "PTE"?: string, "CAEL"?: string } | null,
  "min_grade": string | null,
  "tuition_intl_year": number | null,
  "application_url": string | null,
  "confidence": "high" | "medium" | "low",
  "field_confidence": { [field: string]: "high" | "medium" | "low" },
  "notes": string | null
}
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

async function callAnthropic(apiKey: string, url: string, pageText: string) {
  const body = {
    model: MODEL,
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
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

  const results: any[] = [];
  for (const t of TARGETS) {
    const row: any = {
      name: t.name,
      institution_id: null,
      raw_source_url: t.url,
      extracted_at: new Date().toISOString(),
      review_status: "needs_review",
      review_notes: "Conestoga College (pilot). ",
    };
    try {
      if (!t.url) throw new Error("no url");
      const pageText = await fetchPage(t.url);
      const extracted = await callAnthropic(apiKey, t.url, pageText);
      row.name = extracted.name ?? t.name;
      row.credential = extracted.credential ?? null;
      row.campus_city = extracted.campus_city ?? null;
      row.field_area = extracted.field_area ?? null;
      row.duration_months = extracted.duration_months ?? null;
      row.has_coop = extracted.has_coop ?? null;
      row.pgwp_eligible = extracted.pgwp_eligible === "yes" ? true : extracted.pgwp_eligible === "no" ? false : null;
      row.pgwp_basis = extracted.pgwp_basis ?? null;
      row.prerequisites = extracted.prerequisites ?? null;
      row.english_admission_tests = extracted.english_admission_tests ?? null;
      row.min_grade = extracted.min_grade ?? null;
      row.tuition_intl_year = extracted.tuition_intl_year ?? null;
      row.application_url = extracted.application_url ?? null;
      row.confidence = extracted.confidence ?? "medium";
      row.field_confidence = extracted.field_confidence ?? null;
      row.review_notes += extracted.notes ? `AI notes: ${extracted.notes}` : "extracted via Anthropic";
    } catch (e) {
      row.confidence = "low";
      row.review_notes += `página não localizada automaticamente ou falha de extração — verificar URL. Erro: ${(e as Error).message}`;
    }

    const { data, error } = await supabase.from("programs_staging").insert(row).select().single();
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
        review_status: data.review_status,
        review_notes: data.review_notes,
      });
    }
  }

  return new Response(JSON.stringify({ ok: true, count: results.length, results }, null, 2), {
    headers: { ...corsHeaders, "content-type": "application/json" },
  });
});