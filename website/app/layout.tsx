import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
import "@/styles/globals.css";

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
    default: "distill — Less context. More clarity.",
    template: "%s · distill",
  },
  description,
  openGraph: {
    title: "distill — Less context. More clarity.",
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
    title: "distill — Less context. More clarity.",
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
    <html lang="en">
      <body id="top">
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
