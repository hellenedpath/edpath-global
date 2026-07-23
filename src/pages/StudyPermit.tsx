import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import bannerPermit from "@/assets/banner-permit.jpg";
import {
  AlertTriangle,
  ExternalLink,
  FileText,
  Shield,
  ShieldAlert,
  Building2,
  Globe2,
} from "lucide-react";

function SourceLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer external"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--azul))] hover:underline"
    >
      {label}
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}

type Step = {
  n: number;
  title: string;
  body: string;
  link?: { href: string; label: string };
};

type ScamLink = { label: string; href: string };

type ScamSection = {
  title: string;
  intro: string;
  rights: { title: string; items: string[] };
  redFlags: { title: string; items: string[] };
  protect: { title: string; items: string[] };
  victim: { title: string; body: string };
  links: { title: string; items: ScamLink[] };
  seal: { title: string; body: string };
};

type EmbassyGroupKey = "latam" | "africa" | "caribbean";
type Embassy = {
  group: EmbassyGroupKey;
  namePt: string;
  nameEn: string;
  cityPt: string;
  cityEn: string;
  url: string;
};

const EMBASSIES: Embassy[] = [
  // Latin America
  { group: "latam", namePt: "Brasil", nameEn: "Brazil", cityPt: "Brasília", cityEn: "Brasília", url: "https://www.international.gc.ca/country-pays/brazil-bresil/brasilia.aspx?lang=eng" },
  { group: "latam", namePt: "México", nameEn: "Mexico", cityPt: "Cidade do México", cityEn: "Mexico City", url: "https://www.international.gc.ca/country-pays/mexico-mexique/mexico_city-mexico.aspx?lang=eng" },
  { group: "latam", namePt: "Colômbia", nameEn: "Colombia", cityPt: "Bogotá", cityEn: "Bogotá", url: "https://www.international.gc.ca/country-pays/colombia-colombie/bogota.aspx?lang=eng" },
  { group: "latam", namePt: "Argentina", nameEn: "Argentina", cityPt: "Buenos Aires", cityEn: "Buenos Aires", url: "https://www.international.gc.ca/country-pays/argentina-argentine/buenos_aires.aspx?lang=eng" },
  { group: "latam", namePt: "Chile", nameEn: "Chile", cityPt: "Santiago", cityEn: "Santiago", url: "https://www.international.gc.ca/country-pays/chile-chili/santiago.aspx?lang=eng" },
  { group: "latam", namePt: "Peru", nameEn: "Peru", cityPt: "Lima", cityEn: "Lima", url: "https://www.international.gc.ca/country-pays/peru-perou/lima.aspx?lang=eng" },
  { group: "latam", namePt: "Equador", nameEn: "Ecuador", cityPt: "Quito", cityEn: "Quito", url: "https://www.international.gc.ca/country-pays/ecuador-equateur/quito.aspx?lang=eng" },
  { group: "latam", namePt: "Bolívia", nameEn: "Bolivia", cityPt: "La Paz", cityEn: "La Paz", url: "https://www.international.gc.ca/country-pays/bolivia-bolivie/la_paz.aspx?lang=eng" },
  { group: "latam", namePt: "Uruguai", nameEn: "Uruguay", cityPt: "Montevidéu", cityEn: "Montevideo", url: "https://www.international.gc.ca/country-pays/uruguay/montevideo.aspx?lang=eng" },
  { group: "latam", namePt: "Costa Rica", nameEn: "Costa Rica", cityPt: "San José", cityEn: "San José", url: "https://www.international.gc.ca/country-pays/costa_rica/san_jose.aspx?lang=eng" },
  { group: "latam", namePt: "Guatemala", nameEn: "Guatemala", cityPt: "Cidade da Guatemala", cityEn: "Guatemala City", url: "https://www.international.gc.ca/country-pays/guatemala/guatemala_city.aspx?lang=eng" },
  { group: "latam", namePt: "República Dominicana", nameEn: "Dominican Republic", cityPt: "Santo Domingo", cityEn: "Santo Domingo", url: "https://www.international.gc.ca/country-pays/dominican_republic-republique_dominicaine/santo_domingo.aspx?lang=eng" },
  { group: "latam", namePt: "Cuba", nameEn: "Cuba", cityPt: "Havana", cityEn: "Havana", url: "https://www.international.gc.ca/country-pays/cuba/havana-la_havane.aspx?lang=eng" },
  // Africa
  { group: "africa", namePt: "Nigéria", nameEn: "Nigeria", cityPt: "Abuja", cityEn: "Abuja", url: "https://www.international.gc.ca/country-pays/nigeria/abuja.aspx?lang=eng" },
  { group: "africa", namePt: "Quênia", nameEn: "Kenya", cityPt: "Nairóbi", cityEn: "Nairobi", url: "https://www.international.gc.ca/country-pays/kenya/nairobi.aspx?lang=eng" },
  { group: "africa", namePt: "Gana", nameEn: "Ghana", cityPt: "Acra", cityEn: "Accra", url: "https://www.international.gc.ca/country-pays/ghana/accra.aspx?lang=eng" },
  { group: "africa", namePt: "África do Sul", nameEn: "South Africa", cityPt: "Pretória", cityEn: "Pretoria", url: "https://www.international.gc.ca/country-pays/south_africa-afrique_sud/pretoria.aspx?lang=eng" },
  { group: "africa", namePt: "Egito", nameEn: "Egypt", cityPt: "Cairo", cityEn: "Cairo", url: "https://www.international.gc.ca/country-pays/egypt-egypte/cairo-caire.aspx?lang=eng" },
  { group: "africa", namePt: "Marrocos", nameEn: "Morocco", cityPt: "Rabat", cityEn: "Rabat", url: "https://www.international.gc.ca/country-pays/morocco-maroc/rabat.aspx?lang=eng" },
  { group: "africa", namePt: "Etiópia", nameEn: "Ethiopia", cityPt: "Adis Abeba", cityEn: "Addis Ababa", url: "https://www.international.gc.ca/country-pays/ethiopia-ethiopie/addis_ababa-addis-abeba.aspx?lang=eng" },
  { group: "africa", namePt: "Senegal", nameEn: "Senegal", cityPt: "Dakar", cityEn: "Dakar", url: "https://www.international.gc.ca/country-pays/senegal/dakar.aspx?lang=eng" },
  { group: "africa", namePt: "Tanzânia", nameEn: "Tanzania", cityPt: "Dar es Salaam", cityEn: "Dar es Salaam", url: "https://www.international.gc.ca/country-pays/tanzania-tanzanie/dar_es_salaam.aspx?lang=eng" },
  { group: "africa", namePt: "Camarões", nameEn: "Cameroon", cityPt: "Yaoundé", cityEn: "Yaoundé", url: "https://www.international.gc.ca/country-pays/cameroon-cameroun/yaounde.aspx?lang=eng" },
  // Caribbean
  { group: "caribbean", namePt: "Jamaica", nameEn: "Jamaica", cityPt: "Kingston", cityEn: "Kingston", url: "https://www.international.gc.ca/country-pays/jamaica-jamaique/kingston.aspx?lang=eng" },
  { group: "caribbean", namePt: "Trinidad e Tobago", nameEn: "Trinidad and Tobago", cityPt: "Port of Spain", cityEn: "Port of Spain", url: "https://www.international.gc.ca/country-pays/trinidad_tobago-trinite_tobago/port_of_spain-port_d_espagne.aspx?lang=eng" },
  { group: "caribbean", namePt: "Barbados", nameEn: "Barbados", cityPt: "Bridgetown", cityEn: "Bridgetown", url: "https://www.international.gc.ca/country-pays/barbados-barbade/bridgetown.aspx?lang=eng" },
  { group: "caribbean", namePt: "Haiti", nameEn: "Haiti", cityPt: "Port-au-Prince", cityEn: "Port-au-Prince", url: "https://www.international.gc.ca/country-pays/haiti/port_au_prince.aspx?lang=eng" },
];

