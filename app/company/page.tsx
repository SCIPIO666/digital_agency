import type { Metadata } from "next";
import { CompanyHero } from "@/components/company/CompanyHero";
import { CompanyBanner } from "@/components/company/CompanyBanner";
import { CompanyNumbers } from "@/components/company/CompanyNumbers";
import { CompanyDifferently } from "@/components/company/CompanyDifferently";
import { CompanyMeans } from "@/components/company/CompanyMeans";
import { CompanyExperienced } from "@/components/company/CompanyExperienced";
import { CompanyTeam } from "@/components/company/CompanyTeam";
import { CompanyValues } from "@/components/company/CompanyValues";
import { CompanyPreCta } from "@/components/company/CompanyPreCta";
import { ContactCta } from "@/components/shared/ContactCta";

export const metadata: Metadata = {
  title: "Company",
  description: "Nuevazen is a human-first, AI-native design and technology company. Meet the team and the way we work.",
};

export default function CompanyPage() {
  return (
    <main>
      <CompanyHero />
      <CompanyBanner />
      <CompanyNumbers />
      <CompanyDifferently />
      <CompanyMeans />
      <CompanyExperienced />
      <CompanyTeam />
      <CompanyValues />
      <CompanyPreCta />
      <ContactCta />
    </main>
  );
}
