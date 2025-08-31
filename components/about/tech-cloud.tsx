"use client";

import { motion } from "framer-motion";

export default function TechCloud({ tags }: { tags: string[] }) {
  return (
    <div
      className="
        -mx-2 flex gap-2 overflow-x-auto px-2 py-2
        sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0
        [-ms-overflow-style:none] [scrollbar-width:none]
        [&::-webkit-scrollbar]:hidden
        snap-x snap-mandatory sm:snap-none
      "
    >
      {tags.map((t, i) => (
        <motion.span
          key={t}
          initial={{ opacity: 0, scale: 0.95, y: 4 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.2, delay: i * 0.015 }}
          className="
            snap-start whitespace-nowrap rounded-full border px-3 py-1.5
            text-[11px] sm:text-xs dark:border-white/10
          "
        >
          {t}
        </motion.span>
      ))}
    </div>
  );
}
