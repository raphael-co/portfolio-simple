import { TechItem } from "@/components/TechMarquee";
import type { Locale } from "@/lib/i18n";

/* =========================
   Profil
   ========================= */
export const profile = {
  name: "Raphael Comandon",
  role: "Développeur Full-Stack",
  location: "France",
  email: "comandonraphael@gmail.com",
  phone: "07 82 83 33 59",
  linkedin: "https://www.linkedin.com/in/raphael-comandon",
  github: "https://github.com/raphael-co",
  about: `Développeur full-stack passionné avec 4 ans d’expérience. Spécialisé en PHP, React, Node.js et TypeScript.
Après trois ans en entreprise et six mois en freelance, je cherche un nouveau défi technique. Polyvalent, rigoureux et orienté produit,
j’aime concevoir des solutions robustes avec des équipes dynamiques.`,
};

/* =========================
   Compétences (FR/EN)
   ========================= */
export type Skills = {
  languages: string[];
  frameworks: string[];
  databases: string[];
  tools: string[];
  virtualization: string[];
  notions: string[];
  languagesSpoken: string[];
  interests: string[];
};

export const skillsByLocale: Record<Locale, Skills> = {
  fr: {
    languages: ["JavaScript", "TypeScript", "PHP", "HTML", "CSS/SCSS", "SQL", "Bash"],
    frameworks: [
      "React.js",
      "React Native",
      "Next.js",
      "Express",
      "Laravel",
      "Symfony",
      "Bootstrap",
      "Tailwind CSS",
      "Framer Motion",
      "Redux Toolkit",
      "NextAuth.js",
      "Shopify (Liquid)"
    ],
    databases: ["MariaDB", "MySQL", "PostgreSQL", "SQLite", "Redis"],
    tools: [
      "Git",
      "Node.js",
      "Docker",
      "Docker Compose",
      "NGINX",
      "Linux",
      "macOS",
      "Windows",
      "Vercel",
      "Cloudflare",
      "Figma",
      "Stripe",
      "GitHub Actions (CI/CD)",
      "ESLint",
      "Prettier",
      "Jest",
      "Playwright",
      "React Testing Library",
      "pnpm/npm",
      "yarn",
      "TanStack Query",
      "Zod",
      "Lucide React",
      "next-themes",
      "JSON",
      "YAML",
      "CSV",
      "XML",
      "OpenAPI/Swagger",
      "JSON Schema"
    ],
    virtualization: ["Proxmox", "VMware Workstation", "VirtualBox"],
    notions: ["Python", "Java", "Angular", "CodeIgniter", "GraphQL", "Go (notions)", "Rust (notions)"],
    languagesSpoken: ["Français (natif)", "Anglais"],
    interests: ["Veille technologique", "Open source", "UI/UX", "Automatisation", "Voyages", "Escalade", "Randonnée", "Running"]
  },
  en: {
    languages: ["JavaScript", "TypeScript", "PHP", "HTML", "CSS/SCSS", "SQL", "Bash"],
    frameworks: [
      "React.js",
      "React Native",
      "Next.js",
      "Express",
      "Laravel",
      "Symfony",
      "Bootstrap",
      "Tailwind CSS",
      "Framer Motion",
      "Redux Toolkit",
      "NextAuth.js",
      "Shopify (Liquid)"
    ],
    databases: ["MariaDB", "MySQL", "PostgreSQL", "SQLite", "Redis"],
    tools: [
      "Git",
      "Node.js",
      "Docker",
      "Docker Compose",
      "NGINX",
      "Linux",
      "macOS",
      "Windows",
      "Vercel",
      "Cloudflare",
      "Figma",
      "Stripe",
      "GitHub Actions (CI/CD)",
      "ESLint",
      "Prettier",
      "Jest",
      "Playwright",
      "React Testing Library",
      "pnpm/npm",
      "yarn",
      "TanStack Query",
      "Zod",
      "Lucide React",
      "next-themes",
      "JSON",
      "YAML",
      "CSV",
      "XML",
      "OpenAPI/Swagger",
      "JSON Schema"
    ],
    virtualization: ["Proxmox", "VMware Workstation", "VirtualBox"],
    notions: ["Python", "Java", "Angular", "CodeIgniter", "GraphQL", "Go (basics)", "Rust (basics)"],
    languagesSpoken: ["French (native)", "English"],
    interests: ["Tech watch", "Open source", "UI/UX", "Automation", "Travel", "Climbing", "Hiking", "Running"]
  }
};

