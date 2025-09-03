"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import type { Locale } from "@/lib/i18n";

export default function CommandPalette({ locale }: { locale: Locale }) {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const mql = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  React.useEffect(() => {
    if (!isDesktop) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDesktop]);

  if (!mounted || !isDesktop) return null;

  const base = `/${locale}`;
  const labels =
    locale === "fr"
      ? { home: "Accueil", projects: "Projets", experience: "Expérience", about: "À propos", relaxation: "Détente", contact: "Contact" }
      : { home: "Home", projects: "Projects", experience: "Experience", about: "About", relaxation: "Relaxation", contact: "Contact" };

  const nav = [
    { seg: "", label: labels.home },
    { seg: "projects", label: labels.projects },
    { seg: "experience", label: labels.experience },
    { seg: "about", label: labels.about },
    { seg: "relaxation", label: labels.relaxation },
    { seg: "contact", label: labels.contact },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 rounded-full border bg-white/70 px-4 py-2 text-sm shadow backdrop-blur hover:bg-white dark:border-white/10 dark:bg-black/40"
      >
        ⌘K
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] grid place-items-start bg-black/30 p-4 backdrop-blur"
          onClick={() => setOpen(false)}
        >
          <div
            className="mx-auto w-full max-w-lg rounded-2xl border bg-white shadow-lg dark:border-white/10 dark:bg-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            <Command label="Palette" className="[&_[cmdk-input]]:w-full">
              <div className="border-b p-3 dark:border-white/10">
                <Command.Input
                  placeholder={locale === "fr" ? "Rechercher une page…" : "Search a page…"}
                  className="w-full rounded-md bg-transparent outline-none"
                />
              </div>
              <Command.List className="max-h-80 overflow-auto p-2">
                <Command.Empty className="p-2 text-sm opacity-70">
                  {locale === "fr" ? "Aucun résultat." : "No results."}
                </Command.Empty>
                <Command.Group heading={locale === "fr" ? "Navigation" : "Navigation"}>
                  {nav.map(({ seg, label }) => {
                    const path = seg ? `${base}/${seg}` : `${base}`;
                    return (
                      <Command.Item
                        key={path}
                        onSelect={() => {
                          router.push(path);
                          setOpen(false);
                        }}
                        className="cursor-pointer rounded-md px-3 py-2 data-[selected=true]:bg-black/5 dark:data-[selected=true]:bg-white/10"
                      >
                        {label}
                        <span className="ml-2 text-xs opacity-60">{path}</span>
                      </Command.Item>
                    );
                  })}
                </Command.Group>
              </Command.List>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}
