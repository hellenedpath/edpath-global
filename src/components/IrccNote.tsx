import { Info, ExternalLink } from "lucide-react";

type Props = {
  /** Optional link to specific IRCC page for extra context */
  href?: string;
  linkLabel?: string;
  className?: string;
};

/**
 * Small, reusable badge/note used across the site to remind users that
 * immigration content is general guidance, not individual advice.
 */
export default function IrccNote({
  href,
  linkLabel = "Ver página oficial do IRCC",
  className = "",
}: Props) {
  return (
    <div
      className={`flex items-start gap-2 rounded-md border border-azul/30 bg-azul/5 p-3 text-xs md:text-sm leading-relaxed text-navy ${className}`}
    >
      <Info className="h-4 w-4 mt-0.5 shrink-0 text-azul" />
      <p>
        <span className="font-medium">Informação geral, não confirma seu caso.</span>{" "}
        Confirme no IRCC oficial ou com um consultor RCIC licenciado.
        {href && (
          <>
            {" "}
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-azul hover:underline"
            >
              {linkLabel}
              <ExternalLink className="h-3 w-3" />
            </a>
          </>
        )}
      </p>
    </div>
  );
}