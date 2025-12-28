import express from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getJobs)
  .post(protect, authorize('client'), createJob);

router.get('/client/my-jobs', protect, authorize('client', 'admin'), getMyJobs);

router.route('/:id')
  .get(getJobById)
  .put(protect, authorize('client'), updateJob)
  .delete(protect, authorize('client'), deleteJob);

export default router;
