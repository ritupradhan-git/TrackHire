// server/services/aiExtractorService.js
import  { SCRAPE_STATUSES } from '../utils/constants.js';

/**
 * Attempts to extract structured job data from raw text content when direct selectors fail.
 * This is a rule-based approach, not a true AI/ML model, but aims to intelligently
 * infer common job attributes.
 * @param {string} rawText The full innerText of the job page.
 * @param {string} sourceUrl The original URL of the job posting.
 * @returns {object} Structured job data or a best-effort parsed object.
 */
const extractFromRawText = (rawText, sourceUrl) => {
  const jobData = {
    title: 'N/A',
    company: 'N/A',
    location: 'N/A',
    salary: 'N/A',
    experience: 'N/A',
    description: rawText ? rawText.substring(0, 5000) + '... (full text fallback)' : 'No detailed description found.',
    sourceUrl: sourceUrl,
    status:SCRAPE_STATUSES.ACTIVE,
  };

  if (!rawText) {
    return jobData;
  }

  // Normalize text for easier parsing
  const lowerCaseText = rawText.toLowerCase();

  if (
    lowerCaseText.includes('job is no longer available') ||
    lowerCaseText.includes('position has been filled') ||
    lowerCaseText.includes('this job has expired') ||
    lowerCaseText.includes('no longer accepting applications')
  ) {
    jobData.status = 'CLOSED';
    return jobData;
  }
  
  // --- Title Extraction (often appears first and is prominent) ---
  // Look for common title indicators near the start of the text
  const titleMatch = rawText.match(/^(.*?)(?:job description|about the role|responsibilities|qualifications)/i);
  if (titleMatch && titleMatch[1]) {
    let potentialTitle = titleMatch[1].split('\n').filter(line => line.trim().length > 5 && line.trim().length < 100).slice(0, 3).join(' ').trim();
    if (potentialTitle) {
      jobData.title = potentialTitle;
    }
  }
  // Fallback title from first prominent line
  if (jobData.title === 'N/A') {
    const firstLine = rawText.split('\n')[0]?.trim();
    if (firstLine && firstLine.length > 5 && firstLine.length < 100) {
      jobData.title = firstLine;
    }
  }


  // --- Company Extraction ---
  // Look for "Company Name" or "About Us" sections, often near the title or footer
  const companyMatch = rawText.match(/(?:company name|about us|our company|we are)\s*([\w\s.&,-]+)\s*(\w+\s*inc|\w+\s*llc|\w+\s*corp|\w+\s*ltd)/i);
  if (companyMatch && companyMatch[1]) {
    jobData.company = companyMatch[1].trim();
  } else {
    // Attempt to extract from URL if not found (e.g., indeed.com/company/google)
    try {
      const urlHost = new URL(sourceUrl).hostname;
      const domainParts = urlHost.split('.');
      if (domainParts.length >= 2 && !['indeed', 'linkedin', 'glassdoor'].includes(domainParts[domainParts.length - 2])) {
        jobData.company = domainParts[domainParts.length - 2].replace(/[-\s]/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      }
    } catch (e) { /* ignore */ }
  }


  // --- Location Extraction ---
  // Common patterns: City, State; Remote; Hybrid; specific address
  const locationMatch = lowerCaseText.match(/(?:location|office|remote|hybrid):\s*([a-z\s,.-]+(?:\s*\d{5})?)/i);
  if (locationMatch && locationMatch[1]) {
    jobData.location = locationMatch[1].trim().split('\n')[0];
  } else {
    const cityStateMatch = lowerCaseText.match(/([a-z\s]+),\s*([a-z]{2,})\s*(\d{5})?/i);
    if (cityStateMatch && cityStateMatch[1] && cityStateMatch[2]) {
      jobData.location = `${cityStateMatch[1].trim()}, ${cityStateMatch[2].trim().toUpperCase()}`;
    }
  }
  if (lowerCaseText.includes('remote')) {
    jobData.location = jobData.location === 'N/A' ? 'Remote' : `${jobData.location} (Remote)`;
  }


  // --- Salary Extraction ---
  // Look for patterns like "$X - $Y", "Xk-Yk", "hourly rate"
  const salaryMatch = lowerCaseText.match(/(?:salary|pay|compensation):\s*(\$?[\d,.]+k?\s*(?:-|\s+to\s+)?\s*\$?[\d,.]+k?\s*(?:per\s*(?:year|hour))?)/i);
  if (salaryMatch && salaryMatch[1]) {
    jobData.salary = salaryMatch[1].trim();
  } else {
    const rangeMatch = lowerCaseText.match(/(\d{2,3}k(?:\s*-\s*\d{2,3}k)?(?:\s+per\s+year)?)/i);
    if (rangeMatch && rangeMatch[1]) {
      jobData.salary = rangeMatch[1].trim();
    }
  }


  // --- Experience Extraction ---
  // Look for "X years experience", "junior", "senior", "mid-level"
  const experienceMatch = lowerCaseText.match(/(?:experience|years):\s*(\d+\+?\s*years?\s*|\b(junior|mid-level|senior|entry-level|lead)\b)/i);
  if (experienceMatch && experienceMatch[1]) {
    jobData.experience = experienceMatch[1].trim();
  } else {
    if (lowerCaseText.includes('senior')) jobData.experience = 'Senior';
    else if (lowerCaseText.includes('mid-level') || lowerCaseText.includes('intermediate')) jobData.experience = 'Mid-level';
    else if (lowerCaseText.includes('junior') || lowerCaseText.includes('entry-level')) jobData.experience = 'Entry-level';
    else if (lowerCaseText.includes('lead')) jobData.experience = 'Lead';
  }

  // Basic cleanup for description if it's too generic
  if (jobData.description.includes("full text fallback") && rawText.length > 500) {
    // Attempt to find a more relevant description part
    const jobDescriptionKeywords = ['job description', 'responsibilities', 'qualifications', 'requirements', 'what you\'ll do'];
    for (const keyword of jobDescriptionKeywords) {
      const idx = lowerCaseText.indexOf(keyword);
      if (idx !== -1) {
        let potentialDesc = rawText.substring(idx).split('\n\n').slice(0, 5).join('\n\n'); // Get a few paragraphs
        if (potentialDesc.length > 100) {
          jobData.description = potentialDesc.substring(0, 5000) + '... (parsed description)';
          break;
        }
      }
    }
  }


  return jobData;
};

export default extractFromRawText