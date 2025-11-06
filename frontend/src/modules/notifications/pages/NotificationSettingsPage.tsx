import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

interface NotificationTypeSettings {
  email: boolean;
  inApp: boolean;
  push: boolean;
}

interface NotificationPreferences {
  emailFrequency: 'instant' | 'daily' | 'weekly' | 'never';
  types: {
    applicationStatus: NotificationTypeSettings;
    newJobMatch: NotificationTypeSettings;
    newMessage: NotificationTypeSettings;
    interviewScheduled: NotificationTypeSettings;
    jobAlert: NotificationTypeSettings;
    profileView: NotificationTypeSettings;
    offerExtended: NotificationTypeSettings;
    applicationReceived: NotificationTypeSettings;
    subscriptionExpiring: NotificationTypeSettings;
    paymentSuccess: NotificationTypeSettings;
    paymentFailed: NotificationTypeSettings;
    system: NotificationTypeSettings;
  };
}

const defaultNotificationSettings: NotificationPreferences = {
  emailFrequency: 'instant',
  types: {
    applicationStatus: { email: true, inApp: true, push: true },
    newJobMatch: { email: true, inApp: true, push: true },
    newMessage: { email: true, inApp: true, push: true },
    interviewScheduled: { email: true, inApp: true, push: true },
    jobAlert: { email: true, inApp: true, push: false },
    profileView: { email: false, inApp: true, push: false },
    offerExtended: { email: true, inApp: true, push: true },
    applicationReceived: { email: true, inApp: true, push: true },
    subscriptionExpiring: { email: true, inApp: true, push: false },
    paymentSuccess: { email: true, inApp: true, push: false },
    paymentFailed: { email: true, inApp: true, push: true },
    system: { email: true, inApp: true, push: true },
  },
};

const notificationLabels = {
  applicationStatus: {
    title: 'Application Status Updates',
    description: 'Get notified when your application status changes',
    icon: '📋',
  },
  newJobMatch: {
    title: 'New Job Matches',
    description: 'Jobs that match your skills and preferences',
    icon: '💼',
  },
  newMessage: {
    title: 'New Messages',
    description: 'Messages from employers or recruiters',
    icon: '💬',
  },
  interviewScheduled: {
    title: 'Interview Scheduled',
    description: 'Interview invitations and scheduling updates',
    icon: '📅',
  },
  jobAlert: {
    title: 'Job Alerts',
    description: 'New jobs matching your saved searches',
    icon: '🔔',
  },
  profileView: {
    title: 'Profile Views',
    description: 'When employers view your profile',
    icon: '👀',
  },
  offerExtended: {
    title: 'Job Offers',
    description: 'Job offer notifications',
    icon: '🎉',
  },
  applicationReceived: {
    title: 'Application Received',
    description: 'New applications for your job postings',
    icon: '📨',
  },
  subscriptionExpiring: {
    title: 'Subscription Expiring',
    description: 'Subscription renewal reminders',
    icon: '⏰',
  },
  paymentSuccess: {
    title: 'Payment Successful',
    description: 'Payment confirmation notifications',
    icon: '✅',
  },
  paymentFailed: {
    title: 'Payment Failed',
    description: 'Failed payment alerts',
    icon: '❌',
  },
  system: {
    title: 'System Notifications',
    description: 'Important platform updates and announcements',
    icon: '🔧',
  },
};

export default function NotificationSettingsPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultNotificationSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch notification preferences on mount
  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/v1/users/notification-preferences');
      if (response.data.data && Object.keys(response.data.data).length > 0) {
        setPreferences(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch notification preferences:', error);
      setErrorMessage('Failed to load preferences. Using default settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (notificationType: keyof typeof preferences.types, channel: 'email' | 'inApp' | 'push') => {
    setPreferences((prev) => ({
      ...prev,
      types: {
        ...prev.types,
        [notificationType]: {
          ...prev.types[notificationType],
          [channel]: !prev.types[notificationType][channel],
        },
      },
    }));
  };

  const handleEmailFrequencyChange = (frequency: 'instant' | 'daily' | 'weekly' | 'never') => {
    setPreferences((prev) => ({
      ...prev,
      emailFrequency: frequency,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrorMessage('');
      await axios.patch('/api/v1/users/notification-preferences', preferences);
      setSuccessMessage('Notification preferences saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
      setErrorMessage('Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const ToggleSwitch = ({ checked, onChange, disabled = false }: { checked: boolean; onChange: () => void; disabled?: boolean }) => (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Group notifications by user role
  const jobSeekerNotifications = ['applicationStatus', 'newJobMatch', 'newMessage', 'interviewScheduled', 'jobAlert', 'profileView', 'offerExtended'];
  const employerNotifications = ['applicationReceived', 'newMessage', 'subscriptionExpiring'];
  const commonNotifications = ['paymentSuccess', 'paymentFailed', 'system'];

  const getNotificationsByRole = () => {
    if (user?.role === 'employer') {
      return [...employerNotifications, ...commonNotifications];
    }
    return [...jobSeekerNotifications, ...commonNotifications];
  };

  const visibleNotifications = getNotificationsByRole();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage how and when you receive notifications across different channels
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-800">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <p className="text-red-800">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Email Frequency Setting */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Email Frequency</h2>
              <p className="text-sm text-gray-600">Control how often you receive email notifications</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(['instant', 'daily', 'weekly', 'never'] as const).map((freq) => (
              <button
                key={freq}
                onClick={() => handleEmailFrequencyChange(freq)}
                className={`p-4 border-2 rounded-lg text-center transition ${
                  preferences.emailFrequency === freq
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="font-semibold capitalize">{freq}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {freq === 'instant' && 'Receive emails immediately'}
                  {freq === 'daily' && 'One digest per day'}
                  {freq === 'weekly' && 'One digest per week'}
                  {freq === 'never' && 'No email notifications'}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notification Types Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Notification Types</h2>
          <p className="text-sm text-gray-600 mt-1">Choose which notifications you want to receive for each type</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notification Type
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  In-App
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Push
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visibleNotifications.map((notifType) => {
                const typeKey = notifType as keyof typeof preferences.types;
                const label = notificationLabels[typeKey];
                return (
                  <tr key={typeKey} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{label.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{label.title}</div>
                          <div className="text-xs text-gray-500">{label.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <ToggleSwitch
                          checked={preferences.types[typeKey]?.email || false}
                          onChange={() => handleToggle(typeKey, 'email')}
                          disabled={preferences.emailFrequency === 'never'}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <ToggleSwitch
                          checked={preferences.types[typeKey]?.inApp || false}
                          onChange={() => handleToggle(typeKey, 'inApp')}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <ToggleSwitch
                          checked={preferences.types[typeKey]?.push || false}
                          onChange={() => handleToggle(typeKey, 'push')}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Save Button */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {user?.unsubscribeToken && (
              <span>
                To unsubscribe from all emails,{' '}
                <a
                  href={`/api/v1/users/unsubscribe/${user.unsubscribeToken}`}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  click here
                </a>
              </span>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}
