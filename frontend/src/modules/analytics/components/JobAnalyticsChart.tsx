import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart } from '../../../shared/components/charts';
import { AreaChart } from '../../../shared/components/charts';

interface JobAnalyticsData {
  timeSeries: Array<{
    date: string;
    views: number;
    applications: number;
    saves: number;
    shares: number;
    viewToApplicationRate: number;
  }>;
  summary: {
    totalViews: number;
    totalApplications: number;
    totalSaves: number;
    totalShares: number;
    averageViewsPerDay: number;
    conversionRate: string;
  };
  period: {
    start: string;
    end: string;
  };
}

interface JobAnalyticsChartProps {
  jobId: string;
  defaultPeriod?: '7days' | '30days' | '90days' | 'all';
  chartType?: 'line' | 'area';
}

export default function JobAnalyticsChart({
  jobId,
  defaultPeriod = '30days',
  chartType = 'line',
}: JobAnalyticsChartProps) {
  const [data, setData] = useState<JobAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState(defaultPeriod);
  const [selectedChartType, setSelectedChartType] = useState(chartType);

  useEffect(() => {
    fetchAnalytics();
  }, [jobId, period]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await axios.get(`/api/v1/analytics/jobs/${jobId}/views`, {
        params: { period },
      });
      setData(response.data.data);
    } catch (err: any) {
      console.error('Failed to fetch job analytics:', err);
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

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
          <h2 className="text-2xl font-bold text-gray-900">Job Performance Analytics</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
              Avg: {formatNumber(data.summary.averageViewsPerDay)}/day
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Applications</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(data.summary.totalApplications)}</p>
              </div>
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 mt-2">From total views</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{data.summary.conversionRate}%</p>
              </div>
              <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 mt-2">View to application</p>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Saves</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(data.summary.totalSaves)}</p>
              </div>
              <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 mt-2">Users interested</p>
          </div>
        </div>
      </div>

      {/* Views & Applications Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Views &amp; Applications Over Time</h3>
        <ChartComponent
          data={data.timeSeries}
          xKey="date"
          lines={[
            {
              dataKey: 'views',
              name: 'Views',
              color: '#3b82f6',
              strokeWidth: 2,
            },
            {
              dataKey: 'applications',
              name: 'Applications',
              color: '#10b981',
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
              dataKey: 'saves',
              name: 'Saves',
              color: '#f59e0b',
              strokeWidth: 2,
            },
            {
              dataKey: 'shares',
              name: 'Shares',
              color: '#8b5cf6',
              strokeWidth: 2,
            },
            {
              dataKey: 'viewToApplicationRate',
              name: 'Conversion Rate (%)',
              color: '#ec4899',
              strokeWidth: 2,
            },
          ]}
          height={350}
          showGrid={true}
          showLegend={true}
          formatXAxis={formatDate}
          formatYAxis={(value: number) => formatNumber(value)}
          formatTooltip={(value: number, name?: string) => {
            if (name === 'Conversion Rate (%)') {
              return formatPercentage(value);
            }
            return formatNumber(value);
          }}
        />
      </div>
    </div>
  );
}
