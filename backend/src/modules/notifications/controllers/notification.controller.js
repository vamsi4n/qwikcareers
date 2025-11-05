const notificationService = require('../services/notification.service');
const catchAsync = require('../../../shared/utils/catchAsync');
const ApiResponse = require('../../../shared/utils/ApiResponse');

const getUserNotifications = catchAsync(async (req, res) => {
  const { page, limit, ...filter } = req.query;
  const result = await notificationService.getUserNotifications(
    req.user._id,
    page,
    limit,
    filter
  );
  ApiResponse.success(res, result, 'Notifications retrieved successfully');
});

const getNotificationById = catchAsync(async (req, res) => {
  const notification = await notificationService.getNotificationById(
    req.user._id,
    req.params.id
  );
  ApiResponse.success(res, notification, 'Notification retrieved successfully');
});

const markAsRead = catchAsync(async (req, res) => {
  const notification = await notificationService.markAsRead(req.user._id, req.params.id);
  ApiResponse.success(res, notification, 'Notification marked as read');
});

const markAllAsRead = catchAsync(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user._id);
  ApiResponse.success(res, result, 'All notifications marked as read');
});

const markMultipleAsRead = catchAsync(async (req, res) => {
  const { notificationIds } = req.body;
  const result = await notificationService.markMultipleAsRead(req.user._id, notificationIds);
  ApiResponse.success(res, result, 'Notifications marked as read');
});

const deleteNotification = catchAsync(async (req, res) => {
  const result = await notificationService.deleteNotification(req.user._id, req.params.id);
  ApiResponse.success(res, result, 'Notification deleted successfully');
});

const deleteMultipleNotifications = catchAsync(async (req, res) => {
  const { notificationIds } = req.body;
  const result = await notificationService.deleteMultipleNotifications(
    req.user._id,
    notificationIds
  );
  ApiResponse.success(res, result, 'Notifications deleted successfully');
});

const deleteAllNotifications = catchAsync(async (req, res) => {
  const result = await notificationService.deleteAllNotifications(req.user._id);
  ApiResponse.success(res, result, 'All notifications deleted successfully');
});

const getUnreadCount = catchAsync(async (req, res) => {
  const result = await notificationService.getUnreadCount(req.user._id);
  ApiResponse.success(res, result, 'Unread count retrieved successfully');
});

module.exports = {
  getUserNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  markMultipleAsRead,
  deleteNotification,
  deleteMultipleNotifications,
  deleteAllNotifications,
  getUnreadCount
};
