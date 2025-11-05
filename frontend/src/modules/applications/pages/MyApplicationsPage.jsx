import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMyApplications, withdrawApplication } from '../../../store/slices/applicationSlice';

export default function MyApplicationsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { applications, isLoading } = useSelector((state) => state.applications);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(getMyApplications());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'interview':
        return 'bg-purple-100 text-purple-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleWithdraw = (applicationId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      dispatch(withdrawApplication(applicationId));
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const statusCounts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    reviewing: applications.filter((a) => a.status === 'reviewing').length,
    shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
    interview: applications.filter((a) => a.status === 'interview').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Applications</h1>

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

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600 mb-4">
            {filter === 'all'
              ? 'You haven\'t applied to any jobs yet'
              : `No applications with status "${filter}"`}
          </p>
          {filter === 'all' && (
            <button
              onClick={() => navigate('/jobs')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Browse Jobs →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div key={application._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 cursor-pointer" onClick={() => navigate(`/jobs/${application.job?._id}`)}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {application.job?.title || 'Job Title'}
                  </h3>
                  <p className="text-blue-600 font-medium mb-2">
                    {application.job?.company?.name || 'Company Name'}
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {application.job?.location?.city}, {application.job?.location?.state}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {application.job?.jobType}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusColor(
                    application.status
                  )}`}
                >
                  {application.status}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Applied</span>
                    <p className="font-medium text-gray-900">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {application.viewedAt && (
                    <div>
                      <span className="text-gray-500">Viewed</span>
                      <p className="font-medium text-gray-900">
                        {new Date(application.viewedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {application.interviewDate && (
                    <div>
                      <span className="text-gray-500">Interview</span>
                      <p className="font-medium text-gray-900">
                        {new Date(application.interviewDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {application.statusUpdatedAt && (
                    <div>
                      <span className="text-gray-500">Last Updated</span>
                      <p className="font-medium text-gray-900">
                        {new Date(application.statusUpdatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {application.notes && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Notes:</span> {application.notes}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/applications/${application._id}`)}
                  className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-md hover:bg-blue-50 transition font-medium"
                >
                  View Details
                </button>
                {['pending', 'reviewing'].includes(application.status) && (
                  <button
                    onClick={() => handleWithdraw(application._id)}
                    className="border border-red-600 text-red-600 px-6 py-2 rounded-md hover:bg-red-50 transition font-medium"
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
