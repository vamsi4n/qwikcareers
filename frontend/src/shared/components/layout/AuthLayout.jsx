import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BriefcaseIcon, SparklesIcon } from '@heroicons/react/24/outline';
import GlassCard from '../../../components/ui/GlassCard';
import FloatingElements from '../../../components/animations/FloatingElements';

export default function AuthLayout() {
  const { user } = useSelector((state) => state.auth);

  // Redirect to dashboard if already logged in
  if (user) {
    return <Navigate to={user.role === 'employer' ? '/employer/dashboard' : '/dashboard'} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 bg-size-300% animate-gradient flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <FloatingElements variant="circles" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Logo and Header */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-2xl mb-6 animate-bounce-in">
            <BriefcaseIcon className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-3 flex items-center justify-center gap-3">
            <span>QwikCareers</span>
            <SparklesIcon className="w-8 h-8 text-yellow-300 animate-pulse" />
          </h1>
          <p className="text-blue-100 text-lg font-medium">
            Your career journey starts here
          </p>
        </div>

        {/* Form Card */}
        <div className="animate-scale-in">
          <GlassCard className="py-10 px-6 sm:px-12 shadow-2xl">
            <Outlet />
          </GlassCard>

          {/* Decorative Elements */}
          <div className="mt-6 text-center">
            <p className="text-white/80 text-sm font-medium">
              Join thousands of professionals finding their dream jobs
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
    </div>
  );
}
