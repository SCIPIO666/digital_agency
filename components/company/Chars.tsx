/** Splits text into per-character spans (masked) so gsap can rise them in. Mark: [data-char] */
export function Chars({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((ch, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]">
          <span data-char className="inline-block will-change-transform">
            {ch === " " ? "\u00A0" : ch}
          </span>
        </span>
      ))}
    </>
  );
}
