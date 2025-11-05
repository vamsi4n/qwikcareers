import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  DocumentTextIcon,
  BookmarkIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  BellAlertIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { getMyApplications } from '../../../store/slices/applicationSlice';
import { getRecommendedJobs, getSavedJobs } from '../../../store/slices/jobSlice';
import AnimatedCard from '../../../components/animations/AnimatedCard';
import GlassCard from '../../../components/ui/GlassCard';

export default function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { applications } = useSelector((state) => state.applications);
  const { recommendedJobs, savedJobs } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(getMyApplications({ limit: 5 }));
    dispatch(getRecommendedJobs());
    dispatch(getSavedJobs());
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

  const stats = [
    {
      label: 'Applications',
      value: applications.length || 0,
      icon: DocumentTextIcon,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      label: 'Saved Jobs',
      value: savedJobs.length || 0,
      icon: BookmarkIcon,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      label: 'Profile Views',
      value: user?.profileViews || 0,
      icon: EyeIcon,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your job search</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <AnimatedCard key={index} animation="fadeUp" delay={index * 50}>
                <GlassCard className="p-6 transition hover:shadow-lg hover:scale-[1.01]">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-4 ${stat.bgColor} rounded-xl`}>
                      <Icon className={`w-8 h-8 ${stat.textColor}`} />
                    </div>
                  </div>
                </GlassCard>
              </AnimatedCard>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Applications */}
          <AnimatedCard animation="fadeUp" delay={150}>
            <GlassCard className="overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-blue-50">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
                  <button
                    onClick={() => navigate('/applications')}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-semibold transition"
                  >
                    View All
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {applications.length === 0 ? (
                  <div className="p-8 text-center">
                    <DocumentTextIcon className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-600 mb-3">No applications yet</p>
                    <button
                      onClick={() => navigate('/jobs')}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Browse Jobs
                      <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  applications.slice(0, 5).map((application, index) => (
                    <div
                      key={application._id}
                      onClick={() => navigate(`/applications/${application._id}`)}
                      className="p-4 hover:bg-blue-50 cursor-pointer transition"
                    >
                      <div className="flex justify-between items-start gap-3 mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1 hover:text-blue-600 transition">
                            {application.job?.title || 'Job Title'}
                          </h3>
                          <p className="text-sm text-blue-600 font-medium">
                            {application.job?.company?.name || 'Company Name'}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize whitespace-nowrap ${getStatusColor(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Applied {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </GlassCard>
          </AnimatedCard>

          {/* Recommended Jobs */}
          <AnimatedCard animation="fadeUp" delay={200}>
            <GlassCard className="overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-purple-50">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Recommended Jobs</h2>
                  <button
                    onClick={() => navigate('/jobs/recommended')}
                    className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-semibold transition"
                  >
                    View All
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {recommendedJobs.length === 0 ? (
                  <div className="p-8 text-center">
                    <BriefcaseIcon className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-600 mb-1 font-medium">No recommendations yet</p>
                    <p className="text-sm text-gray-500 mb-3">Complete your profile to get personalized job recommendations</p>
                    <button
                      onClick={() => navigate('/profile')}
                      className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
                    >
                      <UserCircleIcon className="w-4 h-4" />
                      Complete Profile
                    </button>
                  </div>
                ) : (
                  recommendedJobs.slice(0, 5).map((job) => (
                    <div
                      key={job._id}
                      onClick={() => navigate(`/jobs/${job._id}`)}
                      className="p-4 hover:bg-purple-50 cursor-pointer transition group"
                    >
                      <h3 className="font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition">{job.title}</h3>
                      <p className="text-sm text-purple-600 font-medium mb-2">
                        {job.company?.name || 'Company Name'}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="flex items-center gap-1 text-gray-600 bg-blue-50 px-2 py-1 rounded">
                          <MapPinIcon className="w-3 h-3" />
                          {job.location?.city}, {job.location?.state}
                        </span>
                        <span className="flex items-center gap-1 text-gray-600 bg-purple-50 px-2 py-1 rounded capitalize">
                          <BriefcaseIcon className="w-3 h-3" />
                          {job.jobType}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </GlassCard>
          </AnimatedCard>
        </div>

        {/* Quick Actions */}
        <AnimatedCard animation="fadeUp" delay={250} className="mt-8">
          <GlassCard className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/jobs')}
                className="bg-white p-5 rounded-xl hover:shadow-lg transition hover:scale-[1.02] text-center group border-2 border-transparent hover:border-blue-200"
              >
                <MagnifyingGlassIcon className="w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-900">Search Jobs</span>
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="bg-white p-5 rounded-xl hover:shadow-lg transition hover:scale-[1.02] text-center group border-2 border-transparent hover:border-purple-200"
              >
                <UserCircleIcon className="w-8 h-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-900">Edit Profile</span>
              </button>
              <button
                onClick={() => navigate('/saved-jobs')}
                className="bg-white p-5 rounded-xl hover:shadow-lg transition hover:scale-[1.02] text-center group border-2 border-transparent hover:border-green-200"
              >
                <BookmarkIcon className="w-8 h-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-900">Saved Jobs</span>
              </button>
              <button
                onClick={() => navigate('/job-alerts')}
                className="bg-white p-5 rounded-xl hover:shadow-lg transition hover:scale-[1.02] text-center group border-2 border-transparent hover:border-orange-200"
              >
                <BellAlertIcon className="w-8 h-8 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-900">Job Alerts</span>
              </button>
            </div>
          </GlassCard>
        </AnimatedCard>
      </div>
    </div>
  );
}
