import "server-only";
import puppeteer, { type Browser } from "puppeteer";

type GlobalWithBrowser = typeof globalThis & { __autoReportBrowser?: Browser };
const g = globalThis as GlobalWithBrowser;

async function getBrowser(): Promise<Browser> {
  if (g.__autoReportBrowser && g.__autoReportBrowser.connected) {
    return g.__autoReportBrowser;
  }
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  g.__autoReportBrowser = browser;
  return browser;
}

export async function htmlToPdf(html: string): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", bottom: "0", left: "0", right: "0" },
    });
    return Buffer.from(pdf);
  } finally {
    await page.close();
  }
}

if (typeof process !== "undefined") {
  const shutdown = async () => {
    if (g.__autoReportBrowser) {
      try {
        await g.__autoReportBrowser.close();
      } catch {
        /* ignore */
      }
      g.__autoReportBrowser = undefined;
    }
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}
