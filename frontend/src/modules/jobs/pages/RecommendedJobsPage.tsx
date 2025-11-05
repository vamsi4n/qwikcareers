import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  SparklesIcon,
  CheckCircleIcon,
  MapPinIcon,
  BriefcaseIcon,
  ClockIcon,
  BookmarkIcon,
  ArrowRightIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { getRecommendedJobs } from '../../../store/slices/jobSlice';
import { saveJob } from '../../../store/slices/jobSlice';
import AnimatedCard from '../../../components/animations/AnimatedCard';
import GlassCard from '../../../components/ui/GlassCard';

export default function RecommendedJobsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { recommendedJobs, isLoading } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getRecommendedJobs());
  }, [dispatch]);

  const handleSaveJob = (jobId) => {
    dispatch(saveJob(jobId));
  };

  const getMatchScore = (job) => {
    // This would be calculated on the backend based on user profile match
    return job.matchScore || Math.floor(Math.random() * 30) + 70; // Mock: 70-100%
  };

  const getMatchReasons = (job) => {
    // This would come from backend algorithm
    return job.matchReasons || [
      'Skills match',
      'Location preference',
      'Salary range',
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Recommended Jobs</h1>
            <SparklesIcon className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600">
            Jobs handpicked for you based on your profile, skills, and preferences
          </p>
        </div>

        {/* Profile Completion Banner */}
        {user && (!user.skills || user.skills.length === 0) && (
          <AnimatedCard animation="fadeUp" className="mb-6">
            <GlassCard className="p-6 border-l-4 border-blue-600">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <UserIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Get Better Recommendations
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Complete your profile to help us find more relevant job opportunities for you
                  </p>
                  <button
                    onClick={() => navigate('/profile')}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Complete Profile
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </GlassCard>
          </AnimatedCard>
        )}

        {/* Jobs List */}
        {isLoading ? (
          <GlassCard className="text-center py-20">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Finding the best jobs for you...</p>
          </GlassCard>
        ) : recommendedJobs.length === 0 ? (
          <GlassCard className="text-center py-20">
            <BriefcaseIcon className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No recommendations yet</h3>
            <p className="text-gray-600 mb-6">
              Complete your profile to get personalized job recommendations
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Complete Profile
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </GlassCard>
        ) : (
          <div className="space-y-4">
          {recommendedJobs.map((job, index) => {
            const matchScore = getMatchScore(job);
            const matchReasons = getMatchReasons(job);

            return (
              <AnimatedCard key={job._id} delay={index * 50} animation="fadeUp">
                <GlassCard className="p-6 border-l-4 border-blue-600 transition hover:shadow-lg hover:scale-[1.01]">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 cursor-pointer" onClick={() => navigate(`/jobs/${job._id}`)}>
                      <div className="flex items-center gap-3 mb-3">
                        <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition">
                          {job.title}
                        </h2>
                        <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          <CheckCircleIcon className="w-4 h-4" />
                          {matchScore}% Match
                        </span>
                      </div>
                      <p className="text-blue-600 font-semibold mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        {job.company?.name}
                      </p>

                      <div className="flex flex-wrap gap-3 mb-4">
                        <div className="flex items-center gap-2 text-gray-600 bg-blue-50 px-3 py-1.5 rounded-lg">
                          <MapPinIcon className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">
                            {job.location?.city}, {job.location?.state}
                            {job.location?.isRemote && ' (Remote)'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 bg-purple-50 px-3 py-1.5 rounded-lg">
                          <BriefcaseIcon className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-medium capitalize">{job.jobType}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 bg-orange-50 px-3 py-1.5 rounded-lg">
                          <ClockIcon className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-medium capitalize">{job.experienceLevel}</span>
                        </div>
                      </div>

                      {job.salary && (
                        <p className="text-gray-700 font-semibold mb-4">
                          ${job.salary.min?.toLocaleString()} - ${job.salary.max?.toLocaleString()} / year
                        </p>
                      )}

                      {/* Match Reasons */}
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Why we recommend this:</p>
                        <div className="flex flex-wrap gap-2">
                          {matchReasons.map((reason, idx) => (
                            <span key={idx} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                              <CheckCircleIcon className="w-3 h-3" />
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveJob(job._id);
                      }}
                      className="ml-4 p-2 rounded-full bg-gray-100 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      <BookmarkIcon className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Skills Match */}
                  {job.skills && job.skills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.slice(0, 6).map((skill, idx) => (
                          <span
                            key={idx}
                            className={`px-3 py-1 rounded-lg text-sm font-medium ${
                              user?.skills?.includes(skill)
                                ? 'bg-green-100 text-green-700 border-2 border-green-300'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {skill}
                            {user?.skills?.includes(skill) && ' ✓'}
                          </span>
                        ))}
                        {job.skills.length > 6 && (
                          <span className="text-sm text-gray-500 self-center">+{job.skills.length - 6} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => navigate(`/jobs/${job._id}`)}
                      className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => navigate(`/jobs/${job._id}/apply`)}
                      className="flex-1 border-2 border-blue-600 text-blue-600 py-2.5 px-4 rounded-lg hover:bg-blue-50 transition font-semibold"
                    >
                      Apply Now
                    </button>
                  </div>
                </GlassCard>
              </AnimatedCard>
            );
          })}
        </div>
      )}

      {/* Tips Section */}
      {recommendedJobs.length > 0 && (
        <AnimatedCard animation="fadeUp" delay={100} className="mt-8">
          <GlassCard className="p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-blue-600" />
              Tips for better recommendations
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Keep your skills up to date on your profile</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Set your job preferences (location, salary, job type)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Save jobs you're interested in to improve recommendations</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Create job alerts for positions you're actively seeking</span>
              </li>
            </ul>
          </GlassCard>
        </AnimatedCard>
      )}
      </div>
    </div>
  );
}
