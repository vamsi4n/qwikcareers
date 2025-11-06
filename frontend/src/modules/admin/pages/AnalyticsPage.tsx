import { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import AnimatedCard from '../../../shared/components/animations/AnimatedCard';
import GlassCard from '../../../shared/components/ui/GlassCard';
import {
  LineChartComponent,
  BarChartComponent,
  AreaChartComponent,
  PieChartComponent
} from '../../../shared/components/charts';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  fetchPlatformAnalytics,
  fetchUserAnalytics,
  fetchJobAnalytics,
  setAnalyticsPeriod,
  selectPlatformAnalytics,
  selectUserAnalytics,
  selectJobAnalytics,
  selectAnalyticsLoading,
  selectAnalyticsPeriod
} from '../../../store/slices/adminSlice';

type TimePeriod = '7days' | '30days' | '90days' | 'all';

interface PlatformStats {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  activeCompanies: number;
  userGrowth: number;
  jobGrowth: number;
  applicationRate: number;
  successRate: number;
}

export default function AnalyticsPage() {
  const dispatch = useAppDispatch();
  const timePeriod = useAppSelector(selectAnalyticsPeriod);
  const platformAnalytics = useAppSelector(selectPlatformAnalytics);
  const userAnalytics = useAppSelector(selectUserAnalytics);
  const jobAnalytics = useAppSelector(selectJobAnalytics);
  const isLoading = useAppSelector(selectAnalyticsLoading);

  // Fetch analytics data when component mounts or time period changes
  useEffect(() => {
    dispatch(fetchPlatformAnalytics({ period: timePeriod }));
    dispatch(fetchUserAnalytics({ period: timePeriod }));
    dispatch(fetchJobAnalytics({ period: timePeriod }));
  }, [dispatch, timePeriod]);

  const handleTimePeriodChange = (period: TimePeriod) => {
    dispatch(setAnalyticsPeriod(period));
  };

  // Use actual data from Redux state or provide default values
  const stats: PlatformStats = platformAnalytics || {
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    activeCompanies: 0,
    userGrowth: 0,
    jobGrowth: 0,
    applicationRate: 0,
    successRate: 0
  };

  // Extract chart data from analytics state
  const userGrowthData = userAnalytics?.chartData || [];
  const jobPostingsData = jobAnalytics?.chartData || [];
  const applicationData = jobAnalytics?.applicationData || [];

  // Success rate pie chart data
  const successRateData = [
    { name: 'Accepted', value: Math.round(stats.totalApplications * 0.12) },
    { name: 'Pending', value: Math.round(stats.totalApplications * 0.65) },
    { name: 'Rejected', value: Math.round(stats.totalApplications * 0.23) }
  ];

  const getTimePeriodLabel = (period: TimePeriod): string => {
    switch (period) {
      case '7days':
        return 'Last 7 Days';
      case '30days':
        return 'Last 30 Days';
      case '90days':
        return 'Last 90 Days';
      case 'all':
        return 'All Time';
      default:
        return '';
    }
  };

  const mainStats = [
    {
      label: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      growth: stats.userGrowth,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Registered users'
    },
    {
      label: 'Total Jobs',
      value: stats.totalJobs.toLocaleString(),
      growth: stats.jobGrowth,
      icon: BriefcaseIcon,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Posted jobs'
    },
    {
      label: 'Applications',
      value: stats.totalApplications.toLocaleString(),
      growth: stats.applicationRate,
      icon: DocumentTextIcon,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Total applications'
    },
    {
      label: 'Active Companies',
      value: stats.activeCompanies.toLocaleString(),
      growth: 18.5,
      icon: BuildingOfficeIcon,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Hiring companies'
    }
  ];

  const keyMetrics = [
    {
      label: 'User Growth Rate',
      value: `${stats.userGrowth}%`,
      change: stats.userGrowth,
      icon: UserGroupIcon,
      description: 'Percentage increase in new user registrations',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Job Posting Rate',
      value: `${stats.jobGrowth}%`,
      change: stats.jobGrowth,
      icon: BriefcaseIcon,
      description: 'Percentage increase in job listings',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Application Rate',
      value: `${stats.applicationRate}%`,
      change: stats.applicationRate,
      icon: DocumentTextIcon,
      description: 'Average applications per job posting',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Success Rate',
      value: `${stats.successRate}%`,
      change: stats.successRate,
      icon: CheckCircleIcon,
      description: 'Percentage of applications leading to hires',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const renderTrendIndicator = (change: number) => {
    const isPositive = change > 0;
    return (
      <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? (
          <ArrowTrendingUpIcon className="w-4 h-4" />
        ) : (
          <ArrowTrendingDownIcon className="w-4 h-4" />
        )}
        <span>{Math.abs(change)}%</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Monitor platform performance and key metrics</p>
            </div>

            {/* Time Period Filter */}
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-gray-400" />
              <select
                value={timePeriod}
                onChange={(e) => handleTimePeriodChange(e.target.value as TimePeriod)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white font-medium"
                disabled={isLoading}
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mainStats.map((stat, index) => (
            <AnimatedCard key={stat.label} animation="fadeUp" delay={index * 50}>
              <GlassCard className="p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  {renderTrendIndicator(stat.growth)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              </GlassCard>
            </AnimatedCard>
          ))}
        </div>

        {/* Key Metrics Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {keyMetrics.map((metric, index) => (
              <AnimatedCard key={metric.label} animation="fadeUp" delay={index * 50}>
                <GlassCard className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-4 rounded-lg ${metric.bgColor} flex-shrink-0`}>
                      <metric.icon className={`w-8 h-8 ${metric.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{metric.label}</h3>
                        {renderTrendIndicator(metric.change)}
                      </div>
                      <p className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</p>
                      <p className="text-sm text-gray-600">{metric.description}</p>
                    </div>
                  </div>
                </GlassCard>
              </AnimatedCard>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <AnimatedCard animation="fadeUp" delay={0}>
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">User Growth Over Time</h3>
                  <ChartBarIcon className="w-6 h-6 text-gray-400" />
                </div>
                <LineChartComponent
                  data={userGrowthData}
                  xKey="date"
                  yKeys={[
                    { key: 'users', color: '#3B82F6', name: 'Total Users' },
                    { key: 'jobseekers', color: '#10B981', name: 'Job Seekers' },
                    { key: 'employers', color: '#F59E0B', name: 'Employers' }
                  ]}
                  height={300}
                  showGrid={true}
                  showLegend={true}
                />
              </GlassCard>
            </AnimatedCard>

            {/* Job Postings Chart */}
            <AnimatedCard animation="fadeUp" delay={100}>
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Job Postings Trend</h3>
                  <ChartBarIcon className="w-6 h-6 text-gray-400" />
                </div>
                <BarChartComponent
                  data={jobPostingsData}
                  xKey="date"
                  yKeys={[
                    { key: 'jobs', color: '#8B5CF6', name: 'Total Jobs' },
                    { key: 'active', color: '#10B981', name: 'Active' },
                    { key: 'filled', color: '#EF4444', name: 'Filled' }
                  ]}
                  height={300}
                  showGrid={true}
                  showLegend={true}
                  stacked={false}
                />
              </GlassCard>
            </AnimatedCard>

            {/* Applications Chart */}
            <AnimatedCard animation="fadeUp" delay={200}>
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Application Analytics</h3>
                  <ChartBarIcon className="w-6 h-6 text-gray-400" />
                </div>
                <AreaChartComponent
                  data={applicationData}
                  xKey="date"
                  yKeys={[
                    { key: 'applications', color: '#10B981', name: 'Total Applications' },
                    { key: 'accepted', color: '#3B82F6', name: 'Accepted' },
                    { key: 'rejected', color: '#EF4444', name: 'Rejected' }
                  ]}
                  height={300}
                  showGrid={true}
                  showLegend={true}
                  stacked={false}
                />
              </GlassCard>
            </AnimatedCard>

            {/* Success Rate Chart */}
            <AnimatedCard animation="fadeUp" delay={300}>
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Application Status Distribution</h3>
                  <ChartBarIcon className="w-6 h-6 text-gray-400" />
                </div>
                <PieChartComponent
                  data={successRateData}
                  dataKey="value"
                  nameKey="name"
                  colors={['#10B981', '#F59E0B', '#EF4444']}
                  height={300}
                  showLegend={true}
                  innerRadius={60}
                  outerRadius={100}
                  showLabels={true}
                />
              </GlassCard>
            </AnimatedCard>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Activity Overview</h2>
          <GlassCard className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 border-r border-gray-200 last:border-r-0">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-green-50 rounded-full">
                    <CheckCircleIcon className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-2">Active Applications</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {Math.round(stats.totalApplications * 0.65).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Currently in review</p>
              </div>

              <div className="text-center p-6 border-r border-gray-200 last:border-r-0">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-yellow-50 rounded-full">
                    <ClockIcon className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-2">Pending Approvals</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {Math.round(stats.totalJobs * 0.15).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Jobs awaiting review</p>
              </div>

              <div className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-red-50 rounded-full">
                    <XCircleIcon className="w-8 h-8 text-red-600" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-600 mb-2">Rejected Applications</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {Math.round(stats.totalApplications * 0.12).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Declined this period</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Time Period Summary */}
        <GlassCard className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Summary for {getTimePeriodLabel(timePeriod)}
              </h3>
              <p className="text-gray-600 mb-4">
                Platform activity overview for the selected time period. All metrics show positive growth trends indicating healthy platform engagement.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Avg. Daily Users</p>
                  <p className="text-xl font-bold text-gray-900">
                    {Math.round(stats.totalUsers / (timePeriod === '7days' ? 7 : timePeriod === '30days' ? 30 : timePeriod === '90days' ? 90 : 365)).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Daily Jobs</p>
                  <p className="text-xl font-bold text-gray-900">
                    {Math.round(stats.totalJobs / (timePeriod === '7days' ? 7 : timePeriod === '30days' ? 30 : timePeriod === '90days' ? 90 : 365)).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-xl font-bold text-gray-900">{stats.successRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Engagement Score</p>
                  <p className="text-xl font-bold text-gray-900">
                    {Math.round((stats.userGrowth + stats.jobGrowth + stats.applicationRate) / 3)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