/** Récupération localisée (utiliser ceci dans les pages) */
export function getSkills(locale: Locale): Skills {
  return skillsByLocale[locale] ?? skillsByLocale.fr;
}

/** Compat : ancien import `skills` (FR par défaut) */
export const skills: Skills = skillsByLocale.fr;

/* =========================
   Projets (FR/EN)
   ========================= */
export type Project = { title: string; href?: string; description: string; stack?: string[] };

const projectsFR: Project[] = [
  {
    title: "JSON Analyzer — Explorateur/Analyseur JSON",
    href: "https://github.com/raphael-co/json-analyzer",
    description: "Outil web pour coller/valider/formater du JSON, recherche, pliage, surlignage, paramètre ?json=… (b64:…). UI FR/EN.",
    stack: ["Next.js (App Router)", "TypeScript", "Tailwind", "Framer Motion", "next-themes", "Lucide React", "JSON"],
  },
  {
    title: "Mewe Jewels — E-commerce",
    href: "https://mewejewels.myshopify.com",
    description: "Boutique Shopify avec thème personnalisé, intégrations et optimisations.",
    stack: ["Shopify (Liquid)", "JavaScript", "UI/UX", "SEO", "HTML", "CSS", "Figma"],
  },
  {
    title: "Bluenote Films — Site vitrine",
    href: "https://bluenote-films.fr",
    description: "Site vitrine sur mesure + back-office Next.js pour gérer médias et contenus.",
    stack: ["Next.js", "TypeScript", "Tailwind", "Framer Motion", "Prisma", "PostgreSQL"],
  },
  {
    title: "MiddleStaking — Plateforme de staking",
    href: "https://app.middlestaking.fr/stake/MID-ecb7bf",
    description: "Interface web, stats utilisateurs (évolution mensuelle, agrégations, performances) + stats admin.",
    stack: ["React", "Node.js", "MultiversX", "REST API", "Chart.js", "Docker", "NGINX"],
  },
  {
    title: "Debaas",
    href: "#",
    description: "Gestion, hébergement local et indexation de données avec principes cloud.",
    stack: ["Node.js", "PostgreSQL", "Docker", "Redis", "Express", "NGINX", "TypeScript"],
  },
  {
    title: "Frigo partagé (mobile)",
    href: "#",
    description: "Gestion de frigo partagé, courses, et recettes via API externe.",
    stack: ["React Native", "Expo", "Axios", "REST API", "Node.js", "TypeScript", "AsyncStorage", "Material UI", "PostgreSQL"],
  },
  {
    title: "maPoint",
    href: "#",
    description: "Marquage de points d’intérêt sur carte avec photos, notes et visibilité.",
    stack: ["Leaflet", "React Native", "Expo", "Material UI", "TypeScript", "Cloudinary", "Axios", "Node.js", "REST API", "PostgreSQL"],
  },
  {
    title: "status_netgraph",
    href: "#",
    description: "Monitoring de disponibilité avec alerte email.",
    stack: ["Node.js", "Express", "PostgreSQL", "Nodemailer", "Docker", "Vercel"],
  },
  {
    title: "mail_edit",
    href: "#",
    description: "Éditeur d’e-mail en ligne pour campagnes massives (CSV).",
    stack: ["Node.js", "Next.js", "React", "Papaparse", "Nodemailer", "TypeScript", "Material UI", "Vercel"],
  },
  {
    title: "File Transfer Service — Backend",
    href: "https://github.com/raphael-co/file-transfer-service",
    description: "Service d’envoi/réception de fichiers (backend) avec flux efficaces et endpoints sécurisés.",
    stack: ["Node.js", "TypeScript", "Express", "Upload", "Streams", "Docker", "NGINX"],
  },
  {
    title: "File Transfer Service — Frontend",
    href: "https://github.com/raphael-co/file-transfer-service-front",
    description: "Interface web pour uploader/télécharger et suivre la progression des transferts.",
    stack: ["React", "Next.js", "TypeScript", "Tailwind", "Axios", "NGINX"],
  },
  {
    title: "Tirage au sort",
    href: "https://github.com/raphael-co/tirage-au-sort",
    description: "Application de tirage au sort simple et rapide (participants, exclusions, résultats).",
    stack: ["Next.js", "TypeScript", "Tailwind", "React", "Vercel"],
  },
  {
    title: "My Site Builder — CMS expérimental",
    href: "https://github.com/raphael-co/my-site-builder",
    description: "CMS Next.js expérimental : créer un site personnalisable via des composants préfaits et schémas.",
    stack: ["Next.js", "TypeScript", "Tailwind", "Composants dynamiques", "JSON Schema"],
  },
  {
    title: "Cardlore — Gestion de collections TCG",
    href: "#",
    description: "Site de gestion de collections de cartes (Pokémon, Yu-Gi-Oh!, Magic) : suivi, doubles, échanges. Créé pour un ami.",
    stack: ["Next.js", "TypeScript", "React", "PostgreSQL", "Prisma", "Tailwind", "Vercel"],
  },
];

