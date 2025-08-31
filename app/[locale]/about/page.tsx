import { Section } from "@/components/ui";
import Link from "next/link";
import { type Locale } from "@/lib/i18n";
import { profile, getSkills, getExperience, getAbout, getAboutFacts } from "@/lib/data";
import Facts from "@/components/about/facts";
import TechCloud from "@/components/about/tech-cloud";
import SpotlightCard from "@/components/spotlight-card";

export const metadata = { title: "About — Raphael Comandon" };

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const about = getAbout(locale);
  const skills = getSkills(locale);
  const facts = getAboutFacts(locale);
  const xp = getExperience(locale);

  const techCloud = [
    ...skills.languages,
    ...skills.frameworks,
    ...skills.databases,
    ...skills.tools,
  ];

  return (
    <Section className="py-12">
      <header className="space-y-2 md:space-y-3">
        <h1 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
          {about.title}
        </h1>
        <p className="max-w-3xl text-pretty text-sm opacity-80 sm:text-base">
          {about.intro}
        </p>
      </header>

      {/* Grille responsive : 1 col → 12 cols (8/4) */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Colonne principale */}
        <div className="min-w-0 space-y-6 lg:col-span-8">
          <SpotlightCard className="p-4 sm:p-5 md:p-6">
            <h2 className="text-lg font-semibold sm:text-xl">{about.sections.who}</h2>
            <p className="mt-2 text-pretty text-sm leading-relaxed opacity-85 sm:text-base">
              {profile.about}
            </p>
          </SpotlightCard>

          <SpotlightCard className="p-4 sm:p-5 md:p-6">
            <h2 className="text-lg font-semibold sm:text-xl">{about.sections.do}</h2>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm sm:text-base">
              {about.bullets.map((b, i) => (
                <li key={i} className="opacity-90">{b}</li>
              ))}
            </ul>
          </SpotlightCard>

          <SpotlightCard className="p-4 sm:p-5 md:p-6">
            <h2 className="text-lg font-semibold sm:text-xl">{about.sections.recent}</h2>
            <ul className="mt-3 space-y-3">
              {xp.slice(0, 2).map((e, i) => (
                <li
                  key={i}
                  className="rounded-xl border p-3 text-sm dark:border-white/10 sm:p-4 sm:text-base"
                >
                  <p className="font-medium break-words">{e.role} — {e.company}</p>
                  <p className="text-xs opacity-80 sm:text-sm">
                    {e.location} · {e.period}
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-xs opacity-90 sm:text-sm">
                    {e.bullets.slice(0, 3).map((b, j) => (
                      <li key={j} className="break-words">{b}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <Link
              href={`/${locale}/experience`}
              className="mt-4 inline-flex w-full justify-center rounded-full px-3 py-2 text-sm text-brand hover:underline sm:w-auto sm:px-0 sm:py-0 sm:text-base"
            >
              {locale === "fr" ? "Toute mon expérience" : "All experience"} ↗
            </Link>
          </SpotlightCard>

          <SpotlightCard className="p-4 sm:p-5 md:p-6">
            <h2 className="text-lg font-semibold sm:text-xl">{about.sections.cta}</h2>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={`/${locale}/projects`}
                className="w-full rounded-full border px-4 py-2 text-center text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10 sm:w-auto"
              >
                {about.buttons.viewProjects}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="w-full rounded-full bg-brand px-4 py-2 text-center text-sm font-medium text-white sm:w-auto"
              >
                {about.buttons.contact}
              </Link>
            </div>
          </SpotlightCard>
        </div>

        {/* Colonne latérale */}
        <aside className="min-w-0 space-y-6 lg:col-span-4 xl:sticky xl:top-20 xl:h-fit">
          <SpotlightCard className="p-4 sm:p-5 md:p-6">
            <h2 className="text-lg font-semibold sm:text-xl">
              {locale === "fr" ? "Infos" : "Info"}
            </h2>
            <Facts items={facts} />
          </SpotlightCard>

          <SpotlightCard className="p-4 sm:p-5 md:p-6">
            <h2 className="text-lg font-semibold sm:text-xl">{about.sections.stack}</h2>
            <div className="mt-3">
              <TechCloud tags={Array.from(new Set(techCloud))} />
            </div>
          </SpotlightCard>
        </aside>
      </div>
    </Section>
  );
}
