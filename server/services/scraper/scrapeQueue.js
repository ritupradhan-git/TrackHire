// services/scraper/scrapeQueue.js
import pLimit from 'p-limit';
import scrapeJobPosting from './scraperJob.js';

const limit = pLimit(3); // max 3 concurrent browsers

export const scrapeMultipleJobs = async (urls) => {
  const tasks = urls.map(url =>
    limit(() => scrapeJobPosting(url))
  );

  return Promise.all(tasks);
};
