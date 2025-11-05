import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManageJobsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  // Mock data - replace with actual Redux data
  const jobs = [
    { id: 1, title: 'Senior React Developer', status: 'active', applications: 45, views: 234, postedDate: '2024-01-15' },
    { id: 2, title: 'Product Manager', status: 'active', applications: 67, views: 456, postedDate: '2024-01-10' },
    { id: 3, title: 'UX Designer', status: 'active', applications: 32, views: 178, postedDate: '2024-01-05' },
    { id: 4, title: 'Backend Engineer', status: 'closed', applications: 89, views: 567, postedDate: '2023-12-20' },
    { id: 5, title: 'DevOps Engineer', status: 'draft', applications: 0, views: 0, postedDate: '2024-01-18' },
  ];

  const filteredJobs = jobs.filter((job) => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  const statusCounts = {
    all: jobs.length,
    active: jobs.filter((j) => j.status === 'active').length,
    closed: jobs.filter((j) => j.status === 'closed').length,
    draft: jobs.filter((j) => j.status === 'draft').length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleToggleStatus = (jobId) => {
    // TODO: Dispatch action to toggle job status
    console.log('Toggle status for job:', jobId);
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      // TODO: Dispatch action to delete job
      console.log('Delete job:', jobId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
        <button
          onClick={() => navigate('/employer/jobs/post')}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-semibold"
        >
          Post New Job
        </button>
      </div>

      {/* Status Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md font-medium transition capitalize ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 mb-4">No jobs found with status "{filter}"</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Posted on {new Date(job.postedDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/employer/jobs/${job.id}/edit`)}
                    className="text-blue-600 hover:text-blue-700 px-3 py-1 rounded-md hover:bg-blue-50 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="text-red-600 hover:text-red-700 px-3 py-1 rounded-md hover:bg-red-50 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{job.applications}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">Views</p>
                  <p className="text-2xl font-bold text-gray-900">{job.views}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">Conversion</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {job.views > 0 ? ((job.applications / job.views) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition font-medium"
                >
                  View Job
                </button>
                <button
                  onClick={() => navigate(`/employer/jobs/${job.id}/applicants`)}
                  className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-md hover:bg-blue-50 transition font-medium"
                >
                  View Applicants ({job.applications})
                </button>
                {job.status === 'active' ? (
                  <button
                    onClick={() => handleToggleStatus(job.id)}
                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition font-medium"
                  >
                    Close
                  </button>
                ) : job.status === 'closed' ? (
                  <button
                    onClick={() => handleToggleStatus(job.id)}
                    className="border border-green-600 text-green-600 px-6 py-2 rounded-md hover:bg-green-50 transition font-medium"
                  >
                    Reopen
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleStatus(job.id)}
                    className="border border-blue-600 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 transition font-medium"
                  >
                    Publish
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
