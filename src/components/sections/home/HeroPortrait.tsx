"use client";

import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArchMotif } from "@/components/ui/ArchMotif";

const portraitMask = [
  "[mask-image:radial-gradient(ellipse_50%_40%_at_50%_38%,black_58%,transparent_100%)]",
  "[-webkit-mask-image:radial-gradient(ellipse_50%_40%_at_50%_38%,black_58%,transparent_100%)]",
  "md:[mask-image:radial-gradient(ellipse_88%_84%_at_50%_42%,black_46%,transparent_100%)]",
  "md:[-webkit-mask-image:radial-gradient(ellipse_88%_84%_at_50%_42%,black_46%,transparent_100%)]",
  "[mask-repeat:no-repeat]",
  "[-webkit-mask-repeat:no-repeat]",
  "[mask-size:100%_100%]",
  "[-webkit-mask-size:100%_100%]",
].join(" ");

function useDesktopLayout() {
  return useSyncExternalStore(
    (notify) => {
      const query = window.matchMedia("(min-width: 768px)");
      query.addEventListener("change", notify);
      return () => query.removeEventListener("change", notify);
    },
    () => window.matchMedia("(min-width: 768px)").matches,
    () => true,
  );
}

export function HeroPortrait() {
  const ref = useRef<HTMLElement>(null);
  const desktop = useDesktopLayout();
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.92], [1, 1, 0]);
  const fade = !desktop && reduceMotion === false;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!fade) {
      node.style.opacity = "";
      return;
    }
    const apply = (value: number) => {
      node.style.opacity = String(value);
    };
    apply(opacity.get());
    return opacity.on("change", apply);
  }, [fade, opacity]);

  return (
    <figure
      ref={ref}
      className={`relative order-first min-w-0 md:order-0 lg:col-span-5${fade ? " max-md:[will-change:opacity]" : ""}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[8%] inset-y-[6%] bg-[radial-gradient(ellipse_at_center,#541d27_0%,rgba(84,29,39,0.72)_42%,transparent_74%)] max-md:hidden"
      />
      <ArchMotif className="pointer-events-none absolute bottom-[8%] left-1/2 h-48 w-48 -translate-x-1/2 text-gold/30 max-md:hidden md:h-56 md:w-56" />
      <div className={`relative mx-auto h-[24rem] w-full max-w-lg sm:h-[28rem] md:h-[32rem] md:max-w-none lg:h-[38rem] ${portraitMask}`}>
        <Image
          src="/images/ramesh-sarma-portrait.jpeg"
          alt="Portrait of Machavolu Ramesh Sarma, Vedic Scholar."
          fill
          priority
          sizes="(min-width: 1024px) 540px, (min-width: 768px) 46vw, 92vw"
          className="object-cover object-[center_6%] md:object-[center_18%] lg:object-[center_16%]"
        />
      </div>
    </figure>
  );
}
