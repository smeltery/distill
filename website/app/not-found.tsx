import Link from "next/link";
import { MarketingNav, MarketingFooter } from "@/components/MarketingLayout";
export default function NotFound() {
  return (
    <>
      <MarketingNav />
      <main className="wrap brand-page" id="main">
        <p className="eyebrow">404 · Page not found</p>
        <h1>A little off course.</h1>
        <p>
          This page doesn’t exist. The documentation is a good place to start.
        </p>
        <p>
          <Link className="text-link" href="/docs">
            Browse documentation
          </Link>
        </p>
      </main>
      <MarketingFooter />
    </>
  );
}
