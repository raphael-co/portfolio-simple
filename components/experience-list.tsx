"use client";

import { motion } from "framer-motion";
import ExperienceCard from "@/components/experience-card";
import type { ExperienceEntry } from "@/lib/data";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 380, damping: 28, mass: 0.6 },
  },
};

export default function ExperienceList({ items }: { items: ExperienceEntry[] }) {
  return (
    <motion.div
      className="grid gap-6"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      {items.map((e, i) => (
        <motion.div key={`${e.company}-${i}`} variants={item} layout>
          <ExperienceCard {...e} />
        </motion.div>
      ))}
    </motion.div>
  );
}
