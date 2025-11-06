import { useState, useEffect } from 'react';
import {
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';
import AnimatedCard from '../../../shared/components/animations/AnimatedCard';
import GlassCard from '../../../shared/components/ui/GlassCard';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  fetchAuditLogs,
  selectAuditLogs,
  selectAuditLogsLoading,
  selectAuditLogsPagination,
} from '../../../store/slices/adminSlice';
import axios from 'axios';

type ActionType = 'create' | 'update' | 'delete' | 'suspend' | 'activate' | 'approve' | 'reject' | 'all';
type TargetType = 'user' | 'job' | 'company' | 'review' | 'application' | 'system' | 'all';

interface AuditLog {
  _id: string;
  admin: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  action: string;
  targetType: string;
  targetId: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  createdAt: string;
}

export default function AuditLogsPage() {
  const dispatch = useAppDispatch();
  const auditLogs = useAppSelector(selectAuditLogs) as AuditLog[];
  const isLoading = useAppSelector(selectAuditLogsLoading);
  const pagination = useAppSelector(selectAuditLogsPagination);

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<ActionType>('all');
  const [targetTypeFilter, setTargetTypeFilter] = useState<TargetType>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, [currentPage, actionFilter, targetTypeFilter, dateRange]);

  const fetchLogs = () => {
    const params: any = {
      page: currentPage,
      limit: 20,
    };

    if (actionFilter !== 'all') params.action = actionFilter;
    if (targetTypeFilter !== 'all') params.targetType = targetTypeFilter;
    if (dateRange.start) params.startDate = dateRange.start;
    if (dateRange.end) params.endDate = dateRange.end;
    if (searchQuery) params.search = searchQuery;

    dispatch(fetchAuditLogs(params));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchLogs();
  };

  const handleRefresh = () => {
    fetchLogs();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setActionFilter('all');
    setTargetTypeFilter('all');
    setDateRange({ start: '', end: '' });
    setCurrentPage(1);
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      setIsExporting(true);

      // Build query params for export
      const params: any = {};
      if (actionFilter !== 'all') params.action = actionFilter;
      if (targetTypeFilter !== 'all') params.targetType = targetTypeFilter;
      if (dateRange.start) params.startDate = dateRange.start;
      if (dateRange.end) params.endDate = dateRange.end;

      // Call export API
      const queryString = new URLSearchParams(params).toString();
      const url = `/api/admin/audit-logs/export/${format}${queryString ? `?${queryString}` : ''}`;

      const response = await axios.get(url, {
        responseType: 'blob',
      });

      // Create download link
      const blob = new Blob([response.data], {
        type: format === 'csv' ? 'text/csv' : 'application/pdf',
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(`Failed to export ${format.toUpperCase()}:`, error);
      alert(`Failed to export ${format.toUpperCase()}. Please try again.`);
    } finally {
      setIsExporting(false);
    }
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'update':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'delete':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'suspend':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'activate':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'approve':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'reject':
        return 'bg-pink-100 text-pink-800 border-pink-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTargetTypeIcon = (targetType: string) => {
    switch (targetType) {
      case 'user':
        return <UserIcon className="w-5 h-5" />;
      case 'system':
        return <ShieldCheckIcon className="w-5 h-5" />;
      default:
        return <DocumentTextIcon className="w-5 h-5" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatUserAgent = (userAgent: string) => {
    if (!userAgent || userAgent === 'unknown') return 'Unknown';

    // Extract browser and OS info
    const browserMatch = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)\/[\d.]+/);
    const osMatch = userAgent.match(/(Windows|Mac|Linux|Android|iOS)/);

    const browser = browserMatch ? browserMatch[0] : '';
    const os = osMatch ? osMatch[1] : '';

    return `${browser} on ${os}`.trim() || userAgent.substring(0, 50);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Audit Logs</h1>
              <p className="text-gray-600">Track all administrative actions and system changes</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                <ArrowPathIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <FunnelIcon className="w-5 h-5" />
                  <span>Filters</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExport('csv')}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  title="Export as CSV"
                >
                  <DocumentArrowDownIcon className="w-5 h-5" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                  title="Export as PDF"
                >
                  <DocumentArrowDownIcon className="w-5 h-5" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <AnimatedCard animation="fadeDown" className="mb-6">
            <GlassCard className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Admin email, IP address..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                {/* Action Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Action Type
                  </label>
                  <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value as ActionType)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Actions</option>
                    <option value="create">Create</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                    <option value="suspend">Suspend</option>
                    <option value="activate">Activate</option>
                    <option value="approve">Approve</option>
                    <option value="reject">Reject</option>
                  </select>
                </div>

                {/* Target Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Type
                  </label>
                  <select
                    value={targetTypeFilter}
                    onChange={(e) => setTargetTypeFilter(e.target.value as TargetType)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="user">User</option>
                    <option value="job">Job</option>
                    <option value="company">Company</option>
                    <option value="review">Review</option>
                    <option value="application">Application</option>
                    <option value="system">System</option>
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                      className="flex-1 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                      className="flex-1 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Apply Filters
                </button>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Clear All
                </button>
              </div>
            </GlassCard>
          </AnimatedCard>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <AnimatedCard animation="fadeUp" delay={0}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Logs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pagination?.total || 0}
                  </p>
                </div>
              </div>
            </GlassCard>
          </AnimatedCard>

          <AnimatedCard animation="fadeUp" delay={50}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <ShieldCheckIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Today's Actions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {auditLogs.filter(log => {
                      const logDate = new Date(log.timestamp);
                      const today = new Date();
                      return logDate.toDateString() === today.toDateString();
                    }).length}
                  </p>
                </div>
              </div>
            </GlassCard>
          </AnimatedCard>

          <AnimatedCard animation="fadeUp" delay={100}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <UserIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Admins</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(auditLogs.map(log => log.admin?._id)).size}
                  </p>
                </div>
              </div>
            </GlassCard>
          </AnimatedCard>

          <AnimatedCard animation="fadeUp" delay={150}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <ClockIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last 24 Hours</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {auditLogs.filter(log => {
                      const logDate = new Date(log.timestamp);
                      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
                      return logDate > yesterday;
                    }).length}
                  </p>
                </div>
              </div>
            </GlassCard>
          </AnimatedCard>
        </div>

        {/* Audit Logs Table */}
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Agent
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex justify-center">
                        <ArrowPathIcon className="w-8 h-8 text-blue-600 animate-spin" />
                      </div>
                      <p className="mt-2 text-gray-600">Loading audit logs...</p>
                    </td>
                  </tr>
                ) : auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No audit logs found
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log, index) => (
                    <tr
                      key={log._id}
                      className={`hover:bg-gray-50 transition ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <ClockIcon className="w-4 h-4 text-gray-400" />
                          {formatTimestamp(log.timestamp)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-xs font-semibold text-blue-600">
                              {log.admin?.firstName?.[0]}{log.admin?.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {log.admin?.firstName} {log.admin?.lastName}
                            </p>
                            <p className="text-xs text-gray-500">{log.admin?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full border ${getActionBadgeColor(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="text-gray-600">
                            {getTargetTypeIcon(log.targetType)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 capitalize">
                              {log.targetType}
                            </p>
                            <p className="text-xs text-gray-500 font-mono">
                              {log.targetId.substring(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="truncate">
                          {log.details?.userName || log.details?.userEmail || log.details?.reason || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                        {log.ipAddress}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                        <div className="truncate" title={log.userAgent}>
                          {formatUserAgent(log.userAgent)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="bg-white px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * pagination.limit + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * pagination.limit, pagination.total)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.total}</span> results
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 border border-gray-300 rounded-lg bg-blue-50 text-blue-600 font-medium">
                    {currentPage} / {pagination.pages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(pagination.pages, p + 1))}
                    disabled={currentPage === pagination.pages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
