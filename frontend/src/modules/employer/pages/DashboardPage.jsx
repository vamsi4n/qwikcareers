import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  BriefcaseIcon,
  UserGroupIcon,
  UserPlusIcon,
  CalendarIcon,
  PlusCircleIcon,
  ChartBarIcon,
  Cog8ToothIcon,
  ArrowRightIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import AnimatedCard from '../../../components/animations/AnimatedCard';
import GlassCard from '../../../components/ui/GlassCard';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const stats = [
    {
      label: 'Active Jobs',
      value: 12,
      change: '+2 this month',
      icon: BriefcaseIcon,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      label: 'Total Applications',
      value: 248,
      change: '+45 this week',
      icon: UserGroupIcon,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      label: 'New Applicants',
      value: 32,
      change: 'Since yesterday',
      icon: UserPlusIcon,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      label: 'Interviews Scheduled',
      value: 8,
      change: 'This week',
      icon: CalendarIcon,
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600'
    },
  ];

  const recentJobs = [
    { id: 1, title: 'Senior React Developer', applications: 45, status: 'active', postedDays: 3 },
    { id: 2, title: 'Product Manager', applications: 67, status: 'active', postedDays: 7 },
    { id: 3, title: 'UX Designer', applications: 32, status: 'active', postedDays: 12 },
    { id: 4, title: 'Backend Engineer', applications: 28, status: 'closed', postedDays: 20 },
  ];

  const recentApplicants = [
    { id: 1, name: 'John Doe', position: 'Senior React Developer', status: 'reviewing', date: '2 hours ago' },
    { id: 2, name: 'Jane Smith', position: 'Product Manager', status: 'shortlisted', date: '5 hours ago' },
    { id: 3, name: 'Mike Johnson', position: 'UX Designer', status: 'pending', date: '1 day ago' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'closed':
        return 'bg-gray-100 text-gray-700';
      case 'shortlisted':
        return 'bg-green-100 text-green-700';
      case 'reviewing':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Employer Dashboard 💼</h1>
          <p className="text-gray-600 mt-2">Manage your job postings and candidates</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <AnimatedCard key={index} animation="fadeUp" delay={index * 50}>
                <GlassCard className="p-6 transition hover:shadow-lg hover:scale-[1.01]">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-4 ${stat.bgColor} rounded-xl`}>
                      <Icon className={`w-8 h-8 ${stat.textColor}`} />
                    </div>
                    <span className="text-xs text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-lg">
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                </GlassCard>
              </AnimatedCard>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Job Postings */}
          <AnimatedCard animation="fadeUp" delay={200}>
            <GlassCard className="overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-blue-50">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Recent Job Postings</h2>
                  <button
                    onClick={() => navigate('/employer/jobs')}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-semibold transition"
                  >
                    View All
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {recentJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => navigate(`/employer/jobs/${job.id}`)}
                    className="p-4 hover:bg-blue-50 cursor-pointer transition group"
                  >
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition">
                          {job.title}
                        </h3>
                        <p className="text-sm text-blue-600 font-medium">
                          {job.applications} applications
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize whitespace-nowrap ${getStatusColor(job.status)}`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <ClockIcon className="w-4 h-4" />
                      <span>Posted {job.postedDays} days ago</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </AnimatedCard>

          {/* Recent Applicants */}
          <AnimatedCard animation="fadeUp" delay={250}>
            <GlassCard className="overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-purple-50">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Recent Applicants</h2>
                  <button
                    onClick={() => navigate('/employer/applicants')}
                    className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-semibold transition"
                  >
                    View All
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {recentApplicants.map((applicant) => (
                  <div
                    key={applicant.id}
                    onClick={() => navigate(`/employer/applicants/${applicant.id}`)}
                    className="p-4 hover:bg-purple-50 cursor-pointer transition group"
                  >
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition">
                          {applicant.name}
                        </h3>
                        <p className="text-sm text-purple-600 font-medium">
                          {applicant.position}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize whitespace-nowrap ${getStatusColor(applicant.status)}`}
                      >
                        {applicant.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <ClockIcon className="w-4 h-4" />
                      <span>{applicant.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </AnimatedCard>
        </div>

        {/* Quick Actions */}
        <AnimatedCard animation="fadeUp" delay={300} className="mt-8">
          <GlassCard className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/employer/jobs/post')}
                className="bg-white p-5 rounded-xl hover:shadow-lg transition hover:scale-[1.02] text-center group border-2 border-transparent hover:border-blue-200"
              >
                <PlusCircleIcon className="w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-900">Post New Job</span>
              </button>
              <button
                onClick={() => navigate('/employer/applicants')}
                className="bg-white p-5 rounded-xl hover:shadow-lg transition hover:scale-[1.02] text-center group border-2 border-transparent hover:border-purple-200"
              >
                <UserGroupIcon className="w-8 h-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-900">View Applicants</span>
              </button>
              <button
                onClick={() => navigate('/employer/jobs')}
                className="bg-white p-5 rounded-xl hover:shadow-lg transition hover:scale-[1.02] text-center group border-2 border-transparent hover:border-green-200"
              >
                <Cog8ToothIcon className="w-8 h-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-900">Manage Jobs</span>
              </button>
              <button
                onClick={() => navigate('/employer/analytics')}
                className="bg-white p-5 rounded-xl hover:shadow-lg transition hover:scale-[1.02] text-center group border-2 border-transparent hover:border-orange-200"
              >
                <ChartBarIcon className="w-8 h-8 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition" />
                <span className="text-sm font-semibold text-gray-900">View Analytics</span>
              </button>
            </div>
          </GlassCard>
        </AnimatedCard>
      </div>
    </div>
  );
}
