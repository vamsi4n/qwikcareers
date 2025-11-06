import { useState, useEffect } from 'react';
import {
  Cog6ToothIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  FlagIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  BellIcon,
  GlobeAltIcon,
  LockClosedIcon,
  KeyIcon,
  ServerIcon
} from '@heroicons/react/24/outline';
import AnimatedCard from '../../../shared/components/animations/AnimatedCard';
import GlassCard from '../../../shared/components/ui/GlassCard';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  fetchSystemSettings,
  updateSystemSettings,
  selectSystemSettings,
  selectSettingsLoading
} from '../../../store/slices/adminSlice';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    supportEmail: string;
    contactPhone: string;
    timezone: string;
    language: string;
  };
  email: {
    smtpHost: string;
    smtpPort: string;
    smtpUser: string;
    fromEmail: string;
    fromName: string;
    emailNotifications: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: string;
    passwordMinLength: string;
    apiRateLimit: string;
    ipWhitelist: string;
    maintenanceMode: boolean;
  };
  features: {
    userRegistration: boolean;
    jobPosting: boolean;
    companyReviews: boolean;
    messaging: boolean;
    notifications: boolean;
    analytics: boolean;
  };
}

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const systemSettings = useAppSelector(selectSystemSettings);
  const isLoading = useAppSelector(selectSettingsLoading);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [activeSection, setActiveSection] = useState<'general' | 'email' | 'security' | 'features'>('general');

  // Local state for settings that syncs with Redux
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: 'QwikCareers',
      siteDescription: 'Your gateway to career opportunities',
      supportEmail: 'support@qwikcareers.com',
      contactPhone: '+1 (555) 123-4567',
      timezone: 'America/New_York',
      language: 'en'
    },
    email: {
      smtpHost: 'smtp.qwikcareers.com',
      smtpPort: '587',
      smtpUser: 'noreply@qwikcareers.com',
      fromEmail: 'noreply@qwikcareers.com',
      fromName: 'QwikCareers',
      emailNotifications: true
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: '30',
      passwordMinLength: '8',
      apiRateLimit: '100',
      ipWhitelist: '',
      maintenanceMode: false
    },
    features: {
      userRegistration: true,
      jobPosting: true,
      companyReviews: true,
      messaging: true,
      notifications: true,
      analytics: true
    }
  });

  // Fetch settings on mount
  useEffect(() => {
    dispatch(fetchSystemSettings());
  }, [dispatch]);

  // Update local state when Redux state changes
  useEffect(() => {
    if (systemSettings) {
      setSettings(systemSettings);
    }
  }, [systemSettings]);

  const handleInputChange = (section: keyof SystemSettings, field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    const result = await dispatch(updateSystemSettings(settings));
    if (result.type === updateSystemSettings.fulfilled.type) {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  const sections = [
    {
      id: 'general' as const,
      label: 'General Settings',
      icon: Cog6ToothIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'email' as const,
      label: 'Email Settings',
      icon: EnvelopeIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'security' as const,
      label: 'Security Settings',
      icon: ShieldCheckIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'features' as const,
      label: 'Feature Flags',
      icon: FlagIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
          <p className="text-gray-600">Configure and manage platform settings</p>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 animate-fade-in">
            <GlassCard className="p-4 bg-green-50 border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">Settings saved successfully!</p>
                  <p className="text-sm text-green-700">All changes have been applied.</p>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <GlassCard className="p-4">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    <span className="text-sm">{section.label}</span>
                  </button>
                ))}
              </nav>
            </GlassCard>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* General Settings */}
            {activeSection === 'general' && (
              <AnimatedCard animation="fadeUp" delay={0}>
                <GlassCard className="p-6">
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Cog6ToothIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">General Settings</h2>
                      <p className="text-sm text-gray-600">Basic platform configuration</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <GlobeAltIcon className="w-4 h-4 inline mr-2" />
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={settings.general.siteName}
                        onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter site name"
                      />
                      <p className="text-xs text-gray-500 mt-1">The name displayed across the platform</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Site Description
                      </label>
                      <textarea
                        value={settings.general.siteDescription}
                        onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Enter site description"
                      />
                      <p className="text-xs text-gray-500 mt-1">Brief description for SEO and meta tags</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <EnvelopeIcon className="w-4 h-4 inline mr-2" />
                          Support Email
                        </label>
                        <input
                          type="email"
                          value={settings.general.supportEmail}
                          onChange={(e) => handleInputChange('general', 'supportEmail', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="support@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          value={settings.general.contactPhone}
                          onChange={(e) => handleInputChange('general', 'contactPhone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Timezone
                        </label>
                        <select
                          value={settings.general.timezone}
                          onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="America/New_York">Eastern Time (ET)</option>
                          <option value="America/Chicago">Central Time (CT)</option>
                          <option value="America/Denver">Mountain Time (MT)</option>
                          <option value="America/Los_Angeles">Pacific Time (PT)</option>
                          <option value="UTC">UTC</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Default Language
                        </label>
                        <select
                          value={settings.general.language}
                          onChange={(e) => handleInputChange('general', 'language', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </AnimatedCard>
            )}

            {/* Email Settings */}
            {activeSection === 'email' && (
              <AnimatedCard animation="fadeUp" delay={0}>
                <GlassCard className="p-6">
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <EnvelopeIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Email Settings</h2>
                      <p className="text-sm text-gray-600">Configure email server and notifications</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                      <InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-1">SMTP Configuration</p>
                        <p>Configure your email server settings to enable email notifications and communications.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <ServerIcon className="w-4 h-4 inline mr-2" />
                          SMTP Host
                        </label>
                        <input
                          type="text"
                          value={settings.email.smtpHost}
                          onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="smtp.example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          SMTP Port
                        </label>
                        <input
                          type="text"
                          value={settings.email.smtpPort}
                          onChange={(e) => handleInputChange('email', 'smtpPort', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="587"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        SMTP Username
                      </label>
                      <input
                        type="text"
                        value={settings.email.smtpUser}
                        onChange={(e) => handleInputChange('email', 'smtpUser', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="noreply@example.com"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          From Email Address
                        </label>
                        <input
                          type="email"
                          value={settings.email.fromEmail}
                          onChange={(e) => handleInputChange('email', 'fromEmail', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="noreply@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          From Name
                        </label>
                        <input
                          type="text"
                          value={settings.email.fromName}
                          onChange={(e) => handleInputChange('email', 'fromName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="QwikCareers"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.email.emailNotifications}
                          onChange={(e) => handleInputChange('email', 'emailNotifications', e.target.checked)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <div>
                          <span className="font-semibold text-gray-900 flex items-center gap-2">
                            <BellIcon className="w-4 h-4" />
                            Enable Email Notifications
                          </span>
                          <p className="text-sm text-gray-600">Send automated email notifications to users</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </GlassCard>
              </AnimatedCard>
            )}

            {/* Security Settings */}
            {activeSection === 'security' && (
              <AnimatedCard animation="fadeUp" delay={0}>
                <GlassCard className="p-6">
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <ShieldCheckIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
                      <p className="text-sm text-gray-600">Manage security and authentication</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                      <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-900">
                        <p className="font-semibold mb-1">Security Warning</p>
                        <p>Changes to security settings may affect all users. Please proceed with caution.</p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4">
                      <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                        <input
                          type="checkbox"
                          checked={settings.security.twoFactorAuth}
                          onChange={(e) => handleInputChange('security', 'twoFactorAuth', e.target.checked)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <span className="font-semibold text-gray-900 flex items-center gap-2">
                            <KeyIcon className="w-4 h-4" />
                            Enable Two-Factor Authentication
                          </span>
                          <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                        <input
                          type="checkbox"
                          checked={settings.security.maintenanceMode}
                          onChange={(e) => handleInputChange('security', 'maintenanceMode', e.target.checked)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <span className="font-semibold text-gray-900 flex items-center gap-2">
                            <ExclamationTriangleIcon className="w-4 h-4" />
                            Maintenance Mode
                          </span>
                          <p className="text-sm text-gray-600">Temporarily disable public access to the platform</p>
                        </div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <LockClosedIcon className="w-4 h-4 inline mr-2" />
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          value={settings.security.sessionTimeout}
                          onChange={(e) => handleInputChange('security', 'sessionTimeout', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="30"
                          min="5"
                          max="1440"
                        />
                        <p className="text-xs text-gray-500 mt-1">Auto-logout inactive users</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Password Min Length
                        </label>
                        <input
                          type="number"
                          value={settings.security.passwordMinLength}
                          onChange={(e) => handleInputChange('security', 'passwordMinLength', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="8"
                          min="6"
                          max="32"
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimum password characters</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        API Rate Limit (requests/minute)
                      </label>
                      <input
                        type="number"
                        value={settings.security.apiRateLimit}
                        onChange={(e) => handleInputChange('security', 'apiRateLimit', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="100"
                        min="10"
                        max="1000"
                      />
                      <p className="text-xs text-gray-500 mt-1">Maximum API requests per minute per IP</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        IP Whitelist (optional)
                      </label>
                      <textarea
                        value={settings.security.ipWhitelist}
                        onChange={(e) => handleInputChange('security', 'ipWhitelist', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        rows={4}
                        placeholder="192.168.1.1&#10;10.0.0.1&#10;172.16.0.1"
                      />
                      <p className="text-xs text-gray-500 mt-1">One IP address per line. Leave empty to allow all IPs.</p>
                    </div>
                  </div>
                </GlassCard>
              </AnimatedCard>
            )}

            {/* Feature Flags */}
            {activeSection === 'features' && (
              <AnimatedCard animation="fadeUp" delay={0}>
                <GlassCard className="p-6">
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <FlagIcon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Feature Flags</h2>
                      <p className="text-sm text-gray-600">Enable or disable platform features</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                      <input
                        type="checkbox"
                        checked={settings.features.userRegistration}
                        onChange={(e) => handleInputChange('features', 'userRegistration', e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-gray-900">User Registration</span>
                        <p className="text-sm text-gray-600">Allow new users to create accounts</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        settings.features.userRegistration ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {settings.features.userRegistration ? 'Enabled' : 'Disabled'}
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                      <input
                        type="checkbox"
                        checked={settings.features.jobPosting}
                        onChange={(e) => handleInputChange('features', 'jobPosting', e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-gray-900">Job Posting</span>
                        <p className="text-sm text-gray-600">Allow employers to post new job listings</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        settings.features.jobPosting ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {settings.features.jobPosting ? 'Enabled' : 'Disabled'}
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                      <input
                        type="checkbox"
                        checked={settings.features.companyReviews}
                        onChange={(e) => handleInputChange('features', 'companyReviews', e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-gray-900">Company Reviews</span>
                        <p className="text-sm text-gray-600">Allow users to review and rate companies</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        settings.features.companyReviews ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {settings.features.companyReviews ? 'Enabled' : 'Disabled'}
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                      <input
                        type="checkbox"
                        checked={settings.features.messaging}
                        onChange={(e) => handleInputChange('features', 'messaging', e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-gray-900">Messaging System</span>
                        <p className="text-sm text-gray-600">Enable direct messaging between users</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        settings.features.messaging ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {settings.features.messaging ? 'Enabled' : 'Disabled'}
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                      <input
                        type="checkbox"
                        checked={settings.features.notifications}
                        onChange={(e) => handleInputChange('features', 'notifications', e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-gray-900">Push Notifications</span>
                        <p className="text-sm text-gray-600">Send real-time notifications to users</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        settings.features.notifications ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {settings.features.notifications ? 'Enabled' : 'Disabled'}
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                      <input
                        type="checkbox"
                        checked={settings.features.analytics}
                        onChange={(e) => handleInputChange('features', 'analytics', e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-gray-900">Analytics Tracking</span>
                        <p className="text-sm text-gray-600">Track user behavior and platform metrics</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        settings.features.analytics ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {settings.features.analytics ? 'Enabled' : 'Disabled'}
                      </span>
                    </label>
                  </div>
                </GlassCard>
              </AnimatedCard>
            )}

            {/* Save Button */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <InformationCircleIcon className="w-5 h-5 text-blue-600" />
                  <p className="text-sm text-gray-600">
                    Changes will be applied immediately after saving
                  </p>
                </div>
                <button
                  onClick={handleSaveSettings}
                  disabled={isLoading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-5 h-5" />
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
