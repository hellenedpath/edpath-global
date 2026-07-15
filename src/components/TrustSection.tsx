import { useTranslation } from "react-i18next";
import { ShieldCheck, FileCheck, Compass } from "lucide-react";
import trustStudents from "@/assets/trust-students.jpg";

const icons = [ShieldCheck, FileCheck, Compass];

export function TrustSection() {
  const { t } = useTranslation();
  const items = t("home.trust.items", { returnObjects: true }) as Array<{
    title: string;
    content: string;
  }>;

  return (
    <section className="bg-background py-24 md:py-32">
      <div className="container max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative order-1 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_-20px_rgba(5,21,86,0.18)]">
              <img
                src={trustStudents}
                alt=""
                width={1200}
                height={675}
                className="w-full h-auto aspect-[4/3] object-cover"
              />
            </div>
            <div
              className="absolute -z-10 -bottom-6 -right-6 w-3/5 h-3/5 rounded-2xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 70% 70%, hsl(var(--crimson) / 0.12), transparent 60%)",
              }}
            />
          </div>

          <div className="order-2 lg:order-2">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-10">
              {t("home.trust.title")}
            </h2>
            <div className="space-y-8">
              {items.map((item, index) => {
                const Icon = icons[index];
                return (
                  <div key={index} className="flex gap-5">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-navy" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
