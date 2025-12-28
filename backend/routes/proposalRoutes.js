import express from 'express';
import {
  submitProposal,
  getJobProposals,
  getMyProposals,
  acceptProposal,
  rejectProposal,
  withdrawProposal
} from '../controllers/proposalController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('freelancer'), submitProposal);
router.get('/my-proposals', protect, authorize('freelancer', 'admin'), getMyProposals);
router.get('/job/:jobId', protect, authorize('client'), getJobProposals);
router.put('/:id/accept', protect, authorize('client'), acceptProposal);
router.put('/:id/reject', protect, authorize('client'), rejectProposal);
router.put('/:id/withdraw', protect, authorize('freelancer'), withdrawProposal);

export default router;
