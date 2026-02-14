import express from 'express';

import {
  scrapeJob,
  createJob,
  getJobs,
  updateJob,
  deleteJob,
} from '../controllers/jobController.js';

import auth from '../middleware/authMiddleware.js';
import { body, param } from 'express-validator';
import { JOB_STATUSES } from '../utils/constants.js';

const router = express.Router();

router.post(
  '/scrape',
  auth,
  [
    body('url', 'A valid URL is required').isURL(),
  ],
  scrapeJob
);

router.post(
  '/',
  auth,
  [
    body('title', 'Title is required').not().isEmpty(),
    body('company', 'Company is required').not().isEmpty(),
    body('sourceUrl', 'A valid source URL is required').isURL(),
    body('description', 'Description is required').not().isEmpty(),
    body('status', `Status must be one of: ${JOB_STATUSES.join(', ')}`).optional().isIn(JOB_STATUSES),
  ],
  createJob
);

router.get('/', auth, getJobs);

router.put(
  '/:id',
  auth,
  [
    param('id', 'Job ID is required').isMongoId(),
    body('status', `Status must be one of: ${JOB_STATUSES.join(', ')}`).optional().isIn(JOB_STATUSES),
    body('notes').optional().isString(),
  ],
  updateJob
);

router.delete(
  '/:id',
  auth,
  [
    param('id', 'Job ID is required').isMongoId(),
  ],
  deleteJob
);

export default router;