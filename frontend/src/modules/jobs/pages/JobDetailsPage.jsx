import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getJobById } from '../../../store/slices/jobSlice';
import { submitApplication } from '../../../store/slices/applicationSlice';
import { saveJob } from '../../../store/slices/jobSlice';

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { job, isLoading } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);
  const [showApplyModal, setShowApplyModal] = useState(false);
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
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Job not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to jobs
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-8">
            {/* Job Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <button
                  onClick={() => navigate(`/companies/${job.company?._id}`)}
                  className="text-blue-600 font-medium hover:underline"
                >
                  {job.company?.name}
                </button>
                <span>•</span>
                <span>{job.location?.city}, {job.location?.state}</span>
                <span>•</span>
                <span>{timeAgo(job.createdAt)}</span>
              </div>
            </div>

            {/* Job Meta */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <div className="text-sm text-gray-500">Job Type</div>
                <div className="font-medium capitalize">{job.jobType}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Experience</div>
                <div className="font-medium capitalize">{job.experienceLevel}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Salary</div>
                <div className="font-medium">{formatSalary(job.salary?.min, job.salary?.max, job.salary?.currency)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Applicants</div>
                <div className="font-medium">{job.applicationsCount || 0}</div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Job Description</h2>
              <div className="text-gray-700 whitespace-pre-line">{job.description}</div>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Requirements</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Responsibilities</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Benefits</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {job.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-24 space-y-4">
            {user?.role === 'jobseeker' && (
              <>
                <button
                  onClick={handleApply}
                  className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition font-semibold"
                >
                  Apply Now
                </button>
                <button
                  onClick={handleSaveJob}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-50 transition font-semibold"
                >
                  Save Job
                </button>
              </>
            )}

            {!user && (
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition font-semibold"
              >
                Sign in to Apply
              </button>
            )}

            {/* Company Info */}
            <div className="pt-6 border-t">
              <h3 className="font-semibold mb-3">About the Company</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Company</div>
                  <div className="font-medium">{job.company?.name}</div>
                </div>
                {job.company?.size && (
                  <div>
                    <div className="text-sm text-gray-500">Company Size</div>
                    <div className="font-medium">{job.company.size}</div>
                  </div>
                )}
                {job.company?.industry && (
                  <div>
                    <div className="text-sm text-gray-500">Industry</div>
                    <div className="font-medium">{job.company.industry}</div>
                  </div>
                )}
                <button
                  onClick={() => navigate(`/companies/${job.company?._id}`)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View Company Profile →
                </button>
              </div>
            </div>

            {/* Location */}
            <div className="pt-6 border-t">
              <h3 className="font-semibold mb-3">Location</h3>
              <div className="text-gray-700">
                {job.location?.address && <div>{job.location.address}</div>}
                <div>
                  {job.location?.city}, {job.location?.state} {job.location?.zipCode}
                </div>
                {job.location?.country && <div>{job.location.country}</div>}
              </div>
              {job.remoteAllowed && (
                <div className="mt-2 text-green-600 font-medium">Remote work available</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Apply for {job.title}</h2>
              <button onClick={() => setShowApplyModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter
                </label>
                <textarea
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us why you're a great fit for this role..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume URL (optional)
                </label>
                <input
                  type="url"
                  value={applicationData.resume}
                  onChange={(e) => setApplicationData({ ...applicationData, resume: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
