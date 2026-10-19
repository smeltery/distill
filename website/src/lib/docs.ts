import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { pages, headingId } from "./catalog";

export function readDoc(slug: string) {
  const page = pages.find((item) => item.slug === slug);
  if (!page) return null;
  const markdown = fs.readFileSync(
    path.join(process.cwd(), "../docs", `${page.file}.md`),
    "utf8",
  );
  const headings = [...markdown.matchAll(/^## (.+)$/gm)].map(([, title]) => ({
    title,
    id: headingId(title),
  }));
  return { ...page, markdown, headings };
}
export function diagramName(source: string) {
  return createHash("sha256").update(source.trim()).digest("hex").slice(0, 16);
}
