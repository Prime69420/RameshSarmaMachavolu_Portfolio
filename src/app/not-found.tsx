import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GoldRule } from "@/components/ui/GoldRule";
import { Heading } from "@/components/ui/Heading";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Container className="py-24 md:py-section">
      <Eyebrow>404</Eyebrow>
      <Heading as="h1" size="title" className="mt-6 max-w-xl">
        This page is not part of the record.
      </Heading>
      <GoldRule className="mt-8" />
      <p className="mt-8 max-w-md text-lg leading-8 text-charcoal/80">
        The address does not match a page that has been published.
      </p>
      <div className="mt-10">
        <Button href="/" variant="quiet">
          Return home
        </Button>
      </div>
    </Container>
  );
}
