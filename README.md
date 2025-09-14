# Raphael Comandon — Portfolio
t
Portfolio/CV moderne, multilingue (FR/EN), construit avec **Next.js 15**, **React 18**, **TypeScript** et **Tailwind CSS**.
Animations fluides via **Framer Motion**, thème clair/sombre avec **next-themes**, palette de commande (**cmdk**), formulaire de contact avec **Nodemailer** et contenu centralisé dans `lib/data.ts`.

## ✨ Fonctionnalités

* 🌍 **i18n FR/EN** (textes & données : compétences, expériences, projets)
* 🧭 **Navbar responsive** (menu burger), **switch de langue**, **toggle thème**
* 🧑‍🎤 **Hero** avec avatar (fond adapté aux PNG transparents)
* 🗂️ **Projets** : recherche plein-texte + filtrage par stack, cartes de hauteur égale
* 👤 **About** : “facts” avec **tooltip** auto survol (s’affiche si le texte est tronqué), nuage de technos animé
* 📈 **Stats animées** (lancement quand la section est visible, support *prefers-reduced-motion*)
* ✉️ **Contact** : API `/api/contact` + template d’email soigné (texte + HTML), fallback mailto et copie du message en cas d’erreur
* ♿ **Accessibilité** : navigation clavier, aria-live, fermeture modales via Échap / clic fond

## 🛠️ Stack

* **Next.js 15**, **React 18**, **TypeScript**
* **Tailwind CSS**, **Framer Motion**
* **next-themes** (dark/light), **cmdk** (palette)
* **Nodemailer** (envoi d’emails serveur)
* Organisation des contenus dans **`lib/data.ts`** et lib i18n dans **`lib/i18n.ts`**

## 📁 Structure (extrait)

```
app/
  [locale]/(pages)...
  api/contact/route.ts        # endpoint contact (Nodemailer)
components/
  about/facts.tsx             # Facts + tooltip auto
  about/tech-cloud.tsx        # Nuage de technos (wrap/scroll)
  animated-stats.tsx
  command-palette.tsx
  navbar.tsx / footer.tsx
  project-card.tsx / projects-filter.tsx
  hero.tsx
  ui/ (Card, Section, Badge, SpotlightCard, etc.)
lib/
  data.ts                     # profil, skills, projets, expériences (FR/EN)
  i18n.ts                     # dictionnaires & helpers i18n
```

## 🚀 Démarrage

### Prérequis

* Node 18+ (ou 20+)
* pnpm / npm / yarn

```bash
# installation
pnpm install     # ou npm install / yarn

# développement
pnpm dev         # http://localhost:3000

# build + start
pnpm build
pnpm start
```

## 🔐 Variables d’environnement

Crée un `.env.local` à la racine :

```env
# SMTP générique
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=ton_user
SMTP_PASS=ton_password
SMTP_FROM=no-reply@ton-domaine.com

# destinataire des messages du formulaire
CONTACT_TO=comandonraphael@gmail.com
```

**Gmail (app password)**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=usermail@gmail.com
SMTP_PASS=APP_PASSWORD_GMAIL   # mot de passe d'application
SMTP_FROM=smtpmail@gmail.com
CONTACT_TO=contact@gmail.com
```

> Pour Gmail, active l’**app password** (sécurité → mots de passe d’application) et utilise le **port 465** (secure true). Le code du transport bascule tout seul selon le port.

## 🧩 Personnalisation du contenu

Tout est centralisé dans **`lib/data.ts`** :

* **Profil** : `profile`
* **Compétences** (FR/EN) : `skillsByLocale`
* **Projets** (FR/EN) : `projectsFR` / `projectsEN`
* **Expériences** (FR/EN) : `experienceFR` / `experienceEN`
* **About** (FR/EN) : `aboutFR` / `aboutEN`
* Helpers : `getSkills(locale)`, `getProjects(locale)`, `getExperience(locale)`, `getAbout(locale)`, `getAboutFacts(locale)`

Textes d’interface (boutons, titres, placeholders) : **`lib/i18n.ts`**.

## 💌 Formulaire de contact

* Endpoint : `POST /api/contact`
* Body : `{ name, email, message, website }` (honeypot `website`)
* Envoi : **Nodemailer** (texte + HTML avec template propre)
* Fallback si erreur : bouton **mailto** pré-rempli + bouton **copier le message**
* Modales **succès/erreur** animées (fermeture par Échap / clic fond / bouton)

## 📱 Responsive & a11y

* Grilles fluides (`lg:grid-cols-3`, etc.), tailles de police adaptatives
* Tooltips montés dans `body` pour éviter le clipping
* *prefers-reduced-motion* respecté pour les animations de chiffres
* Focus management et aria-live pour les retours d’état

## 🧪 Vérification rapide (dev)

* Envoyer un message depuis la page Contact
* Regarder l’onglet **Network** : `200` attendu
* En prod : vérifier la réception sur `CONTACT_TO`

## 🏗️ Déploiement

* Conçu pour **Vercel** (Next 15 / App Router)
* Configurer les **env vars** dans le dashboard (mêmes clés que `.env`)
