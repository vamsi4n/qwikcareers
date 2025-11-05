import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircleIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserGroupIcon,
  ChartBarIcon,
  XMarkIcon,
  CheckIcon,
  BriefcaseIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import AnimatedCard from '../../../components/animations/AnimatedCard';
import GlassCard from '../../../components/ui/GlassCard';

export default function ManageJobsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  // Mock data - replace with actual Redux data
  const jobs = [
    { id: 1, title: 'Senior React Developer', status: 'active', applications: 45, views: 234, postedDate: '2024-01-15' },
    { id: 2, title: 'Product Manager', status: 'active', applications: 67, views: 456, postedDate: '2024-01-10' },
    { id: 3, title: 'UX Designer', status: 'active', applications: 32, views: 178, postedDate: '2024-01-05' },
    { id: 4, title: 'Backend Engineer', status: 'closed', applications: 89, views: 567, postedDate: '2023-12-20' },
    { id: 5, title: 'DevOps Engineer', status: 'draft', applications: 0, views: 0, postedDate: '2024-01-18' },
  ];

  const filteredJobs = jobs.filter((job) => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  const statusCounts = {
    all: jobs.length,
    active: jobs.filter((j) => j.status === 'active').length,
    closed: jobs.filter((j) => j.status === 'closed').length,
    draft: jobs.filter((j) => j.status === 'draft').length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleToggleStatus = (jobId) => {
    // TODO: Dispatch action to toggle job status
    console.log('Toggle status for job:', jobId);
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      // TODO: Dispatch action to delete job
      console.log('Delete job:', jobId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
            <p className="text-gray-600 mt-1">View and manage all your job postings</p>
          </div>
          <button
            onClick={() => navigate('/employer/jobs/post')}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Post New Job
          </button>
        </div>

        {/* Status Filters */}
        <AnimatedCard animation="fadeUp" delay={0}>
          <GlassCard className="mb-6 p-4">
            <div className="flex flex-wrap gap-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-semibold transition capitalize ${
                    filter === status
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                  }`}
                >
                  {status} ({count})
                </button>
              ))}
            </div>
          </GlassCard>
        </AnimatedCard>

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <AnimatedCard animation="fadeUp" delay={50}>
              <GlassCard className="text-center py-20">
                <BriefcaseIcon className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-6">No jobs found with status "{filter}"</p>
                <button
                  onClick={() => navigate('/employer/jobs/post')}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  <PlusCircleIcon className="w-5 h-5" />
                  Post Your First Job
                </button>
              </GlassCard>
            </AnimatedCard>
          ) : (
            filteredJobs.map((job, index) => (
              <AnimatedCard key={job.id} animation="fadeUp" delay={50 + index * 50}>
                <GlassCard className="p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize border-2 ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Posted on {new Date(job.postedDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/employer/jobs/${job.id}/edit`)}
                        className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition"
                        title="Edit Job"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition"
                        title="Delete Job"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-100">
                      <div className="flex items-center gap-2 mb-1">
                        <UserGroupIcon className="w-4 h-4 text-blue-600" />
                        <p className="text-sm font-medium text-blue-900">Applications</p>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{job.applications}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-100">
                      <div className="flex items-center gap-2 mb-1">
                        <EyeIcon className="w-4 h-4 text-purple-600" />
                        <p className="text-sm font-medium text-purple-900">Views</p>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">{job.views}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border-2 border-green-100">
                      <div className="flex items-center gap-2 mb-1">
                        <ChartBarIcon className="w-4 h-4 text-green-600" />
                        <p className="text-sm font-medium text-green-900">Conversion</p>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {job.views > 0 ? ((job.applications / job.views) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition font-semibold"
                    >
                      <EyeIcon className="w-4 h-4" />
                      View Job
                    </button>
                    <button
                      onClick={() => navigate(`/employer/jobs/${job.id}/applicants`)}
                      className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 py-2.5 rounded-lg hover:bg-blue-50 transition font-semibold"
                    >
                      <UserGroupIcon className="w-4 h-4" />
                      Applicants ({job.applications})
                    </button>
                    {job.status === 'active' ? (
                      <button
                        onClick={() => handleToggleStatus(job.id)}
                        className="inline-flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition font-semibold"
                      >
                        <XMarkIcon className="w-4 h-4" />
                        Close
                      </button>
                    ) : job.status === 'closed' ? (
                      <button
                        onClick={() => handleToggleStatus(job.id)}
                        className="inline-flex items-center gap-2 border-2 border-green-600 text-green-600 px-6 py-2.5 rounded-lg hover:bg-green-50 transition font-semibold"
                      >
                        <CheckIcon className="w-4 h-4" />
                        Reopen
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(job.id)}
                        className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-6 py-2.5 rounded-lg hover:bg-blue-50 transition font-semibold"
                      >
                        <CheckIcon className="w-4 h-4" />
                        Publish
                      </button>
                    )}
                  </div>
                </GlassCard>
              </AnimatedCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
