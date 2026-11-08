import type { Metadata } from "next";
import { ProcessHero } from "@/components/process/ProcessHero";
import { ProcessSteps } from "@/components/process/ProcessSteps";
import { ContactCta } from "@/components/shared/ContactCta";

export const metadata: Metadata = {
  title: "Process",
  description: "How Nuevazen works: six clear steps from the first conversation to long after launch.",
};

export default function ProcessPage() {
  return (
    <main>
      <ProcessHero />
      <ProcessSteps />
      <ContactCta />
    </main>
  );
}
