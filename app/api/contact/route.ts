// Receives the contact form. Validates, drops bots, then hands off to delivery.

import { NextResponse } from "next/server";

type Brief = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  services: string[];
  message: string;
  heard: string;
  timeline: string;
  budget: string;
};

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let raw: Record<string, unknown>;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot filled: pretend success so bots learn nothing.
  if (str(raw.website, 200)) return NextResponse.json({ ok: true });

  const brief: Brief = {
    name: str(raw.name, 120),
    email: str(raw.email, 200),
    phone: str(raw.phone, 40),
    company: str(raw.company, 160),
    services: Array.isArray(raw.services) ? raw.services.map((s) => str(s, 80)).filter(Boolean).slice(0, 12) : [],
    message: str(raw.message, 4000),
    heard: str(raw.heard, 80),
    timeline: str(raw.timeline, 80),
    budget: str(raw.budget, 80),
  };

  const valid =
    brief.name.length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(brief.email) &&
    brief.services.length > 0 &&
    brief.message.length >= 10 &&
    brief.heard &&
    brief.timeline &&
    brief.budget;

  if (!valid) return NextResponse.json({ ok: false, error: "Missing or invalid fields." }, { status: 422 });

  // TODO: deliver the brief (e.g. Resend, Postmark, Slack webhook).
  console.log("[contact] new brief", brief);

  return NextResponse.json({ ok: true });
}
