import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  BookmarkIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { getJobById } from '../../../store/slices/jobSlice';
import { submitApplication } from '../../../store/slices/applicationSlice';
import { saveJob } from '../../../store/slices/jobSlice';
import AnimatedCard from '../../../components/animations/AnimatedCard';
import GlassCard from '../../../components/ui/GlassCard';
import FloatingElements from '../../../components/animations/FloatingElements';

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { job, isLoading } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: '',
  });

  useEffect(() => {
    dispatch(getJobById(id));
  }, [dispatch, id]);

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

  const handleApply = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowApplyModal(true);
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    dispatch(submitApplication({ job: id, ...applicationData }));
    setShowApplyModal(false);
  };

  const handleSaveJob = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(saveJob(id));
    setIsSaved(!isSaved);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <GlassCard className="text-center py-20 px-12">
          <div className="relative inline-flex">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-purple-600 rounded-full animate-spin animation-delay-2000"></div>
          </div>
          <p className="mt-6 text-gray-700 font-medium text-lg">Loading job details...</p>
        </GlassCard>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <GlassCard className="text-center py-20 px-12">
          <BriefcaseIcon className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist</p>
          <button
            onClick={() => navigate('/jobs')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 font-semibold"
          >
            Browse Jobs
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      <FloatingElements variant="circles" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-700 hover:text-blue-600 mb-6 transition-all animate-fade-in"
        >
          <div className="p-2 rounded-lg bg-white group-hover:bg-blue-50 transition-all shadow-sm group-hover:shadow-md">
            <ArrowLeftIcon className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to jobs</span>
        </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header Card */}
          <AnimatedCard animation="fadeUp">
            <GlassCard className="p-8">
              {/* Job Title */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-3">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight">
                    {job.title}
                  </h1>
                  {job.featured && (
                    <span className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      <SparklesIcon className="w-4 h-4" />
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <button
                    onClick={() => navigate(`/companies/${job.company?._id}`)}
                    className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                  >
                    <BuildingOfficeIcon className="w-5 h-5" />
                    {job.company?.name}
                  </button>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1.5">
                    <MapPinIcon className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">{job.location?.city}, {job.location?.state}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1.5">
                    <ClockIcon className="w-4 h-4 text-orange-500" />
                    <span>{timeAgo(job.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Job Meta Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <BriefcaseIcon className="w-5 h-5" />
                    <div className="text-xs font-semibold uppercase tracking-wide">Job Type</div>
                  </div>
                  <div className="font-bold text-gray-900 capitalize text-lg">{job.jobType}</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 text-purple-600 mb-2">
                    <UserGroupIcon className="w-5 h-5" />
                    <div className="text-xs font-semibold uppercase tracking-wide">Experience</div>
                  </div>
                  <div className="font-bold text-gray-900 capitalize text-lg">{job.experienceLevel}</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <CurrencyDollarIcon className="w-5 h-5" />
                    <div className="text-xs font-semibold uppercase tracking-wide">Salary</div>
                  </div>
                  <div className="font-bold text-gray-900 text-sm leading-tight">
                    {formatSalary(job.salary?.min, job.salary?.max, job.salary?.currency)}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                  <div className="flex items-center gap-2 text-orange-600 mb-2">
                    <UserGroupIcon className="w-5 h-5" />
                    <div className="text-xs font-semibold uppercase tracking-wide">Applicants</div>
                  </div>
                  <div className="font-bold text-gray-900 text-lg">{job.applicationsCount || 0}</div>
                </div>
              </div>
            </GlassCard>
          </AnimatedCard>

          {/* Description */}
          <AnimatedCard animation="fadeUp" delay={100}>
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Job Description
              </h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </GlassCard>
          </AnimatedCard>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <AnimatedCard animation="fadeUp" delay={150}>
              <GlassCard className="p-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Requirements
                </h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </AnimatedCard>
          )}

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <AnimatedCard animation="fadeUp" delay={200}>
              <GlassCard className="p-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Responsibilities
                </h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 leading-relaxed">{resp}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </AnimatedCard>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <AnimatedCard animation="fadeUp" delay={250}>
              <GlassCard className="p-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Benefits
                </h2>
                <ul className="space-y-3">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </AnimatedCard>
          )}

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <AnimatedCard animation="fadeUp" delay={300}>
              <GlassCard className="p-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-3">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 border-blue-200 hover:border-blue-400 hover:shadow-md transition-all"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </AnimatedCard>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Action Buttons */}
          <AnimatedCard animation="fadeLeft">
            <GlassCard className="p-6 sticky top-24 space-y-4">
              {user?.role === 'jobseeker' && (
                <>
                  <button
                    onClick={handleApply}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] hover:shadow-xl font-bold flex items-center justify-center gap-2 group"
                  >
                    <PaperAirplaneIcon className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                    Apply Now
                  </button>
                  <button
                    onClick={handleSaveJob}
                    className={`w-full py-4 rounded-xl transition-all transform hover:scale-[1.02] font-semibold flex items-center justify-center gap-2 ${
                      isSaved
                        ? 'bg-gradient-to-r from-red-50 to-pink-50 text-red-600 border-2 border-red-300 hover:border-red-400'
                        : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    {isSaved ? (
                      <>
                        <BookmarkSolidIcon className="w-5 h-5" />
                        Saved
                      </>
                    ) : (
                      <>
                        <BookmarkIcon className="w-5 h-5" />
                        Save Job
                      </>
                    )}
                  </button>
                </>
              )}

              {!user && (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] hover:shadow-xl font-bold"
                >
                  Sign in to Apply
                </button>
              )}

              {/* Company Info */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <BuildingOfficeIcon className="w-5 h-5 text-blue-500" />
                  About the Company
                </h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl">
                    <div className="text-xs text-gray-600 font-semibold mb-1 uppercase tracking-wide">Company</div>
                    <div className="font-bold text-gray-900">{job.company?.name}</div>
                  </div>
                  {job.company?.size && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
                      <div className="text-xs text-gray-600 font-semibold mb-1 uppercase tracking-wide">Company Size</div>
                      <div className="font-bold text-gray-900">{job.company.size}</div>
                    </div>
                  )}
                  {job.company?.industry && (
                    <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-4 rounded-xl">
                      <div className="text-xs text-gray-600 font-semibold mb-1 uppercase tracking-wide">Industry</div>
                      <div className="font-bold text-gray-900">{job.company.industry}</div>
                    </div>
                  )}
                  <button
                    onClick={() => navigate(`/companies/${job.company?._id}`)}
                    className="w-full text-blue-600 hover:text-blue-700 text-sm font-bold py-3 px-4 rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                  >
                    View Company Profile
                    <ArrowLeftIcon className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>

              {/* Location */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-purple-500" />
                  Location
                </h3>
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-xl space-y-1">
                  {job.location?.address && (
                    <div className="text-gray-700 font-medium">{job.location.address}</div>
                  )}
                  <div className="text-gray-700 font-medium">
                    {job.location?.city}, {job.location?.state} {job.location?.zipCode}
                  </div>
                  {job.location?.country && (
                    <div className="text-gray-700 font-medium">{job.location.country}</div>
                  )}
                  {job.remoteAllowed && (
                    <div className="mt-3 flex items-center gap-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg font-semibold text-sm">
                      <CheckCircleIcon className="w-4 h-4" />
                      Remote work available
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </AnimatedCard>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl transform animate-scale-in">
            <GlassCard className="p-8">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Apply for this Position
                  </h2>
                  <p className="text-gray-600 font-medium">{job.title}</p>
                </div>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitApplication} className="space-y-6">
                {/* Cover Letter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <PaperAirplaneIcon className="w-4 h-4 text-blue-500" />
                    Cover Letter *
                  </label>
                  <textarea
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                    rows={8}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none hover:border-blue-300"
                    placeholder="Tell us why you're a great fit for this role and what makes you excited about this opportunity..."
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Highlight your relevant experience and skills
                  </p>
                </div>

                {/* Resume URL */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-purple-500" />
                    Resume URL (optional)
                  </label>
                  <input
                    type="url"
                    value={applicationData.resume}
                    onChange={(e) => setApplicationData({ ...applicationData, resume: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-purple-300"
                    placeholder="https://yourportfolio.com/resume.pdf"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Link to your resume, portfolio, or LinkedIn profile
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] hover:shadow-lg font-bold flex items-center justify-center gap-2"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                    Submit Application
                  </button>
                </div>
              </form>
            </GlassCard>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
