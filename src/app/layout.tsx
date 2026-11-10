import type { Metadata } from "next";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { SiteShell } from "@/components/layout/SiteShell";
import { site } from "@/data/site";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: site.honorificName,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={site.locale} className={fontVariables}>
      <body>
        <MotionProvider>
          <SiteShell>{children}</SiteShell>
        </MotionProvider>
      </body>
    </html>
  );
}
