import express from 'express';
import {
    getAdminDashboard,
    getAllUsers,
    getAllContracts,
    getAllJobs,
    suspendUser,
    deleteUser
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// All admin routes require authentication AND admin role
// Apply both middlewares to every route

// Dashboard
router.get('/dashboard', protect, isAdmin, getAdminDashboard);

// User Management
router.get('/users', protect, isAdmin, getAllUsers);
router.put('/users/:id/suspend', protect, isAdmin, suspendUser);
router.delete('/users/:id', protect, isAdmin, deleteUser);

// Contract Management
router.get('/contracts', protect, isAdmin, getAllContracts);

// Job Management
router.get('/jobs', protect, isAdmin, getAllJobs);

export default router;
