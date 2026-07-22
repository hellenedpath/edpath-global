import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";

const SYSTEM_PROMPT = `You are "EdPath Assistant", the AI assistant of EdPath Global — a platform that helps international students navigate studying abroad, starting with Canada.

CORE RULES (non-negotiable):

1. GROUNDING: Answer only from the "VERIFIED EDPATH DATA" block provided in the conversation, plus general, uncontroversial background knowledge about how studying abroad works. Never invent specific numbers, tuition figures, deadlines, admission requirements, PGWP eligibility, or program details. If the data block does not contain the answer, say so plainly and point the student to the official source. Never guess.

2. CITE THE SOURCE: Whenever giving a concrete data point (tuition, requirement, PGWP eligibility, proof of funds, program detail), state where it comes from and link the official URL when available. If the source has a valid_as_of date, mention it.

3. NOT IMMIGRATION ADVICE: EdPath provides educational information and orientation, never personalized immigration advice. For any question about a personal case — PR chances, visa refusal, "will I get approved", "what should I do to immigrate", family sponsorship, appeals — do not speculate. Explain the general public rule if it is verified, then direct the student to a Regulated Canadian Immigration Consultant (RCIC) or an immigration lawyer. Always use the correct terms "regulated immigration consultant (RCIC)" or "immigration lawyer" — NEVER the word "agent" or "agency".

4. PGWP CARE: PGWP field-of-study rules changed and many college business/management programs no longer qualify. Never state a program is PGWP-eligible unless the data block says so. When uncertain, say it is not confirmed and link the official IRCC page (https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation.html).

5. NEVER CLAIM PARTNERSHIP: EdPath is not an official partner, representative, or authorized agent of any institution. Never imply otherwise.

6. LANGUAGE: Detect the language of the user's message and reply in that same language — Portuguese, English, or Spanish. Match it naturally, do not announce the detection.

7. TONE: Clear, warm, direct, confident. Short paragraphs. No jargon. Students may be anxious and overwhelmed — the job is to reduce noise and give clarity, not to add more information. Never oversell, never make promises, never say something is "easy" or "guaranteed".

8. SCOPE: EdPath is global; Canada is the first country. If asked about a country with no data yet, say the guide is coming and offer what exists.

Format: use short paragraphs and markdown lists when useful. Include links as markdown [label](url).`;

const STOPWORDS = new Set([
  "the","a","an","and","or","of","in","to","for","on","is","are","do","does","how","what","which","that","this","with","from","by","at","as","it","i","you","my","me","we","us","our","your","can","should","would","will","be","have","has","had","not","no","yes","um","uma","o","os","as","de","do","da","dos","das","em","no","na","para","por","com","que","e","é","ser","tem","ter","como","qual","quais","onde","quando","quanto","quantos","meu","minha","posso","preciso","el","la","los","las","un","una","y","o","de","del","en","por","para","con","que","es","como","cual","donde","cuando","cuanto",
]);

function extractKeywords(text: string): string[] {
  const clean = text.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, " ");
  const words = clean.split(/\s+/).filter((w) => w.length >= 3 && !STOPWORDS.has(w));
  return Array.from(new Set(words)).slice(0, 12);
}

function orIlike(field: string, keywords: string[]): string {
  return keywords.map((k) => `${field}.ilike.%${k}%`).join(",");
}

