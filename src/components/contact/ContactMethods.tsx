import { Mail, MessageCircle, Phone } from "lucide-react";
import { contactInfo, displayPhone, socialLinks, whatsappHref } from "@/data/contact";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export function ContactMethods({
  tone = "ivory",
  compact = false,
  className,
}: {
  tone?: "ivory" | "burgundy";
  compact?: boolean;
  className?: string;
}) {
  const quiet = tone === "burgundy";
  const text = quiet ? "text-ivory" : "text-charcoal";
  const label = quiet ? "text-sandstone" : "text-charcoal/70";
  const icon = quiet ? "text-gold" : "text-gold";

  return (
    <div className={className}>
      <ul className={cn("grid", compact ? "gap-3" : "gap-5")}>
        <li>
          <a href={`mailto:${contactInfo.email}`} className={cn("inline-flex items-start gap-3 text-sm leading-6 underline decoration-gold/70 underline-offset-4", text)}>
            <Mail aria-hidden="true" className={cn("mt-1 h-4 w-4 shrink-0", icon)} />
            <span className="min-w-0 break-all">{contactInfo.email}</span>
          </a>
        </li>
        <li>
          <a href={`tel:${contactInfo.phone}`} className={cn("inline-flex items-center gap-3 text-sm leading-6 underline decoration-gold/70 underline-offset-4", text)}>
            <Phone aria-hidden="true" className={cn("h-4 w-4 shrink-0", icon)} />
            <span>{displayPhone(contactInfo.phone)}</span>
          </a>
        </li>
        <li>
          <Button
            href={whatsappHref()}
            variant={quiet ? "light" : "secondary"}
            {...external}
            aria-label="WhatsApp, opens in a new tab"
          >
            <MessageCircle aria-hidden="true" className="mr-2 h-4 w-4" />
            WhatsApp
          </Button>
        </li>
      </ul>
      <p className={cn("font-sans text-[0.68rem] uppercase tracking-[0.2em]", label, compact ? "mt-8" : "mt-10")}>Social</p>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {socialLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              {...external}
              className={cn("text-sm underline decoration-gold/70 underline-offset-4", text)}
              aria-label={`${link.label}, opens in a new tab`}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
