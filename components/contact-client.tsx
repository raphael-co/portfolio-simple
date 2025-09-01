"use client";

import { useMemo, useState, useEffect } from "react";
import { Section, Card, cn } from "@/components/ui";
import { useToast } from "@/components/toast";
import { profile, techLogos } from "@/lib/data";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDict } from "@/lib/i18n";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Mail, Clipboard, X, ArrowRight, Github, Linkedin, Phone } from "lucide-react";
import SpotlightCard from "./spotlight-card";
import { TechMarquee } from "./TechMarquee";
import { Field } from "./Field";


type Payload = { name: string; email: string; message: string; website?: string };

const MESSAGE_MIN = 12;
const MESSAGE_MAX = 1200;

export default function ContactClient({ locale }: { locale: Locale }) {
  const { notify } = useToast();
  const dict = getDict(locale);

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
          successTitle: "Merci !",
          successDesc: "Votre message a bien été envoyé. Je reviens vers vous rapidement.",
          close: "Fermer",
          errorTitle: "Oups…",
          errorDesc:
            "L’envoi a échoué. Essayez à nouveau, ou utilisez la solution temporaire ci-dessous.",
          tryAgain: "Réessayer",
          openMail: "Ouvrir mon client mail",
          copyAll: "Copier le message",
          copied: "Copié ✅",
          nameShort: "Nom trop court.",
          emailInvalid: "Adresse email invalide.",
          messageShort: `Écrivez au moins ${MESSAGE_MIN} caractères.`,
          chars: "caractères",
          of: "sur",
          contactMe: "Me contacter autrement",
        }
        : {
          sent: "Message sent ✅",
          fail: "Failed to send ❌",
          sending: "Sending...",
          send: "Send",
          yourName: "Your name",
          yourEmail: "Your email",
          yourMessage: "Your message",
          successTitle: "Thank you!",
          successDesc: "Your message has been delivered. I’ll get back to you shortly.",
          close: "Close",
          errorTitle: "Whoops…",
          errorDesc:
            "Sending failed. Please try again, or use the temporary fallback below.",
          tryAgain: "Try again",
          openMail: "Open my email app",
          copyAll: "Copy the message",
          copied: "Copied ✅",
          nameShort: "Name is too short.",
          emailInvalid: "Invalid email address.",
          messageShort: `Write at least ${MESSAGE_MIN} characters.`,
          chars: "characters",
          of: "of",
          contactMe: "Other ways to reach me",
        },
    [locale]
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [lastPayload, setLastPayload] = useState<Payload | null>(null);

  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const nameOk = name.trim().length >= 2;
  const emailOk = isEmail(email);
  const messageOk = message.trim().length >= MESSAGE_MIN;
  const canSubmit = nameOk && emailOk && messageOk && !loading;

  const progress = ((nameOk ? 1 : 0) + (emailOk ? 1 : 0) + (messageOk ? 1 : 0)) / 3;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload: Payload = { name: name.trim(), email: email.trim(), message: message.trim(), website: "" };
    setLastPayload(payload);

    try {
      setLoading(true);
      setStatus("idle");
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Request failed");
      notify(t.sent);
      setStatus("success");
      setName(""); setEmail(""); setMessage("");
    } catch {
      notify(t.fail);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  const mailtoHref = useMemo(() => {
    const p = lastPayload;
    const subject = locale === "fr" ? `Contact depuis le portfolio — ${p?.name ?? ""}` : `Contact from portfolio — ${p?.name ?? ""}`;
    const body =
      (locale === "fr"
        ? `Nom: ${p?.name}\nEmail: ${p?.email}\n\nMessage:\n${p?.message}`
        : `Name: ${p?.name}\nEmail: ${p?.email}\n\nMessage:\n${p?.message}`) || "";
    return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [lastPayload, locale]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setStatus("idle"); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function copyAll() {
    const text = locale === "fr"
      ? `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      : `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    try { await navigator.clipboard.writeText(text); notify(t.copied); } catch { }
  }

  const nameError = name && !nameOk ? t.nameShort : null;
  const emailError = email && !emailOk ? t.emailInvalid : null;
  const messageError = message && !messageOk ? t.messageShort : null;

  return (
    <Section className="py-12">
      <p aria-live="polite" className="sr-only">
        {status === "success" ? t.sent : status === "error" ? t.fail : ""}
      </p>

      <motion.h1 initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }} className="mb-8 text-3xl font-semibold md:text-4xl">
        {dict.contact_title}
      </motion.h1>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05, duration: 0.5 }} className="min-w-0 flex justify-between flex-col"
        >
          <SpotlightCard className="relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/10 blur-2xl pointer-events-none -z-10" />
            <p className="opacity-80">{dict.contact_intro}</p>

            <div className="mt-4 space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 opacity-60" />
                <span className="opacity-60">{dict.contact_email}:</span>{" "}
                <Link href={`mailto:${profile.email}`} className="text-brand hover:underline">{profile.email}</Link>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 opacity-60" />
                <span className="opacity-60">{dict.contact_phone}:</span>{" "}
                <span>{profile.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 opacity-60" />
                <span className="opacity-60">{dict.contact_linkedin}:</span>{" "}
                <Link href={profile.linkedin} className="text-brand hover:underline" target="_blank" rel="noopener noreferrer">
                  {profile.name}
                </Link>
              </p>
              <p className="flex items-center gap-2">
                <Github className="h-4 w-4 opacity-60" />
                <span className="opacity-60">{dict.contact_github}:</span>{" "}
                <Link href={profile.github} className="text-brand hover:underline" target="_blank" rel="noopener noreferrer">
                  {dict.all_repos}
                </Link>
              </p>
            </div>

            <div className="mt-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider opacity-60">{t.contactMe}</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { href: `mailto:${profile.email}`, label: "Email", Icon: Mail },
                  { href: profile.linkedin, label: "LinkedIn", Icon: Linkedin },
                  { href: profile.github, label: "GitHub", Icon: Github },
                ].map(({ href, label, Icon }) => (
                  <motion.a key={label} href={href} target={label !== "Email" ? "_blank" : undefined} rel="noopener noreferrer"
                    whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="group inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10 !cursor-pointer relative z-10"
                  >
                    <Icon className="h-4 w-4 opacity-70 transition group-hover:opacity-100" />
                    <span>{label}</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-70" />
                  </motion.a>
                ))}
              </div>
            </div>
          </SpotlightCard>

          <TechMarquee className="mt-4" items={techLogos} />

          <TechMarquee className="mt-4" items={techLogos} reverse={false}/>
        </motion.div>

        <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }}>
          <motion.div animate={status === "error" ? { x: [0, -6, 6, -4, 4, 0] } : {}} transition={{ duration: 0.35 }}>
            <Card className="relative overflow-hidden">
              <div className="mb-4 h-1 w-full rounded-full bg-black/5 dark:bg-white/10">
                <motion.div className="h-1 rounded-full bg-brand" initial={{ width: "0%" }}
                  animate={{ width: `${Math.round(progress * 100)}%` }} transition={{ type: "spring", stiffness: 140, damping: 18 }} />
              </div>

              <form className="grid gap-3" onSubmit={onSubmit}>
                <input tabIndex={-1} autoComplete="off" name="website" className="absolute left-[-9999px] top-[-9999px]" />

                <Field id="name" label={t.yourName} value={name} onChange={setName} error={nameError} />
                <Field id="email" type="email" label={t.yourEmail} value={email} onChange={setEmail} error={emailError} />
                <div>
                  <Field id="message" label={t.yourMessage} value={message} onChange={setMessage} textarea error={messageError} />
                  <div className="mt-1 flex justify-end text-[11px] opacity-60">
                    {message.length} {t.of} {1200} {t.chars}
                  </div>
                </div>

                <div className="mt-1 flex items-center gap-2">
                  <motion.button disabled={!canSubmit} whileTap={{ scale: canSubmit ? 0.98 : 1 }}
                    className={cn("inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 font-medium text-white transition disabled:opacity-60",
                      !canSubmit && "cursor-not-allowed")}>
                    {loading && <span className="inline-block size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
                    {loading ? t.sending : t.send}
                  </motion.button>
                  <button type="button" onClick={copyAll}
                    className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10">
                    <Clipboard className="h-4 w-4" />
                    {t.copyAll}
                  </button>
                </div>
              </form>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {status === "success" && (
          <motion.div key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur" aria-modal role="dialog"
            onClick={() => setStatus("idle")}>
            <motion.div initial={{ y: 12, scale: 0.98, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 8, scale: 0.98, opacity: 0 }} transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="w-[90%] max-w-sm rounded-2xl border bg-white p-5 text-center shadow-xl dark:border-white/10 dark:bg-neutral-900"
              onClick={(e) => e.stopPropagation()}>
              <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-emerald-100/80 dark:bg-emerald-400/15">
                <motion.div initial={{ scale: 0.8, rotate: -10, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ duration: 0.35 }}>
                  <Check className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                </motion.div>
              </div>
              <h3 className="text-lg font-semibold">{t.successTitle}</h3>
              <p className="mt-1 text-sm opacity-80">{t.successDesc}</p>
              <button onClick={() => setStatus("idle")} className="mt-4 inline-flex rounded-full border px-4 py-2 text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10">
                {t.close}
              </button>
            </motion.div>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur" aria-modal role="dialog"
            onClick={() => setStatus("idle")}>
            <motion.div initial={{ y: 12, scale: 0.98, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 8, scale: 0.98, opacity: 0 }} transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="w-[92%] max-w-lg rounded-2xl border bg-white p-5 shadow-xl dark:border-white/10 dark:bg-neutral-900"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-rose-100/80 dark:bg-rose-400/15">
                  <X className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold">{t.errorTitle}</h3>
                  <p className="mt-1 text-sm opacity-80">{t.errorDesc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a href={mailtoHref} className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white">
                      <Mail className="h-4 w-4" /> {t.openMail}
                    </a>
                    <button onClick={copyAll} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10">
                      <Clipboard className="h-4 w-4" /> {t.copyAll}
                    </button>
                    <button onClick={() => setStatus("idle")} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10">
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
