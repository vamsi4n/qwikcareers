const Notification = require('../../../shared/models/Notification.model');
const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');

class NotificationService {
  async createNotification(notificationData) {
    const notification = await Notification.create(notificationData);
    return notification.populate('recipient', 'firstName lastName email');
  }

  async getUserNotifications(userId, page = 1, limit = 20, filter = {}) {
    const skip = (page - 1) * limit;
    const query = { recipient: userId };

    // Filter by read status
    if (filter.isRead !== undefined) {
      query.isRead = filter.isRead === 'true';
    }

    // Filter by type
    if (filter.type) {
      query.type = filter.type;
    }

    // Filter by category
    if (filter.category) {
      query.category = filter.category;
    }

    const notifications = await Notification.find(query)
      .populate('recipient', 'firstName lastName email')
      .populate('relatedUser', 'firstName lastName email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false
    });

    return {
      notifications,
      total,
      unreadCount,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    };
  }

  async getNotificationById(userId, notificationId) {
    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: userId
    })
      .populate('recipient', 'firstName lastName email')
      .populate('relatedUser', 'firstName lastName email avatar');

    if (!notification) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
    }

    return notification;
  }

  async markAsRead(userId, notificationId) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { $set: { isRead: true, readAt: new Date() } },
      { new: true }
    );

    if (!notification) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
    }

    return notification;
  }

  async markAllAsRead(userId) {
    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    return { message: 'All notifications marked as read' };
  }

  async markMultipleAsRead(userId, notificationIds) {
    await Notification.updateMany(
      {
        _id: { $in: notificationIds },
        recipient: userId,
        isRead: false
      },
      { $set: { isRead: true, readAt: new Date() } }
    );

    return { message: 'Notifications marked as read' };
  }

  async deleteNotification(userId, notificationId) {
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId
    });

    if (!notification) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
    }

    return { message: 'Notification deleted successfully' };
  }

  async deleteMultipleNotifications(userId, notificationIds) {
    await Notification.deleteMany({
      _id: { $in: notificationIds },
      recipient: userId
    });

    return { message: 'Notifications deleted successfully' };
  }

  async deleteAllNotifications(userId) {
    await Notification.deleteMany({ recipient: userId });
    return { message: 'All notifications deleted successfully' };
  }

  async getUnreadCount(userId) {
    const count = await Notification.countDocuments({
      recipient: userId,
      isRead: false
    });

    return { unreadCount: count };
  }

  // Helper methods for creating specific notification types
  async notifyJobApplication(jobSeekerId, employerId, jobId, applicationId) {
    return this.createNotification({
      recipient: employerId,
      type: 'application',
      category: 'job',
      title: 'New Job Application',
      message: 'A new candidate has applied for your job posting',
      relatedUser: jobSeekerId,
      metadata: {
        jobId,
        applicationId
      },
      channels: { inApp: true, email: true }
    });
  }

  async notifyApplicationStatusChange(jobSeekerId, employerId, applicationId, status) {
    return this.createNotification({
      recipient: jobSeekerId,
      type: 'application-status',
      category: 'job',
      title: `Application ${status}`,
      message: `Your job application status has been updated to ${status}`,
      relatedUser: employerId,
      metadata: { applicationId, status },
      channels: { inApp: true, email: true, push: true }
    });
  }

  async notifyNewMessage(recipientId, senderId, conversationId, messagePreview) {
    return this.createNotification({
      recipient: recipientId,
      type: 'message',
      category: 'message',
      title: 'New Message',
      message: messagePreview,
      relatedUser: senderId,
      metadata: { conversationId },
      channels: { inApp: true, push: true }
    });
  }

  async notifyJobAlert(jobSeekerId, matchingJobsCount, alertId) {
    return this.createNotification({
      recipient: jobSeekerId,
      type: 'job-alert',
      category: 'job',
      title: 'New Jobs Matching Your Alert',
      message: `${matchingJobsCount} new jobs match your job alert preferences`,
      metadata: { alertId, matchingJobsCount },
      channels: { inApp: true, email: true }
    });
  }

  async notifyProfileView(profileOwnerId, viewerId) {
    return this.createNotification({
      recipient: profileOwnerId,
      type: 'profile-view',
      category: 'profile',
      title: 'Profile Viewed',
      message: 'Someone viewed your profile',
      relatedUser: viewerId,
      channels: { inApp: true }
    });
  }
}

module.exports = new NotificationService();