async function buildContext(supabase: any, latestUserMessage: string) {
  const keywords = extractKeywords(latestUserMessage);
  const hasKeywords = keywords.length > 0;

  const [programsRes, institutionsRes, cipRes, hsRes, occRes, sourcesRes] = await Promise.all([
    hasKeywords
      ? supabase
          .from("programs")
          .select(
            "name,credential,campus_city,field_area,duration_months,has_coop,pgwp_eligible,pgwp_basis,prerequisites,english_admission_tests,min_grade,tuition_intl_year,application_url,intl_office_url,book_meeting_url,institutions(display_name,name,province,city,website,type)",
          )
          .or(
            [
              orIlike("name", keywords),
              orIlike("field_area", keywords),
            ].join(","),
          )
          .limit(25)
      : supabase
          .from("programs")
          .select(
            "name,credential,campus_city,field_area,duration_months,pgwp_eligible,tuition_intl_year,application_url,institutions(display_name,name,province,city,type)",
          )
          .limit(10),
    hasKeywords
      ? supabase
          .from("institutions")
          .select("*")
          .or(
            [
              orIlike("name", keywords),
              orIlike("display_name", keywords),
              orIlike("city", keywords),
              orIlike("province", keywords),
            ].join(","),
          )
          .limit(15)
      : supabase.from("institutions").select("*").limit(10),
    hasKeywords
      ? supabase
          .from("cip_codes")
          .select("*")
          .or(
            [
              orIlike("title", keywords),
              orIlike("description", keywords),
              orIlike("category", keywords),
            ].join(","),
          )
          .limit(10)
      : Promise.resolve({ data: [] }),
    hasKeywords
      ? supabase
          .from("high_schools")
          .select("*")
          .or(
            [
              orIlike("name", keywords),
              orIlike("city", keywords),
              orIlike("province", keywords),
            ].join(","),
          )
          .limit(10)
      : Promise.resolve({ data: [] }),
    hasKeywords
      ? supabase
          .from("occupations")
          .select("*")
          .or([orIlike("title", keywords), orIlike("noc_code", keywords)].join(","))
          .limit(10)
      : Promise.resolve({ data: [] }),
    supabase.from("sources").select("url,type,valid_as_of,last_checked,title,notes"),
  ]);

  return {
    keywords,
    programs: programsRes.data ?? [],
    institutions: institutionsRes.data ?? [],
    cip_codes: cipRes.data ?? [],
    high_schools: hsRes.data ?? [],
    occupations: occRes.data ?? [],
    sources: sourcesRes.data ?? [],
  };
}

function friendlyError(locale: string | undefined): string {
  const l = (locale ?? "").toLowerCase();
  if (l.startsWith("es"))
    return "Lo siento, tuve un problema para responder ahora. Intenta de nuevo en unos segundos.";
  if (l.startsWith("en"))
    return "Sorry, I had trouble answering right now. Please try again in a few seconds.";
  return "Desculpe, tive um problema para responder agora. Tente novamente em alguns segundos.";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  let locale: string | undefined;
  try {
    const body = await req.json();
    locale = body?.locale;
    const messages: Array<{ role: string; content: string }> = Array.isArray(body?.messages)
      ? body.messages
      : [];
    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "no messages" }), {
        status: 400,
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }
    if (!apiKey) throw new Error("missing ANTHROPIC_API_KEY");

    const supabase = createClient(supabaseUrl, serviceKey);
    const latestUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
    const context = await buildContext(supabase, latestUser);

    // Inject the verified data block into the last user turn
    const anthropicMessages = messages.map((m, i) => ({ role: m.role, content: m.content }));
    const lastUserIdx = (() => {
      for (let i = anthropicMessages.length - 1; i >= 0; i--) {
        if (anthropicMessages[i].role === "user") return i;
      }
      return -1;
    })();
    if (lastUserIdx >= 0) {
      const dataBlock = `\n\n---\nVERIFIED EDPATH DATA (use only this for concrete facts; if missing, say so):\n${JSON.stringify(context)}\n---`;
      anthropicMessages[lastUserIdx] = {
        role: "user",
        content: anthropicMessages[lastUserIdx].content + dataBlock,
      };
    }

    const r = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: anthropicMessages,
      }),
    });
    const j = await r.json();
    if (!r.ok) {
      console.error("anthropic error", r.status, JSON.stringify(j).slice(0, 500));
      return new Response(
        JSON.stringify({ reply: friendlyError(locale), error: "upstream" }),
        { status: 200, headers: { ...corsHeaders, "content-type": "application/json" } },
      );
    }
    const reply: string = j?.content?.[0]?.text ?? "";

    // Collect any URLs cited in the retrieved sources for optional display
    const sources = (context.sources ?? [])
      .filter((s: any) => s?.url && reply.includes(s.url))
      .map((s: any) => ({ url: s.url, valid_as_of: s.valid_as_of, type: s.type }));

    return new Response(JSON.stringify({ reply, sources }), {
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  } catch (e) {
    console.error("edpath-assistant error", (e as Error).message);
    return new Response(
      JSON.stringify({ reply: friendlyError(locale), error: (e as Error).message }),
      { status: 200, headers: { ...corsHeaders, "content-type": "application/json" } },
    );
  }
});