const projectsEN: Project[] = [
  {
    title: "JSON Analyzer — JSON Explorer",
    href: "https://github.com/raphael-co/json-analyzer",
    description: "Web tool to paste/validate/format JSON, search, folding, syntax highlight, ?json=… (b64:…). FR/EN UI.",
    stack: ["Next.js (App Router)", "TypeScript", "Tailwind", "Framer Motion", "next-themes", "Lucide React", "JSON"],
  },
  {
    title: "Mewe Jewels — E-commerce",
    href: "https://mewejewels.myshopify.com",
    description: "Shopify store with custom theme, integrations and optimizations.",
    stack: ["Shopify (Liquid)", "JavaScript", "UI/UX", "SEO", "HTML", "CSS", "Figma"],
  },
  {
    title: "Bluenote Films — Showcase site",
    href: "https://bluenote-films.fr",
    description: "Bespoke showcase website + Next.js back-office to manage media and content.",
    stack: ["Next.js", "TypeScript", "Tailwind", "Framer Motion", "Prisma", "PostgreSQL"],
  },
  {
    title: "MiddleStaking — Staking platform",
    href: "https://app.middlestaking.fr/stake/MID-ecb7bf",
    description: "Web interface, user stats (monthly evolution, aggregations, performance) + admin dashboards.",
    stack: ["React", "Node.js", "MultiversX", "REST API", "Chart.js", "Docker", "NGINX"],
  },
  {
    title: "Debaas",
    href: "#",
    description: "Local data management, hosting and indexing with cloud principles.",
    stack: ["Node.js", "PostgreSQL", "Docker", "Redis", "Express", "NGINX", "TypeScript"],
  },
  {
    title: "Shared fridge (mobile)",
    href: "#",
    description: "Shared fridge management, groceries and recipes via external API.",
    stack: ["React Native", "Expo", "Axios", "REST API", "Node.js", "TypeScript", "AsyncStorage", "Material UI", "PostgreSQL"],
  },
  {
    title: "maPoint",
    href: "#",
    description: "Map points of interest with photos, notes and visibility options.",
    stack: ["Leaflet", "React Native", "Expo", "Material UI", "TypeScript", "Cloudinary", "Axios", "Node.js", "REST API", "PostgreSQL"],
  },
  {
    title: "status_netgraph",
    href: "#",
    description: "Uptime monitoring with email alerts.",
    stack: ["Node.js", "Express", "PostgreSQL", "Nodemailer", "Docker", "Vercel"],
  },
  {
    title: "mail_edit",
    href: "#",
    description: "Online email editor for large campaigns (CSV).",
    stack: ["Node.js", "Next.js", "React", "Papaparse", "Nodemailer", "TypeScript", "Material UI", "Vercel"],
  },
  {
    title: "File Transfer Service — Backend",
    href: "https://github.com/raphael-co/file-transfer-service",
    description: "File send/receive backend with efficient streams and secure endpoints.",
    stack: ["Node.js", "TypeScript", "Express", "Upload", "Streams", "NGINX", "Docker"],
  },
  {
    title: "File Transfer Service — Frontend",
    href: "https://github.com/raphael-co/file-transfer-service-front",
    description: "Web UI to upload/download files and track transfer progress.",
    stack: ["React", "Next.js", "TypeScript", "Tailwind", "Axios", "NGINX"],
  },
  {
    title: "Tirage au sort",
    href: "https://github.com/raphael-co/tirage-au-sort",
    description: "Simple and fast random draw app (participants, exclusions, results).",
    stack: ["Next.js", "TypeScript", "Tailwind", "React", "Vercel"],
  },
  {
    title: "My Site Builder — Experimental CMS",
    href: "https://github.com/raphael-co/my-site-builder",
    description: "Experimental Next.js CMS: build customizable websites via prebuilt components and schemas.",
    stack: ["Next.js", "TypeScript", "Tailwind", "Dynamic components", "JSON Schema"],
  },
  {
    title: "Cardlore — TCG Collections Manager",
    href: "#",
    description: "Manage Pokémon, Yu-Gi-Oh! and Magic collections: tracking, duplicates, trades. Built for a friend.",
    stack: ["Next.js", "TypeScript", "React", "PostgreSQL", "Prisma", "Tailwind", "Vercel"],
  },
];

