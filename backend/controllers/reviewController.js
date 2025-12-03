import Review from '../models/Review.js';
import User from '../models/User.js';
import Contract from '../models/Contract.js';
import { notifyReview } from '../utils/notificationService.js';

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { contractId, revieweeId, rating, comment, skills } = req.body;

    const contract = await Contract.findById(contractId);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    if (contract.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed contracts' });
    }

    const review = await Review.create({
      contract: contractId,
      job: contract.job,
      reviewer: req.user._id,
      reviewee: revieweeId,
      rating,
      comment,
      skills
    });

    // Update reviewee's rating
    const reviewee = await User.findById(revieweeId);
    const totalRating = reviewee.rating * reviewee.reviewCount + rating;
    reviewee.reviewCount += 1;
    reviewee.rating = totalRating / reviewee.reviewCount;
    await reviewee.save();

    // Send notification to reviewee
    await notifyReview(
      revieweeId,
      req.user.name,
      rating,
      contractId
    );

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a user
// @route   GET /api/reviews/user/:userId
// @access  Public
export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name avatar')
      .populate('job', 'title')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
