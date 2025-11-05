const Conversation = require('../../../shared/models/Conversation.model');
const Message = require('../../../shared/models/Message.model');
const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');

class ConversationService {
  async createConversation(userId, participantId) {
    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      participants: { $all: [userId, participantId] },
      type: 'direct'
    });

    if (existingConversation) {
      return existingConversation.populate({
        path: 'participants',
        select: 'firstName lastName email avatar'
      });
    }

    // Create new conversation
    const conversation = await Conversation.create({
      participants: [userId, participantId],
      type: 'direct'
    });

    return conversation.populate({
      path: 'participants',
      select: 'firstName lastName email avatar'
    });
  }

  async getConversations(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const conversations = await Conversation.find({
      participants: userId
    })
      .populate({
        path: 'participants',
        select: 'firstName lastName email avatar'
      })
      .populate({
        path: 'lastMessage',
        populate: {
          path: 'sender',
          select: 'firstName lastName avatar'
        }
      })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Conversation.countDocuments({ participants: userId });

    return {
      conversations,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    };
  }

  async getConversationById(userId, conversationId) {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    })
      .populate({
        path: 'participants',
        select: 'firstName lastName email avatar'
      })
      .populate({
        path: 'lastMessage',
        populate: {
          path: 'sender',
          select: 'firstName lastName avatar'
        }
      });

    if (!conversation) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
    }

    return conversation;
  }

  async markAsRead(userId, conversationId) {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
    }

    // Update unread count for this user
    const otherParticipantIndex = conversation.participants.findIndex(
      (p) => p.toString() !== userId
    );

    if (otherParticipantIndex !== -1) {
      conversation.unreadCount.set(userId, 0);
      await conversation.save();
    }

    return conversation;
  }

  async deleteConversation(userId, conversationId) {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
    }

    // Delete all messages in the conversation
    await Message.deleteMany({ conversation: conversationId });

    // Delete the conversation
    await conversation.deleteOne();

    return { message: 'Conversation deleted successfully' };
  }

  async updateLastMessage(conversationId, messageId) {
    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $set: { lastMessage: messageId },
        $currentDate: { updatedAt: true }
      },
      { new: true }
    );

    return conversation;
  }

  async incrementUnreadCount(conversationId, senderId) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return;

    // Increment unread count for all participants except sender
    conversation.participants.forEach((participantId) => {
      if (participantId.toString() !== senderId) {
        const currentCount = conversation.unreadCount.get(participantId.toString()) || 0;
        conversation.unreadCount.set(participantId.toString(), currentCount + 1);
      }
    });

    await conversation.save();
    return conversation;
  }

  async getUnreadCount(userId) {
    const conversations = await Conversation.find({
      participants: userId
    });

    let totalUnread = 0;
    conversations.forEach((conv) => {
      const unread = conv.unreadCount.get(userId) || 0;
      totalUnread += unread;
    });

    return { unreadCount: totalUnread };
  }
}

module.exports = new ConversationService();
