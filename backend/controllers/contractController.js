import Contract from '../models/Contract.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import { notifyDeliverable, notifyContractCompleted } from '../utils/notificationService.js';

// @desc    Get all contracts for user
// @route   GET /api/contracts
// @access  Private
export const getMyContracts = async (req, res) => {
  try {
    const query = req.user.role === 'client'
      ? { client: req.user._id }
      : { freelancer: req.user._id };

    const contracts = await Contract.find(query)
      .populate('job', 'title category')
      .populate('client', 'name avatar')
      .populate('freelancer', 'name avatar rating')
      .sort({ createdAt: -1 });

    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single contract
// @route   GET /api/contracts/:id
// @access  Private
export const getContractById = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('job')
      .populate('client', 'name avatar email')
      .populate('freelancer', 'name avatar email rating skills');

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Check authorization
    if (
      contract.client._id.toString() !== req.user._id.toString() &&
      contract.freelancer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add milestone to contract
// @route   POST /api/contracts/:id/milestones
// @access  Private (Client only)
export const addMilestone = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    if (contract.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    contract.milestones.push(req.body);
    await contract.save();

    res.json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit deliverable
// @route   POST /api/contracts/:id/deliverables
// @access  Private (Freelancer only)
export const submitDeliverable = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    if (contract.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    contract.deliverables.push(req.body);
    await contract.save();

    // Populate contract to get job details
    const populatedContract = await Contract.findById(contract._id).populate('job', 'title');

    // Create notification for client
    await notifyDeliverable(
      contract.client,
      req.user.name,
      populatedContract.job.title,
      contract._id,
      contract.deliverables[contract.deliverables.length - 1]._id
    );

    res.json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Complete contract
// @route   PUT /api/contracts/:id/complete
// @access  Private (Client only)
export const completeContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    if (contract.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    contract.status = 'completed';
    contract.completedAt = Date.now();
    contract.paymentStatus = 'released';
    await contract.save();

    // Update job status
    await Job.findByIdAndUpdate(contract.job, { status: 'completed' });

    // Update freelancer stats
    const freelancer = await User.findById(contract.freelancer);
    freelancer.completedJobs += 1;
    freelancer.totalEarnings += contract.totalAmount;
    await freelancer.save();

    // Update client stats
    const client = await User.findById(contract.client);
    client.totalSpent += contract.totalAmount;
    await client.save();

    // Populate contract to get job details
    const populatedContract = await Contract.findById(contract._id).populate('job', 'title');

    // Create notification for freelancer
    await notifyContractCompleted(
      contract.freelancer,
      populatedContract.job.title,
      contract._id
    );

    res.json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel contract
// @route   PUT /api/contracts/:id/cancel
// @access  Private
export const cancelContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Check authorization
    if (
      contract.client.toString() !== req.user._id.toString() &&
      contract.freelancer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    contract.status = 'cancelled';
    await contract.save();

    // Update job status
    await Job.findByIdAndUpdate(contract.job, { status: 'cancelled' });

    res.json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
