"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { site } from "@/data/site";
import { durations, easeOut } from "@/lib/motion";
import { Container } from "@/components/layout/Container";
import { SiteNav } from "@/components/layout/SiteNav";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const isClient = useIsClient();
  const titleId = useId();
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const chrome = document.querySelectorAll("[data-page-chrome]");
    const openButton = openButtonRef.current;
    chrome.forEach((node) => node.setAttribute("inert", ""));

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        restoreFocus.current = true;
        setOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    closeButtonRef.current?.focus();

    return () => {
      chrome.forEach((node) => node.removeAttribute("inert"));
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      if (restoreFocus.current) {
        openButton?.focus();
        restoreFocus.current = false;
      }
    };
  }, [open]);

  function close(options?: { restore?: boolean }) {
    restoreFocus.current = options?.restore ?? false;
    setOpen(false);
  }

  const menu = (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="site-menu"
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: durations.fast, ease: easeOut }}
          className="fixed inset-0 z-50 overflow-y-auto bg-ivory"
        >
          <Container className="flex items-center justify-between border-b border-sandstone py-4">
            <p id={titleId} className="font-sans text-[0.72rem] uppercase tracking-[0.28em] text-charcoal">
              Menu
            </p>
            <button
              ref={closeButtonRef}
              type="button"
              className="inline-flex items-center gap-2.5 font-sans text-[0.72rem] uppercase tracking-[0.22em] text-charcoal"
              onClick={() => close({ restore: true })}
            >
              <X aria-hidden="true" size={18} strokeWidth={1.25} />
              Close
            </button>
          </Container>
          <Container className="py-8">
            <SiteNav
              tone="menu"
              className="grid border-t border-sandstone"
              linkClassName="block border-b border-sandstone/80 py-4"
              onNavigate={(event) => {
                const href = event.currentTarget.getAttribute("href") ?? "";
                const url = new URL(href, window.location.origin);
                const id = url.hash.replace(/^#/, "");
                const samePage = url.pathname === window.location.pathname;

                if (!samePage || !id) {
                  close();
                  return;
                }

                event.preventDefault();
                document.querySelectorAll("[data-page-chrome]").forEach((node) => {
                  node.removeAttribute("inert");
                });
                document.body.style.overflow = "";
                close();
                window.setTimeout(() => {
                  document.getElementById(id)?.scrollIntoView();
                  if (window.location.hash !== `#${id}`) {
                    window.history.pushState(null, "", `#${id}`);
                  }
                }, 0);
              }}
            />
          </Container>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <header data-page-chrome="" className="sticky top-0 z-40 border-b border-sandstone bg-ivory">
      <Container className="flex items-center justify-between gap-8 py-4 md:py-5">
        <Link href="/#top" className="min-w-0">
          <span className="block font-display text-[1.05rem] uppercase leading-none tracking-[0.16em] text-burgundy sm:text-lg">
            {site.givenLines[0]}
          </span>
          <span className="mt-1.5 block font-display text-[1.05rem] uppercase leading-none tracking-[0.16em] text-burgundy sm:text-lg">
            {site.givenLines[1]}
          </span>
          <span className="mt-2 block font-sans text-[0.68rem] uppercase tracking-[0.18em] text-charcoal/75">
            {site.headerSubtitle}
          </span>
        </Link>
        <SiteNav tone="ivory" className="hidden items-center gap-x-5 xl:flex" />
        <button
          ref={openButtonRef}
          type="button"
          className="inline-flex shrink-0 items-center gap-2.5 font-sans text-[0.72rem] uppercase tracking-[0.22em] text-charcoal xl:hidden"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen(true)}
        >
          <Menu aria-hidden="true" size={18} strokeWidth={1.25} />
          Menu
        </button>
      </Container>
      {isClient ? createPortal(menu, document.body) : null}
    </header>
  );
}
