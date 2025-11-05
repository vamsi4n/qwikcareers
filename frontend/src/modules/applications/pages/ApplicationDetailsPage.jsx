import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeftIcon,
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { getApplicationDetails, withdrawApplication } from '../../../store/slices/applicationSlice';
import AnimatedCard from '../../../components/animations/AnimatedCard';
import GlassCard from '../../../components/ui/GlassCard';

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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <GlassCard className="text-center py-20">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading application details...</p>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <GlassCard className="text-center py-20">
            <DocumentTextIcon className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Application not found</h3>
            <p className="text-gray-600 mb-6">This application may have been removed or doesn't exist</p>
            <button
              onClick={() => navigate('/applications')}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Applications
            </button>
          </GlassCard>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <button
            onClick={() => navigate('/applications')}
            className="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center gap-2 font-medium transition"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Applications
          </button>
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{application.job?.title || 'Job Position'}</h1>
              <p className="text-lg text-blue-600 font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                {application.job?.company?.name || 'Company Name'}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize border-2 whitespace-nowrap ${getStatusColor(application.status)}`}>
              {getStatusIcon(application.status)} {application.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            <AnimatedCard animation="fadeUp" delay={0}>
              <GlassCard className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Application Timeline</h2>
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex flex-col items-center mr-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                        item.completed
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {item.completed ? (
                        <CheckCircleIcon className="w-6 h-6" />
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
              </GlassCard>
            </AnimatedCard>

            {/* Application Materials */}
            <AnimatedCard animation="fadeUp" delay={100}>
              <GlassCard className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Application Materials</h2>
                <div className="space-y-4">
                  {application.resume && (
                    <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <DocumentTextIcon className="w-8 h-8 text-red-600" />
                          <div>
                            <p className="font-semibold text-gray-900">Resume</p>
                            <p className="text-sm text-gray-600">PDF Document</p>
                          </div>
                        </div>
                        <a
                          href={application.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  )}

                  {application.coverLetter && (
                    <div className="border-2 border-gray-200 rounded-lg p-4 bg-blue-50 border-blue-100">
                      <h3 className="font-semibold text-blue-900 mb-2">Cover Letter</h3>
                      <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                        {application.coverLetter}
                      </p>
                    </div>
                  )}
                </div>
              </GlassCard>
            </AnimatedCard>

            {/* Interview Details (if scheduled) */}
            {application.status === 'interview' && application.interviewDetails && (
              <AnimatedCard animation="fadeUp" delay={200}>
                <GlassCard className="p-6 bg-purple-50 border-2 border-purple-200">
                  <div className="flex items-start gap-3">
                    <CalendarIcon className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-purple-900 mb-3">Interview Scheduled</h3>
                      <div className="space-y-2 text-sm text-purple-800">
                        <p>
                          <span className="font-semibold">Date:</span>{' '}
                          {new Date(application.interviewDetails.date).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-semibold">Time:</span> {application.interviewDetails.time}
                        </p>
                        {application.interviewDetails.location && (
                          <p>
                            <span className="font-semibold">Location:</span> {application.interviewDetails.location}
                          </p>
                        )}
                        {application.interviewDetails.meetingLink && (
                          <p>
                            <a
                              href={application.interviewDetails.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-semibold mt-2"
                            >
                              Join Video Call
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </AnimatedCard>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Details */}
            <AnimatedCard animation="fadeUp" delay={50}>
              <GlassCard className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Job Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
                    <MapPinIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-gray-600 font-medium">Location</p>
                      <p className="text-gray-900 font-semibold">
                        {application.job?.location?.city}, {application.job?.location?.state}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-purple-50 p-3 rounded-lg">
                    <BriefcaseIcon className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-gray-600 font-medium">Job Type</p>
                      <p className="text-gray-900 font-semibold capitalize">{application.job?.jobType}</p>
                    </div>
                  </div>

                  {application.job?.salary && (
                    <div className="flex items-start gap-3 bg-green-50 p-3 rounded-lg">
                      <CurrencyDollarIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-gray-600 font-medium">Salary</p>
                        <p className="text-gray-900 font-semibold">
                          ${application.job.salary.min?.toLocaleString()} - $
                          {application.job.salary.max?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/jobs/${application.job?._id}`)}
                  className="w-full mt-4 px-4 py-2.5 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold"
                >
                  View Full Job Description
                </button>
              </GlassCard>
            </AnimatedCard>

            {/* Actions */}
            <AnimatedCard animation="fadeUp" delay={100}>
              <GlassCard className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  {canWithdraw && (
                    <button
                      onClick={() => setShowWithdrawModal(true)}
                      className="w-full px-4 py-2.5 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition font-semibold"
                    >
                      Withdraw Application
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/messages')}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    Contact Employer
                  </button>
                </div>
              </GlassCard>
            </AnimatedCard>

            {/* Application Info */}
            <AnimatedCard animation="fadeUp" delay={150}>
              <GlassCard className="p-4 bg-blue-50 border-2 border-blue-100">
                <p className="text-sm text-blue-900 font-medium">
                  <span className="text-gray-600">Applied on</span>{' '}
                  {new Date(application.appliedDate || application.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </GlassCard>
            </AnimatedCard>
          </div>
        </div>

        {/* Withdraw Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <GlassCard className="p-8 max-w-md w-full animate-scale-in">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Withdraw Application</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Are you sure you want to withdraw your application for <span className="font-semibold text-gray-900">{application.job?.title}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdraw}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                >
                  Withdraw
                </button>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}
