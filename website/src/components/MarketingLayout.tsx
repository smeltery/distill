import Link from "next/link";
import { Github } from "lucide-react";
import { Brand } from "./Brand";
import { Search } from "./Search";
import { MobileMenu } from "./MobileMenu";
import { repository } from "@/lib/catalog";

export function MarketingNav() {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link href="/#features">Explore Distill</Link>
          <Link href="/docs/quick-start">Getting started</Link>
          <Link href="/docs">Our approach</Link>
        </nav>
        <Search />
        <a className="github-link" href={repository}>
          <Github size={19} /> <span>GitHub</span>
        </a>
        <MobileMenu />
      </div>
    </header>
  );
}
export function MarketingFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Brand />
            <p>
              A little context.
              <br />A lot more clarity.
            </p>
            <span>Focused knowledge for thoughtful builders.</span>
          </div>
          <nav aria-label="Footer product">
            <h2>The toolkit</h2>
            <Link href="/#features">Explore Distill</Link>
            <Link href="/docs/templates">Templates</Link>
            <Link href="/docs/agents">AI agents</Link>
          </nav>
          <nav aria-label="Footer resources">
            <h2>Resources</h2>
            <Link href="/brand">Brand & assets</Link>
            <a href="/llms.txt">For agents</a>
            <Link href="/docs/quick-start">Getting started</Link>
            <Link href="/docs">Why Distill exists</Link>
            <Link href="/docs/development">Contributing</Link>
          </nav>
          <nav aria-label="Footer project">
            <h2>In the open</h2>
            <a href="https://github.com/smeltery">About Smeltery</a>
            <Link href="/docs/troubleshooting">Support</Link>
            <Link href="/docs/agents">Data & providers</Link>
            <a href={repository} className="icon-link">
              <Github size={14} /> GitHub repository
            </a>
            <a href={`${repository}/issues`}>Feedback & issues</a>
            <a href={`${repository}/blob/master/THIRD_PARTY_NOTICES.md`}>
              Credits & acknowledgments
            </a>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Smeltery</span>
          <a href={`${repository}/blob/master/LICENSE`}>
            PolyForm Shield license
          </a>
          <span className="footer-note">Built for the way you work.</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
