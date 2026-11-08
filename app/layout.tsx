import type { Metadata } from "next";
import { Archivo, Crimson_Text } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteMenu } from "@/components/layout/SiteMenu";
import { site } from "@/lib/site";

// Fonts from the wireframe. Each exposes a CSS variable that globals.css
// maps to Tailwind's `font-sans` (Archivo) and `font-display` (Crimson Text).
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-crimson",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${crimson.variable}`}>
      <body className="bg-background text-foreground font-sans antialiased">
        <SmoothScroll>
          <SiteHeader />
          {children}
          <SiteMenu />
        </SmoothScroll>
      </body>
    </html>
  );
}
