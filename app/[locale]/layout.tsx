import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "next-themes";
import CommandPalette from "@/components/command-palette";
import { ToastProvider } from "@/components/toast";
import { getDict, type Locale, defaultLocale } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Raphael Comandon — Portfolio",
  description: "CV / Portfolio — React, Next.js, Node.js, TypeScript.",
  icons: { icon: "/favicon.svg" },
};

type LayoutProps = {
  children: React.ReactNode;
  // ⬇️ ta config attend un Promise ici
  params: Promise<{ locale: string }>;
};

function resolveLocale(l: string): Locale {
  return l === "fr" || l === "en" ? l : defaultLocale;
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale: raw } = await params; // ⬅️ on attend params
  const locale = resolveLocale(raw);
  const dict = getDict(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
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
