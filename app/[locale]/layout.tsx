// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "next-themes";
import CommandPalette from "@/components/command-palette";
import { ToastProvider } from "@/components/toast";
import { getDict, type Locale, defaultLocale } from "@/lib/i18n";
import { DOMAIN } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// --- CONFIG DOMAINE ---


// Valeurs globales (fallback). Les titres/descriptions seront définis page par page.
export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  applicationName: "Raphael Comandon — Portfolio",
  description: "Développeur Full-Stack. Découvrez mon portfolio, mes projets, mon expérience et contactez-moi pour vos missions web et mobiles.",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    url: DOMAIN,
    siteName: "Raphael Comandon — Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    site: "@ton_handle",
    creator: "@ton_handle",
  },
};
type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const dict = getDict(locale);

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToastProvider>
            <Navbar dict={dict} locale={locale} />
            <main className="min-h-[83vh]">{children}</main>
            <Footer />
            <CommandPalette />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }];
}
