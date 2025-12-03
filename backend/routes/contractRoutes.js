import express from 'express';
import {
  getMyContracts,
  getContractById,
  addMilestone,
  submitDeliverable,
  completeContract,
  cancelContract
} from '../controllers/contractController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getMyContracts);
router.get('/:id', protect, getContractById);
router.post('/:id/milestones', protect, authorize('client'), addMilestone);
router.post('/:id/deliverables', protect, authorize('freelancer'), submitDeliverable);
router.put('/:id/complete', protect, authorize('client'), completeContract);
router.put('/:id/cancel', protect, cancelContract);

export default router;
