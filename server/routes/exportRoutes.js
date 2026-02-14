import express from 'express';
import { exportJobsToExcel } from '../controllers/exportController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/excel', auth, exportJobsToExcel);

export default router;




