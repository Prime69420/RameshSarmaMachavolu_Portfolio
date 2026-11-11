import type { Metadata } from "next";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { SiteShell } from "@/components/layout/SiteShell";
import { site } from "@/data/site";
import { fontVariables } from "@/lib/fonts";
import { defaultDescription, publicPages, siteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: publicPages.home.title,
    template: `%s | ${site.name}`,
  },
  description: defaultDescription,
  applicationName: site.name,
  authors: [{ name: site.name, url: siteUrl.origin }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
  },
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
