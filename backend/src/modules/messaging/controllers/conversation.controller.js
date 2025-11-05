const conversationService = require('../services/conversation.service');
const catchAsync = require('../../../shared/utils/catchAsync');
const ApiResponse = require('../../../shared/utils/ApiResponse');

const createConversation = catchAsync(async (req, res) => {
  const { participantId } = req.body;
  const conversation = await conversationService.createConversation(req.user._id, participantId);
  ApiResponse.created(res, conversation, 'Conversation created successfully');
});

const getConversations = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const result = await conversationService.getConversations(req.user._id, page, limit);
  ApiResponse.success(res, result, 'Conversations retrieved successfully');
});

const getConversationById = catchAsync(async (req, res) => {
  const conversation = await conversationService.getConversationById(req.user._id, req.params.id);
  ApiResponse.success(res, conversation, 'Conversation retrieved successfully');
});

const markAsRead = catchAsync(async (req, res) => {
  const conversation = await conversationService.markAsRead(req.user._id, req.params.id);
  ApiResponse.success(res, conversation, 'Conversation marked as read');
});

const deleteConversation = catchAsync(async (req, res) => {
  const result = await conversationService.deleteConversation(req.user._id, req.params.id);
  ApiResponse.success(res, result, 'Conversation deleted successfully');
});

const getUnreadCount = catchAsync(async (req, res) => {
  const result = await conversationService.getUnreadCount(req.user._id);
  ApiResponse.success(res, result, 'Unread count retrieved successfully');
});

module.exports = {
  createConversation,
  getConversations,
  getConversationById,
  markAsRead,
  deleteConversation,
  getUnreadCount
};
