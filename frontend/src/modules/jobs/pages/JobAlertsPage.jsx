import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getJobAlerts } from '../../../store/slices/jobSlice';

export default function JobAlertsPage() {
  const dispatch = useDispatch();
  const { jobAlerts, isLoading } = useSelector((state) => state.jobs);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [alertData, setAlertData] = useState({
    keywords: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    frequency: 'daily',
  });

  useEffect(() => {
    dispatch(getJobAlerts());
  }, [dispatch]);

  const handleCreateAlert = (e) => {
    e.preventDefault();
    // Dispatch create alert action
    setShowCreateModal(false);
  };

  const handleToggleAlert = (alertId, isActive) => {
    // Dispatch toggle alert action
  };

  const handleDeleteAlert = (alertId) => {
    // Dispatch delete alert action
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Job Alerts</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-semibold"
        >
          Create Alert
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">How Job Alerts Work</p>
            <p>We'll send you email notifications when new jobs match your criteria. You can create multiple alerts with different search parameters.</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job alerts...</p>
        </div>
      ) : jobAlerts.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <p className="text-gray-600 mb-4">You don't have any job alerts yet</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Create Your First Alert →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobAlerts.map((alert) => (
            <div key={alert._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {alert.keywords || 'All Jobs'}
                    {alert.location && ` in ${alert.location}`}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    {alert.jobType && (
                      <span className="flex items-center">
                        <span className="font-medium mr-1">Type:</span>
                        <span className="capitalize">{alert.jobType}</span>
                      </span>
                    )}
                    {alert.experienceLevel && (
                      <span className="flex items-center">
                        <span className="font-medium mr-1">Level:</span>
                        <span className="capitalize">{alert.experienceLevel}</span>
                      </span>
                    )}
                    <span className="flex items-center">
                      <span className="font-medium mr-1">Frequency:</span>
                      <span className="capitalize">{alert.frequency}</span>
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleToggleAlert(alert._id, alert.isActive)}
                    className={`px-4 py-2 rounded-md font-medium transition ${
                      alert.isActive
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {alert.isActive ? 'Active' : 'Paused'}
                  </button>
                  <button
                    onClick={() => handleDeleteAlert(alert._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded p-3 text-sm text-gray-700">
                <span className="font-medium">Last sent:</span> {alert.lastSentAt ? new Date(alert.lastSentAt).toLocaleDateString() : 'Never'}
                <span className="mx-2">•</span>
                <span className="font-medium">Jobs sent:</span> {alert.jobsSent || 0}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Alert Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Create Job Alert</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateAlert} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  value={alertData.keywords}
                  onChange={(e) => setAlertData({ ...alertData, keywords: e.target.value })}
                  placeholder="e.g. Software Engineer, React Developer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={alertData.location}
                  onChange={(e) => setAlertData({ ...alertData, location: e.target.value })}
                  placeholder="City or state"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    value={alertData.jobType}
                    onChange={(e) => setAlertData({ ...alertData, jobType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={alertData.experienceLevel}
                    onChange={(e) => setAlertData({ ...alertData, experienceLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Levels</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="lead">Lead</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Frequency
                </label>
                <select
                  value={alertData.frequency}
                  onChange={(e) => setAlertData({ ...alertData, frequency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="instant">Instant</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Create Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
