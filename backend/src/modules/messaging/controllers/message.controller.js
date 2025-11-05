const messageService = require('../services/message.service');
const catchAsync = require('../../../shared/utils/catchAsync');
const ApiResponse = require('../../../shared/utils/ApiResponse');

const sendMessage = catchAsync(async (req, res) => {
  const message = await messageService.sendMessage(req.user._id, req.body);
  ApiResponse.created(res, message, 'Message sent successfully');
});

const getMessages = catchAsync(async (req, res) => {
  const { conversationId } = req.params;
  const { page, limit } = req.query;
  const result = await messageService.getMessages(req.user._id, conversationId, page, limit);
  ApiResponse.success(res, result, 'Messages retrieved successfully');
});

const getMessageById = catchAsync(async (req, res) => {
  const message = await messageService.getMessageById(req.user._id, req.params.id);
  ApiResponse.success(res, message, 'Message retrieved successfully');
});

const updateMessage = catchAsync(async (req, res) => {
  const { content } = req.body;
  const message = await messageService.updateMessage(req.user._id, req.params.id, content);
  ApiResponse.success(res, message, 'Message updated successfully');
});

const deleteMessage = catchAsync(async (req, res) => {
  const message = await messageService.deleteMessage(req.user._id, req.params.id);
  ApiResponse.success(res, message, 'Message deleted successfully');
});

const markAsRead = catchAsync(async (req, res) => {
  const message = await messageService.markAsRead(req.user._id, req.params.id);
  ApiResponse.success(res, message, 'Message marked as read');
});

const markMultipleAsRead = catchAsync(async (req, res) => {
  const { messageIds } = req.body;
  const result = await messageService.markMultipleAsRead(req.user._id, messageIds);
  ApiResponse.success(res, result, 'Messages marked as read');
});

const searchMessages = catchAsync(async (req, res) => {
  const { query, conversationId } = req.query;
  const messages = await messageService.searchMessages(req.user._id, query, conversationId);
  ApiResponse.success(res, messages, 'Messages retrieved successfully');
});

module.exports = {
  sendMessage,
  getMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
  markAsRead,
  markMultipleAsRead,
  searchMessages
};
