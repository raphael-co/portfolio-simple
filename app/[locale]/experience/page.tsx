import ExperienceList from "@/components/experience-list";
import { Section } from "@/components/ui";
import { getExperience } from "@/lib/data";
import { getDict, type Locale } from "@/lib/i18n";

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDict(locale);
  const items = getExperience(locale);

  return (
    <Section className="py-12">
      <h1 className="mb-6 text-2xl font-semibold">{dict.experience_title}</h1>
      <ExperienceList items={items} />
    </Section>
  );
}
