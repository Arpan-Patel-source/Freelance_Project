import User from '../models/User.js';
import Job from '../models/Job.js';
import Contract from '../models/Contract.js';
import Proposal from '../models/Proposal.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getAdminDashboard = async (req, res) => {
    try {
        // Get counts
        const totalUsers = await User.countDocuments();
        const totalFreelancers = await User.countDocuments({ role: 'freelancer' });
        const totalClients = await User.countDocuments({ role: 'client' });
        const totalJobs = await Job.countDocuments();
        const totalContracts = await Contract.countDocuments();
        const activeContracts = await Contract.countDocuments({ status: 'active' });
        const completedContracts = await Contract.countDocuments({ status: 'completed' });
        const totalProposals = await Proposal.countDocuments();

        // Calculate total platform revenue (sum of all completed contracts)
        const revenueData = await Contract.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueData[0]?.total || 0;

        // Get recent users (last 5)
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email role createdAt');

        // Get recent contracts (last 5)
        const recentContracts = await Contract.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('client', 'name email')
            .populate('freelancer', 'name email')
            .populate('job', 'title');

        res.json({
            stats: {
                totalUsers,
                totalFreelancers,
                totalClients,
                totalJobs,
                totalContracts,
                activeContracts,
                completedContracts,
                totalProposals,
                totalRevenue
            },
            recentUsers,
            recentContracts
        });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({ message: 'Error fetching admin dashboard data' });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

// @desc    Get all contracts
// @route   GET /api/admin/contracts
// @access  Private/Admin
export const getAllContracts = async (req, res) => {
    try {
        const contracts = await Contract.find()
            .populate('client', 'name email')
            .populate('freelancer', 'name email')
            .populate('job', 'title')
            .sort({ createdAt: -1 });

        res.json(contracts);
    } catch (error) {
        console.error('Get contracts error:', error);
        res.status(500).json({ message: 'Error fetching contracts' });
    }
};

// @desc    Get all jobs
// @route   GET /api/admin/jobs
// @access  Private/Admin
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate('client', 'name email')
            .sort({ createdAt: -1 });

        res.json(jobs);
    } catch (error) {
        console.error('Get jobs error:', error);
        res.status(500).json({ message: 'Error fetching jobs' });
    }
};

// @desc    Suspend/Unsuspend user
// @route   PUT /api/admin/users/:id/suspend
// @access  Private/Admin
export const suspendUser = async (req, res) => {
    try {
        const { suspended } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent suspending other admins
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot suspend admin users' });
        }

        user.suspended = suspended;
        await user.save();

        res.json({
            message: `User ${suspended ? 'suspended' : 'unsuspended'} successfully`,
            user
        });
    } catch (error) {
        console.error('Suspend user error:', error);
        res.status(500).json({ message: 'Error updating user status' });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent deleting admins
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot delete admin users' });
        }

        await user.deleteOne();

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Error deleting user' });
    }
};
