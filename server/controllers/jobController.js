import Job from '../models/jobModel.js';
import { scrapeJobPosting } from '../services/scraper/scraperJob.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { validationResult } from 'express-validator';


// @desc    Scrape job details from a URL
// @route   POST /api/jobs/scrape
// @access  Private
export const scrapeJob = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      success: false,
      message: "URL is required for scraping.",
    });
  }

  const scrapedData = await scrapeJobPosting(url);

  if (!scrapedData) {
    return res.status(500).json({
      success: false,
      message: "Failed to scrape job data.",
    });
  }

  // 🔥 SAVE TO DB
  const newJob = await Job.create({
    userId: req.user.id,
    ...scrapedData,
    sourceUrl: url,
    dateAdded: new Date(),
  });

  res.status(201).json({
    success: true,
    message: "Job scraped and saved successfully",
    data: newJob,
  });
});



// @desc    Create a new job entry
// @route   POST /api/jobs
// @access  Private
export const createJob = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }

  const { title, company, location, salary, experience, description, sourceUrl, status, notes } = req.body;

  const newJob = new Job({
    userId: req.user.id,
    title,
    company,
    location,
    salary,
    experience,
    description,
    sourceUrl,
    status,
    notes,
    dateAdded: new Date(),
  });

  const job = await newJob.save();

  res.status(201).json({
    success: true,
    message: 'Job added successfully',
    data: job,
  });
});


// @desc    Get all jobs for the logged-in user
// @route   GET /api/jobs
// @access  Private
export const getJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ userId: req.user.id }).sort({ dateAdded: -1 });

  res.json({
    success: true,
    message: 'Jobs fetched successfully',
    data: jobs,
  });
});


// @desc    Update a job by ID
// @route   PUT /api/jobs/:id
// @access  Private
export const updateJob = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }

  const { status, notes } = req.body;

  let job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }

  if (job.userId.toString() !== req.user.id) {
    return res.status(401).json({ success: false, message: 'Not authorized to update this job' });
  }

  job.status = status || job.status;
  job.notes = notes !== undefined ? notes : job.notes;

  job = await job.save();

  res.json({
    success: true,
    message: 'Job updated successfully',
    data: job,
  });
});


// @desc    Delete a job by ID
// @route   DELETE /api/jobs/:id
// @access  Private
export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }

  if (job.userId.toString() !== req.user.id) {
    return res.status(401).json({ success: false, message: 'Not authorized to delete this job' });
  }

  await job.deleteOne();

  res.json({
    success: true,
    message: 'Job deleted successfully',
    data: {},
  });
});
