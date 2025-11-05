/**
 * ADMIN SLICE USAGE EXAMPLES
 *
 * This file demonstrates how to use the admin Redux slice in your React components.
 * Import the necessary actions and selectors, and use them with Redux hooks.
 */

import { useAppDispatch, useAppSelector } from '../index';
import {
  // Actions
  fetchUsers,
  fetchUserById,
  updateUserStatus,
  deleteUser,
  fetchModerationQueue,
  fetchModerationItemById,
  approveContent,
  rejectReport,
  removeContent,
  createModerationReport,
  fetchPlatformAnalytics,
  fetchUserAnalytics,
  fetchJobAnalytics,
  fetchRecentActivity,
  fetchSystemSettings,
  updateSystemSettings,
  resetSystemSettings,
  fetchAuditLogs,
  setAnalyticsPeriod,
  clearError,
  clearSelectedUser,
  clearSelectedModerationItem,

  // Selectors
  selectUsers,
  selectSelectedUser,
  selectUsersLoading,
  selectUsersPagination,
  selectModerationQueue,
  selectSelectedModerationItem,
  selectModerationLoading,
  selectModerationPagination,
  selectPlatformAnalytics,
  selectUserAnalytics,
  selectJobAnalytics,
  selectRecentActivity,
  selectAnalyticsLoading,
  selectAnalyticsPeriod,
  selectSystemSettings,
  selectSettingsLoading,
  selectAuditLogs,
  selectAuditLogsLoading,
  selectAuditLogsPagination,
  selectAdminError,
} from './adminSlice';

// ==================== EXAMPLE 1: USER MANAGEMENT ====================

export const UserManagementExample = () => {
  const dispatch = useAppDispatch();

  // Select state
  const users = useAppSelector(selectUsers);
  const selectedUser = useAppSelector(selectSelectedUser);
  const usersLoading = useAppSelector(selectUsersLoading);
  const usersPagination = useAppSelector(selectUsersPagination);
  const error = useAppSelector(selectAdminError);

  // Fetch all users with filters
  const loadUsers = async () => {
    await dispatch(fetchUsers({
      page: 1,
      limit: 20,
      role: 'jobseeker',
      search: 'john',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }));
  };

  // Fetch specific user
  const loadUserDetails = async (userId: string) => {
    await dispatch(fetchUserById(userId));
  };

  // Update user status
  const suspendUser = async (userId: string) => {
    await dispatch(updateUserStatus({
      userId,
      status: 'suspended'
    }));
  };

  // Delete user
  const removeUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await dispatch(deleteUser(userId));
    }
  };

  // Clear selected user
  const clearSelection = () => {
    dispatch(clearSelectedUser());
  };

  return null; // Component JSX would go here
};

// ==================== EXAMPLE 2: CONTENT MODERATION ====================

export const ContentModerationExample = () => {
  const dispatch = useAppDispatch();

  // Select state
  const moderationQueue = useAppSelector(selectModerationQueue);
  const selectedItem = useAppSelector(selectSelectedModerationItem);
  const moderationLoading = useAppSelector(selectModerationLoading);
  const moderationPagination = useAppSelector(selectModerationPagination);
  const error = useAppSelector(selectAdminError);

  // Fetch moderation queue with filters
  const loadModerationQueue = async () => {
    await dispatch(fetchModerationQueue({
      page: 1,
      limit: 50,
      contentType: 'job',
      status: 'pending',
      severity: 'high',
      search: 'spam'
    }));
  };

  // Fetch specific moderation item
  const loadModerationItem = async (reportId: string) => {
    await dispatch(fetchModerationItemById(reportId));
  };

  // Approve content
  const handleApproveContent = async (reportId: string) => {
    await dispatch(approveContent({
      reportId,
      resolution: 'Content reviewed and found to be appropriate. No action needed.'
    }));
  };

  // Reject report (content is fine, report is invalid)
  const handleRejectReport = async (reportId: string) => {
    await dispatch(rejectReport({
      reportId,
      resolution: 'Report reviewed and rejected. Content does not violate guidelines.'
    }));
  };

  // Remove content (content violates guidelines)
  const handleRemoveContent = async (reportId: string) => {
    await dispatch(removeContent({
      reportId,
      resolution: 'Content removed for violating community guidelines.'
    }));
  };

  // Create new moderation report
  const createReport = async () => {
    await dispatch(createModerationReport({
      contentType: 'job',
      contentId: 'job123',
      reason: 'Inappropriate content',
      description: 'This job posting contains offensive language.',
      severity: 'high'
    }));
  };

  // Clear selected item
  const clearSelection = () => {
    dispatch(clearSelectedModerationItem());
  };

  return null; // Component JSX would go here
};

// ==================== EXAMPLE 3: ANALYTICS ====================

