import Proposal from '../models/Proposal.js';
import Job from '../models/Job.js';
import Contract from '../models/Contract.js';
import { notifyNewProposal, notifyProposalAccepted } from '../utils/notificationService.js';

// @desc    Submit a proposal
// @route   POST /api/proposals
// @access  Private (Freelancer only)
export const submitProposal = async (req, res) => {
  try {
    const { jobId, coverLetter, bidAmount, deliveryTime } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if job is still open
    if (job.status !== 'open') {
      return res.status(400).json({ message: 'Job is no longer accepting proposals' });
    }

    // Check if already submitted
    const existingProposal = await Proposal.findOne({
      job: jobId,
      freelancer: req.user._id
    });

    if (existingProposal) {
      return res.status(400).json({ message: 'You have already submitted a proposal for this job' });
    }

    const proposal = await Proposal.create({
      job: jobId,
      freelancer: req.user._id,
      coverLetter,
      bidAmount,
      deliveryTime
    });

    // Add proposal to job
    job.proposals.push(proposal._id);
    await job.save();

    // Create notification for client
    await notifyNewProposal(
      job.client,
      req.user.name,
      job.title,
      jobId,
      proposal._id
    );

    const populatedProposal = await Proposal.findById(proposal._id)
      .populate('freelancer', 'name avatar rating reviewCount skills');

    res.status(201).json(populatedProposal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get proposals for a job
// @route   GET /api/proposals/job/:jobId
// @access  Private (Client only)
export const getJobProposals = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the job owner
    if (job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const proposals = await Proposal.find({ job: req.params.jobId })
      .populate('freelancer', 'name avatar rating reviewCount skills completedJobs')
      .sort({ createdAt: -1 });

    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get freelancer's proposals
// @route   GET /api/proposals/my-proposals
// @access  Private (Freelancer only)
export const getMyProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ freelancer: req.user._id })
      .populate('job')
      .populate('job.client', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept a proposal
// @route   PUT /api/proposals/:id/accept
// @access  Private (Client only)
export const acceptProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('job');

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    const job = proposal.job;

    // Check if user is the job owner
    if (job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update proposal status
    proposal.status = 'accepted';
    await proposal.save();

    // Update job status
    job.status = 'in-progress';
    job.hiredFreelancer = proposal.freelancer;
    await job.save();

    // Reject other proposals
    await Proposal.updateMany(
      { job: job._id, _id: { $ne: proposal._id } },
      { status: 'rejected' }
    );

    // Create contract
    const contract = await Contract.create({
      job: job._id,
      client: job.client,
      freelancer: proposal.freelancer,
      proposal: proposal._id,
      totalAmount: proposal.bidAmount
    });

    // Create notification for freelancer
    await notifyProposalAccepted(
      proposal.freelancer,
      req.user.name,
      job.title,
      contract._id
    );

    res.json({ proposal, contract });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject a proposal
// @route   PUT /api/proposals/:id/reject
// @access  Private (Client only)
export const rejectProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('job');

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    // Check if user is the job owner
    if (proposal.job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    proposal.status = 'rejected';
    await proposal.save();

    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Withdraw a proposal
// @route   PUT /api/proposals/:id/withdraw
// @access  Private (Freelancer only)
export const withdrawProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    // Check if user is the proposal owner
    if (proposal.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (proposal.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot withdraw this proposal' });
    }

    proposal.status = 'withdrawn';
    await proposal.save();

    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
