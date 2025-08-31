"use client";

import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "@/components/project-card";

type Project = {
  title: string;
  href?: string;
  description: string;
  stack?: string[];
};

export default function ProjectsFilter({
  projects,
  dict,
}: {
  projects: Project[];
  dict?: Record<string, string>;
}) {
  const allTags = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.stack?.forEach((s) => set.add(s)));
    return [dict?.filter_all ?? "Tous", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [projects, dict]);

  const ALL = dict?.filter_all ?? "Tous";

  const [query, setQuery] = useState("");
  const [tag, setTag] = useState(ALL);

  const onTagClick = useCallback((t: string) => {
    setTag(t);
    setQuery("");
  }, []);

  const clearFilters = () => {
    setTag(ALL);
    setQuery("");
  };

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchTag = tag === ALL || p.stack?.includes(tag);
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.stack || []).some((s) => s.toLowerCase().includes(q));
      return matchTag && matchQuery;
    });
  }, [projects, query, tag, ALL]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={dict?.search_projects_placeholder ?? "Rechercher un projet…"}
          className="w-full max-w-sm rounded-xl border px-3 py-2 text-sm dark:border-white/10"
        />

        <div className="flex flex-wrap gap-2">
          {allTags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTag(t)}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                tag === t
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "hover:bg-black/5 dark:border-white/10"
              }`}
              aria-pressed={tag === t}
            >
              {t}
            </button>
          ))}
        </div>

        {(tag !== ALL || query) && (
          <button
            type="button"
            onClick={clearFilters}
            className="ml-auto rounded-full border px-3 py-1 text-xs hover:bg-black/5 dark:border-white/10"
            title="Réinitialiser les filtres"
          >
            Réinitialiser
          </button>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div
          layout
          className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((p, i) => (
            <motion.div
              key={p.title}
              layout
              className="h-full"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, delay: i * 0.02 }}
            >
              <ProjectCard {...p} onTagClick={onTagClick} />
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <p className="opacity-70">
              {dict?.no_results ?? "Aucun projet ne correspond à la recherche."}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
