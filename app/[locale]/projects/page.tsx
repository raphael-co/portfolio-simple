import { Section } from "@/components/ui";
import ProjectsFilter from "@/components/projects-filter";
import { getDict, type Locale } from "@/lib/i18n";
import { getProjects } from "@/lib/data";

export const metadata = { title: "Projets — Raphael Comandon" };

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDict(locale);
  const projects = getProjects(locale);

  return (
    <Section className="py-12">
      <h1 className="mb-6 text-2xl font-semibold">{dict.projects_title}</h1>
      <ProjectsFilter projects={projects} dict={dict} />
    </Section>
  );
}
