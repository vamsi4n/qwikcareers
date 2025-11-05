const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversation.controller');
const messageController = require('../controllers/message.controller');
const authenticate = require('../../auth/middleware/authenticate.middleware');

// All routes require authentication
router.use(authenticate);

// Conversation routes
router.post('/conversations', conversationController.createConversation);
router.get('/conversations', conversationController.getConversations);
router.get('/conversations/unread-count', conversationController.getUnreadCount);
router.get('/conversations/:id', conversationController.getConversationById);
router.post('/conversations/:id/read', conversationController.markAsRead);
router.delete('/conversations/:id', conversationController.deleteConversation);

// Message routes
router.post('/messages', messageController.sendMessage);
router.get('/messages/search', messageController.searchMessages);
router.get('/conversations/:conversationId/messages', messageController.getMessages);
router.get('/messages/:id', messageController.getMessageById);
router.patch('/messages/:id', messageController.updateMessage);
router.delete('/messages/:id', messageController.deleteMessage);
router.post('/messages/:id/read', messageController.markAsRead);
router.post('/messages/read-multiple', messageController.markMultipleAsRead);

module.exports = router;
