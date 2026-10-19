import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteUrl } from "@/lib/site";
import "@/styles/globals.css";

const sans = localFont({
  src: "../node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2",
  variable: "--font-dm-sans",
  weight: "100 1000",
  display: "swap",
  adjustFontFallback: "Arial",
});
const mono = localFont({
  src: "../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2",
  variable: "--font-ibm-mono",
  weight: "400",
  display: "swap",
});

const description =
  "Turn local Markdown into focused, reusable knowledge for AI agents. Template-driven compaction with Claude, Codex, Anthropic, or OpenAI.";
const image = `${siteUrl}/og-image.png`;
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  robots:
    process.env.VERCEL_ENV === "preview"
      ? { index: false, follow: false }
      : undefined,
  title: {
    default: "distill — Long docs. Focused AI context.",
    template: "%s · distill",
  },
  description,
  openGraph: {
    title: "distill — Long docs. Focused AI context.",
    description,
    siteName: "distill",
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: "Distill compacts a Markdown guide into focused agent context.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "distill — Long docs. Focused AI context.",
    description,
    images: [image],
  },
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body id="top">
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
