"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@/components/providers/SmoothScroll";
import { services } from "@/lib/services";
import { budgetOptions, heardOptions, timelineOptions } from "@/lib/contact";

gsap.registerPlugin(ScrollTrigger);

type Errors = Partial<Record<"name" | "email" | "phone" | "services" | "message" | "heard" | "timeline" | "budget", string>>;
type Status = "idle" | "sending" | "sent" | "error";

const FIELD_ORDER: (keyof Errors)[] = ["name", "email", "phone", "services", "message", "heard", "timeline", "budget"];

// Explicit colours (not Tailwind classes) because GSAP tweens these on focus/blur.
const FIELD_REST = { backgroundColor: "#f5f3ee", borderColor: "rgba(23,23,19,0.3)", boxShadow: "0 0 0 0 rgba(23,23,19,0)" };
const FIELD_FOCUS = { backgroundColor: "#fffefa", borderColor: "#171713", boxShadow: "0 14px 28px -14px rgba(23,23,19,0.35)" };
const FIELD_INVALID = { ...FIELD_REST, borderColor: "#b91c1c" };

const COUNTRY_DIAL_CODES = [
  { iso: "KE", name: "Kenya", dial: "+254" },
  { iso: "UG", name: "Uganda", dial: "+256" },
  { iso: "TZ", name: "Tanzania", dial: "+255" },
  { iso: "RW", name: "Rwanda", dial: "+250" },
  { iso: "BI", name: "Burundi", dial: "+257" },
  { iso: "SS", name: "South Sudan", dial: "+211" },
  { iso: "ET", name: "Ethiopia", dial: "+251" },
  { iso: "SO", name: "Somalia", dial: "+252" },
  { iso: "CD", name: "DR Congo", dial: "+243" },
  { iso: "NG", name: "Nigeria", dial: "+234" },
  { iso: "GH", name: "Ghana", dial: "+233" },
  { iso: "ZA", name: "South Africa", dial: "+27" },
  { iso: "ZM", name: "Zambia", dial: "+260" },
  { iso: "ZW", name: "Zimbabwe", dial: "+263" },
  { iso: "EG", name: "Egypt", dial: "+20" },
  { iso: "GB", name: "United Kingdom", dial: "+44" },
  { iso: "IE", name: "Ireland", dial: "+353" },
  { iso: "US", name: "United States", dial: "+1" },
  { iso: "CA", name: "Canada", dial: "+1" },
  { iso: "MX", name: "Mexico", dial: "+52" },
  { iso: "IN", name: "India", dial: "+91" },
  { iso: "AE", name: "United Arab Emirates", dial: "+971" },
  { iso: "SA", name: "Saudi Arabia", dial: "+966" },
  { iso: "AU", name: "Australia", dial: "+61" },
  { iso: "DE", name: "Germany", dial: "+49" },
  { iso: "FR", name: "France", dial: "+33" },
  { iso: "NL", name: "Netherlands", dial: "+31" },
  { iso: "SE", name: "Sweden", dial: "+46" },
  { iso: "CN", name: "China", dial: "+86" },
  { iso: "JP", name: "Japan", dial: "+81" },
] as const;

function validate(fd: FormData): Errors {
  const e: Errors = {};
  const text = (k: string) => String(fd.get(k) ?? "").trim();

  if (text("name").length < 2) e.name = "Please tell us your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text("email"))) e.email = "That email doesn’t look right.";
  const phone = text("phone");
  if (phone) {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 6 || digits.length > 15) e.phone = "That phone number looks too short or too long.";
  }
  if (fd.getAll("services").length === 0) e.services = "Pick at least one service.";
  if (text("message").length < 10) e.message = "A sentence or two about the project helps us a lot.";
  if (!text("heard")) e.heard = "Please choose one.";
  if (!text("timeline")) e.timeline = "Please choose one.";
  if (!text("budget")) e.budget = "Please choose one.";
  return e;
}

function buildPhone(dial: string, raw: string) {
  const value = raw.trim();
  if (!value) return "";
  if (value.startsWith("+")) return `+${value.replace(/\D/g, "")}`;
  return `${dial}${value.replace(/\D/g, "").replace(/^0+/, "")}`;
}

/* ---- small presentational pieces ---------------------------------------- */

