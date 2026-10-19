import Link from "next/link";
import { Github } from "lucide-react";
import { Brand } from "./Brand";
import { Search } from "./Search";
import { pages, docHref, repository } from "@/lib/catalog";

export function DocsHeader() {
  return (
    <header className="docs-header">
      <Brand compact />
      <span className="docs-header-label">Documentation</span>
      <nav aria-label="Documentation">
        <Link href="/docs/commands">CLI reference</Link>
        <Link href="/docs/quick-start">Quick start</Link>
        <a className="icon-link" href={repository}>
          <Github size={16} /> GitHub
        </a>
      </nav>
      <Search />
    </header>
  );
}
export function DocsNavigation({ slug }: { slug: string }) {
  const links = (
    <nav aria-label="Documentation pages">
      <Link href="/docs/commands">CLI overview</Link>
      {[...new Set(pages.map((page) => page.group))].map((group) => (
        <div key={group}>
          <p>{group}</p>
          {pages
            .filter((page) => page.group === group)
            .map((page) => (
              <Link
                key={page.file}
                href={docHref(page.slug)}
                aria-current={page.slug === slug ? "page" : undefined}
              >
                {page.title}
              </Link>
            ))}
        </div>
      ))}
    </nav>
  );
  return (
    <>
      <aside className="docs-sidebar">
        {links}
        <Link className="docs-home" href="/">
          Back to Distill
        </Link>
      </aside>
      <details className="docs-mobile-nav">
        <summary>
          Documentation <span>Browse pages</span>
        </summary>
        {links}
      </details>
    </>
  );
}
