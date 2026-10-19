import { notFound } from "next/navigation";
import Link from "next/link";
import { readDoc } from "@/lib/docs";
import { pages, docHref } from "@/lib/catalog";
import { DocsHeader, DocsNavigation } from "@/components/DocsNavigation";
import { DocArticle } from "@/components/DocArticle";
import { DocActions } from "@/components/DocActions";

type Props = { params: Promise<{ slug?: string[] }> };
export const dynamicParams = true;
export function generateStaticParams() {
  return pages.map((page) => ({ slug: page.slug ? page.slug.split("/") : [] }));
}
export async function generateMetadata({ params }: Props) {
  const page = readDoc((await params).slug?.join("/") ?? "");
  return page
    ? {
        title: `${page.title} — docs`,
        description: page.description,
        alternates: { canonical: docHref(page.slug) },
      }
    : { title: "Page not found" };
}
export default async function DocPage({ params }: Props) {
  const page = readDoc((await params).slug?.join("/") ?? "");
  if (!page) notFound();
  const index = pages.findIndex((item) => item.slug === page.slug);
  return (
    <>
      <DocsHeader />
      <div className="docs-layout">
        <DocsNavigation slug={page.slug} />
        <main className="docs-main" id="main">
          <details className="mobile-toc">
            <summary>On this page</summary>
            <nav aria-label="On this page">
              {page.headings.map((heading) => (
                <a key={heading.id} href={`#${heading.id}`}>
                  {heading.title}
                </a>
              ))}
            </nav>
          </details>
          <p className="doc-category">{page.group}</p>
          <article>
            <DocArticle markdown={page.markdown} />
          </article>
          <div className="mobile-doc-actions">
            <DocActions file={page.file} markdown={page.markdown} />
          </div>
          <nav className="doc-pagination" aria-label="Adjacent pages">
            {[pages[index - 1], pages[index + 1]].map((item, position) =>
              item ? (
                <Link key={item.file} href={docHref(item.slug)}>
                  <span>{position === 0 ? "Previous" : "Next"}</span>
                  <strong>{item.title}</strong>
                </Link>
              ) : (
                <span key={position} />
              ),
            )}
          </nav>
          <p className="docs-end">
            Distill · Focused knowledge, in plain Markdown.
          </p>
        </main>
        <aside className="docs-toc">
          <p>On this page</p>
          <nav aria-label="On this page">
            {page.headings.map((heading) => (
              <a key={heading.id} href={`#${heading.id}`}>
                {heading.title}
              </a>
            ))}
          </nav>
          <DocActions file={page.file} markdown={page.markdown} />
        </aside>
      </div>
    </>
  );
}
