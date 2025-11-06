import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UsersIcon,
  FlagIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  TrashIcon,
  UserPlusIcon,
  DocumentTextIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import AnimatedCard from '../../../shared/components/animations/AnimatedCard';
import GlassCard from '../../../shared/components/ui/GlassCard';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  fetchUsers,
  fetchModerationQueue,
  fetchAuditLogs,
  fetchPlatformAnalytics,
  selectUsers,
  selectModerationQueue,
  selectAuditLogs,
  selectPlatformAnalytics,
  selectUsersLoading,
  selectModerationLoading,
  selectAuditLogsLoading,
  selectAnalyticsLoading
} from '../../../store/slices/adminSlice';

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();

  const users = useAppSelector(selectUsers);
  const moderationQueue = useAppSelector(selectModerationQueue);
  const auditLogs = useAppSelector(selectAuditLogs);
  const platformAnalytics = useAppSelector(selectPlatformAnalytics);

  const usersLoading = useAppSelector(selectUsersLoading);
  const moderationLoading = useAppSelector(selectModerationLoading);
  const auditLogsLoading = useAppSelector(selectAuditLogsLoading);
  const analyticsLoading = useAppSelector(selectAnalyticsLoading);

  // Fetch dashboard data on mount
  useEffect(() => {
    dispatch(fetchUsers({ limit: 5 }));
    dispatch(fetchModerationQueue({ status: 'pending', limit: 5 }));
    dispatch(fetchAuditLogs({ limit: 10 }));
    dispatch(fetchPlatformAnalytics({ period: '7days' }));
  }, [dispatch]);

  // Calculate stats
  const pendingModerationCount = moderationQueue.filter(item => item.status === 'pending').length;
  const recentActivityCount = auditLogs.length;
  const totalUsers = platformAnalytics?.totalUsers || users.length;

  // Get action icon and color
  const getActionIcon = (action: string) => {
    const iconClass = "w-5 h-5";
    switch (action) {
      case 'create':
      case 'register':
        return <UserPlusIcon className={iconClass} />;
      case 'update':
      case 'update_permissions':
        return <Cog6ToothIcon className={iconClass} />;
      case 'delete':
        return <TrashIcon className={iconClass} />;
      case 'suspend':
        return <ExclamationTriangleIcon className={iconClass} />;
      case 'activate':
        return <CheckCircleIcon className={iconClass} />;
      case 'view':
        return <EyeIcon className={iconClass} />;
      case 'approve':
        return <CheckCircleIcon className={iconClass} />;
      case 'reject':
        return <XCircleIcon className={iconClass} />;
      default:
        return <DocumentTextIcon className={iconClass} />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
      case 'register':
      case 'activate':
      case 'approve':
        return 'bg-green-100 text-green-700';
      case 'update':
      case 'update_permissions':
        return 'bg-blue-100 text-blue-700';
      case 'delete':
      case 'reject':
        return 'bg-red-100 text-red-700';
      case 'suspend':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <AnimatedCard animation="fade-in" delay={0}>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back! Here's what's happening with your platform today.
            </p>
          </div>
        </AnimatedCard>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnimatedCard animation="slide-up" delay={0.1}>
            <Link to="/admin/users">
              <GlassCard className="p-6 hover:shadow-lg transition cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <UsersIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {usersLoading ? '...' : totalUsers.toLocaleString()}
                </h3>
                <p className="text-sm text-gray-600">Total Users</p>
              </GlassCard>
            </Link>
          </AnimatedCard>

          <AnimatedCard animation="slide-up" delay={0.2}>
            <Link to="/admin/moderation">
              <GlassCard className="p-6 hover:shadow-lg transition cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <FlagIcon className="w-6 h-6 text-yellow-600" />
                  </div>
                  {pendingModerationCount > 0 ? (
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {moderationLoading ? '...' : pendingModerationCount}
                </h3>
                <p className="text-sm text-gray-600">Pending Moderation</p>
              </GlassCard>
            </Link>
          </AnimatedCard>

          <AnimatedCard animation="slide-up" delay={0.3}>
            <Link to="/admin/audit-logs">
              <GlassCard className="p-6 hover:shadow-lg transition cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <ClockIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <ShieldCheckIcon className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {auditLogsLoading ? '...' : recentActivityCount}
                </h3>
                <p className="text-sm text-gray-600">Recent Actions (24h)</p>
              </GlassCard>
            </Link>
          </AnimatedCard>

          <AnimatedCard animation="slide-up" delay={0.4}>
            <Link to="/admin/analytics">
              <GlassCard className="p-6 hover:shadow-lg transition cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <ChartBarIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {analyticsLoading ? '...' : 'Active'}
                </h3>
                <p className="text-sm text-gray-600">System Status</p>
              </GlassCard>
            </Link>
          </AnimatedCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity Feed */}
          <div className="lg:col-span-2">
            <AnimatedCard animation="slide-up" delay={0.5}>
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                  <Link
                    to="/admin/audit-logs"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All
                  </Link>
                </div>

                {auditLogsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : auditLogs.length === 0 ? (
                  <div className="text-center py-12">
                    <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {auditLogs.slice(0, 10).map((log: any, index) => (
                      <div
                        key={log._id || index}
                        className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition"
                      >
                        <div className={`p-2 rounded-lg ${getActionColor(log.action)}`}>
                          {getActionIcon(log.action)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="font-semibold text-gray-900">
                              {log.action.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                            </p>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {formatTimeAgo(log.timestamp || log.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {typeof log.admin === 'object' && log.admin
                              ? `${log.admin.firstName} ${log.admin.lastName}`
                              : 'Admin'}
                            {' '}performed {log.action} on {log.targetType}
                          </p>
                          {log.details && (
                            <p className="text-xs text-gray-500">
                              {log.details.userEmail || log.details.userName || log.targetId}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </AnimatedCard>
          </div>

          {/* Quick Actions & System Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <AnimatedCard animation="slide-left" delay={0.6}>
              <GlassCard className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link
                    to="/admin/users"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition group"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition">
                      <UsersIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-blue-600">
                      Manage Users
                    </span>
                  </Link>

                  <Link
                    to="/admin/moderation"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-yellow-50 transition group"
                  >
                    <div className="p-2 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition">
                      <FlagIcon className="w-5 h-5 text-yellow-600" />
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-yellow-600">
                      Review Reports
                    </span>
                  </Link>

                  <Link
                    to="/admin/analytics"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition group"
                  >
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition">
                      <ChartBarIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-green-600">
                      View Analytics
                    </span>
                  </Link>

                  <Link
                    to="/admin/settings"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition group"
                  >
                    <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition">
                      <Cog6ToothIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-purple-600">
                      System Settings
                    </span>
                  </Link>
                </div>
              </GlassCard>
            </AnimatedCard>

            {/* System Health */}
            <AnimatedCard animation="slide-left" delay={0.7}>
              <GlassCard className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">System Health</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Status</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-600">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-600">Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email Service</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-600">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Storage</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-600">85% Available</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </AnimatedCard>
          </div>
        </div>
      </div>
    </div>
  );
}
