import { useState } from 'react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30'); // days

  // Mock analytics data - TODO: Replace with Redux state
  const stats = {
    totalViews: 12453,
    totalApplications: 287,
    interviews: 45,
    hires: 8,
    viewsChange: 23.5,
    applicationsChange: 12.8,
    interviewsChange: -5.2,
    hiresChange: 33.3,
  };

  const jobPerformance = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      views: 3420,
      applications: 89,
      interviews: 15,
      hires: 3,
      conversionRate: 2.6,
      postedDate: '2024-01-15',
    },
    {
      id: 2,
      title: 'Product Designer',
      views: 2150,
      applications: 67,
      interviews: 12,
      hires: 2,
      conversionRate: 3.1,
      postedDate: '2024-01-20',
    },
    {
      id: 3,
      title: 'Marketing Manager',
      views: 1890,
      applications: 54,
      interviews: 8,
      hires: 1,
      conversionRate: 2.9,
      postedDate: '2024-01-22',
    },
    {
      id: 4,
      title: 'Data Scientist',
      views: 2840,
      applications: 43,
      interviews: 7,
      hires: 1,
      conversionRate: 1.5,
      postedDate: '2024-01-18',
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      views: 2153,
      applications: 34,
      interviews: 3,
      hires: 1,
      conversionRate: 1.6,
      postedDate: '2024-01-25',
    },
  ];

  const viewsTrend = [
    { date: 'Jan 1', value: 320 },
    { date: 'Jan 8', value: 450 },
    { date: 'Jan 15', value: 520 },
    { date: 'Jan 22', value: 480 },
    { date: 'Jan 29', value: 610 },
    { date: 'Feb 5', value: 550 },
    { date: 'Feb 12', value: 680 },
  ];

  const applicationsTrend = [
    { date: 'Jan 1', value: 25 },
    { date: 'Jan 8', value: 32 },
    { date: 'Jan 15', value: 45 },
    { date: 'Jan 22', value: 38 },
    { date: 'Jan 29', value: 52 },
    { date: 'Feb 5', value: 48 },
    { date: 'Feb 12', value: 47 },
  ];

  const getMaxValue = (data) => Math.max(...data.map((item) => item.value));

  const StatCard = ({ title, value, change, icon }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className={`p-2 rounded-lg ${icon.bgColor}`}>
          <svg className={`w-5 h-5 ${icon.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon.path} />
          </svg>
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value.toLocaleString()}</p>
      <div className="flex items-center">
        {change >= 0 ? (
          <svg className="w-4 h-4 text-green-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-red-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        )}
        <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {Math.abs(change)}%
        </span>
        <span className="text-sm text-gray-600 ml-1">vs last period</span>
      </div>
    </div>
  );

  const SimpleBarChart = ({ data, title, color }) => {
    const maxValue = getMaxValue(data);
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{item.date}</span>
                <span className="font-semibold text-gray-900">{item.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${color} h-2 rounded-full transition-all`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">
            Track your job postings performance and recruitment metrics
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Views"
          value={stats.totalViews}
          change={stats.viewsChange}
          icon={{
            path: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
          }}
        />
        <StatCard
          title="Applications"
          value={stats.totalApplications}
          change={stats.applicationsChange}
          icon={{
            path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
            color: 'text-green-600',
            bgColor: 'bg-green-100',
          }}
        />
        <StatCard
          title="Interviews"
          value={stats.interviews}
          change={stats.interviewsChange}
          icon={{
            path: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
          }}
        />
        <StatCard
          title="Hires"
          value={stats.hires}
          change={stats.hiresChange}
          icon={{
            path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
          }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SimpleBarChart data={viewsTrend} title="Views Trend" color="bg-blue-600" />
        <SimpleBarChart data={applicationsTrend} title="Applications Trend" color="bg-green-600" />
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Conversion Funnel</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">Views</span>
              <span className="text-gray-900 font-semibold">{stats.totalViews.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-8">
              <div className="bg-blue-600 h-8 rounded-full flex items-center justify-center" style={{ width: '100%' }}>
                <span className="text-white text-sm font-medium">100%</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">Applications</span>
              <span className="text-gray-900 font-semibold">{stats.totalApplications.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-8">
              <div
                className="bg-green-600 h-8 rounded-full flex items-center justify-center"
                style={{ width: `${(stats.totalApplications / stats.totalViews) * 100}%` }}
              >
                <span className="text-white text-sm font-medium">
                  {((stats.totalApplications / stats.totalViews) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">Interviews</span>
              <span className="text-gray-900 font-semibold">{stats.interviews.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-8">
              <div
                className="bg-purple-600 h-8 rounded-full flex items-center justify-center"
                style={{ width: `${(stats.interviews / stats.totalViews) * 100}%` }}
              >
                <span className="text-white text-sm font-medium">
                  {((stats.interviews / stats.totalViews) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">Hires</span>
              <span className="text-gray-900 font-semibold">{stats.hires.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-8">
              <div
                className="bg-orange-600 h-8 rounded-full flex items-center justify-center"
                style={{ width: `${(stats.hires / stats.totalViews) * 100}%` }}
              >
                <span className="text-white text-sm font-medium">
                  {((stats.hires / stats.totalViews) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Performance Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Job Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interviews
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posted
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobPerformance.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{job.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{job.views.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{job.applications}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{job.interviews}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{job.hires}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        job.conversionRate >= 3
                          ? 'bg-green-100 text-green-800'
                          : job.conversionRate >= 2
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {job.conversionRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(job.postedDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Insights & Recommendations</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>
                • Your overall conversion rate from views to applications is{' '}
                <strong>{((stats.totalApplications / stats.totalViews) * 100).toFixed(1)}%</strong>, which is{' '}
                {((stats.totalApplications / stats.totalViews) * 100).toFixed(1) >= 2.5 ? 'above' : 'below'}{' '}
                industry average.
              </li>
              <li>
                • <strong>Product Designer</strong> has your highest conversion rate at{' '}
                <strong>3.1%</strong>. Consider what's working well in that job posting.
              </li>
              <li>
                • Applications have increased by <strong>{stats.applicationsChange}%</strong> compared to the
                previous period.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
