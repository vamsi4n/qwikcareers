const Message = require('../../../shared/models/Message.model');
const Conversation = require('../../../shared/models/Conversation.model');
const conversationService = require('./conversation.service');
const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');

class MessageService {
  async sendMessage(userId, messageData) {
    const { conversationId, content, attachments = [] } = messageData;

    // Verify user is participant of the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found or access denied');
    }

    // Create message
    const message = await Message.create({
      conversation: conversationId,
      sender: userId,
      content,
      attachments
    });

    // Update conversation's last message and unread counts
    await conversationService.updateLastMessage(conversationId, message._id);
    await conversationService.incrementUnreadCount(conversationId, userId);

    return message.populate({
      path: 'sender',
      select: 'firstName lastName avatar'
    });
  }

  async getMessages(userId, conversationId, page = 1, limit = 50) {
    // Verify user is participant of the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found or access denied');
    }

    const skip = (page - 1) * limit;

    const messages = await Message.find({ conversation: conversationId })
      .populate({
        path: 'sender',
        select: 'firstName lastName avatar'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments({ conversation: conversationId });

    // Mark conversation as read
    await conversationService.markAsRead(userId, conversationId);

    return {
      messages: messages.reverse(), // Reverse to show oldest first
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    };
  }

  async getMessageById(userId, messageId) {
    const message = await Message.findById(messageId).populate({
      path: 'sender',
      select: 'firstName lastName avatar'
    });

    if (!message) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
    }

    // Verify user is participant of the conversation
    const conversation = await Conversation.findOne({
      _id: message.conversation,
      participants: userId
    });

    if (!conversation) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
    }

    return message;
  }

  async updateMessage(userId, messageId, content) {
    const message = await Message.findById(messageId);

    if (!message) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
    }

    // Only sender can edit message
    if (message.sender.toString() !== userId) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Only sender can edit message');
    }

    // Check if message is not too old (e.g., 15 minutes)
    const fifteenMinutes = 15 * 60 * 1000;
    if (Date.now() - message.createdAt.getTime() > fifteenMinutes) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Message is too old to edit');
    }

    message.content = content;
    message.isEdited = true;
    await message.save();

    return message.populate({
      path: 'sender',
      select: 'firstName lastName avatar'
    });
  }

  async deleteMessage(userId, messageId) {
    const message = await Message.findById(messageId);

    if (!message) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
    }

    // Only sender can delete message
    if (message.sender.toString() !== userId) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Only sender can delete message');
    }

    message.isDeleted = true;
    message.content = 'This message was deleted';
    message.attachments = [];
    await message.save();

    return message;
  }

  async markAsRead(userId, messageId) {
    const message = await Message.findById(messageId);

    if (!message) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
    }

    // Add user to readBy array if not already there
    if (!message.readBy.includes(userId)) {
      message.readBy.push(userId);
      await message.save();
    }

    return message;
  }

  async markMultipleAsRead(userId, messageIds) {
    await Message.updateMany(
      {
        _id: { $in: messageIds },
        readBy: { $ne: userId }
      },
      {
        $push: { readBy: userId }
      }
    );

    return { message: 'Messages marked as read' };
  }

  async searchMessages(userId, query, conversationId = null) {
    const searchQuery = {
      content: { $regex: query, $options: 'i' },
      isDeleted: false
    };

    // Get all conversations user is part of
    const conversations = await Conversation.find({
      participants: userId
    }).select('_id');

    const conversationIds = conversations.map((c) => c._id);

    // If specific conversation, search only in that
    if (conversationId) {
      // Verify user has access
      if (!conversationIds.some((id) => id.toString() === conversationId)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
      }
      searchQuery.conversation = conversationId;
    } else {
      searchQuery.conversation = { $in: conversationIds };
    }

    const messages = await Message.find(searchQuery)
      .populate({
        path: 'sender',
        select: 'firstName lastName avatar'
      })
      .populate({
        path: 'conversation',
        select: 'participants type'
      })
      .sort({ createdAt: -1 })
      .limit(50);

    return messages;
  }
}

module.exports = new MessageService();
