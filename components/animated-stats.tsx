"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { type Locale, getDict } from "@/lib/i18n";
import { getProjects, getSkills, getExperience, education } from "@/lib/data";
import { Briefcase, Rocket, Wrench, GraduationCap, Link2 } from "lucide-react";
import SpotlightCard from "./spotlight-card";

type Stat = {
  label: string;
  value: number;
  suffix?: string;
  sub?: string;
  icon?: React.ReactNode;
};

function AnimatedNumber({ value, play }: { value: number; play: boolean }) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 120, damping: 18, mass: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) {
      setDisplay(Math.round(value));
      return;
    }

    const unsub = spring.on("change", (v) => setDisplay(Math.round(v)));

    if (play) {
      mv.set(0);
      const t = setTimeout(() => mv.set(value), 120);
      return () => {
        unsub();
        clearTimeout(t);
      };
    } else {
      mv.set(0);
      setDisplay(0);
      return () => unsub();
    }
  }, [play, value, mv, spring]);

  return <span>{new Intl.NumberFormat().format(display)}</span>;
}

function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 14, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <SpotlightCard className="group relative h-full overflow-hidden px-4 py-5 shadow-sm transition hover:shadow-md">
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-black/5 to-transparent dark:from-white/5" />
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border p-2 dark:border-white/10">{stat.icon}</div>
          <p className="text-[0.8rem] font-medium opacity-70 md:text-sm">{stat.label}</p>
        </div>

        <div className="mt-2">
          <p className="text-3xl font-bold tracking-tight md:text-4xl">
            <AnimatedNumber value={stat.value} play={inView} />
            {stat.suffix ?? ""}
          </p>
          {stat.sub && <p className="mt-1 text-xs opacity-60 md:text-sm">{stat.sub}</p>}
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

export default function AnimatedStats({
  stats,
  locale,
}: {
  stats?: Stat[];
  locale: Locale;
}) {
  const dict = getDict(locale);

  const computed = useMemo<Stat[]>(() => {
    const skills = getSkills(locale);
    const projects = getProjects(locale);
    const xp = getExperience(locale);

    const years = xp
      .map((e) => {
        const m = e.period.match(/(20\d{2})/g);
        return m ? Math.min(...m.map(Number)) : undefined;
      })
      .filter(Boolean) as number[];
    const firstYear = years.length ? Math.min(...years) : new Date().getFullYear();
    const yearsExp = Math.max(0, new Date().getFullYear() - firstYear);

    const totalProjects = projects.length;
    const liveProjects = projects.filter((p) => p.href && p.href !== "#").length;

    const toolset = new Set([
      ...skills.languages,
      ...skills.frameworks,
      ...skills.databases,
      ...skills.tools,
    ]);
    const toolCount = toolset.size;

    const degrees = education.length;

    const fr = locale === "fr";
    return [
      {
        label: dict.stats_years || (fr ? "Années d’expérience" : "Years of experience"),
        value: yearsExp,
        suffix: "+",
        sub: fr ? `depuis ${firstYear}` : `since ${firstYear}`,
        icon: <Briefcase className="h-5 w-5" />,
      },
      {
        label: dict.stats_projects || (fr ? "Projets livrés" : "Delivered projects"),
        value: totalProjects,
        sub: fr ? "sélection publique + privé" : "public + private selection",
        icon: <Rocket className="h-5 w-5" />,
      },
      {
        label: dict.stats_techs || (fr ? "Techs approchées" : "Technologies used"),
        value: toolCount,
        sub: fr ? "outils & pratiques du quotidien" : "everyday tools & practices",
        icon: <Wrench className="h-5 w-5" />,
      },
      {
        label: fr ? "Projets en ligne" : "Live projects",
        value: liveProjects,
        sub: fr ? "avec lien public" : "with public link",
        icon: <Link2 className="h-5 w-5" />,
      },
      {
        label: fr ? "Diplômes" : "Degrees",
        value: degrees,
        sub: fr ? "formation et certifications" : "education & certifications",
        icon: <GraduationCap className="h-5 w-5" />,
      },
    ];
  }, [locale, dict]);

  const resolved = (stats && stats.length ? stats : computed).slice(0, 5);

  return (
    <section
      className="container mx-auto px-4 py-8 sm:py-10 md:py-12"
      aria-label={locale === "fr" ? "Chiffres clés" : "Key figures"}
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {resolved.map((s, i) => (
          <StatCard key={s.label} stat={s} index={i} />
        ))}
      </div>
    </section>
  );
}
