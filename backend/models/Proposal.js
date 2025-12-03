import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverLetter: {
    type: String,
    required: [true, 'Please provide a cover letter']
  },
  bidAmount: {
    type: Number,
    required: [true, 'Please provide a bid amount']
  },
  deliveryTime: {
    type: Number,
    required: [true, 'Please provide estimated delivery time in days']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  attachments: [{
    name: String,
    url: String
  }]
}, {
  timestamps: true
});

// Ensure one proposal per freelancer per job
proposalSchema.index({ job: 1, freelancer: 1 }, { unique: true });

const Proposal = mongoose.model('Proposal', proposalSchema);

export default Proposal;
