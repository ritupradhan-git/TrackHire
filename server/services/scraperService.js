import getBrowser from '../config/puppeteer.js';
import { SELECTORS } from '../utils/constants.js';
import extractFromRawText from './aiExtractorService.js';

const scrapeJobPosting = async (url) => {
  let browser;
  let page;

  try {
    browser = await getBrowser();
    page = await browser.newPage();

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });
    await new Promise(r => setTimeout(r, 5000));

    const jobData = {};

    // Helper to extract text safely
    const getText = async (selector) => {
      try {
        const element = await page.$(selector);
        return element
          ? await page.evaluate(el => el.textContent.trim(), element)
          : null;
      } catch {
        return null;
      }
    };

    // Scrape using selectors
    jobData.title =
      (await getText(SELECTORS.TITLE)) || (await page.title());

    jobData.company = await getText(SELECTORS.COMPANY);
    jobData.location = await getText(SELECTORS.LOCATION);
    jobData.salary = await getText(SELECTORS.SALARY);
    jobData.experience = await getText(SELECTORS.EXPERIENCE);

    // Description
    let descriptionText =
      (await getText(SELECTORS.DESCRIPTION_BODY)) ||
      (await getText('body'));

    if (descriptionText?.length > 5000) {
      descriptionText =
        descriptionText.substring(0, 5000) + '... (truncated)';
    }

    jobData.description =
      descriptionText || 'No detailed description found.';

    jobData.sourceUrl = url;

    // --- AI FALLBACK ---
    if (
      !jobData.title ||
      !jobData.company ||
      jobData.description.includes('No detailed description found.')
    ) {
      console.warn(
        `Selector scrape failed for ${url}. Using fallback.`
      );

      const fullText = await page.evaluate(
        () => document.body.innerText
      );

      const fallbackData = extractFromRawText(fullText, url);

      jobData.title =
        jobData.title && jobData.title !== (await page.title())
          ? jobData.title
          : fallbackData.title;

      jobData.company =
        jobData.company || fallbackData.company;

      jobData.location =
        jobData.location || fallbackData.location;

      jobData.salary =
        jobData.salary || fallbackData.salary;

      jobData.experience =
        jobData.experience || fallbackData.experience;

      if (
        jobData.description.includes(
          'No detailed description found.'
        ) ||
        jobData.description.includes('... (truncated)')
      ) {
        jobData.description = fallbackData.description;
      }
    }

    return jobData;

  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);

    return {
      title: 'Scraping Failed',
      company: 'N/A',
      location: 'N/A',
      salary: 'N/A',
      experience: 'N/A',
      description: `Failed to scrape ${url}: ${error.message}`,
      sourceUrl: url,
    };

  } finally {
    if (page) await page.close();
    if (browser) await browser.close();
  }
};

export default scrapeJobPosting ;
