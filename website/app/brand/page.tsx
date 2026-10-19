import Image from "next/image";
import { MarketingNav, MarketingFooter } from "@/components/MarketingLayout";
export const metadata = {
  title: "Brand & assets",
  alternates: { canonical: "/brand" },
  description:
    "The Distill logo, original purple palette, and social preview assets.",
};
export default function BrandPage() {
  return (
    <>
      <MarketingNav />
      <main className="wrap brand-page" id="main">
        <p className="eyebrow">The Distill identity</p>
        <h1>A little more Distill.</h1>
        <p>
          Our flask mark, purple palette, and social preview. Use these assets
          when linking to the project.
        </p>
        <div className="brand-assets">
          <article>
            <h2>The mark</h2>
            <Image
              src="/favicon.svg"
              alt="Distill’s purple flask mark"
              width={120}
              height={120}
            />
            <p>
              Slate #1a1d29 · Purple #8b5cf6
              <br />
              Lavender #a78bfa · Cream #fefdfb
            </p>
            <a
              className="text-link"
              href="/favicon.svg"
              download="distill-logo.svg"
            >
              Download SVG
            </a>
          </article>
          <article>
            <h2>The big picture</h2>
            <Image
              src="/og-image.png"
              alt="Distill — Less context. More clarity."
              width={1200}
              height={630}
            />
            <a className="text-link" href="/og-image.png" download>
              Download PNG
            </a>
            <a className="text-link" href="/og-image.svg" download>
              Download SVG
            </a>
          </article>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
