import type { Metadata } from "next";
import { ServiceArc } from "@/components/services/ServiceArc";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServiceStack } from "@/components/services/ServiceStack";
import { ContactCta } from "@/components/shared/ContactCta";

export const metadata: Metadata = {
  title: "Services",
  description: "Strategy, design, content, film, software and automation, run by one connected team.",
};

export default function ServicesPage() {
  return (
    <main>
      <ServicesHero />
      <ServiceArc />
      <ServiceStack />
      <ContactCta />
    </main>
  );
}