export const AnalyticsExample = () => {
  const dispatch = useAppDispatch();

  // Select state
  const platformAnalytics = useAppSelector(selectPlatformAnalytics);
  const userAnalytics = useAppSelector(selectUserAnalytics);
  const jobAnalytics = useAppSelector(selectJobAnalytics);
  const recentActivity = useAppSelector(selectRecentActivity);
  const analyticsLoading = useAppSelector(selectAnalyticsLoading);
  const analyticsPeriod = useAppSelector(selectAnalyticsPeriod);
  const error = useAppSelector(selectAdminError);

  // Fetch all analytics data
  const loadAllAnalytics = async (period: '7days' | '30days' | '90days' | 'all') => {
    // Update the period filter
    dispatch(setAnalyticsPeriod(period));

    // Fetch all analytics in parallel
    await Promise.all([
      dispatch(fetchPlatformAnalytics({ period })),
      dispatch(fetchUserAnalytics({ period })),
      dispatch(fetchJobAnalytics({ period })),
      dispatch(fetchRecentActivity({ limit: 20 }))
    ]);
  };

  // Fetch platform analytics only
  const loadPlatformAnalytics = async () => {
    await dispatch(fetchPlatformAnalytics({ period: analyticsPeriod }));
  };

  // Fetch user analytics only
  const loadUserAnalytics = async () => {
    await dispatch(fetchUserAnalytics({ period: analyticsPeriod }));
  };

  // Fetch job analytics only
  const loadJobAnalytics = async () => {
    await dispatch(fetchJobAnalytics({ period: analyticsPeriod }));
  };

  // Fetch recent activity
  const loadRecentActivity = async (limit: number = 10) => {
    await dispatch(fetchRecentActivity({ limit }));
  };

  // Change analytics period
  const changePeriod = (period: '7days' | '30days' | '90days' | 'all') => {
    dispatch(setAnalyticsPeriod(period));
    loadAllAnalytics(period);
  };

  return null; // Component JSX would go here
};

// ==================== EXAMPLE 4: SYSTEM SETTINGS ====================

export const SystemSettingsExample = () => {
  const dispatch = useAppDispatch();

  // Select state
  const systemSettings = useAppSelector(selectSystemSettings);
  const settingsLoading = useAppSelector(selectSettingsLoading);
  const error = useAppSelector(selectAdminError);

  // Fetch system settings
  const loadSettings = async () => {
    await dispatch(fetchSystemSettings());
  };

  // Update system settings
  const saveSettings = async (settings: any) => {
    await dispatch(updateSystemSettings(settings));
  };

  // Reset to default settings
  const resetToDefaults = async () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      await dispatch(resetSystemSettings());
    }
  };

  // Example: Update specific setting
  const updateSpecificSetting = async (key: string, value: any) => {
    if (systemSettings) {
      const updatedSettings = {
        ...systemSettings,
        [key]: value
      };
      await dispatch(updateSystemSettings(updatedSettings));
    }
  };

  return null; // Component JSX would go here
};

// ==================== EXAMPLE 5: AUDIT LOGS ====================

export const AuditLogsExample = () => {
  const dispatch = useAppDispatch();

  // Select state
  const auditLogs = useAppSelector(selectAuditLogs);
  const auditLogsLoading = useAppSelector(selectAuditLogsLoading);
  const auditLogsPagination = useAppSelector(selectAuditLogsPagination);
  const error = useAppSelector(selectAdminError);

  // Fetch audit logs with filters
  const loadAuditLogs = async () => {
    await dispatch(fetchAuditLogs({
      page: 1,
      limit: 50,
      adminId: 'admin123',
      action: 'user_deleted',
      targetType: 'user',
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    }));
  };

  // Fetch logs for specific admin
  const loadAdminLogs = async (adminId: string) => {
    await dispatch(fetchAuditLogs({
      adminId,
      page: 1,
      limit: 100
    }));
  };

  // Fetch logs by action type
  const loadLogsByAction = async (action: string) => {
    await dispatch(fetchAuditLogs({
      action,
      page: 1,
      limit: 50
    }));
  };

  // Fetch logs by date range
  const loadLogsByDateRange = async (startDate: string, endDate: string) => {
    await dispatch(fetchAuditLogs({
      startDate,
      endDate,
      page: 1,
      limit: 100
    }));
  };

  return null; // Component JSX would go here
};

// ==================== EXAMPLE 6: ERROR HANDLING ====================

export const ErrorHandlingExample = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectAdminError);

  // Clear error when component unmounts or when needed
  const handleClearError = () => {
    dispatch(clearError());
  };

  // Example: Fetch with error handling
  const fetchWithErrorHandling = async () => {
    try {
      const result = await dispatch(fetchUsers({ page: 1, limit: 20 }));

      if (fetchUsers.fulfilled.match(result)) {
        // Success
        console.log('Users loaded successfully:', result.payload);
      } else if (fetchUsers.rejected.match(result)) {
        // Error
        console.error('Failed to load users:', result.payload);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  return null; // Component JSX would go here
};

// ==================== EXAMPLE 7: COMPLETE ADMIN DASHBOARD ====================

export const AdminDashboardExample = () => {
  const dispatch = useAppDispatch();

  // All selectors
  const users = useAppSelector(selectUsers);
  const moderationQueue = useAppSelector(selectModerationQueue);
  const platformAnalytics = useAppSelector(selectPlatformAnalytics);
  const recentActivity = useAppSelector(selectRecentActivity);
  const systemSettings = useAppSelector(selectSystemSettings);
  const auditLogs = useAppSelector(selectAuditLogs);

  const usersLoading = useAppSelector(selectUsersLoading);
  const moderationLoading = useAppSelector(selectModerationLoading);
  const analyticsLoading = useAppSelector(selectAnalyticsLoading);
  const settingsLoading = useAppSelector(selectSettingsLoading);
  const auditLogsLoading = useAppSelector(selectAuditLogsLoading);

  const error = useAppSelector(selectAdminError);

  // Load all dashboard data
  const loadDashboard = async () => {
    await Promise.all([
      dispatch(fetchUsers({ page: 1, limit: 10 })),
      dispatch(fetchModerationQueue({ status: 'pending', limit: 10 })),
      dispatch(fetchPlatformAnalytics({ period: '30days' })),
      dispatch(fetchRecentActivity({ limit: 10 })),
      dispatch(fetchSystemSettings()),
      dispatch(fetchAuditLogs({ page: 1, limit: 10 }))
    ]);
  };

  // Use effect to load dashboard on mount
  // useEffect(() => {
  //   loadDashboard();
  // }, []);

  return null; // Component JSX would go here
};
