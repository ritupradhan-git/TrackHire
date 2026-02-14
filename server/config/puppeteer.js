import puppeteer from "puppeteer";

const getBrowser = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true, // Set to true for production
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-size=1920,1080',
        '--ignore-certificate-errors',
        '--disable-dev-shm-usage' // For Docker environments
      ],
      ignoreHTTPSErrors: true,
    });
    return browser;
  } catch (error) {
    console.error('Failed to launch Puppeteer browser:', error);
    throw new Error('Failed to launch browser for scraping.');
  }
};

export default getBrowser;