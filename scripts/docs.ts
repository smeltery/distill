import { chromium } from "@playwright/test";
import { createHash } from "node:crypto";
import { readFile, mkdir, writeFile, access } from "node:fs/promises";
import { resolve, dirname } from "node:path";

const write = process.argv.includes("--write");
const assetsOnly = process.argv.includes("--assets-only");
const files = [
  "README.md",
  ...Array.from(new Bun.Glob("docs/**/*.md").scanSync(".")),
];
const diagrams = new Map<string, string>();
for (const file of files) {
  const markdown = await readFile(file, "utf8");
  for (const [, source] of markdown.matchAll(/```mermaid\s*\n([\s\S]*?)```/g)) {
    const hash = createHash("sha256")
      .update(source.trim())
      .digest("hex")
      .slice(0, 16);
    diagrams.set(hash, source.trim());
  }
  for (const [, target] of markdown.matchAll(/\]\(([^)]+)\)/g)) {
    if (/^(https?:|mailto:)/.test(target)) continue;
    const [relative, fragment] = target.split("#");
    const destination = relative
      ? resolve(dirname(file), relative)
      : resolve(file);
    await access(destination).catch(() => {
      throw new Error(`${file}: missing link ${target}`);
    });
    if (fragment && destination.endsWith(".md")) {
      const content = await readFile(destination, "utf8");
      const headings = [...content.matchAll(/^#{1,6} (.+)$/gm)].map(
        ([, title]) =>
          title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-"),
      );
      if (!headings.includes(fragment))
        throw new Error(`${file}: missing heading ${target}`);
    }
  }
}
await mkdir("website/public/diagrams", { recursive: true });
if (!write) {
  for (const hash of diagrams.keys()) {
    await access(`website/public/diagrams/${hash}.svg`).catch(() => {
      throw new Error(
        `Missing diagram ${hash}. Run bun run docs:generate and commit the SVG.`,
      );
    });
  }
}
if (assetsOnly) {
  console.log(
    `Verified ${diagrams.size} committed diagrams and Markdown links.`,
  );
  process.exit(0);
}
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.setContent("<!doctype html><html><body></body></html>");
  await page.addScriptTag({ path: "node_modules/mermaid/dist/mermaid.min.js" });
  await page.evaluate(() => {
    // Mermaid is intentionally browser-only and loaded into this build page.
    const mermaid = (
      window as unknown as {
        mermaid: { initialize: (config: unknown) => void };
      }
    ).mermaid;
    mermaid.initialize({
      startOnLoad: false,
      deterministicIds: true,
      deterministicIDSeed: "distill",
      securityLevel: "strict",
      theme: "base",
      themeVariables: {
        background: "#1a1d29",
        primaryColor: "#302942",
        primaryTextColor: "#fefdfb",
        primaryBorderColor: "#8b5cf6",
        lineColor: "#a78bfa",
        secondaryColor: "#222635",
        tertiaryColor: "#29243e",
        fontFamily: "Arial",
      },
    });
  });
  for (const [hash, source] of diagrams) {
    const svg = await page.evaluate(
      async ({ hash, source }) => {
        const mermaid = (
          window as unknown as {
            mermaid: {
              parse: (source: string) => Promise<unknown>;
              render: (id: string, source: string) => Promise<{ svg: string }>;
            };
          }
        ).mermaid;
        await mermaid.parse(source);
        return (await mermaid.render(`diagram-${hash}`, source)).svg;
      },
      { hash, source },
    );
    if (write) await writeFile(`website/public/diagrams/${hash}.svg`, svg);
  }
} finally {
  await browser.close();
}
console.log(
  `Validated ${files.length} Markdown documents and rendered ${diagrams.size} Mermaid diagrams.`,
);
