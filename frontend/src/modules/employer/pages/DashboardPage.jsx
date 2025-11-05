import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const stats = [
    {
      label: 'Active Jobs',
      value: 12,
      change: '+2 this month',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Total Applications',
      value: 248,
      change: '+45 this week',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      label: 'New Applicants',
      value: 32,
      change: 'Since yesterday',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      label: 'Interviews Scheduled',
      value: 8,
      change: 'This week',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const recentJobs = [
    { id: 1, title: 'Senior React Developer', applications: 45, status: 'active', postedDays: 3 },
    { id: 2, title: 'Product Manager', applications: 67, status: 'active', postedDays: 7 },
    { id: 3, title: 'UX Designer', applications: 32, status: 'active', postedDays: 12 },
    { id: 4, title: 'Backend Engineer', applications: 28, status: 'closed', postedDays: 20 },
  ];

  const recentApplicants = [
    { id: 1, name: 'John Doe', position: 'Senior React Developer', status: 'reviewing', date: '2 hours ago' },
    { id: 2, name: 'Jane Smith', position: 'Product Manager', status: 'shortlisted', date: '5 hours ago' },
    { id: 3, name: 'Mike Johnson', position: 'UX Designer', status: 'pending', date: '1 day ago' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage your job postings and candidates</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-blue-600">{stat.icon}</div>
              <span className="text-sm text-green-600 font-medium">{stat.change}</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Job Postings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Recent Job Postings</h2>
              <button
                onClick={() => navigate('/employer/jobs')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentJobs.map((job) => (
              <div key={job.id} className="p-6 hover:bg-gray-50 cursor-pointer transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.applications} applications</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      job.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Posted {job.postedDays} days ago</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applicants */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Recent Applicants</h2>
              <button
                onClick={() => navigate('/employer/applicants')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentApplicants.map((applicant) => (
              <div key={applicant.id} className="p-6 hover:bg-gray-50 cursor-pointer transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{applicant.name}</h3>
                    <p className="text-sm text-gray-600">{applicant.position}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      applicant.status === 'shortlisted'
                        ? 'bg-green-100 text-green-800'
                        : applicant.status === 'reviewing'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {applicant.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{applicant.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/employer/jobs/post')}
            className="bg-white p-4 rounded-lg hover:shadow-md transition text-center"
          >
            <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium">Post New Job</span>
          </button>
          <button
            onClick={() => navigate('/employer/applicants')}
            className="bg-white p-4 rounded-lg hover:shadow-md transition text-center"
          >
            <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm font-medium">View Applicants</span>
          </button>
          <button
            onClick={() => navigate('/employer/jobs')}
            className="bg-white p-4 rounded-lg hover:shadow-md transition text-center"
          >
            <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">Manage Jobs</span>
          </button>
          <button
            onClick={() => navigate('/employer/analytics')}
            className="bg-white p-4 rounded-lg hover:shadow-md transition text-center"
          >
            <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm font-medium">View Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
}
