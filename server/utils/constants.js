// Puppeteer selectors for common job board elements.
// These are examples and might need to be adjusted based on specific job boards.
// The scraper has a fallback for general text extraction if these fail.
 export const SELECTORS = {
  TITLE: 'h1.job-title, h1[data-automation-id="jobTitle"], .job-details__title',
  COMPANY: '.company-name, [data-automation-id="companyName"], .job-details__company',
  LOCATION: '.job-location, [data-automation-id="location"], .job-details__location',
  SALARY: '.salary-range, [data-automation-id="salaryInfo"], .job-details__salary',
  EXPERIENCE: '.experience-level, [data-automation-id="experienceLevel"], .job-details__experience',
  DESCRIPTION_BODY: '.job-description-content, [data-automation-id="jobDescription"], .job-details__description',
};

 export const JOB_STATUSES = ["Saved", "Applied", "Interview", "Rejected"];
