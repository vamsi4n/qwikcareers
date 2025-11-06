import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart } from '../../../shared/components/charts';
import { AreaChart } from '../../../shared/components/charts';

interface ProfileAnalyticsData {
  timeSeries: Array<{
    date: string;
    views: number;
    uniqueViews: number;
    resumeDownloads: number;
    contactInitiated: number;
    jobInvitations: number;
  }>;
  summary: {
    totalViews: number;
    totalUniqueViews: number;
    totalResumeDownloads: number;
    totalContacts: number;
    totalJobInvitations: number;
    averageViewsPerDay: number;
    responseRate: string;
  };
  topCompanies: Array<{
    company: {
      _id: string;
      name: string;
      logo?: string;
    };
    totalViews: number;
  }>;
  period: {
    start: string;
    end: string;
  };
}

interface ProfileAnalyticsChartProps {
  profileId: string;
  defaultPeriod?: '7days' | '30days' | '90days' | 'all';
  chartType?: 'line' | 'area';
}

export default function ProfileAnalyticsChart({
  profileId,
  defaultPeriod = '30days',
  chartType = 'line',
}: ProfileAnalyticsChartProps) {
  const [data, setData] = useState<ProfileAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState(defaultPeriod);
  const [selectedChartType, setSelectedChartType] = useState(chartType);

  useEffect(() => {
    fetchAnalytics();
  }, [profileId, period]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await axios.get(`/api/v1/analytics/profiles/${profileId}/views`, {
        params: { period },
      });
      setData(response.data.data);
    } catch (err: any) {
      console.error('Failed to fetch profile analytics:', err);
      setError(err.response?.data?.message || 'Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-red-600 py-8">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!data || data.timeSeries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-gray-500 py-8">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <p>No analytics data available for this period</p>
        </div>
      </div>
    );
  }

  const ChartComponent = selectedChartType === 'area' ? AreaChart : LineChart;

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Profile Performance Analytics</h2>
          <div className="flex gap-2">
            {/* Chart Type Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setSelectedChartType('line')}
                className={`px-4 py-2 text-sm font-medium ${
                  selectedChartType === 'line'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Line
              </button>
              <button
                onClick={() => setSelectedChartType('area')}
                className={`px-4 py-2 text-sm font-medium ${
                  selectedChartType === 'area'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Area
              </button>
            </div>
            {/* Period Selector */}
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(data.summary.totalViews)}</p>
              </div>
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {formatNumber(data.summary.totalUniqueViews)} unique
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Resume Downloads</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(data.summary.totalResumeDownloads)}</p>
              </div>
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 mt-2">By employers</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Contact Initiated</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(data.summary.totalContacts)}</p>
              </div>
              <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 mt-2">Direct contacts</p>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Job Invitations</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(data.summary.totalJobInvitations)}</p>
              </div>
              <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 mt-2">Opportunities</p>
          </div>

          <div className="bg-pink-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Response Rate</p>
                <p className="text-2xl font-bold text-gray-900">{data.summary.responseRate}%</p>
              </div>
              <svg className="w-10 h-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 mt-2">Engagement rate</p>
          </div>
        </div>
      </div>

      {/* Profile Views Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Views Over Time</h3>
        <ChartComponent
          data={data.timeSeries}
          xKey="date"
          lines={[
            {
              dataKey: 'views',
              name: 'Total Views',
              color: '#3b82f6',
              strokeWidth: 2,
            },
            {
              dataKey: 'uniqueViews',
              name: 'Unique Views',
              color: '#8b5cf6',
              strokeWidth: 2,
            },
          ]}
          height={350}
          showGrid={true}
          showLegend={true}
          formatXAxis={formatDate}
          formatYAxis={(value: number) => formatNumber(value)}
          formatTooltip={(value: number) => formatNumber(value)}
        />
      </div>

      {/* Engagement Metrics Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h3>
        <ChartComponent
          data={data.timeSeries}
          xKey="date"
          lines={[
            {
              dataKey: 'resumeDownloads',
              name: 'Resume Downloads',
              color: '#10b981',
              strokeWidth: 2,
            },
            {
              dataKey: 'contactInitiated',
              name: 'Contacts',
              color: '#a855f7',
              strokeWidth: 2,
            },
            {
              dataKey: 'jobInvitations',
              name: 'Job Invitations',
              color: '#f59e0b',
              strokeWidth: 2,
            },
          ]}
          height={350}
          showGrid={true}
          showLegend={true}
          formatXAxis={formatDate}
          formatYAxis={(value: number) => formatNumber(value)}
          formatTooltip={(value: number) => formatNumber(value)}
        />
      </div>

      {/* Top Viewing Companies */}
      {data.topCompanies && data.topCompanies.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Companies Viewing Your Profile</h3>
          <div className="space-y-3">
            {data.topCompanies.map((item, index) => (
              <div
                key={item.company._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-semibold">
                    {index + 1}
                  </div>
                  {item.company.logo ? (
                    <img
                      src={item.company.logo}
                      alt={item.company.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{item.company.name}</p>
                    <p className="text-sm text-gray-500">{formatNumber(item.totalViews)} views</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, (item.totalViews / data.topCompanies[0].totalViews) * 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
