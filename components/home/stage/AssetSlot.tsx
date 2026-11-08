import Image from "next/image";
import { slotMap, type SlotId } from "@/lib/stage";

/**
 * One place for one generated asset.
 *  - If `src` is set in lib/stage.ts: renders the real image or video.
 *  - If not: renders a labelled placeholder saying exactly what to generate.
 * The placeholder labels hide when the HUD's "Slots" switch is off.
 */
export function AssetSlot({
  id,
  fit = "cover",
  priority = false,
  safe = false,
  className = "",
}: {
  id: SlotId;
  fit?: "cover" | "contain";
  priority?: boolean;
  /** Full-bleed slots: push the label inward so parallax/zoom never crops it or hides it under the brand mark */
  safe?: boolean;
  className?: string;
}) {
  const def = slotMap[id];
  const objectFit = fit === "cover" ? "object-cover" : "object-contain";

  if (def.src) {
    if (def.kind === "video") {
      return (
        <video
          className={`absolute inset-0 size-full ${objectFit} ${className}`}
          src={def.src}
          poster={def.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      );
    }
    return (
      <Image
        src={def.src}
        alt=""
        fill
        priority={priority}
        sizes="(min-width:768px) 50vw, 100vw"
        className={`${objectFit} ${className}`}
      />
    );
  }

  return (
    <div
      className={`absolute inset-0 overflow-hidden border border-dashed border-primary/70 bg-placeholder group-data-[slots=off]/stage:opacity-0 ${className}`}
    >
      <div className="absolute inset-0 bg-secondary-100/70" />
      <div className={`relative flex h-full flex-col items-start justify-start gap-1.5 p-3 text-left ${safe ? "pt-[22%] pl-[14%] pr-[14%]" : ""}`}>
        <span className="rounded-sm bg-primary px-1.5 py-0.5 text-[0.5625rem] font-bold tracking-eyebrow text-on-primary uppercase">
          Asset slot · {def.scene}
        </span>
        <span className="text-xs font-bold text-foreground">{id}</span>
        <span className="text-[0.625rem] leading-snug text-body">
          <b className="text-primary-700">{def.kind}</b> · {def.size}
        </span>
        <span className="font-mono text-[0.5625rem] leading-snug text-muted">public/stage/{def.file}</span>
        <span className="hidden text-[0.625rem] leading-snug text-muted sm:block">{def.note}</span>
      </div>
    </div>
  );
}