export const projectsByLocale: Record<Locale, Project[]> = {
  fr: projectsFR,
  en: projectsEN,
};

export function getProjects(locale: Locale): Project[] {
  return projectsByLocale[locale] ?? projectsFR;
}

/** Compat : ancien import `projects` (FR par défaut) */
export const projects = projectsFR;

/* =========================
   Expérience & Éducation (FR/EN)
   ========================= */
export type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
};

const experienceFR: ExperienceEntry[] = [
  {
    company: "Freelance",
    role: "Développeur Full-Stack",
    period: "Janvier 2025 — Aujourd’hui",
    location: "Remote",
    bullets: [
      "Conception de sites modernes pour e-commerce et audiovisuel.",
      "Back-offices personnalisés (images/vidéos/textes) en Next.js.",
      "Stack : Node.js/TypeScript, React (TSX), Next.js, Shopify (Liquid).",
    ],
  },
  {
    company: "Linkeweaver",
    role: "Développeur Full-Stack",
    period: "Décembre 2020 — Décembre 2023",
    location: "Les Lilas",
    bullets: [
      "Développement back-end (PHP, Node.js/TypeScript) et front-end (React, HTML/CSS).",
      "Projet MiddleStaking (MultiversX) : interface web + modules statistiques utilisateurs et administrateurs.",
      "Cycle complet : planification → production.",
    ],
  },
];

const experienceEN: ExperienceEntry[] = [
  {
    company: "Freelance",
    role: "Full-Stack Developer",
    period: "January 2025 — Present",
    location: "Remote",
    bullets: [
      "Designed modern websites for e-commerce and audiovisual.",
      "Custom back-offices (images/videos/text) with Next.js.",
      "Stack: Node.js/TypeScript, React (TSX), Next.js, Shopify (Liquid).",
    ],
  },
  {
    company: "Linkeweaver",
    role: "Full-Stack Developer",
    period: "December 2020 — December 2023",
    location: "Les Lilas",
    bullets: [
      "Back-end development (PHP, Node.js/TypeScript) and front-end (React, HTML/CSS).",
      "MiddleStaking (MultiversX): web interface + user/admin analytics modules.",
      "Full lifecycle: planning → production.",
    ],
  },
];

export const experienceByLocale: Record<Locale, ExperienceEntry[]> = {
  fr: experienceFR,
  en: experienceEN,
};

export function getExperience(locale: Locale): ExperienceEntry[] {
  return experienceByLocale[locale] ?? experienceFR;
}

/** Compat : certains imports utilisent encore `experience` (FR par défaut) */
export const experience = experienceFR;

export const education = [
  { title: "Manager de Solutions Digitales et Data (Bac+5)", school: "IMIE Paris", period: "2021 — 2023", place: "Levallois-Perret" },
  { title: "Concepteur Développeur d’Application (Bac+3)", school: "IMIE Paris", period: "2020 — 2021", place: "Levallois-Perret" },
  { title: "Développeur Web et Web Mobile (Bac+2)", school: "IMIE Paris", period: "2019 — 2020", place: "Levallois-Perret" },
];

/* =========================
   About (FR/EN) — contenu centralisé
   ========================= */
export type AboutContent = {
  title: string;
  intro: string;
  sections: {
    who: string;
    do: string;
    stack: string;
    recent: string;
    cta: string;
  };
  bullets: string[];
  factsLabels: {
    role: string;
    location: string;
    email: string;
    github: string;
    linkedin: string;
    languages: string;
  };
  buttons: {
    viewProjects: string;
    contact: string;
  };
};

