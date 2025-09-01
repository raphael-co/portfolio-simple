"use client";
import Hero from "@/components/hero";
import { Section, Badge } from "@/components/ui";
import { education, getSkills } from "@/lib/data";
import Link from "next/link";
import AnimatedStats from "@/components/animated-stats";
import Reveal from "@/components/reveal";
import { getDict, type Locale } from "@/lib/i18n";
import SpotlightCard from "@/components/spotlight-card";
import { usePathname } from "next/navigation";

export default function Home({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const skills = getSkills(locale);
  const pathname = usePathname();

    const segments = pathname?.split("/") || [];
  const currentLocale: Locale =
    segments[1] === "en" || segments[1] === "fr" ? (segments[1] as Locale) : locale;
  const href = (l: string, p: string = "") => `/${l}/${p}`.replace(/\/$/, "");

  return (
    <div>
      <Hero locale={locale} />

      <Reveal>
        <Section className="grid gap-6 py-16 md:grid-cols-3">
          <SpotlightCard className="md:col-span-2">
            <h2 className="text-xl font-semibold">{dict.skills_title}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="font-medium">{dict.skills_languages}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {skills.languages.map((s, i) => (
                    <Badge key={i}>{s}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium">{dict.skills_frameworks}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {skills.frameworks.map((s, i) => (
                    <Badge key={i}>{s}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium">{dict.skills_databases}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {skills.databases.map((s, i) => (
                    <Badge key={i}>{s}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium">{dict.skills_tools}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {skills.tools.map((s, i) => (
                    <Badge key={i}>{s}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium">{dict.skills_virtualization}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {skills.virtualization.map((s, i) => (
                    <Badge key={i}>{s}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium">{dict.skills_lang_interests}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {skills.languagesSpoken.map((s, i) => (
                    <Badge key={i}>{s}</Badge>
                  ))}
                  {skills.interests.map((s, i) => (
                    <Badge key={i}>{s}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard>
            <h2 className="text-xl font-semibold">{dict.education_title}</h2>
            <ul className="mt-3 space-y-3">
              {education.map((e, i) => (
                <li key={i}>
                  <p className="font-medium">{e.title}</p>
                  <p className="text-sm opacity-80">
                    {e.school} — {e.place}
                  </p>
                  <p className="text-sm opacity-70">{e.period}</p>
                </li>
              ))}
            </ul>
            <Link
              href={href(currentLocale, "experience")}
              className="mt-4 inline-flex text-brand hover:underline"
            >
              {dict.view_experience} ↗
            </Link>
          </SpotlightCard>
        </Section>
      </Reveal>

      <AnimatedStats locale={locale} />
      <Section bleed className="py-2" />
    </div>
  );
}
