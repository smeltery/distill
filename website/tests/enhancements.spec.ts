import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("template keyboard exploration, provider choice, and FAQ", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/#use-cases");
  const rules = page.getByRole("tab", { name: "rules", exact: true });
  await rules.focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "principles", exact: true }),
  ).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText(
    "# Errors carry context",
  );
  await page.getByRole("button", { name: "Copy example" }).click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain("# Errors carry context");
  await page.getByRole("tab", { name: "principles", exact: true }).focus();
  await page.keyboard.press("End");
  await expect(
    page.getByRole("tab", { name: "raw", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowRight");
  await expect(rules).toBeFocused();
  await page.getByRole("button", { name: "Provider API", exact: true }).click();
  await expect(page.getByText("Choose a model for the job.")).toBeVisible();
  await page.getByText("What can I distill today?", { exact: true }).click();
  await expect(
    page.getByText("Local Markdown files and the immediate Markdown files", {
      exact: false,
    }),
  ).toBeVisible();
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
});

test("brand palette copies exact hex values and downloads real assets", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/brand");
  await page.getByRole("button", { name: "Copy Purple hex #8b5cf6" }).click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe("#8b5cf6");
  await expect(page.getByRole("status")).toHaveText("Purple copied: #8b5cf6");
  for (const [name, filename] of [
    ["Vector mark", "distill-logo.svg"],
    ["Social preview", "distill-social.png"],
    ["Browser icon", "distill-icon.png"],
  ]) {
    const download = page.waitForEvent("download");
    await page
      .getByRole("link", { name: `Download ${name}`, exact: true })
      .click();
    expect((await download).suggestedFilename()).toBe(filename);
  }
  await page.evaluate(() =>
    Object.defineProperty(navigator.clipboard, "writeText", {
      value: () => Promise.reject(new Error("Denied")),
    }),
  );
  await page.getByRole("button", { name: "Copy Slate hex #1a1d29" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Copy unavailable. Select and copy this value: #1a1d29",
  );
});

test("syntax highlighting keeps exact copy and chat includes the document", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/docs/configuration");
  const block = page
    .locator(".code-block")
    .filter({ hasText: "default_agent: claude-cli" });
  await expect(block.locator(".hljs-attr").first()).toBeVisible();
  const code = await block.locator("pre code").innerText();
  await block.getByRole("button", { name: "Copy code" }).click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe(code);
  await page.locator(".docs-toc summary").click();
  const providers = page.locator(".docs-toc .chat-links a");
  await expect(providers).toHaveCount(6);
  for (const provider of await providers.all()) {
    const url = new URL((await provider.getAttribute("href"))!);
    expect([...url.searchParams.values()][0]).toContain("# Configuration");
    expect([...url.searchParams.values()][0]).toContain(
      "## Keep configuration reviewable",
    );
    await expect(provider.locator("img")).toHaveAttribute(
      "src",
      /\/brands\/chat\/.+\.svg/,
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() =>
    Object.defineProperty(navigator.clipboard, "writeText", {
      value: () => Promise.reject(new Error("Denied")),
    }),
  );
  await page.getByRole("button", { name: "Copy as Markdown" }).click();
  await expect(
    page.getByRole("textbox", { name: "Page Markdown" }),
  ).toHaveValue(/^# Configuration/);
  await page.locator(".mobile-doc-actions summary").click();
  await page.locator(".mobile-toc summary").click();
  await page
    .locator(".mobile-toc")
    .getByRole("link", { name: "A minimal project", exact: true })
    .click();
  await expect(page).toHaveURL(/#a-minimal-project$/);
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
});
