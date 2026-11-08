import { Fragment } from "react";

/**
 * Splits a string into words, each inside an overflow-hidden mask, so GSAP can
 * slide them up from below. Every word carries `data-word`; the parent
 * component animates `[data-word]` (yPercent 110 -> 0).
 * Server-safe: no hooks, no GSAP here.
 */
export function MaskedWords({ text, highlightLast = false }: { text: string; highlightLast?: boolean }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="-mb-[0.1em] inline-block overflow-hidden pb-[0.1em] align-bottom">
            <span data-word className={`inline-block ${highlightLast && i === words.length - 1 ? "hl-chip" : ""}`}>
              {word}
            </span>
          </span>{" "}
        </Fragment>
      ))}
    </>
  );
}
