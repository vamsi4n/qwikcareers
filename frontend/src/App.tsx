import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import './index.css';

// Layout
import MainLayout from './shared/components/layout/MainLayout';
import AuthLayout from './shared/components/layout/AuthLayout';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import NotFoundPage from './pages/NotFoundPage';

// Auth Pages
import LoginPage from './modules/auth/pages/LoginPage';
import RegisterPage from './modules/auth/pages/RegisterPage';
import ForgotPasswordPage from './modules/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from './modules/auth/pages/ResetPasswordPage';
import VerifyEmailPage from './modules/auth/pages/VerifyEmailPage';

// Job Pages
import JobSearchPage from './modules/jobs/pages/JobSearchPage';
import JobDetailsPage from './modules/jobs/pages/JobDetailsPage';
import SavedJobsPage from './modules/jobs/pages/SavedJobsPage';
import JobAlertsPage from './modules/jobs/pages/JobAlertsPage';
import RecommendedJobsPage from './modules/jobs/pages/RecommendedJobsPage';

// JobSeeker Pages
import JobSeekerDashboardPage from './modules/jobseeker/pages/DashboardPage';
import ProfilePage from './modules/jobseeker/pages/ProfilePage';
import EditProfilePage from './modules/jobseeker/pages/EditProfilePage';
import PreferencesPage from './modules/jobseeker/pages/PreferencesPage';

// Application Pages
import MyApplicationsPage from './modules/applications/pages/MyApplicationsPage';
import ApplyJobPage from './modules/applications/pages/ApplyJobPage';
import ApplicationDetailsPage from './modules/applications/pages/ApplicationDetailsPage';

// Employer Pages
import EmployerDashboardPage from './modules/employer/pages/DashboardPage';
import PostJobPage from './modules/employer/pages/PostJobPage';
import ManageJobsPage from './modules/employer/pages/ManageJobsPage';
import ApplicantsPage from './modules/employer/pages/ApplicantsPage';
import CandidateDatabasePage from './modules/employer/pages/CandidateDatabasePage';
import EmployerSettingsPage from './modules/employer/pages/SettingsPage';
import EmployerAnalyticsPage from './modules/employer/pages/AnalyticsPage';

// Company Pages
import CompaniesPage from './modules/companies/pages/CompaniesPage';
import CompanyProfilePage from './modules/companies/pages/CompanyProfilePage';
import FollowedCompaniesPage from './modules/companies/pages/FollowedCompaniesPage';

// Review Pages
import CompanyReviewsPage from './modules/reviews/pages/CompanyReviewsPage';
import WriteReviewPage from './modules/reviews/pages/WriteReviewPage';
import SalaryInsightsPage from './modules/reviews/pages/SalaryInsightsPage';

// Messaging & Notifications
import MessagesPage from './modules/messaging/pages/MessagesPage';
import NotificationsPage from './modules/notifications/pages/NotificationsPage';
import NotificationSettingsPage from './modules/notifications/pages/NotificationSettingsPage';

// Protected Route Component
import ProtectedRoute from './shared/components/common/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes with Main Layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />

            {/* Jobs - Public */}
            <Route path="/jobs" element={<JobSearchPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />

            {/* Companies - Public */}
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/companies/:id" element={<CompanyProfilePage />} />

            {/* Reviews - Public */}
            <Route path="/companies/:id/reviews" element={<CompanyReviewsPage />} />
            <Route path="/salary-insights" element={<SalaryInsightsPage />} />
          </Route>

          {/* Auth Routes with Auth Layout */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
          </Route>

          {/* Protected Routes - JobSeeker */}
          <Route element={<ProtectedRoute allowedRoles={['jobseeker']} />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<JobSeekerDashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/edit" element={<EditProfilePage />} />
              <Route path="/preferences" element={<PreferencesPage />} />
              <Route path="/applications" element={<MyApplicationsPage />} />
              <Route path="/applications/:id" element={<ApplicationDetailsPage />} />
              <Route path="/jobs/:id/apply" element={<ApplyJobPage />} />
              <Route path="/saved-jobs" element={<SavedJobsPage />} />
              <Route path="/job-alerts" element={<JobAlertsPage />} />
              <Route path="/recommended-jobs" element={<RecommendedJobsPage />} />
              <Route path="/followed-companies" element={<FollowedCompaniesPage />} />
              <Route path="/reviews/write" element={<WriteReviewPage />} />
            </Route>
          </Route>

          {/* Protected Routes - Employer */}
          <Route element={<ProtectedRoute allowedRoles={['employer']} />}>
            <Route element={<MainLayout />}>
              <Route path="/employer/dashboard" element={<EmployerDashboardPage />} />
              <Route path="/employer/jobs/post" element={<PostJobPage />} />
              <Route path="/employer/jobs" element={<ManageJobsPage />} />
              <Route path="/employer/jobs/:id/applicants" element={<ApplicantsPage />} />
              <Route path="/employer/candidates" element={<CandidateDatabasePage />} />
              <Route path="/employer/settings" element={<EmployerSettingsPage />} />
              <Route path="/employer/analytics" element={<EmployerAnalyticsPage />} />
            </Route>
          </Route>

          {/* Protected Routes - All Authenticated Users */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/notifications/settings" element={<NotificationSettingsPage />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