const aboutFR: AboutContent = {
  title: "À propos",
  intro:
    "Je conçois des applications web robustes, performantes et maintenables. J’aime transformer des besoins métiers en interfaces claires, et des contraintes techniques en solutions élégantes.",
  sections: {
    who: "Qui je suis",
    do: "Ce que je fais",
    stack: "Outils & Stack",
    recent: "Expérience récente",
    cta: "Envie d’en discuter ?",
  },
  bullets: [
    "Interfaces claires et cohérentes, centrées utilisateur, du wireframe au pixel-perfect.",
    "Performance mesurée (Web Vitals), budgets et optimisations de rendu côté client/serveur.",
    "Accessibilité par défaut (navigation clavier, contrastes, états de focus, ARIA) et audits réguliers.",
    "Design system structuré : composants réutilisables, variantes, documentation vivante.",
    "APIs côté serveur pensées pour la lisibilité, la maintenabilité et la sécurité.",
    "Modélisation des données, migrations, qualité et intégrité (tests, revues, validations).",
    "Pipelines d’intégration et de déploiement automatisés avec stratégies de release adaptées.",
    "Observabilité produit : logs, métriques, traces, alertes et post-mortems actionnables.",
    "Internationalisation complète : formats, fuseaux horaires, contenus et routing localisés.",
    "Collaboration produit : discovery, priorisation, itérations courtes et démos aux parties prenantes."
  ],
  factsLabels: {
    role: "Rôle",
    location: "Localisation",
    email: "Email",
    github: "GitHub",
    linkedin: "LinkedIn",
    languages: "Langues",
  },
  buttons: {
    viewProjects: "Voir mes projets",
    contact: "Me contacter",
  },
};

const aboutEN: AboutContent = {
  title: "About",
  intro:
    "I build robust, high-performance and maintainable web apps. I enjoy turning business needs into clean UIs, and technical constraints into elegant solutions.",
  sections: {
    who: "Who I am",
    do: "What I do",
    stack: "Tooling & Stack",
    recent: "Recent experience",
    cta: "Let’s talk?",
  },
  bullets: [
    "Clear, user-centric interfaces from wireframes to pixel-perfect delivery.",
    "Measured performance (Web Vitals), budgets, and render optimizations across client/server.",
    "Accessibility by default (keyboard nav, contrast, focus states, ARIA) with regular audits.",
    "Structured design system: reusable components, variants, and living documentation.",
    "Server-side APIs designed for readability, maintainability, and security.",
    "Data modeling, migrations, quality and integrity (tests, reviews, validations).",
    "Automated integration/deployment pipelines with sensible release strategies.",
    "Product observability: logs, metrics, traces, alerts, and actionable post-mortems.",
    "End-to-end internationalization: locales, time zones, content and routing.",
    "Product collaboration: discovery, prioritization, short iterations, stakeholder demos."
  ],
  factsLabels: {
    role: "Role",
    location: "Location",
    email: "Email",
    github: "GitHub",
    linkedin: "LinkedIn",
    languages: "Languages",
  },
  buttons: {
    viewProjects: "View my projects",
    contact: "Contact me",
  },
};

export const aboutByLocale: Record<Locale, AboutContent> = {
  fr: aboutFR,
  en: aboutEN,
};

export function getAbout(locale: Locale): AboutContent {
  return aboutByLocale[locale] ?? aboutFR;
}

/** Données “facts” prêtes à l’emploi pour la page About */
export type FactItem = { label: string; value: string; href?: string };
export function getAboutFacts(locale: Locale): FactItem[] {
  const t = getAbout(locale);
  const sk = getSkills(locale);

  return [
    { label: t.factsLabels.role, value: profile.role },
    { label: t.factsLabels.location, value: profile.location },
    { label: t.factsLabels.languages, value: sk.languagesSpoken.join(" • ") },
    { label: t.factsLabels.email, value: profile.email, href: `mailto:${profile.email}` },
    { label: t.factsLabels.github, value: "github.com/raphael-co", href: profile.github },
    { label: t.factsLabels.linkedin, value: "Raphael Comandon", href: profile.linkedin },
  ];
}

