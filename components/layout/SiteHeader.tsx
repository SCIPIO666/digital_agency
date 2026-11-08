import Link from "next/link";
import { site } from "@/lib/site";

/** Brand mark, fixed top-left on every page. Navigation itself lives in the bottom-circle menu. */
export function SiteHeader() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 p-5 md:p-7">
      <Link
        href="/"
        className="pointer-events-auto inline-block font-sans text-lg font-bold uppercase tracking-tight text-foreground"
      >
        {site.name}
        <span className="text-primary">.</span>
      </Link>
    </header>
  );
}
