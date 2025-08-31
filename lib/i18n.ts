export type Locale = "fr" | "en";

export const locales: Locale[] = ["fr", "en"];
export const defaultLocale: Locale = "fr";

type Dict = Record<string, string>;

const fr: Dict = {
  nav_home: "Accueil",
  nav_projects: "Projets",
  nav_experience: "Expérience",
  nav_about: "À propos",
  nav_contact: "Contact",
  hero_title: "Raphael Comandon — Développeur Full-Stack",
  hero_sub:
    "Je conçois des applications web & mobiles rapides, robustes et maintenables.",
  btn_download_cv: "Télécharger le CV (PDF)",
  btn_contact_me: "Me contacter",
  skills_title: "Compétences",
  skills_languages: "Langages",
  skills_frameworks: "Frameworks",
  skills_databases: "Bases de données",
  skills_tools: "Outils & DevOps",
  skills_virtualization: "Virtualisation",
  skills_lang_interests: "Langues & Intérêts",
  education_title: "Diplômes",
  view_experience: "Voir mon expérience",
  projects_title: "Projets",
  projects_selected: "Projets sélectionnés",
  experience_title: "Expérience",
  contact_title: "Contact",
  contact_intro: "Intéressé par mon profil ? Écrivez‑moi et discutons de vos besoins.",
  contact_email: "Email",
  contact_phone: "Téléphone",
  contact_linkedin: "LinkedIn",
  contact_form_hint: "Le formulaire ouvre votre client mail avec les informations saisies.",
  contact_toast: "Merci ! Votre client mail va s’ouvrir…",
  stats_years: "Années d’expérience",
  stats_projects: "Projets livrés",
  stats_techs: "Techs approchées",
  search_projects_placeholder: "Rechercher un projet…",
  filter_all: "Tous",
  no_results: "Aucun projet ne correspond à la recherche.",
};

const en: Dict = {
  nav_home: "Home",
  nav_projects: "Projects",
  nav_experience: "Experience",
  nav_about: "About",
  nav_contact: "Contact",
  hero_title: "Raphael Comandon — Full‑Stack Developer",
  hero_sub:
    "I build fast, robust and maintainable web & mobile applications.",
  btn_download_cv: "Download CV (PDF)",
  btn_contact_me: "Contact me",
  skills_title: "Skills",
  skills_languages: "Languages",
  skills_frameworks: "Frameworks",
  skills_databases: "Databases",
  skills_tools: "Tools & DevOps",
  skills_virtualization: "Virtualization",
  skills_lang_interests: "Languages & Interests",
  education_title: "Degrees",
  view_experience: "View my experience",
  projects_title: "Projects",
  projects_selected: "Selected projects",
  experience_title: "Experience",
  contact_title: "Contact",
  contact_intro: "Interested in my profile? Write to me and let's discuss your needs.",
  contact_email: "Email",
  contact_phone: "Phone",
  contact_linkedin: "LinkedIn",
  contact_form_hint: "The form opens your email client with the entered information.",
  contact_toast: "Thanks! Your mail client will open…",
  stats_years: "Years of experience",
  stats_projects: "Delivered projects",
  stats_techs: "Technologies used",
  search_projects_placeholder: "Search a project…",
  filter_all: "All",
  no_results: "No project matches your search.",
};

export const dictionaries: Record<Locale, Dict> = { fr, en };

export function getDict(locale: Locale) {
  return dictionaries[locale] ?? fr;
}
