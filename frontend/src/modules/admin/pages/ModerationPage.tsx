import { useEffect, useState } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  FlagIcon,
  BriefcaseIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
  DocumentTextIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import AnimatedCard from '../../../shared/components/animations/AnimatedCard';
import GlassCard from '../../../shared/components/ui/GlassCard';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  fetchModerationQueue,
  approveContent,
  rejectReport,
  removeContent,
  selectModerationQueue,
  selectModerationLoading,
  type ModerationItem
} from '../../../store/slices/adminSlice';

export default function ModerationPage() {
  const dispatch = useAppDispatch();
  const reports = useAppSelector(selectModerationQueue);
  const isLoading = useAppSelector(selectModerationLoading);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'job' | 'profile' | 'application' | 'company' | 'message'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'under_review' | 'approved' | 'rejected' | 'removed'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [selectedReport, setSelectedReport] = useState<ModerationItem | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  // Fetch moderation queue on component mount
  useEffect(() => {
    dispatch(fetchModerationQueue({
      contentType: typeFilter !== 'all' ? typeFilter : undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      severity: severityFilter !== 'all' ? severityFilter : undefined,
      search: searchQuery || undefined,
    }));
  }, [dispatch, typeFilter, statusFilter, severityFilter]);

  // Filter reports locally only by search query, other filters handled by API
  const filteredReports = searchQuery
    ? reports.filter(report => {
        const reportedByName = typeof report.reportedBy === 'string' ? '' : report.reportedBy?.firstName + ' ' + report.reportedBy?.lastName;
        return (
          report.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (report.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
          reportedByName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
    : reports;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'job':
        return <BriefcaseIcon className="w-5 h-5" />;
      case 'review':
        return <DocumentTextIcon className="w-5 h-5" />;
      case 'message':
        return <ChatBubbleLeftIcon className="w-5 h-5" />;
      case 'profile':
        return <UserCircleIcon className="w-5 h-5" />;
      default:
        return <FlagIcon className="w-5 h-5" />;
    }
  };

  const handleApproveReport = (reportId: string) => {
    dispatch(approveContent({
      reportId,
      resolution: 'Content approved and kept active after review'
    }));
    setShowActionMenu(null);
    setSelectedReport(null);
  };

  const handleRejectReport = (reportId: string) => {
    dispatch(rejectReport({
      reportId,
      resolution: 'Report rejected - no policy violation found'
    }));
    setShowActionMenu(null);
    setSelectedReport(null);
  };

  const handleRemoveContent = (reportId: string) => {
    dispatch(removeContent({
      reportId,
      resolution: 'Content removed for policy violation'
    }));
    setShowActionMenu(null);
    setSelectedReport(null);
  };

  const handleViewDetails = (report: ModerationItem) => {
    setSelectedReport(report);
  };

  const stats = [
    {
      label: 'Pending Review',
      value: reports.filter(r => r.status === 'pending').length,
      icon: ClockIcon,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Critical Items',
      value: reports.filter(r => r.severity === 'critical' && r.status === 'pending').length,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      label: 'Approved',
      value: reports.filter(r => r.status === 'approved').length,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Rejected',
      value: reports.filter(r => r.status === 'rejected').length,
      icon: XCircleIcon,
      color: 'bg-gray-500',
      textColor: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Moderation</h1>
          <p className="text-gray-600">Review and manage reported content on the platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <AnimatedCard key={stat.label} animation="fadeUp" delay={index * 50}>
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
              </GlassCard>
            </AnimatedCard>
          ))}
        </div>

        {/* Filters and Search */}
        <GlassCard className="p-6 mb-6">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports by title, reason, or reporter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Type Filter */}
              <div className="flex items-center gap-2 flex-1">
                <FunnelIcon className="w-5 h-5 text-gray-400" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="job">Jobs</option>
                  <option value="profile">Profiles</option>
                  <option value="application">Applications</option>
                  <option value="company">Companies</option>
                  <option value="message">Messages</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex-1">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="removed">Removed</option>
                </select>
              </div>

              {/* Severity Filter */}
              <div className="flex-1">
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Severity</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Reports List */}
        {isLoading ? (
          <GlassCard className="text-center py-20">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reports...</p>
          </GlassCard>
        ) : filteredReports.length === 0 ? (
          <GlassCard className="text-center py-20">
            <FlagIcon className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No reports found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report, index) => (
              <AnimatedCard key={report._id} animation="fadeUp" delay={index * 30}>
                <GlassCard className="p-6 hover:shadow-lg transition">
                  <div className="flex flex-col gap-4">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-3 rounded-lg bg-gray-50 flex-shrink-0`}>
                          {getTypeIcon(report.contentType)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-lg font-bold text-gray-900">
                              {report.reason} - {report.contentType.charAt(0).toUpperCase() + report.contentType.slice(1)}
                            </h3>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(report.severity)}`}>
                              <ExclamationTriangleIcon className="w-4 h-4" />
                              {report.severity.toUpperCase()}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}>
                              {report.status === 'pending' && <ClockIcon className="w-4 h-4" />}
                              {report.status === 'approved' && <CheckCircleIcon className="w-4 h-4" />}
                              {report.status === 'rejected' && <XCircleIcon className="w-4 h-4" />}
                              {report.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-2">
                              <UserCircleIcon className="w-4 h-4 text-gray-400" />
                              <span>Reported by: {typeof report.reportedBy === 'string' ? report.reportedBy : `${report.reportedBy?.firstName || ''} ${report.reportedBy?.lastName || ''}`}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <ClockIcon className="w-4 h-4 text-gray-400" />
                              <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="mb-2">
                            <span className="text-sm font-semibold text-gray-700">Content ID: </span>
                            <span className="text-sm text-gray-600 font-mono">{report.contentId}</span>
                          </div>
                          {report.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">{report.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleViewDetails(report)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm whitespace-nowrap"
                        >
                          View Details
                        </button>
                        {report.status === 'pending' && (
                          <div className="relative">
                            <button
                              onClick={() => setShowActionMenu(showActionMenu === report._id ? null : report._id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition"
                            >
                              <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
                            </button>
                            {showActionMenu === report._id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                <button
                                  onClick={() => handleApproveReport(report._id)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-2"
                                >
                                  <CheckCircleIcon className="w-4 h-4" />
                                  Approve Content
                                </button>
                                <button
                                  onClick={() => handleRemoveContent(report._id)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2"
                                >
                                  <XCircleIcon className="w-4 h-4" />
                                  Remove Content
                                </button>
                                <button
                                  onClick={() => handleRejectReport(report._id)}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <XCircleIcon className="w-4 h-4" />
                                  Reject Report
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </AnimatedCard>
            ))}
          </div>
        )}

        {/* Report Details Modal */}
        {selectedReport && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in"
            onClick={() => setSelectedReport(null)}
          >
            <div
              className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Report Details</h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Severity and Status */}
                <div className="flex gap-3 pb-6 border-b">
                  <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border ${getSeverityColor(selectedReport.severity)}`}>
                    <ExclamationTriangleIcon className="w-5 h-5" />
                    {selectedReport.severity.toUpperCase()} SEVERITY
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedReport.status)}`}>
                    {selectedReport.status === 'pending' && <ClockIcon className="w-5 h-5" />}
                    {selectedReport.status === 'approved' && <CheckCircleIcon className="w-5 h-5" />}
                    {selectedReport.status === 'rejected' && <XCircleIcon className="w-5 h-5" />}
                    {selectedReport.status.toUpperCase()}
                  </span>
                </div>

                {/* Report Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Content Type</label>
                    <p className="text-gray-900 font-semibold capitalize">{selectedReport.contentType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Content ID</label>
                    <p className="text-gray-900 font-mono text-sm">{selectedReport.contentId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Reported By</label>
                    {typeof selectedReport.reportedBy === 'string' ? (
                      <p className="text-gray-900 font-semibold">{selectedReport.reportedBy}</p>
                    ) : (
                      <>
                        <p className="text-gray-900 font-semibold">
                          {selectedReport.reportedBy?.firstName} {selectedReport.reportedBy?.lastName}
                        </p>
                        <p className="text-gray-600 text-sm">{selectedReport.reportedBy?.email}</p>
                      </>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Reported Date</label>
                    <p className="text-gray-900 font-semibold">
                      {new Date(selectedReport.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Reason</label>
                    <p className="text-gray-900">{selectedReport.reason}</p>
                  </div>
                  {selectedReport.description && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                      <p className="text-gray-900">{selectedReport.description}</p>
                    </div>
                  )}
                  {selectedReport.resolution && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Resolution</label>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-gray-700 text-sm">{selectedReport.resolution}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {selectedReport.status === 'pending' && (
                  <div className="pt-6 border-t flex gap-3">
                    <button
                      onClick={() => handleApproveReport(selectedReport._id)}
                      className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                      Approve Content
                    </button>
                    <button
                      onClick={() => handleRemoveContent(selectedReport._id)}
                      className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition font-medium flex items-center justify-center gap-2"
                    >
                      <XCircleIcon className="w-5 h-5" />
                      Remove Content
                    </button>
                    <button
                      onClick={() => handleRejectReport(selectedReport._id)}
                      className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center gap-2"
                    >
                      <XCircleIcon className="w-5 h-5" />
                      Reject Report
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
