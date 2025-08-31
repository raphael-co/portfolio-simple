"use client";

import { useMemo, useState, useEffect } from "react";
import { Section, Card } from "@/components/ui";
import { useToast } from "@/components/toast";
import { profile } from "@/lib/data";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDict } from "@/lib/i18n";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Mail, Clipboard, X } from "lucide-react";

type Payload = { name: string; email: string; message: string; website?: string };

export default function ContactClient({ locale }: { locale: Locale }) {
  const { notify } = useToast();
  const dict = getDict(locale);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [lastPayload, setLastPayload] = useState<Payload | null>(null);

  const t = useMemo(
    () =>
      locale === "fr"
        ? {
            sent: "Message envoyé ✅",
            fail: "Échec de l’envoi ❌",
            sending: "Envoi...",
            send: "Envoyer",
            yourName: "Votre nom",
            yourEmail: "Votre email",
            yourMessage: "Votre message",
            tip: "Astuce : en local, vérifiez l’onglet Réseau de votre navigateur (200 = OK).",
            successTitle: "Merci !",
            successDesc: "Votre message a bien été envoyé. Je reviens vers vous rapidement.",
            close: "Fermer",
            errorTitle: "Oups…",
            errorDesc: "L’envoi a échoué. Essayez à nouveau, ou utilisez la solution temporaire ci-dessous.",
            tryAgain: "Réessayer",
            openMail: "Ouvrir mon client mail",
            copyAll: "Copier le message",
            copied: "Copié ✅",
          }
        : {
            sent: "Message sent ✅",
            fail: "Failed to send ❌",
            sending: "Sending...",
            send: "Send",
            yourName: "Your name",
            yourEmail: "Your email",
            yourMessage: "Your message",
            tip: "Tip: locally, check the Network tab in your browser (200 = OK).",
            successTitle: "Thank you!",
            successDesc: "Your message has been delivered. I’ll get back to you shortly.",
            close: "Close",
            errorTitle: "Whoops…",
            errorDesc: "Sending failed. Please try again, or use the temporary fallback below.",
            tryAgain: "Try again",
            openMail: "Open my email app",
            copyAll: "Copy the message",
            copied: "Copied ✅",
          },
    [locale]
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload: Payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      message: String(fd.get("message") || ""),
      website: String(fd.get("website") || ""),
    };
    setLastPayload(payload);

    try {
      setLoading(true);
      setStatus("idle");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      notify(t.sent);
      form.reset();
      setStatus("success");
    } catch {
      notify(t.fail);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  // mailto fallback si erreur
  const mailtoHref = useMemo(() => {
    const p = lastPayload;
    const subject =
      locale === "fr"
        ? `Contact depuis le portfolio — ${p?.name ?? ""}`
        : `Contact from portfolio — ${p?.name ?? ""}`;
    const body =
      (locale === "fr"
        ? `Nom: ${p?.name}\nEmail: ${p?.email}\n\nMessage:\n${p?.message}`
        : `Name: ${p?.name}\nEmail: ${p?.email}\n\nMessage:\n${p?.message}`) || "";
    return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [lastPayload, locale]);

  // Fermer avec la touche Échap
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setStatus("idle");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function copyAll() {
    if (!lastPayload) return;
    const text =
      locale === "fr"
        ? `Nom: ${lastPayload.name}\nEmail: ${lastPayload.email}\n\nMessage:\n${lastPayload.message}`
        : `Name: ${lastPayload.name}\nEmail: ${lastPayload.email}\n\nMessage:\n${lastPayload.message}`;
    try {
      await navigator.clipboard.writeText(text);
      notify(t.copied);
    } catch {}
  }

  return (
    <Section className="py-12">
      <p aria-live="polite" className="sr-only">
        {status === "success" ? t.sent : status === "error" ? t.fail : ""}
      </p>

      <h1 className="mb-6 text-2xl font-semibold">{dict.contact_title}</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <p className="opacity-80">{dict.contact_intro}</p>
          <div className="mt-4 space-y-2 text-sm">
            <p>
              <span className="opacity-60">{dict.contact_email}:</span>{" "}
              <Link href={`mailto:${profile.email}`} className="text-brand hover:underline">
                {profile.email}
              </Link>
            </p>
            <p>
              <span className="opacity-60">{dict.contact_phone}:</span> <span>{profile.phone}</span>
            </p>
            <p>
              <span className="opacity-60">{dict.contact_linkedin}:</span>{" "}
              <Link href={profile.linkedin} className="text-brand hover:underline">
                Profil
              </Link>
            </p>
          </div>
        </Card>

        <Card>
          <form className="grid gap-3" onSubmit={onSubmit}>
            {/* honeypot */}
            <input tabIndex={-1} autoComplete="off" name="website" className="absolute left-[-9999px] top-[-9999px]" />
            <input className="rounded-xl border p-3 dark:border-white/10" name="name" placeholder={t.yourName} required />
            <input className="rounded-xl border p-3 dark:border-white/10" name="email" type="email" placeholder={t.yourEmail} required />
            <textarea className="min-h-32 rounded-xl border p-3 dark:border-white/10" name="message" placeholder={t.yourMessage} required />
            <button disabled={loading} className="rounded-xl bg-brand px-5 py-3 font-medium text-white disabled:opacity-60">
              {loading ? t.sending : t.send}
            </button>
          </form>
          <p className="mt-3 text-xs opacity-60">{t.tip}</p>
        </Card>
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {status === "success" && (
          <motion.div
            key="ok"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur"
            aria-modal
            role="dialog"
            onClick={() => setStatus("idle")} // clic sur le backdrop => ferme
          >
            <motion.div
              initial={{ y: 12, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 8, scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="w-[90%] max-w-sm rounded-2xl border bg-white p-5 text-center shadow-xl dark:border-white/10 dark:bg-neutral-900"
              onClick={(e) => e.stopPropagation()} // évite de fermer si on clique dans la carte
            >
              <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-emerald-100/80 dark:bg-emerald-400/15">
                <motion.div initial={{ scale: 0.8, rotate: -10, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ duration: 0.35 }}>
                  <Check className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                </motion.div>
              </div>
              <h3 className="text-lg font-semibold">{t.successTitle}</h3>
              <p className="mt-1 text-sm opacity-80">{t.successDesc}</p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-4 inline-flex rounded-full border px-4 py-2 text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
              >
                {t.close}
              </button>
            </motion.div>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            key="err"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur"
            aria-modal
            role="dialog"
            onClick={() => setStatus("idle")}
          >
            <motion.div
              initial={{ y: 12, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 8, scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="w-[92%] max-w-lg rounded-2xl border bg-white p-5 shadow-xl dark:border-white/10 dark:bg-neutral-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-rose-100/80 dark:bg-rose-400/15">
                  <X className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold">{t.errorTitle}</h3>
                  <p className="mt-1 text-sm opacity-80">{t.errorDesc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a href={mailtoHref} className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white">
                      <Mail className="h-4 w-4" />
                      {t.openMail}
                    </a>
                    <button
                      onClick={copyAll}
                      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
                    >
                      <Clipboard className="h-4 w-4" />
                      {t.copyAll}
                    </button>
                    <button
                      onClick={() => setStatus("idle")}
                      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
                    >
                      {t.tryAgain}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
