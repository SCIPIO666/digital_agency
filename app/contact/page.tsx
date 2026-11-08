import type { Metadata } from "next";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = { title: "Contact", description: "Let's make you the easy one to find." };

// No <ContactCta /> here: this IS the destination.
export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <ContactForm />
    </main>
  );
}
