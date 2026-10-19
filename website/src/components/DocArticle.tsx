import { highlight } from "@/lib/highlight";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyButton } from "./CopyButton";
import { diagramName } from "@/lib/docs";
import { headingId, pages, docHref } from "@/lib/catalog";

export function DocArticle({ markdown }: { markdown: string }) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1>{children}</h1>,
        h2: ({ children }) => (
          <h2 id={headingId(String(children))}>{children}</h2>
        ),
        a: ({ href, children }) => {
          const [file, fragment] = (href ?? "").split("#");
          const page = pages.find((item) => `${item.file}.md` === file);
          const target = page
            ? `${docHref(page.slug)}${fragment ? `#${fragment}` : ""}`
            : (href ?? "/docs");
          return <Link href={target}>{children}</Link>;
        },
        pre: ({ children }) => <div className="code-block">{children}</div>,
        code: ({ className, children }) => {
          const text = String(children).replace(/\n$/, "");
          if (className === "language-mermaid")
            return (
              <figure className="doc-diagram">
                <div
                  className="diagram-scroll"
                  tabIndex={0}
                  role="region"
                  aria-label="Scrollable workflow diagram"
                >
                  <Image
                    unoptimized
                    src={`/diagrams/${diagramName(text)}.svg`}
                    alt="Workflow diagram; the equivalent steps are described in the surrounding text."
                    width={1000}
                    height={420}
                  />
                </div>
                <details>
                  <summary>View diagram source</summary>
                  <pre>{text}</pre>
                </details>
              </figure>
            );
          if (className)
            return (
              <>
                <div className="code-heading">
                  <span>
                    {(
                      {
                        sh: "Terminal",
                        bash: "Terminal",
                        yaml: "YAML · distill.yaml",
                        json: "JSON",
                        markdown: "Markdown",
                      } as Record<string, string>
                    )[className.replace("language-", "")] ??
                      className.replace("language-", "")}
                  </span>
                  <CopyButton text={text} label="Copy code" />
                </div>
                <pre
                  className="highlighted-code"
                  tabIndex={0}
                  aria-label="Code example"
                >
                  <span className="code-gutter" aria-hidden="true">
                    {text
                      .split("\n")
                      .map((_, index) => index + 1)
                      .join("\n")}
                  </span>
                  <code
                    dangerouslySetInnerHTML={{
                      __html: highlight(
                        text,
                        className.replace("language-", ""),
                      ),
                    }}
                  />
                </pre>
              </>
            );
          return <code>{children}</code>;
        },
        blockquote: ({ children }) => (
          <aside className="docs-notice">{children}</aside>
        ),
        table: ({ children }) => (
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Reference table"
          >
            <table>{children}</table>
          </div>
        ),
      }}
    >
      {markdown}
    </Markdown>
  );
}
