import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a job title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a job description']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Web Development', 'Mobile Development', 'Design', 'Writing', 'Marketing', 'Data Science', 'Other']
  },
  skills: [{
    type: String,
    required: true
  }],
  budget: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  budgetType: {
    type: String,
    enum: ['fixed', 'hourly'],
    default: 'fixed'
  },
  duration: {
    type: String,
    enum: ['less than 1 week', '1-2 weeks', '2-4 weeks', '1-3 months', 'more than 3 months'],
    required: true
  },
  experienceLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'expert'],
    default: 'intermediate'
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  proposals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proposal'
  }],
  hiredFreelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attachments: [{
    name: String,
    url: String
  }],
  deadline: {
    type: Date
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search
jobSchema.index({ title: 'text', description: 'text' });

const Job = mongoose.model('Job', jobSchema);

export default Job;
