import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getApplicationDetails, withdrawApplication } from '../../../store/slices/applicationSlice';

export default function ApplicationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedApplication: application, isLoading } = useSelector((state) => state.applications);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getApplicationDetails(id));
    }
  }, [id, dispatch]);

  const handleWithdraw = () => {
    dispatch(withdrawApplication(id));
    setShowWithdrawModal(false);
    navigate('/applications');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'shortlisted':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'interview':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'reviewing':
        return '👀';
      case 'shortlisted':
        return '⭐';
      case 'interview':
        return '📅';
      case 'accepted':
        return '✅';
      case 'rejected':
        return '❌';
      case 'withdrawn':
        return '🚫';
      default:
        return '📄';
    }
  };

  if (isLoading && !application) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600">Application not found</p>
          <button
            onClick={() => navigate('/applications')}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  // Mock timeline data - replace with actual data from application
  const timeline = [
    {
      status: 'submitted',
      date: application.appliedDate || application.createdAt,
      description: 'Application submitted',
      completed: true,
    },
    {
      status: 'reviewing',
      date: application.reviewedAt,
      description: 'Application under review',
      completed: ['reviewing', 'shortlisted', 'interview', 'accepted'].includes(application.status),
    },
    {
      status: 'shortlisted',
      date: application.shortlistedAt,
      description: 'Shortlisted for interview',
      completed: ['shortlisted', 'interview', 'accepted'].includes(application.status),
    },
    {
      status: 'interview',
      date: application.interviewScheduledAt,
      description: 'Interview scheduled',
      completed: ['interview', 'accepted'].includes(application.status),
    },
    {
      status: 'decision',
      date: application.decidedAt,
      description: application.status === 'accepted' ? 'Offer extended' : application.status === 'rejected' ? 'Not selected' : 'Final decision pending',
      completed: ['accepted', 'rejected'].includes(application.status),
    },
  ];

  const canWithdraw = ['pending', 'reviewing'].includes(application.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/applications')}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Applications
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{application.job?.title || 'Job Position'}</h1>
            <p className="text-lg text-gray-600 mt-1">
              {application.job?.company?.name || 'Company Name'}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize border ${getStatusColor(application.status)}`}>
            {getStatusIcon(application.status)} {application.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Application Timeline</h2>
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex flex-col items-center mr-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.completed
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {item.completed ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                      )}
                    </div>
                    {index < timeline.length - 1 && (
                      <div
                        className={`w-0.5 h-12 ${
                          item.completed ? 'bg-green-300' : 'bg-gray-200'
                        }`}
                      ></div>
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className={`font-semibold ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                      {item.description}
                    </h3>
                    {item.date && (
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(item.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application Materials */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Application Materials</h2>
            <div className="space-y-4">
              {application.resume && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-8 h-8 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-900">Resume</p>
                        <p className="text-sm text-gray-600">PDF Document</p>
                      </div>
                    </div>
                    <a
                      href={application.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      View
                    </a>
                  </div>
                </div>
              )}

              {application.coverLetter && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Cover Letter</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {application.coverLetter}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Interview Details (if scheduled) */}
          {application.status === 'interview' && application.interviewDetails && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-purple-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">Interview Scheduled</h3>
                  <div className="space-y-2 text-sm text-purple-800">
                    <p>
                      <span className="font-medium">Date:</span>{' '}
                      {new Date(application.interviewDetails.date).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span> {application.interviewDetails.time}
                    </p>
                    {application.interviewDetails.location && (
                      <p>
                        <span className="font-medium">Location:</span> {application.interviewDetails.location}
                      </p>
                    )}
                    {application.interviewDetails.meetingLink && (
                      <p>
                        <a
                          href={application.interviewDetails.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-700 hover:text-purple-900 font-medium underline"
                        >
                          Join Video Call
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Job Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <div>
                  <p className="text-gray-600">Location</p>
                  <p className="text-gray-900">
                    {application.job?.location?.city}, {application.job?.location?.state}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-gray-600">Job Type</p>
                  <p className="text-gray-900">{application.job?.jobType}</p>
                </div>
              </div>

              {application.job?.salary && (
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-gray-600">Salary</p>
                    <p className="text-gray-900">
                      ${application.job.salary.min?.toLocaleString()} - $
                      {application.job.salary.max?.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate(`/jobs/${application.job?._id}`)}
              className="w-full mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition font-medium text-sm"
            >
              View Full Job Description
            </button>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              {canWithdraw && (
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="w-full px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition font-medium text-sm"
                >
                  Withdraw Application
                </button>
              )}
              <button
                onClick={() => navigate('/messages')}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition font-medium text-sm"
              >
                Contact Employer
              </button>
            </div>
          </div>

          {/* Application Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-600">
              Applied on{' '}
              {new Date(application.appliedDate || application.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Withdraw Application</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to withdraw your application for {application.job?.title}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
