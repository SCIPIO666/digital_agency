import type { ReactNode } from "react";

type PageShellProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  children?: ReactNode;
};

/**
 * Standard frame for every inner page: space for the fixed brand + bottom menu circle,
 * a consistent heading block, then whatever the page passes as children.
 * Inner-page design comes later; for now each page fills this shell with placeholders.
 */
export function PageShell({ eyebrow, title, intro, children }: PageShellProps) {
  return (
    <main className="mx-auto min-h-dvh max-w-page px-6 pt-32 pb-44 md:px-10">
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h1 className="max-w-4xl font-sans text-mega font-semibold uppercase">{title}</h1>
      {intro && <p className="mt-6 max-w-prose font-display text-quote text-body">{intro}</p>}
      <div className="mt-16">{children}</div>
    </main>
  );
}

/** Dashed box that marks "design goes here" so unfinished sections are obvious. */
export function Placeholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div
      className={`bg-placeholder flex min-h-40 items-center justify-center rounded-lg border border-border text-[0.6875rem] tracking-eyebrow text-ink-500 uppercase ${className}`}
    >
      {label}
    </div>
  );
}
