import { cn } from "@/lib/cn";

export function GoldRule({ className }: { className?: string }) {
  return (
    <div role="presentation" className={cn("flex items-center", className)}>
      <span className="h-px w-16 bg-gold sm:w-24" />
      <span className="mx-3 size-2 rotate-45 border border-gold" />
      <span className="h-px w-8 bg-gold" />
    </div>
  );
}
