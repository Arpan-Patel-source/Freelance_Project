import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  amount: {
    type: Number,
    required: true
  },
  dueDate: Date,
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'submitted', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedAt: Date,
  approvedAt: Date
});

const contractSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  proposal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proposal',
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled', 'disputed'],
    default: 'active'
  },
  milestones: [milestoneSchema],
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  deliverables: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  paymentStatus: {
    type: String,
    enum: ['pending', 'escrowed', 'released', 'refunded'],
    default: 'pending'
  },
  completedAt: Date
}, {
  timestamps: true
});

const Contract = mongoose.model('Contract', contractSchema);

export default Contract;
