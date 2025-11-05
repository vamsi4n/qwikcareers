import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  DocumentTextIcon,
  MapPinIcon,
  BriefcaseIcon,
  CalendarIcon,
  EyeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { getMyApplications, withdrawApplication } from '../../../store/slices/applicationSlice';
import AnimatedCard from '../../../components/animations/AnimatedCard';
import GlassCard from '../../../components/ui/GlassCard';

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
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track and manage your job applications</p>
        </div>

        {/* Status Filters */}
        <GlassCard className="mb-6 p-4">
          <div className="flex flex-wrap gap-2">
            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                  filter === status
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {status} ({count})
              </button>
            ))}
          </div>
        </GlassCard>

        {isLoading ? (
          <GlassCard className="text-center py-20">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </GlassCard>
        ) : filteredApplications.length === 0 ? (
          <GlassCard className="text-center py-20">
            <DocumentTextIcon className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {filter === 'all'
                ? 'No applications yet'
                : `No ${filter} applications`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all'
                ? 'Start applying to jobs to track your progress'
                : `You don't have any applications with status "${filter}"`}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => navigate('/jobs')}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Browse Jobs
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            )}
          </GlassCard>
        ) : (
          <div className="space-y-4">
          {filteredApplications.map((application, index) => (
            <AnimatedCard key={application._id} delay={index * 50} animation="fadeUp">
              <GlassCard className="p-6 transition hover:shadow-lg hover:scale-[1.01]">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 cursor-pointer" onClick={() => navigate(`/jobs/${application.job?._id}`)}>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition">
                      {application.job?.title || 'Job Title'}
                    </h3>
                    <p className="text-blue-600 font-semibold mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      {application.job?.company?.name || 'Company Name'}
                    </p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{application.job?.location?.city}, {application.job?.location?.state}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <BriefcaseIcon className="w-4 h-4" />
                        <span className="capitalize">{application.job?.jobType}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize ${getStatusColor(
                      application.status
                    )}`}
                  >
                    {application.status}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span className="font-medium">Applied</span>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {application.viewedAt && (
                      <div>
                        <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                          <EyeIcon className="w-4 h-4" />
                          <span className="font-medium">Viewed</span>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {new Date(application.viewedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {application.statusUpdatedAt && (
                      <div>
                        <span className="text-gray-500 font-medium block mb-1">Last Updated</span>
                        <p className="font-semibold text-gray-900">
                          {new Date(application.statusUpdatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {application.notes && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-blue-900">Notes:</span> {application.notes}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/applications/${application._id}`)}
                    className="flex-1 border-2 border-blue-600 text-blue-600 py-2.5 rounded-lg hover:bg-blue-50 transition font-semibold"
                  >
                    View Details
                  </button>
                  {['pending', 'reviewing'].includes(application.status) && (
                    <button
                      onClick={() => handleWithdraw(application._id)}
                      className="border-2 border-red-600 text-red-600 px-6 py-2.5 rounded-lg hover:bg-red-50 transition font-semibold"
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </GlassCard>
            </AnimatedCard>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
