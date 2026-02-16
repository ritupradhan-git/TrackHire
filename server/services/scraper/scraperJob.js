import { getBrowser } from "../../config/playwright.js";
import extractFromRawText from "../aiExtractorService.js";
import { withRetry } from "./retryHandler.js";

export const scrapeJobPosting = async (url) => {
  return withRetry(async () => {
    const browser = await getBrowser();
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115 Safari/537.36",
      viewport: { width: 1280, height: 800 },
    });
    const page = await context.newPage();
    try {
      console.log("Navigating to ", url);
      await page.goto(url, {
        waitUntil: "networkidle"
      });
      await page.waitForTimeout(3000);
      await page.waitForSelector("body", { timeout: 15000 });
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });
      const getText = async (selector) => {
        try {
          const locator = page.locator(selector);
          if ((await locator.count()) > 0) {
            return (await locator.first().innerText()).trim();
          }
          return null;
        } catch {
          return null;
        }
      };

      const jobData = {};
      jobData.title = (await getText("h1")) || (await page.title());
      jobData.company = (await getText("[class*=company]")) || null;

      jobData.location = (await getText("[class*=location]")) || null;

      jobData.salary = (await getText("[class*=salary]")) || null;

      jobData.experience = (await getText("[class*=experience]")) || null;

      let description =
        (await getText("[class*=description]")) ||
        (await page.locator("body").innerText());

      if (description?.length > 5000) {
        description = description.substring(0, 5000);
      }

      jobData.description = description || "No detailed description found.";

      jobData.sourceUrl = url;

      // AI FALLBACK if structured fails
      if (!jobData.title || !jobData.company) {
        console.log("Using AI fallback...");

        const fullText = await page.locator("body").innerText();
        const fallbackData = extractFromRawText(fullText,url);

        jobData.title = jobData.title || fallbackData.title;
        jobData.company = jobData.company || fallbackData.company;
        jobData.location = jobData.location || fallbackData.location;
        jobData.salary = jobData.salary || fallbackData.salary;
        jobData.experience = jobData.experience || fallbackData.experience;
        jobData.description = fallbackData.description;
      }

      return jobData;
    } finally {
      await page.close();
      await context.close();
    }
  });
};
