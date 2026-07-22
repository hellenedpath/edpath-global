import {
  AvatarOpeningPath,
  AvatarCompassPoint,
  AvatarWaypointTrail,
} from "@/components/assistant/AvatarOptions";

type Option = {
  name: string;
  concept: string;
  Mark: React.ComponentType<{ className?: string }>;
};

const OPTIONS: Option[] = [
  {
    name: "Option 1 — Opening Path",
    concept:
      "A single stroke opens and branches, suggesting clarity emerging from one starting point. The crimson dot marks the destination.",
    Mark: AvatarOpeningPath,
  },
  {
    name: "Option 2 — Compass Point",
    concept:
      "An abstract four-point navigator mark. Thin lines, no circle or letters. The north point is crimson.",
    Mark: AvatarCompassPoint,
  },
  {
    name: "Option 3 — Waypoint Trail",
    concept:
      "Four nodes connected by a rising line, like a journey. The final waypoint is crimson and slightly emphasized.",
    Mark: AvatarWaypointTrail,
  },
];

function Card({ option }: { option: Option }) {
  const { name, concept, Mark } = option;
  return (
    <section className="rounded-2xl border border-navy/15 bg-white p-8 space-y-6">
      <header>
        <h2 className="font-heading text-2xl font-bold text-navy">{name}</h2>
        <p className="mt-2 text-sm text-navy/70 leading-relaxed max-w-2xl">{concept}</p>
      </header>

      {/* Size scale */}
      <div>
        <p className="text-xs uppercase tracking-wide text-navy/50 mb-3">
          Scale · navy on white
        </p>
        <div className="flex items-end gap-8 text-navy">
          <div className="flex flex-col items-center gap-2">
            <Mark className="h-6 w-6" />
            <span className="text-[11px] text-navy/50">24px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Mark className="h-10 w-10" />
            <span className="text-[11px] text-navy/50">40px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Mark className="h-14 w-14" />
            <span className="text-[11px] text-navy/50">56px</span>
          </div>
        </div>
      </div>

      {/* Floating bubble preview */}
      <div>
        <p className="text-xs uppercase tracking-wide text-navy/50 mb-3">
          Floating chat bubble · 56px
        </p>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white shadow-lg ring-2 ring-[#E0405B]/60">
          <Mark className="h-6 w-6" />
        </div>
      </div>

      {/* Inline next to message bubble */}
      <div>
        <p className="text-xs uppercase tracking-wide text-navy/50 mb-3">
          Inline with assistant message · 24px
        </p>
        <div className="flex items-start gap-3">
          <span className="text-navy mt-2">
            <Mark className="h-6 w-6" />
          </span>
          <div className="max-w-md rounded-2xl rounded-bl-sm border border-navy/10 bg-white px-3 py-2 text-sm text-navy leading-relaxed shadow-sm">
            Sample assistant reply: this is how the mark reads next to a real chat message
            bubble at 24px.
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AvatarPreview() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-3xl px-6 space-y-10">
        <header>
          <h1 className="font-heading text-3xl font-bold text-navy">
            EdPath Assistant — Avatar Exploration
          </h1>
          <p className="mt-2 font-body text-sm text-navy/70 leading-relaxed">
            Three candidate marks compared side by side at real sizes. Internal preview
            only — nothing on the live assistant has changed.
          </p>
        </header>

        <div className="space-y-8">
          {OPTIONS.map((o) => (
            <Card key={o.name} option={o} />
          ))}
        </div>
      </div>
    </div>
  );
}