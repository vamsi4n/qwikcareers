import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function PreferencesPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [preferences, setPreferences] = useState({
    jobTypes: ['full-time'],
    experienceLevels: ['mid-level', 'senior'],
    locations: [
      { city: 'San Francisco', state: 'CA' },
      { city: 'New York', state: 'NY' },
    ],
    isRemote: true,
    isWillingToRelocate: false,
    salaryRange: {
      min: 80000,
      max: 150000,
      currency: 'USD',
    },
    industries: ['Technology', 'Finance'],
    companySize: ['medium', 'large'],
    preferredBenefits: ['health-insurance', 'remote-work', '401k'],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [newLocation, setNewLocation] = useState({ city: '', state: '' });

  const handleToggle = (category, value) => {
    setPreferences((prev) => {
      const current = prev[category];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter((item) => item !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  const handleAddLocation = () => {
    if (newLocation.city && newLocation.state) {
      setPreferences((prev) => ({
        ...prev,
        locations: [...prev.locations, newLocation],
      }));
      setNewLocation({ city: '', state: '' });
    }
  };

  const handleRemoveLocation = (index) => {
    setPreferences((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index),
    }));
  };

  const handleSalaryChange = (field, value) => {
    setPreferences((prev) => ({
      ...prev,
      salaryRange: {
        ...prev.salaryRange,
        [field]: parseInt(value) || 0,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Dispatch action to save preferences
    // await dispatch(updatePreferences(preferences));

    setTimeout(() => {
      setIsSaving(false);
      setSuccessMessage('Preferences saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 500);
  };

  const jobTypeOptions = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
  ];

  const experienceLevelOptions = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid-level', label: 'Mid Level' },
    { value: 'senior', label: 'Senior' },
    { value: 'lead', label: 'Lead/Principal' },
    { value: 'executive', label: 'Executive' },
  ];

  const companySizeOptions = [
    { value: 'startup', label: 'Startup (1-50)' },
    { value: 'small', label: 'Small (51-200)' },
    { value: 'medium', label: 'Medium (201-1000)' },
    { value: 'large', label: 'Large (1000+)' },
  ];

  const benefitsOptions = [
    { value: 'health-insurance', label: 'Health Insurance' },
    { value: 'dental-insurance', label: 'Dental Insurance' },
    { value: 'vision-insurance', label: 'Vision Insurance' },
    { value: 'remote-work', label: 'Remote Work' },
    { value: 'flexible-hours', label: 'Flexible Hours' },
    { value: '401k', label: '401(k) Matching' },
    { value: 'stock-options', label: 'Stock Options' },
    { value: 'pto', label: 'Paid Time Off' },
    { value: 'parental-leave', label: 'Parental Leave' },
    { value: 'professional-development', label: 'Professional Development' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Job Preferences</h1>
        <p className="text-gray-600 mt-2">
          Set your preferences to get better job recommendations and alerts
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
        {/* Job Types */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {jobTypeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleToggle('jobTypes', option.value)}
                className={`px-4 py-3 rounded-md border-2 transition font-medium ${
                  preferences.jobTypes.includes(option.value)
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Experience Level</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {experienceLevelOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleToggle('experienceLevels', option.value)}
                className={`px-4 py-3 rounded-md border-2 transition font-medium ${
                  preferences.experienceLevels.includes(option.value)
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Location Preferences */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Location Preferences</h2>

          {/* Remote & Relocation */}
          <div className="flex flex-col gap-3 mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.isRemote}
                onChange={(e) => setPreferences((prev) => ({ ...prev, isRemote: e.target.checked }))}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">Open to remote positions</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.isWillingToRelocate}
                onChange={(e) => setPreferences((prev) => ({ ...prev, isWillingToRelocate: e.target.checked }))}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">Willing to relocate</span>
            </label>
          </div>

          {/* Preferred Locations */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Preferred Locations</h3>
            <div className="space-y-2 mb-4">
              {preferences.locations.map((location, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-md">
                  <span className="text-gray-900">
                    {location.city}, {location.state}
                  </span>
                  <button
                    onClick={() => handleRemoveLocation(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newLocation.city}
                onChange={(e) => setNewLocation((prev) => ({ ...prev, city: e.target.value }))}
                placeholder="City"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                value={newLocation.state}
                onChange={(e) => setNewLocation((prev) => ({ ...prev, state: e.target.value }))}
                placeholder="State"
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleAddLocation}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Salary Range */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Desired Salary Range</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Salary (Annual)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={preferences.salaryRange.min}
                  onChange={(e) => handleSalaryChange('min', e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Salary (Annual)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={preferences.salaryRange.max}
                  onChange={(e) => handleSalaryChange('max', e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Expected range: ${preferences.salaryRange.min.toLocaleString()} - ${preferences.salaryRange.max.toLocaleString()} per year
          </p>
        </div>

        {/* Company Size */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferred Company Size</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {companySizeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleToggle('companySize', option.value)}
                className={`px-4 py-3 rounded-md border-2 transition font-medium text-sm ${
                  preferences.companySize.includes(option.value)
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferred Benefits</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {benefitsOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleToggle('preferredBenefits', option.value)}
                className={`px-4 py-3 rounded-md border-2 transition font-medium text-sm ${
                  preferences.preferredBenefits.includes(option.value)
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}
