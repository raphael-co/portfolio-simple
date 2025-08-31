"use client";

import { motion } from "framer-motion";
import Balancer from "react-wrap-balancer";
import Link from "next/link";
import { type Locale, getDict } from "@/lib/i18n";

export default function Hero({ locale }: { locale: Locale }) {
  const dict = getDict(locale);

  return (
    <section className="relative overflow-hidden">
      {/* Animated grid background */}
      <div className="pointer-events-none absolute inset-0 opacity-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
        <div className="h-full w-full bg-grid"></div>
      </div>

      <div className="container mx-auto grid min-h-[60vh] place-items-center px-4 py-24">
        <div className="relative z-10 max-w-3xl text-center">
          {/* Avatar + decorative background */}
          <div className="relative mx-auto mb-6 h-28 w-28 md:h-32 md:w-32">
            {/* Gradient fallback behind avatar */}
            <motion.div
              className="absolute inset-0 -z-10 rounded-2xl blur-md"
              style={{
                background:
                  "conic-gradient(from 140deg at 50% 50%, rgba(56,189,248,.35), rgba(232,121,249,.35), rgba(37, 98, 234), rgba(37, 98, 234))",
              }}
              initial={{ rotate: -8, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            {/* SVG pattern background (place /public/avatar-bg.svg) */}
            <motion.img
              src="/avatar-bg.svg"
              alt=""
              aria-hidden
              className="absolute inset-0 -z-10 h-full w-full rounded-2xl opacity-70 dark:opacity-60"
              initial={{ scale: 0.9, rotate: -4, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 0.7 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            {/* Soft ring */}
            {/* <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl ring-1 ring-black/10 dark:ring-white/10" /> */}

            {/* Avatar image (transparent PNG) */}
            <motion.img
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              src="/avatar.png"
              alt="Avatar"
              className="h-full w-full rounded-2xl bg-white/70 object-cover shadow-sm ring-1 ring-black/10 backdrop-blur-sm dark:bg-white/5 dark:ring-white/10"
            />
          </div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight md:text-5xl"
          >
            Raphael Comandon — Développeur Full-Stack
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-balance text-lg opacity-80"
          >
            <Balancer>{dict.hero_sub}</Balancer>
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <Link
              href="/Raphael_Comandon_CV.pdf"
              className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white shadow hover:opacity-90"
            >
              {dict.btn_download_cv}
            </Link>
            <Link
              href="./contact"
              className="rounded-full border px-5 py-2.5 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
            >
              {dict.btn_contact_me}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