export default function StudyPermit() {
  const { t, i18n } = useTranslation();
  const steps = t("studyPermit.steps", { returnObjects: true }) as Step[];
  const scam = t("studyPermit.scamProtection", { returnObjects: true }) as ScamSection;
  const isPt = i18n.language?.toLowerCase().startsWith("pt");
  const groupOrder: EmbassyGroupKey[] = ["latam", "africa", "caribbean"];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy text-primary-foreground overflow-hidden">
        <img
          src={bannerPermit}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-[center_50%] opacity-40"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, hsl(228 70% 12%) 0%, hsl(228 65% 14% / 0.85) 55%, hsl(228 55% 20% / 0.35) 100%)",
          }}
        />
        <div className="container relative py-20 md:py-28 max-w-5xl">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary-foreground/70 mb-6">
            <span className="w-6 h-px bg-crimson" />
            {t("studyPermit.hero.tag")}
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight text-white">
            {t("studyPermit.hero.title")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-2xl leading-relaxed">
            {t("studyPermit.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="container py-12 md:py-16 max-w-4xl">
        <Alert className="border-azul/30 bg-azul/5">
          <ShieldAlert className="h-5 w-5 text-azul" />
          <AlertTitle className="font-display text-navy text-lg">
            {t("studyPermit.intro.title")}
          </AlertTitle>
          <AlertDescription className="text-muted-foreground mt-2 leading-relaxed">
            {t("studyPermit.intro.body")}
          </AlertDescription>
        </Alert>
      </section>

      {/* Steps */}
      <section className="container pb-8 max-w-4xl">
        <ol className="space-y-5">
          {steps.map((s) => (
            <li
              key={s.n}
              className="rounded-lg border border-border bg-card p-6 md:p-7 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-crimson font-display text-lg font-semibold">
                  {s.n}
                </span>
                <div className="flex-1">
                  <h2 className="font-display text-xl md:text-2xl text-navy font-semibold">
                    {s.title}
                  </h2>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    {s.body}
                  </p>
                  {s.link && (
                    <div className="mt-3">
                      <SourceLink href={s.link.href} label={s.link.label} />
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Official links */}
      <section className="container py-16 max-w-4xl">
        <div className="rounded-lg border border-border bg-muted/40 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-10 h-10 text-azul">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="font-display text-2xl text-navy font-semibold">
              {t("studyPermit.links.title")}
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {t("studyPermit.links.body")}
          </p>
          <ul className="mt-5 flex flex-col gap-3">
            <li>
              <SourceLink
                href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/apply.html"
                label={t("studyPermit.links.apply")}
              />
            </li>
            <li>
              <SourceLink
                href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents.html"
                label={t("studyPermit.links.documents")}
              />
            </li>
            <li>
              <SourceLink
                href="https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/apply.html"
                label={t("studyPermit.links.visaOffice")}
              />
            </li>
          </ul>
        </div>
      </section>

      {/* Scam protection */}
      <section className="container py-16 md:py-20 max-w-5xl">
        {/* placeholder anchor kept */}
      </section>
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center justify-center w-10 h-10 text-crimson">
              <Shield className="w-5 h-5" />
            </span>
            <h2 className="font-display text-2xl md:text-3xl text-navy font-semibold">
              {scam.title}
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed max-w-3xl">
            {scam.intro}
          </p>

          {/* Rights */}
          <div className="mt-10">
            <h3 className="font-display text-xl text-navy font-semibold mb-4">
              {scam.rights.title}
            </h3>
            <ul className="grid md:grid-cols-3 gap-4">
              {scam.rights.items.map((item, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-border bg-card p-5 shadow-sm"
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Red flags */}
          <div className="mt-10">
            <h3 className="font-display text-xl text-navy font-semibold mb-4">
              {scam.redFlags.title}
            </h3>
            <ul className="grid sm:grid-cols-2 gap-4">
              {scam.redFlags.items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-crimson/20 bg-crimson/5 p-4"
                >
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-crimson/15 text-crimson text-xs font-bold">
                    !
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* How to protect */}
          <div className="mt-10">
            <h3 className="font-display text-xl text-navy font-semibold mb-4">
              {scam.protect.title}
            </h3>
            <ul className="grid md:grid-cols-2 gap-4">
              {scam.protect.items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-4"
                >
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-azul/15 text-azul text-xs font-bold">
                    {i + 1}
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Victim */}
          <div className="mt-10 rounded-lg border border-border bg-card p-6">
            <h3 className="font-display text-lg text-navy font-semibold mb-2">
              {scam.victim.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {scam.victim.body}
            </p>
          </div>

          {/* Scam official links */}
          <div className="mt-10">
            <h3 className="font-display text-xl text-navy font-semibold mb-4">
              {scam.links.title}
            </h3>
            <ul className="flex flex-col gap-3">
              {scam.links.items.map((item, i) => (
                <li key={i}>
                  <SourceLink href={item.href} label={item.label} />
                </li>
              ))}
            </ul>
          </div>

          {/* Scam seal */}
          <div className="mt-10 rounded-lg border border-azul/30 bg-azul/5 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-azul shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display text-lg text-navy font-semibold">
                  {scam.seal.title}
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {scam.seal.body}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seal */}
      <section className="bg-navy text-white">
        <div className="container py-12 md:py-14 max-w-5xl">
          <div className="flex items-start gap-3 max-w-4xl mx-auto">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl md:text-2xl font-semibold text-white">
                {t("studyPermit.seal.title")}
              </h2>
              <p className="mt-3 text-white/80 leading-relaxed">
                {t("studyPermit.seal.body")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}