export const techLogos: TechItem[] = [
  { title: "React", src: "/logos/react.svg" },
  { title: "Next.js", src: "/logos/nextjs.svg", darkInvert: true },
  { title: "TypeScript", src: "/logos/typescript.svg" },
  { title: "JavaScript", src: "/logos/javascript.svg" },
  { title: "Node.js", src: "/logos/nodejs.svg" },
  { title: "Express", src: "/logos/express.svg", darkInvert: true },
  { title: "Tailwind CSS", src: "/logos/tailwindcss.svg" },
  { title: "Framer Motion", src: "/logos/framer.svg", darkInvert: true },
  { title: "Redux", src: "/logos/redux.svg" },
  { title: "PostgreSQL", src: "/logos/postgresql.svg" },
  { title: "MySQL", src: "/logos/mysql.svg", darkInvert: true },
  { title: "Redis", src: "/logos/redis.svg" },
  { title: "Docker", src: "/logos/docker.svg" },
  { title: "NGINX", src: "/logos/nginx.svg" },
  { title: "Git", src: "/logos/git.svg" },
  { title: "Vercel", src: "/logos/vercel.svg", darkInvert: true },
  { title: "Jest", src: "/logos/jest.svg" },
  { title: "Playwright", src: "/logos/playwright.svg", darkInvert: true },
  { title: "Laravel", src: "/logos/laravel.svg" },
  { title: "Symfony", src: "/logos/symfony.svg", darkInvert: true },
  { title: "Shopify", src: "/logos/shopify.svg" },
  { title: "SQLite", src: "/logos/sqlite.svg" },
  { title: "Linux", src: "/logos/linux.svg" },
  { title: "React Native", src: "/logos/react.svg" },
  { title: "Expo", src: "/logos/expo.svg", darkInvert: true },
  { title: "Axios", src: "/logos/axios.svg" },
  { title: "TanStack Query", src: "/logos/TanStack.png" },
  { title: "Zod", src: "/logos/zod.svg" },
  { title: "Auth.js (NextAuth)", src: "/logos/logo-sm.webp", darkInvert: true },
  { title: "Prisma", src: "/logos/prisma.svg", darkInvert: true },
  { title: "GraphQL", src: "/logos/graphql.svg" },
  { title: "Apollo", src: "/logos/apollo-graphql.svg", darkInvert: true },
  { title: "Chart.js", src: "/logos/chartjs.svg" },
  { title: "Material UI", src: "/logos/mui.svg" },
  { title: "Bootstrap", src: "/logos/bootstrap.svg" },
  { title: "Vite", src: "/logos/vite.svg" },
  { title: "Webpack", src: "/logos/webpack.svg" },
  { title: "SWC", src: "/logos/swc.svg" },
  { title: "Turborepo", src: "/logos/turborepo.svg", darkInvert: true },
  { title: "ESLint", src: "/logos/eslint.svg" },
  { title: "Prettier", src: "/logos/prettier.svg" },
  { title: "pnpm", src: "/logos/pnpm.svg" },
  { title: "npm", src: "/logos/npm.svg", darkInvert: true },
  { title: "Yarn", src: "/logos/yarn.svg" },
  { title: "GitHub", src: "/logos/github-mark.svg", darkInvert: true },
  { title: "Sentry", src: "/logos/sentry.svg" },
  { title: "Grafana", src: "/logos/grafana.svg" },
  { title: "Prometheus", src: "/logos/prometheus.svg" },
  { title: "Proxmox", src: "/logos/proxmox.svg" },
  { title: "VMware", src: "/logos/vmware.svg" },
  { title: "VirtualBox", src: "/logos/virtualbox.svg" },
  { title: "macOS", src: "/logos/apple.svg", darkInvert: true },
  { title: "Windows", src: "/logos/windows.svg" },
  { title: "Leaflet", src: "/logos/leaflet.svg" },
  { title: "MultiversX", src: "/logos/multiversx.svg" },
  { title: "Stripe", src: "/logos/stripe.svg" },
  { title: "Nodemailer", src: "/logos/nodemailer.webp", darkInvert: true },
  { title: "Cloudinary", src: "/logos/cloudinary.svg" },
  { title: "Figma", src: "/logos/figma.png" },
  { title: "Proxmox", src: "/logos/Logo_Proxmox.svg", darkInvert: true },
  { title: "Cloudflare", src: "/logos/cloudflare.svg" },
];
