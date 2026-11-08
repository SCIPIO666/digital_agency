import type { Metadata } from "next";
import { ReviewsCanvas } from "@/components/reviews/ReviewsCanvas";
import { ContactCta } from "@/components/shared/ContactCta";

export const metadata: Metadata = {
  title: "Reviews",
  description: "What clients say about working with Nuevazen, in their own words.",
};

export default function ReviewsPage() {
  return (
    <main>
      <ReviewsCanvas />
      <div id="reviews-cta">
        <ContactCta />
      </div>
    </main>
  );
}
