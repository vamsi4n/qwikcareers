import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  BookmarkIcon,
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { getSavedJobs } from '../../../store/slices/jobSlice';
import AnimatedCard from '../../../components/animations/AnimatedCard';
import GlassCard from '../../../components/ui/GlassCard';

export default function SavedJobsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { savedJobs, isLoading } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(getSavedJobs());
  }, [dispatch]);

  const formatSalary = (min, max, currency = 'USD') => {
    if (!min && !max) return 'Not specified';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    });
    if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`;
    if (min) return `From ${formatter.format(min)}`;
    return `Up to ${formatter.format(max)}`;
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    return 'Just now';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Jobs</h1>
          <p className="text-gray-600">Jobs you've bookmarked for later</p>
        </div>

        {isLoading ? (
          <GlassCard className="text-center py-20">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading saved jobs...</p>
          </GlassCard>
        ) : savedJobs.length === 0 ? (
          <GlassCard className="text-center py-20">
            <BookmarkIcon className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No saved jobs yet</h3>
            <p className="text-gray-600 mb-6">Start saving jobs to review them later</p>
            <button
              onClick={() => navigate('/jobs')}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Browse Jobs
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((savedJob, index) => {
              const job = savedJob.job;
              return (
                <AnimatedCard key={savedJob._id} delay={index * 50} animation="fadeUp">
                  <GlassCard
                    onClick={() => navigate(`/jobs/${job._id}`)}
                    className="p-6 cursor-pointer transition hover:shadow-lg hover:scale-[1.01]"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition">
                          {job.title}
                        </h3>
                        <p className="text-blue-600 font-semibold flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          {job.company?.name || 'Company Name'}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Unsave job logic
                        }}
                        className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                      >
                        <BookmarkSolidIcon className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
                        <MapPinIcon className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">{job.location?.city}, {job.location?.state}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 bg-purple-50 px-3 py-2 rounded-lg">
                        <BriefcaseIcon className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium capitalize">{job.jobType}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 bg-green-50 px-3 py-2 rounded-lg">
                        <CurrencyDollarIcon className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">{formatSalary(job.salary?.min, job.salary?.max, job.salary?.currency)}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.slice(0, 5).map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 5 && (
                          <span className="text-gray-500 px-3 py-1 text-sm">+{job.skills.length - 5} more</span>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <ClockIcon className="w-4 h-4" />
                        <span>Saved {timeAgo(savedJob.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-600 font-semibold group-hover:gap-2 transition-all">
                        <span>View Details</span>
                        <ArrowRightIcon className="w-4 h-4" />
                      </div>
                    </div>
                  </GlassCard>
                </AnimatedCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
