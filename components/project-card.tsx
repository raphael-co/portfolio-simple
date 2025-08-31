import Link from "next/link";
import SpotlightCard from "@/components/spotlight-card";

export default function ProjectCard({
  title,
  description,
  href,
  stack,
  onTagClick,
}: {
  title: string;
  description: string;
  href?: string;
  stack?: string[];
  onTagClick?: (tag: string) => void;
}) {
  return (
    <SpotlightCard className="h-full flex flex-col transition-transform hover:-translate-y-0.5">
      <div className="flex flex-col flex-1">
        <h3 className="text-lg font-semibold">{title}</h3>

        <p
          className="mt-2 opacity-80"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </p>

        {stack && stack.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {stack.map((s) =>
              onTagClick ? (
                <button
                  key={s}
                  type="button"
                  onClick={() => onTagClick(s)}
                  className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
                  aria-label={`Filtrer par ${s}`}
                  title={`Filtrer par ${s}`}
                >
                  {s}
                  <span className="opacity-50">#</span>
                </button>
              ) : (
                <span
                  key={s}
                  className="inline-block rounded-full border px-3 py-1 text-xs dark:border-white/10"
                >
                  {s}
                </span>
              )
            )}
          </div>
        )}

        <div className="mt-auto" />
      </div>

      {href && (
        <Link href={href} className="mt-4 inline-flex text-brand hover:underline self-start">
          Voir le projet ↗
        </Link>
      )}
    </SpotlightCard>
  );
}
