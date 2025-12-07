import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
  name: String,
  url: String,
  fileType: String
}, { _id: false });

const messageSchema = new mongoose.Schema({
  conversation: {
    type: String,
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String
  },
  attachments: [attachmentSchema],
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date
}, {
  timestamps: true
});

// Index for efficient querying
messageSchema.index({ conversation: 1, createdAt: -1 });

// Force restart
const Message = mongoose.model('Message', messageSchema);

export default Message;
