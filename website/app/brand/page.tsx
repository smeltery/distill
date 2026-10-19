import Image from "next/image";
import Link from "next/link";
import { ArrowDown, Download } from "lucide-react";
import { MarketingNav, MarketingFooter } from "@/components/MarketingLayout";
import { BrandPalette } from "@/components/BrandPalette";
export const metadata = {
  title: "Brand & assets",
  alternates: { canonical: "/brand" },
  description:
    "The Distill mark, original purple palette, typography, and downloadable assets.",
};
export default function BrandPage() {
  return (
    <>
      <MarketingNav />
      <main className="wrap brand-page" id="main">
        <header className="brand-hero">
          <p className="eyebrow">
            <Link href="/">Distill</Link>
            <span> / </span>Brand & assets
          </p>
          <h1>
            A little less noise.
            <br />
            <em>A little more character.</em>
          </h1>
          <p>
            The things that make Distill feel like Distill. Our flask, familiar
            purple, and a few useful assets for your next mention.
          </p>
          <a className="button" href="#downloads">
            Get the assets <ArrowDown size={16} />
          </a>
        </header>
        <section className="brand-section">
          <p className="eyebrow">01 / The mark</p>
          <h2>
            Keep the essence.
            <br />
            <em>Make it recognizable.</em>
          </h2>
          <p>
            A small flask for a simple idea: keep what matters. Use the mark on
            its own when space is tight, or pair it with the Distill name when
            making an introduction.
          </p>
          <div className="brand-marks">
            <figure>
              <div className="mark-preview">
                <Image
                  src="/favicon.svg"
                  width={150}
                  height={150}
                  alt="Distill flask mark"
                />
              </div>
              <figcaption>Original mark</figcaption>
            </figure>
            <figure>
              <div className="mark-preview signature">
                <Image src="/favicon.svg" width={56} height={56} alt="" />
                <span>distill</span>
              </div>
              <figcaption>The Distill signature</figcaption>
            </figure>
          </div>
        </section>
        <section className="brand-section">
          <p className="eyebrow">02 / The first impression</p>
          <h2>
            Less context.
            <br />
            <em>Worth sharing.</em>
          </h2>
          <p>
            A little preview of the work ahead. Our social image brings the
            source, the command, and the result into one frame.
          </p>
          <Image
            className="brand-social"
            src="/og-image.png"
            alt="Distill — Less context. More clarity. Markdown source becomes focused agent knowledge."
            width={1200}
            height={630}
          />
        </section>
        <section className="brand-section">
          <p className="eyebrow">03 / Color</p>
          <h2>
            Quiet surfaces.
            <br />
            <em>A familiar purple.</em>
          </h2>
          <p>
            Distill’s original slate, purple, and cream palette. Lavender gives
            small text the contrast it needs. Copy a hex value to bring the
            right color along.
          </p>
          <BrandPalette />
        </section>
        <section className="brand-section">
          <p className="eyebrow">04 / Typography</p>
          <h2>
            A useful voice.
            <br />
            <em>A human touch.</em>
          </h2>
          <p>
            Clear language, a little warmth, and code that feels at home. Three
            typefaces, each with one job.
          </p>
          <div className="type-specimens">
            <article>
              <p className="eyebrow">DM Sans / Interface</p>
              <div>Less context. More clarity.</div>
              <p>
                Headings, navigation, and everyday reading. Direct, friendly,
                and easy to scan.
              </p>
            </article>
            <article>
              <p className="eyebrow">Georgia / Emphasis</p>
              <div className="serif-specimen">Room for what matters.</div>
              <p>
                A softer note in a headline. Use it sparingly, where a phrase
                deserves a breath.
              </p>
            </article>
            <article>
              <p className="eyebrow">IBM Plex Mono / Code</p>
              <div className="mono-specimen">distill guide</div>
              <p>
                Commands, examples, and technical details. Copyable, legible,
                and precise.
              </p>
            </article>
          </div>
        </section>
        <section className="brand-section" id="downloads">
          <p className="eyebrow">05 / The toolkit</p>
          <h2>
            Ready for
            <br />
            <em>your next mention.</em>
          </h2>
          <p>
            For a README, an article, or a project directory. Download the
            original assets below.
          </p>
          <div className="asset-downloads">
            {[
              [
                "Vector mark",
                "SVG · Original colors, scalable",
                "/favicon.svg",
                "distill-logo.svg",
              ],
              [
                "Social preview",
                "PNG · 1200 × 630",
                "/og-image.png",
                "distill-social.png",
              ],
              [
                "Browser icon",
                "PNG · 64 × 64",
                "/favicon.png",
                "distill-icon.png",
              ],
            ].map(([name, detail, href, filename]) => (
              <div key={name}>
                <div>
                  <strong>{name}</strong>
                  <span className="asset-detail">{detail}</span>
                </div>
                <a
                  className="download-button"
                  href={href}
                  download={filename}
                  aria-label={`Download ${name}`}
                >
                  Download <Download size={16} />
                </a>
              </div>
            ))}
          </div>
          <aside className="brand-usage">
            <h3>A little care goes a long way.</h3>
            <p>
              Keep the name, colors, and proportions intact. Leave the mark room
              to breathe, and use it to identify Distill without implying an
              endorsement.
            </p>
          </aside>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
