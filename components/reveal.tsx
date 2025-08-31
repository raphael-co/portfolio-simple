"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Reveal({ children, y = 20, delay = 0 }: { children: React.ReactNode; y?: number; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ y, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}
