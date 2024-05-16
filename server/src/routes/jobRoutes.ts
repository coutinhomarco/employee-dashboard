import express from 'express';
import { getJobStatus } from '../controllers/job/jobStatusController';

const router = express.Router();

router.get('/job/:id/status', getJobStatus);

export default router;
