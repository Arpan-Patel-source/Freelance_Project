import Message from '../models/Message.js';
import { notifyNewMessage } from '../utils/notificationService.js';

// Helper to create conversation ID
const getConversationId = (userId1, userId2) => {
  return [userId1, userId2].sort().join('_');
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, attachments } = req.body;
    const senderId = req.user._id;

    // Ensure at least content or attachments are provided
    if (!content && (!attachments || attachments.length === 0)) {
      return res.status(400).json({ message: 'Message must have content or attachments' });
    }

    const conversationId = getConversationId(senderId, receiverId);

    const message = await Message.create({
      conversation: conversationId,
      sender: senderId,
      receiver: receiverId,
      content: content || '', // Allow empty content if there are attachments
      attachments: attachments || []
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    // Send notification to receiver
    await notifyNewMessage(receiverId, req.user.name, conversationId);

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get conversation messages
// @route   GET /api/messages/:userId
// @access  Private
export const getConversation = async (req, res) => {
  try {
    const conversationId = getConversationId(req.user._id, req.params.userId);

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all conversations
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all unique conversations
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$conversation',
          lastMessageId: { $first: '$_id' }
        }
      }
    ]);

    // Get the actual last messages with populated user data
    const lastMessageIds = conversations.map(c => c.lastMessageId);
    const lastMessages = await Message.find({ _id: { $in: lastMessageIds } })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(lastMessages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/messages/:userId/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const conversationId = getConversationId(req.user._id, req.params.userId);

    await Message.updateMany(
      {
        conversation: conversationId,
        receiver: req.user._id,
        isRead: false
      },
      {
        isRead: true,
        readAt: Date.now()
      }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
