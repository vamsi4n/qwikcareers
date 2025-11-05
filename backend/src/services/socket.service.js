/**
 * Socket Service
 * Centralized service for emitting real-time events via Socket.IO
 */

let io = null;

/**
 * Initialize the socket service with Socket.IO instance
 * @param {Object} socketIO - Socket.IO server instance
 */
const initializeSocketService = (socketIO) => {
  io = socketIO;
  console.log('✓ Socket service initialized');
};

/**
 * Get the Socket.IO instance
 * @returns {Object} Socket.IO server instance
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initializeSocketService first.');
  }
  return io;
};

/**
 * Emit event to a specific user
 * @param {string} userId - User ID
 * @param {string} event - Event name
 * @param {Object} data - Event data
 */
const emitToUser = (userId, event, data) => {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, data);
};

/**
 * Emit event to all admin users
 * @param {string} event - Event name
 * @param {Object} data - Event data
 */
const emitToAdmins = (event, data) => {
  if (!io) return;
  io.to('admin-room').emit(event, data);
};

/**
 * Emit event to all employer users
 * @param {string} event - Event name
 * @param {Object} data - Event data
 */
const emitToEmployers = (event, data) => {
  if (!io) return;
  io.to('employer-room').emit(event, data);
};

/**
 * Emit event to all connected users
 * @param {string} event - Event name
 * @param {Object} data - Event data
 */
const emitToAll = (event, data) => {
  if (!io) return;
  io.emit(event, data);
};

// ==============================================
// ADMIN SPECIFIC EVENTS
// ==============================================

/**
 * Emit new moderation report created event
 * @param {Object} report - Moderation report object
 */
const emitModerationReportCreated = (report) => {
  emitToAdmins('moderation:report-created', {
    type: 'MODERATION_REPORT_CREATED',
    data: report,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Emit moderation report updated event
 * @param {Object} report - Updated moderation report object
 */
const emitModerationReportUpdated = (report) => {
  emitToAdmins('moderation:report-updated', {
    type: 'MODERATION_REPORT_UPDATED',
    data: report,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Emit moderation report resolved event
 * @param {Object} report - Resolved moderation report object
 */
const emitModerationReportResolved = (report) => {
  emitToAdmins('moderation:report-resolved', {
    type: 'MODERATION_REPORT_RESOLVED',
    data: report,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Emit user status changed event
 * @param {Object} user - Updated user object
 */
const emitUserStatusChanged = (user) => {
  emitToAdmins('admin:user-status-changed', {
    type: 'USER_STATUS_CHANGED',
    data: user,
    timestamp: new Date().toISOString(),
  });

  // Also notify the affected user
  emitToUser(user._id.toString(), 'user:status-changed', {
    type: 'STATUS_CHANGED',
    data: { status: user.status },
    timestamp: new Date().toISOString(),
  });
};

/**
 * Emit new user registered event
 * @param {Object} user - New user object
 */
const emitNewUserRegistered = (user) => {
  emitToAdmins('admin:user-registered', {
    type: 'NEW_USER_REGISTERED',
    data: user,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Emit analytics updated event
 * @param {Object} analytics - Updated analytics data
 */
const emitAnalyticsUpdated = (analytics) => {
  emitToAdmins('admin:analytics-updated', {
    type: 'ANALYTICS_UPDATED',
    data: analytics,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Emit system settings updated event
 * @param {Object} settings - Updated settings
 */
const emitSystemSettingsUpdated = (settings) => {
  emitToAdmins('admin:settings-updated', {
    type: 'SYSTEM_SETTINGS_UPDATED',
    data: settings,
    timestamp: new Date().toISOString(),
  });
};

// ==============================================
// GENERAL EVENTS
// ==============================================

/**
 * Emit notification to user
 * @param {string} userId - User ID
 * @param {Object} notification - Notification object
 */
const emitNotification = (userId, notification) => {
  emitToUser(userId, 'notification:new', {
    type: 'NEW_NOTIFICATION',
    data: notification,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Emit job application status update
 * @param {string} userId - Job seeker user ID
 * @param {Object} application - Updated application object
 */
const emitApplicationStatusUpdated = (userId, application) => {
  emitToUser(userId, 'application:status-updated', {
    type: 'APPLICATION_STATUS_UPDATED',
    data: application,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Emit new message received event
 * @param {string} userId - Recipient user ID
 * @param {Object} message - Message object
 */
const emitNewMessage = (userId, message) => {
  emitToUser(userId, 'message:new', {
    type: 'NEW_MESSAGE',
    data: message,
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  initializeSocketService,
  getIO,
  emitToUser,
  emitToAdmins,
  emitToEmployers,
  emitToAll,
  // Admin events
  emitModerationReportCreated,
  emitModerationReportUpdated,
  emitModerationReportResolved,
  emitUserStatusChanged,
  emitNewUserRegistered,
  emitAnalyticsUpdated,
  emitSystemSettingsUpdated,
  // General events
  emitNotification,
  emitApplicationStatusUpdated,
  emitNewMessage,
};