function Step({ n, title, hint, children }: { n: string; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section
      data-step
      className="grid grid-cols-1 gap-8 border-t border-border py-10 first:border-t-0 first:pt-0 md:grid-cols-12 md:gap-10 md:py-14"
    >
      <div className="min-w-0 md:col-span-4">
        {/* ink disc + lime numeral: the strongest contrast on the page, so the eye finds each step */}
        <p className="grid size-12 place-items-center rounded-full bg-foreground font-sans text-sm font-bold tracking-nav text-primary-400 tabular-nums">
          {n}
        </p>
        <h2 className="mt-5 font-sans text-title leading-none font-semibold tracking-tight text-foreground uppercase">{title}</h2>
        {hint && <p className="mt-3 max-w-xs font-display text-base text-body">{hint}</p>}
      </div>
      <div className="min-w-0 md:col-span-8">{children}</div>
    </section>
  );
}

function ErrorText({ id, children }: { id: string; children?: string }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-3 text-sm font-semibold text-[#b91c1c]">
      {children}
    </p>
  );
}

const Req = () => (
  <>
    <span aria-hidden="true"> *</span>
    <span className="sr-only"> (required)</span>
  </>
);

/** Filled input / textarea. On focus GSAP lifts the box (white, ink border, shadow) and draws a lime bar. */
function Field({
  label,
  name,
  type = "text",
  required,
  error,
  autoComplete,
  placeholder,
  multiline,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
  multiline?: boolean;
}) {
  const common = {
    id: name,
    name,
    placeholder,
    autoComplete,
    "aria-required": required || undefined,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${name}-error` : undefined,
    className:
      "mt-1.5 block w-full bg-transparent font-display text-[clamp(1.25rem,2vw,1.75rem)] text-foreground placeholder:text-muted focus:outline-none focus-visible:outline-none",
  };
  return (
    <div>
      <div
        data-field
        className="relative overflow-hidden rounded-xl border px-5 pt-4 pb-4"
        style={error ? FIELD_INVALID : FIELD_REST}
      >
        <label htmlFor={name} className="block text-[0.6875rem] font-bold tracking-eyebrow text-body uppercase">
          {label}
          {required && <Req />}
        </label>
        {multiline ? <textarea rows={4} {...common} className={`${common.className} resize-none`} /> : <input type={type} {...common} />}
        <span
          data-line
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1 bg-primary-500"
          style={{ transform: "scaleX(0)", transformOrigin: "0% 50%" }}
        />
      </div>
      <ErrorText id={`${name}-error`}>{error}</ErrorText>
    </div>
  );
}

function Pill({ type, name, value }: { type: "checkbox" | "radio"; name: string; value: string }) {
  return (
    <label className="cursor-pointer">
      <input type={type} name={name} value={value} className="peer sr-only" />
      <span
        data-pill
        className="inline-block rounded-full border border-foreground/45 bg-card px-4 py-2.5 text-[0.75rem] font-bold tracking-nav text-foreground uppercase transition-[background-color,border-color,box-shadow] duration-200 hover:border-foreground peer-checked:border-foreground peer-checked:bg-primary-400 peer-checked:shadow-[0_8px_16px_-8px_rgba(23,23,19,0.55)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring"
      >
        {value}
      </span>
    </label>
  );
}

/** Pills sit on a tinted panel so the white (unselected) and lime (selected) states both read clearly. */
function PillGroup({
  legend,
  name,
  type,
  options,
  error,
  required,
  hideLegend,
}: {
  legend: string;
  name: string;
  type: "checkbox" | "radio";
  options: readonly string[];
  error?: string;
  required?: boolean;
  hideLegend?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-secondary-100 p-5 md:p-6">
      <fieldset aria-describedby={error ? `${name}-error` : undefined}>
        <legend className={hideLegend ? "sr-only" : "mb-4 text-[0.6875rem] font-bold tracking-eyebrow text-body uppercase"}>
          {legend}
          {required && <Req />}
        </legend>
        <div className="flex flex-wrap gap-2.5">
          {options.map((o) => (
            <Pill key={o} type={type} name={name} value={o} />
          ))}
        </div>
        <ErrorText id={`${name}-error`}>{error}</ErrorText>
      </fieldset>
    </div>
  );
}

/* ---- the form ----------------------------------------------------------- */

/**
 * Contact page form, lifted onto a white card that sits on a tinted band
 * (page paper > band > card > filled fields > pills). Ends in a dark ink submit panel
 * for the strongest contrast on the page.
 * Motion (all GSAP): steps reveal on scroll (reversible), fields lift + draw a lime bar
 * on focus, chips pop when picked, the submit arrow turns on hover, success panel animates in.
 */
export function ContactForm() {
  const rootRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [phoneCountry, setPhoneCountry] = useState("KE");
  const selectedCountry = COUNTRY_DIAL_CODES.find((country) => country.iso === phoneCountry) ?? COUNTRY_DIAL_CODES[0];

  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Scroll-in for each step.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.utils.toArray<HTMLElement>("[data-step]", root).forEach((step) => {
          gsap.fromTo(
            step.children,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "expo.out",
              stagger: 0.1,
              scrollTrigger: { trigger: step, start: "top 88%", toggleActions: "play none none reverse" },
            },
          );
        });
      },
      root,
    );
    return () => mm.revert();
  }, []);

  // Success panel.
  useEffect(() => {
    if (status !== "sent") return;
    const done = doneRef.current;
    if (!done) return;
    done.focus({ preventScroll: true });
    if (!reduced()) {
      gsap.fromTo(done.children, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.1 });
    }
    if (rootRef.current) lenis?.scrollTo(rootRef.current, { offset: -96 });
  }, [status, lenis]);

  const moveLine = (target: EventTarget, focused: boolean) => {
    const box = (target as HTMLElement).closest<HTMLElement>("[data-field]");
    if (!box) return;
    const invalid = !!box.querySelector('[aria-invalid="true"]');
    const duration = reduced() ? 0 : 0.5;
    gsap.to(box, { ...(focused ? FIELD_FOCUS : invalid ? FIELD_INVALID : FIELD_REST), duration, ease: "expo.out" });
    gsap.to(box.querySelector("[data-line]"), { scaleX: focused ? 1 : 0, duration, ease: "expo.out" });
  };

  const onChange = (e: FormEvent<HTMLFormElement>) => {
    const t = e.target as HTMLInputElement;
    if (t.name && errors[t.name as keyof Errors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[t.name as keyof Errors];
        return next;
      });
    }
    if ((t.type === "checkbox" || t.type === "radio") && t.checked && !reduced()) {
      const pill = t.parentElement?.querySelector("[data-pill]");
      if (pill) gsap.fromTo(pill, { scale: 0.92 }, { scale: 1, duration: 0.5, ease: "back.out(3)" });
    }
  };

  const turnArrow = (e: React.PointerEvent<HTMLButtonElement>, deg: number) => {
    const arrow = e.currentTarget.querySelector("[data-arrow]");
    if (arrow) gsap.to(arrow, { rotate: deg, duration: reduced() ? 0 : 0.5, ease: "expo.out" });
  };

  const scrollToField = (name: string) => {
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${name}"]`);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -180 });
    else el.scrollIntoView({ block: "center" });
    el.focus({ preventScroll: true });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    const fd = new FormData(e.currentTarget);
    const found = validate(fd);
    setErrors(found);
    const first = FIELD_ORDER.find((k) => found[k]);
    if (first) {
      scrollToField(first);
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          phone: buildPhone(selectedCountry.dial, String(fd.get("phone") ?? "")),
          company: fd.get("company"),
          services: fd.getAll("services"),
          message: fd.get("message"),
          heard: fd.get("heard"),
          timeline: fd.get("timeline"),
          budget: fd.get("budget"),
          website: fd.get("website"), // honeypot, must stay empty
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      ref={rootRef}
      aria-label="Project brief"
      className="relative z-10 -mt-12 rounded-t-[2.5rem] bg-secondary-200 px-3 pt-3 pb-44 shadow-[0_-24px_48px_-24px_rgba(23,23,19,0.2)] md:-mt-16 md:px-6 md:pt-6 md:pb-52"
    >
      <div className="mx-auto max-w-page rounded-[2rem] bg-card p-6 shadow-lift ring-1 ring-foreground/5 md:p-12 lg:p-16">
        {status === "sent" ? (
          <div ref={doneRef} tabIndex={-1} role="status" className="rounded-2xl bg-ink-950 p-8 text-card outline-none md:p-16">
            <p className="text-[0.6875rem] font-bold tracking-eyebrow text-primary-400 uppercase">Sent</p>
            <h2 className="mt-6 max-w-4xl font-sans text-mega font-semibold uppercase">
                Thank you.
            </h2>
            <p className="mt-8 max-w-xl font-display text-quote text-card/80">
              Your brief has been submitted. We’ll be in touch shortly to schedule your discovery call.
            </p>
          </div>
        ) : (
          <form
            ref={formRef}
            noValidate
            onSubmit={onSubmit}
            onChange={onChange}
            onFocus={(e) => moveLine(e.target, true)}
            onBlur={(e) => moveLine(e.target, false)}
            aria-describedby={status === "error" ? "form-error" : undefined}
            className="relative"
          >
            <Step n="01" title="Who are you?" hint="So we know who to write back to.">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 [&>*]:min-w-0">
                <Field label="Your name" name="name" required autoComplete="name" placeholder="Jane Mwangi" error={errors.name} />
                <Field label="Email" name="email" type="email" required autoComplete="email" placeholder="jane@company.com" error={errors.email} />
                <div className="md:col-span-2">
                  <div data-field className="relative min-w-0 overflow-hidden rounded-xl border px-5 pt-4 pb-4" style={errors.phone ? FIELD_INVALID : FIELD_REST}>
                    <label htmlFor="phone" className="block text-[0.6875rem] font-bold tracking-eyebrow text-body uppercase">
                      Phone number
                    </label>
                    <div className="mt-2 flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                      <label htmlFor="phoneCountry" className="sr-only">
                        Country
                      </label>
                      <select
                        id="phoneCountry"
                        value={phoneCountry}
                        onChange={(event) => setPhoneCountry(event.target.value)}
                        className="w-full min-w-0 rounded-md bg-card px-2.5 py-2 font-sans text-sm font-semibold text-foreground focus:outline-none sm:w-auto sm:max-w-[11rem] sm:shrink-0"
                      >
                        {COUNTRY_DIAL_CODES.map((country) => (
                          <option key={country.iso} value={country.iso}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <span aria-live="polite" className="shrink-0 rounded-md bg-card px-2.5 py-2 font-sans text-sm font-bold text-foreground">
                          {selectedCountry.dial}
                        </span>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel-national"
                          placeholder="712 345 678"
                          aria-label="Phone number without country code"
                          aria-invalid={errors.phone ? true : undefined}
                          aria-describedby={errors.phone ? "phone-error" : "phone-hint"}
                          className="w-full min-w-0 flex-1 bg-transparent py-2 font-display text-[clamp(1.125rem,2vw,1.5rem)] text-foreground placeholder:text-muted focus:outline-none focus-visible:outline-none"
                        />
                      </div>
                    </div>
                    <span
                      data-line
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-1 bg-primary-500"
                      style={{ transform: "scaleX(0)", transformOrigin: "0% 50%" }}
                    />
                  </div>
                  {errors.phone ? (
                    <ErrorText id="phone-error">{errors.phone}</ErrorText>
                  ) : (
                    <p id="phone-hint" className="mt-2 text-xs text-body">
                      Optional. Enter it without the leading zero.
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Field label="Company or project name" name="company" autoComplete="organization" placeholder="Optional" />
                </div>
              </div>
            </Step>

            <Step n="02" title="What do you need?" hint="Pick as many as you like. We’ll sort out how they fit together.">
              <PillGroup
                legend="Services"
                hideLegend
                required
                name="services"
                type="checkbox"
                options={services.map((s) => s.title)}
                error={errors.services}
              />
            </Step>

            <Step n="03" title="Tell us about it" hint="What are you building, fixing or launching? Rough is fine.">
              <Field
                label="About the project"
                name="message"
                required
                multiline
                placeholder="We run a ... and we want to ..."
                error={errors.message}
              />
            </Step>

            <Step n="04" title="A few details" hint="Helps us come back with something useful, not a questionnaire.">
              <div className="space-y-4">
                <PillGroup legend="How did you hear about us?" required name="heard" type="radio" options={heardOptions} error={errors.heard} />
                <PillGroup
                  legend="When do you need your project to come to life?"
                  required
                  name="timeline"
                  type="radio"
                  options={timelineOptions}
                  error={errors.timeline}
                />
                <PillGroup legend="What’s your budget?" required name="budget" type="radio" options={budgetOptions} error={errors.budget} />
              </div>
            </Step>

            {/* honeypot: real people never see or fill this */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Website
                <input type="text" name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            {/* dark submit panel: the page's highest-contrast moment */}
            <div data-step className="mt-6 rounded-2xl bg-ink-950 p-6 text-card md:p-10">
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-sans text-title leading-none font-semibold tracking-tight uppercase">Ready when you are.</p>
                  <p id="form-error" role="alert" className="mt-3 min-h-6 text-sm font-semibold text-[#fca5a5]">
                    {status === "error" ? "Something went wrong sending that. Please try again in a moment." : ""}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  onPointerEnter={(e) => turnArrow(e, -45)}
                  onPointerLeave={(e) => turnArrow(e, 0)}
                  className="inline-flex w-fit items-center gap-5 rounded-full bg-primary-400 py-3 pr-3 pl-8 text-xs font-bold tracking-nav text-foreground uppercase shadow-glow-strong transition-colors duration-300 hover:bg-primary-300 disabled:opacity-60 md:text-sm"
                >
                  {status === "sending" ? "Sending…" : "Send it"}
                  <span
                    data-arrow
                    aria-hidden="true"
                    className="grid size-11 place-items-center rounded-full bg-foreground text-lg text-primary-400 md:size-12"
                  >
                    →
                  </span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
