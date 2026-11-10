"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { durations, easeOut } from "@/lib/motion";

export function Reveal({
  children,
  className,
  delay = 0,
  mode = "view",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  mode?: "enter" | "view";
}) {
  const enter = mode === "enter";

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={enter ? { opacity: 1, y: 0 } : undefined}
      whileInView={enter ? undefined : { opacity: 1, y: 0 }}
      viewport={enter ? undefined : { once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: durations.base, ease: easeOut, delay }}
    >
      {children}
    </motion.div>
  );
}
