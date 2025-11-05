import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  HeartIcon,
  ClockIcon,
  UserGroupIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { searchJobs } from '../../../store/slices/jobSlice';
import AnimatedCard from '../../../components/animations/AnimatedCard';
import GlassCard from '../../../components/ui/GlassCard';
import FloatingElements from '../../../components/animations/FloatingElements';

export default function JobSearchPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { jobs, pagination, isLoading } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    location: searchParams.get('location') || '',
    jobType: searchParams.get('jobType') || '',
    experienceLevel: searchParams.get('experienceLevel') || '',
    minSalary: searchParams.get('minSalary') || '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set());

  useEffect(() => {
    const params = {
      page: searchParams.get('page') || 1,
      limit: 20,
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      ),
    };
    dispatch(searchJobs(params));
  }, [dispatch, searchParams, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    navigate(`/jobs?${params.toString()}`);
  };

  const toggleSaveJob = (e, jobId) => {
    e.stopPropagation();
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      <FloatingElements variant="dots" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 animate-fade-in">
            Discover Your Next Opportunity
          </h1>
          <p className="text-gray-600 text-lg animate-fade-in-up">
            Browse thousands of jobs from top companies
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2 bg-white px-4 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
            <span className="font-medium">
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </span>
          </button>
        </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <GlassCard className="p-6 sticky top-24 animate-slide-in-left">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Filters
              </h2>
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Keywords */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MagnifyingGlassIcon className="w-4 h-4 text-blue-500" />
                  Keywords
                </label>
                <input
                  type="text"
                  value={filters.q}
                  onChange={(e) => handleFilterChange('q', e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-300"
                />
              </div>

              {/* Location */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4 text-purple-500" />
                  Location
                </label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder="e.g. San Francisco"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-purple-300"
                />
              </div>

              {/* Job Type */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <BriefcaseIcon className="w-4 h-4 text-pink-500" />
                  Job Type
                </label>
                <select
                  value={filters.jobType}
                  onChange={(e) => handleFilterChange('jobType', e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all hover:border-pink-300 appearance-none bg-white"
                >
                  <option value="">All Types</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              {/* Experience Level */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <UserGroupIcon className="w-4 h-4 text-orange-500" />
                  Experience Level
                </label>
                <select
                  value={filters.experienceLevel}
                  onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all hover:border-orange-300 appearance-none bg-white"
                >
                  <option value="">All Levels</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="lead">Lead</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              {/* Min Salary */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <CurrencyDollarIcon className="w-4 h-4 text-green-500" />
                  Min Salary
                </label>
                <input
                  type="number"
                  value={filters.minSalary}
                  onChange={(e) => handleFilterChange('minSalary', e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all hover:border-green-300"
                />
              </div>

              {/* Apply Button */}
              <button
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] hover:shadow-lg font-semibold"
              >
                Apply Filters
              </button>

              {/* Clear Button */}
              <button
                onClick={() => {
                  setFilters({
                    q: '',
                    location: '',
                    jobType: '',
                    experienceLevel: '',
                    minSalary: '',
                  });
                  navigate('/jobs');
                }}
                className="w-full text-gray-600 py-3 rounded-xl hover:bg-gray-100 transition-all font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Job Listings */}
        <div className="lg:col-span-3">
          {/* Results Header */}
          <GlassCard className="p-4 mb-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <p className="text-gray-700 font-medium">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {pagination.total}
                </span>
                {' '}jobs found
              </p>
              {/* Future: Add sorting options here */}
            </div>
          </GlassCard>

          {isLoading ? (
            <GlassCard className="text-center py-20">
              <div className="relative inline-flex">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin animation-delay-2000"></div>
              </div>
              <p className="mt-6 text-gray-600 font-medium">Discovering amazing opportunities...</p>
            </GlassCard>
          ) : jobs.length === 0 ? (
            <GlassCard className="text-center py-20">
              <div className="max-w-md mx-auto">
                <MagnifyingGlassIcon className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No jobs found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more results</p>
              </div>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {jobs.map((job, index) => (
                <AnimatedCard
                  key={job._id}
                  delay={index * 50}
                  animation="fadeUp"
                  className="group"
                >
                  <GlassCard
                    onClick={() => navigate(`/jobs/${job._id}`)}
                    className="p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-blue-600 font-semibold flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          {job.company?.name || 'Company Name'}
                        </p>
                      </div>
                      {user && (
                        <button
                          onClick={(e) => toggleSaveJob(e, job._id)}
                          className={`p-2 rounded-full transition-all ${
                            savedJobs.has(job._id)
                              ? 'bg-red-100 text-red-500'
                              : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500'
                          }`}
                        >
                          {savedJobs.has(job._id) ? (
                            <HeartSolidIcon className="w-6 h-6" />
                          ) : (
                            <HeartIcon className="w-6 h-6" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Job Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
                        <MapPinIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="text-sm font-medium truncate">
                          {job.location?.city}, {job.location?.state}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 bg-purple-50 px-3 py-2 rounded-lg">
                        <BriefcaseIcon className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <span className="text-sm font-medium capitalize">
                          {job.jobType}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 bg-green-50 px-3 py-2 rounded-lg">
                        <CurrencyDollarIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm font-medium truncate">
                          {formatSalary(job.salary?.min, job.salary?.max, job.salary?.currency)}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-4 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Skills */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.slice(0, 5).map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100 hover:border-blue-300 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 5 && (
                          <span className="text-gray-500 px-3 py-1 text-sm font-medium">
                            +{job.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <ClockIcon className="w-4 h-4" />
                        <span>{timeAgo(job.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <UserGroupIcon className="w-4 h-4" />
                        <span className="font-medium">{job.applicationsCount || 0} applicants</span>
                      </div>
                    </div>
                  </GlassCard>
                </AnimatedCard>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2 flex-wrap">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set('page', page);
                    navigate(`/jobs?${params.toString()}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`min-w-[44px] h-11 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                    page === pagination.page
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
