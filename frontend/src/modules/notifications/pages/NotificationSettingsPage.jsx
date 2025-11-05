import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function NotificationSettingsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [settings, setSettings] = useState({
    email: {
      applicationStatus: true,
      newMessages: true,
      jobAlerts: true,
      companyUpdates: false,
      weeklyDigest: true,
      marketingEmails: false,
    },
    push: {
      applicationStatus: true,
      newMessages: true,
      jobAlerts: false,
      companyUpdates: false,
    },
    sms: {
      applicationStatus: false,
      newMessages: false,
      interviewReminders: true,
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load user's notification settings
  useEffect(() => {
    // TODO: Fetch user's notification settings from backend
    // dispatch(getNotificationSettings());
  }, []);

  const handleToggle = (channel, type) => {
    setSettings((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [type]: !prev[channel][type],
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Dispatch action to save settings
    // await dispatch(updateNotificationSettings(settings));

    setTimeout(() => {
      setIsSaving(false);
      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 500);
  };

  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage how and when you receive notifications
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

      <div className="space-y-6">
        {/* Email Notifications */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Email Notifications</h2>
                <p className="text-sm text-gray-600">Notifications sent to {user?.email}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Application Status Updates</p>
                <p className="text-sm text-gray-600">Get notified when your application status changes</p>
              </div>
              <ToggleSwitch
                checked={settings.email.applicationStatus}
                onChange={() => handleToggle('email', 'applicationStatus')}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">New Messages</p>
                <p className="text-sm text-gray-600">Receive email for new messages from employers</p>
              </div>
              <ToggleSwitch
                checked={settings.email.newMessages}
                onChange={() => handleToggle('email', 'newMessages')}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Job Alerts</p>
                <p className="text-sm text-gray-600">Email notifications for jobs matching your preferences</p>
              </div>
              <ToggleSwitch
                checked={settings.email.jobAlerts}
                onChange={() => handleToggle('email', 'jobAlerts')}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Company Updates</p>
                <p className="text-sm text-gray-600">News and updates from companies you follow</p>
              </div>
              <ToggleSwitch
                checked={settings.email.companyUpdates}
                onChange={() => handleToggle('email', 'companyUpdates')}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Weekly Digest</p>
                <p className="text-sm text-gray-600">Weekly summary of recommended jobs and activity</p>
              </div>
              <ToggleSwitch
                checked={settings.email.weeklyDigest}
                onChange={() => handleToggle('email', 'weeklyDigest')}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Marketing Emails</p>
                <p className="text-sm text-gray-600">Tips, promotions, and platform updates</p>
              </div>
              <ToggleSwitch
                checked={settings.email.marketingEmails}
                onChange={() => handleToggle('email', 'marketingEmails')}
              />
            </div>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Push Notifications</h2>
                <p className="text-sm text-gray-600">Real-time notifications on your browser</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Application Status Updates</p>
                <p className="text-sm text-gray-600">Instant notifications for status changes</p>
              </div>
              <ToggleSwitch
                checked={settings.push.applicationStatus}
                onChange={() => handleToggle('push', 'applicationStatus')}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">New Messages</p>
                <p className="text-sm text-gray-600">Get notified immediately when you receive a message</p>
              </div>
              <ToggleSwitch
                checked={settings.push.newMessages}
                onChange={() => handleToggle('push', 'newMessages')}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Job Alerts</p>
                <p className="text-sm text-gray-600">Push notifications for new matching jobs</p>
              </div>
              <ToggleSwitch
                checked={settings.push.jobAlerts}
                onChange={() => handleToggle('push', 'jobAlerts')}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Company Updates</p>
                <p className="text-sm text-gray-600">New jobs from companies you follow</p>
              </div>
              <ToggleSwitch
                checked={settings.push.companyUpdates}
                onChange={() => handleToggle('push', 'companyUpdates')}
              />
            </div>
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">SMS Notifications</h2>
                <p className="text-sm text-gray-600">Text messages sent to {user?.phone || 'your phone'}</p>
              </div>
            </div>
          </div>

          {!user?.phone ? (
            <div className="p-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-yellow-800 font-medium">Phone number required</p>
                    <p className="text-yellow-700 text-sm mt-1">
                      Add your phone number in profile settings to enable SMS notifications
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Application Status Updates</p>
                  <p className="text-sm text-gray-600">Text for critical status changes</p>
                </div>
                <ToggleSwitch
                  checked={settings.sms.applicationStatus}
                  onChange={() => handleToggle('sms', 'applicationStatus')}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">New Messages</p>
                  <p className="text-sm text-gray-600">SMS for urgent messages from employers</p>
                </div>
                <ToggleSwitch
                  checked={settings.sms.newMessages}
                  onChange={() => handleToggle('sms', 'newMessages')}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Interview Reminders</p>
                  <p className="text-sm text-gray-600">Reminders before scheduled interviews</p>
                </div>
                <ToggleSwitch
                  checked={settings.sms.interviewReminders}
                  onChange={() => handleToggle('sms', 'interviewReminders')}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-blue-800 text-sm">
                  Standard messaging rates may apply. You can opt out at any time.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
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
