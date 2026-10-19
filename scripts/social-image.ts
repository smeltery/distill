import { chromium } from "@playwright/test";
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.setContent(
    `<style>body{margin:0}</style>${await Bun.file("website/public/og-image.svg").text()}`,
  );
  await page.screenshot({ path: "website/public/og-image.png" });
} finally {
  await browser.close();
}
