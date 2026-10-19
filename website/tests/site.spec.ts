import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { pages, docHref } from "../src/lib/catalog";

test("install journey, search recovery, keyboard navigation, and clipboard", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.getByRole("link", { name: "Start distilling" }).click();
  await expect(
    page.getByRole("heading", { name: "Quick start", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Search documentation", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  const input = dialog.getByRole("searchbox");
  await input.fill("no-result-xyz");
  await expect(dialog.getByText("No matches this time.")).toBeVisible();
  await dialog.getByRole("button", { name: "Reset search" }).click();
  await input.fill("templates");
  await input.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Templates", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Copy as Markdown" }).click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain("# Templates");
  await page.keyboard.press("Control+k");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Quick start", exact: true }),
  ).toBeVisible();
});

test("mobile navigation restores focus and leads into docs", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  await menu.click();
  const dialog = page.getByRole("dialog", { name: "What’s next?" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await menu.click();
  await dialog
    .getByRole("link", { name: "Getting started", exact: false })
    .click();
  await expect(page).toHaveURL(/docs\/quick-start$/);
  await page.locator(".docs-mobile-nav summary").click();
  await page
    .locator(".docs-mobile-nav")
    .getByRole("link", { name: "Agents", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Agents", exact: true }),
  ).toBeVisible();
});

for (const route of ["/", "/docs", "/docs/quick-start", "/brand"]) {
  test(`accessible and responsive: ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    for (const width of [320, 390, 700, 768, 780, 781, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `overflow at ${width}`,
      ).toBe(true);
    }
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
  });
}

test("all docs, internal destinations, fragments, assets, and 404", async ({
  page,
  request,
}) => {
  const visited = new Set<string>();
  for (const route of [
    "/",
    "/brand",
    ...pages.map((item) => docHref(item.slug)),
  ]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main h1")).toHaveCount(1);
    const links = await page
      .locator('a[href^="/"], a[href^="#"], img')
      .evaluateAll((elements) =>
        elements.map(
          (element) =>
            element.getAttribute("href") ?? element.getAttribute("src") ?? "",
        ),
      );
    for (const link of links) {
      const url = new URL(link, `http://127.0.0.1:3106${route}`);
      if (visited.has(url.href)) continue;
      visited.add(url.href);
      const destination = await request.get(url.pathname + url.search);
      expect(destination.ok(), url.href).toBe(true);
      if (url.hash)
        expect(await destination.text(), url.href).toContain(
          `id="${url.hash.slice(1)}"`,
        );
    }
  }
  const missing = await request.get("/docs/does-not-exist");
  expect(missing.status()).toBe(404);
});

test("copy failure is honest and search modal passes accessibility", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() =>
    Object.defineProperty(navigator.clipboard, "writeText", {
      value: () => Promise.reject(new Error("Denied")),
    }),
  );
  await page.getByRole("button", { name: "Copy command" }).click();
  await expect(
    page.getByText("Copy unavailable. Select the text to copy."),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Search documentation", exact: true })
    .first()
    .click();
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
});
