import type { Metadata } from "next";
import { CaseStudiesHero } from "@/components/case-studies/CaseStudiesHero";
import { CaseIntro } from "@/components/case-studies/CaseIntro";
import { ProjectsShowcase } from "@/components/case-studies/ProjectsShowcase";
import { ContactCta } from "@/components/shared/ContactCta";

export const metadata: Metadata = { title: "Case Studies", description: "Proof, not promises. Selected work from Nuevazen across brand, web, film, content, software and automation." };

export default function CaseStudiesPage() {
  return (
    <main>
      <CaseStudiesHero />
      <CaseIntro />
      <ProjectsShowcase />
      <ContactCta />
    </main>
  );
}
