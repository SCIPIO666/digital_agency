import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";

export default function NotFound() {
  return (
    <PageShell eyebrow="404" title="Nothing here" intro="That page does not exist. Use the menu below, or head home.">
      <Link href="/" className="btn btn-primary">
        Back home
      </Link>
    </PageShell>
  );
}
