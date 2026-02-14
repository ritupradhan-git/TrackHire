import Job from '../models/jobModel.js';
import generateExcelFromTemplate from '../services/excelService.js'; 
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Export user's jobs to Excel
// @route   GET /api/export/excel
// @access  Private
export const exportJobsToExcel = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ userId: req.user.id }).sort({ dateAdded: -1 });

  if (jobs.length === 0) {
    // If no jobs, we can either return a 404 or an empty template.
    // For now, let's return an empty template with a 200 OK and a message,
    // so the user still gets a downloadable file with headers.
    // If you prefer 404, uncomment the next line and comment the subsequent logic.
    // return res.status(404).json({ success: false, message: 'No jobs found to export for this user.' });
  }

  // Generate Excel, even if jobs array is empty, to provide a template file
  const buffer = await generateExcelFromTemplate(jobs);

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=careerledger_jobs.xlsx"
  );
  res.send(buffer);
});





