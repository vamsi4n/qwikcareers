import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRecommendedJobs } from '../../../store/slices/jobSlice';
import { saveJob } from '../../../store/slices/jobSlice';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Recommended Jobs</h1>
        <p className="text-gray-600 mt-2">
          Jobs handpicked for you based on your profile, skills, and preferences
        </p>
      </div>

      {/* Profile Completion Banner */}
      {user && (!user.skills || user.skills.length === 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-1">
                Get Better Recommendations
              </h3>
              <p className="text-blue-800 mb-3">
                Complete your profile to help us find more relevant job opportunities for you
              </p>
              <button
                onClick={() => navigate('/profile')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium text-sm"
              >
                Complete Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Jobs List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Finding the best jobs for you...</p>
        </div>
      ) : recommendedJobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No recommendations yet</h3>
          <p className="text-gray-600 mb-4">
            Complete your profile to get personalized job recommendations
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-medium"
          >
            Complete Profile
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {recommendedJobs.map((job) => {
            const matchScore = getMatchScore(job);
            const matchReasons = getMatchReasons(job);

            return (
              <div
                key={job._id}
                className="bg-white rounded-lg shadow hover:shadow-md transition p-6 border-l-4 border-blue-600"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2
                        className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                        onClick={() => navigate(`/jobs/${job._id}`)}
                      >
                        {job.title}
                      </h2>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {matchScore}% Match
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{job.company?.name}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {job.location?.city}, {job.location?.state}
                        {job.location?.isRemote && ' (Remote)'}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {job.jobType}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {job.experienceLevel}
                      </span>
                    </div>

                    {job.salary && (
                      <p className="text-gray-700 font-medium mb-3">
                        ${job.salary.min?.toLocaleString()} - ${job.salary.max?.toLocaleString()} / year
                      </p>
                    )}

                    {/* Match Reasons */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Why we recommend this:</p>
                      <div className="flex flex-wrap gap-2">
                        {matchReasons.map((reason, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium flex items-center"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
                  </div>

                  <button
                    onClick={() => handleSaveJob(job._id)}
                    className="ml-4 text-gray-400 hover:text-blue-600 transition"
                    title="Save job"
                  >
                    <svg className="w-6 h-6" fill={job.isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>

                {/* Skills Match */}
                {job.skills && job.skills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.slice(0, 6).map((skill, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user?.skills?.includes(skill)
                              ? 'bg-green-100 text-green-700 border border-green-300'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {skill}
                          {user?.skills?.includes(skill) && ' ✓'}
                        </span>
                      ))}
                      {job.skills.length > 6 && (
                        <span className="text-xs text-gray-600 self-center">
                          +{job.skills.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => navigate(`/jobs/${job._id}`)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => navigate(`/jobs/${job._id}/apply`)}
                    className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 transition font-medium"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tips Section */}
      {recommendedJobs.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Tips for better recommendations</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Keep your skills up to date on your profile
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Set your job preferences (location, salary, job type)
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Save jobs you're interested in to improve recommendations
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Create job alerts for positions you're actively seeking
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
