import type { Metadata } from "next";
import { PageShell, Placeholder } from "@/components/layout/PageShell";

export const metadata: Metadata = { title: "Legal notices" };

export default function LegalPage() {
  return (
    <PageShell eyebrow="Legal" title="Legal notices">
      <Placeholder label="Privacy, cookies and terms go here" />
    </PageShell>
  );
}
