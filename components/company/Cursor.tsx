/** The lime underscore that ends the "Made differently_" headings. Mark: [data-cursor] (blinked by gsap). */
export function Cursor() {
  return (
    <span
      data-cursor
      aria-hidden="true"
      className="ml-[0.06em] inline-block h-[0.075em] w-[0.46em] bg-primary-400 align-baseline"
    />
  );
}
