import Job from '../models/Job.js';
import Proposal from '../models/Proposal.js';

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Client only)
export const createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      client: req.user._id
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const { category, skills, budgetMin, budgetMax, search, status } = req.query;

    console.log('Fetching jobs with filters:', { category, skills, budgetMin, budgetMax, search, status });

    let query = {};

    if (category) {
      query.category = category;
    }

    if (skills) {
      query.skills = { $in: skills.split(',') };
    }

    if (budgetMin || budgetMax) {
      if (budgetMin) {
        query['budget.max'] = { $gte: Number(budgetMin) };
      }
      if (budgetMax) {
        query['budget.min'] = { $lte: Number(budgetMax) };
      }
    }

    if (search) {
      // Search only by title, case-insensitive
      query.title = new RegExp(search, 'i');
    }

    if (status) {
      query.status = status;
    } else {
      query.status = 'open';
    }

    const jobs = await Job.find(query)
      .populate('client', 'name avatar rating reviewCount')
      .sort({ createdAt: -1 });

    console.log(`Found ${jobs.length} jobs`);
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('client', 'name avatar rating reviewCount totalSpent')
      .populate({
        path: 'proposals',
        populate: {
          path: 'freelancer',
          select: 'name avatar rating reviewCount skills'
        }
      });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Increment view count
    job.viewCount += 1;
    await job.save();

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Client only)
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the job owner
    if (job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Client only)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the job owner
    if (job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await job.deleteOne();

    res.json({ message: 'Job removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get jobs posted by client
// @route   GET /api/jobs/client/my-jobs
// @access  Private (Client only)
export const getMyJobs = async (req, res) => {
  try {
    // Build query based on user role
    let query = {};

    if (req.user.role === 'client') {
      query = { client: req.user._id };
    }
    // For admin users, query remains empty {} to fetch all jobs

    const jobs = await Job.find(query)
      .populate('hiredFreelancer', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
