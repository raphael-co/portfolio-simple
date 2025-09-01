// app/[locale]/projects/page.tsx
import type { Metadata } from "next";
import ProjectsFilter from "@/components/projects-filter";
import { getDict, type Locale } from "@/lib/i18n";
import { DOMAIN } from "@/lib/site";
import { getProjects } from "@/lib/data";
import { Section } from "@/components/ui";


type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "fr" ? "Projets — Raphael Comandon" : "Projects — Raphael Comandon";
  const description =
    locale === "fr"
      ? "Mes projets récents en React/Next.js, Node.js et TypeScript."
      : "My recent projects in React/Next.js, Node.js and TypeScript.";

  const basePath = locale === "fr" ? "/fr/projects" : "/en/projects";

  return {
    title,
    description,
    alternates: {
      canonical: `${DOMAIN}${basePath}`,
      languages: {
        fr: `${DOMAIN}/fr/projects`,
        en: `${DOMAIN}/en/projects`,
        "x-default": `${DOMAIN}/fr/projects`,
      },
    },
    openGraph: {
      url: `${DOMAIN}${basePath}`,
      title,
      description,
      images: [{ url: `${DOMAIN}${basePath}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${DOMAIN}${basePath}/opengraph-image`],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const dict = getDict(locale);
  const projects = getProjects(locale);

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${DOMAIN}/${locale}` },
      { "@type": "ListItem", "position": 2, "name": "Projects", "item": `${DOMAIN}/${locale}/projects` }
    ]
  };

  return (
    <Section className="py-12">
      <h1 className="mb-6 text-2xl font-semibold">{dict.projects_title}</h1>
      <ProjectsFilter projects={projects} dict={dict} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
    </Section>
  );
}
