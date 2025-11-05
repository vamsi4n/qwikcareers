import { useState } from 'react';

export default function SalaryInsightsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    experienceLevel: '',
    industry: '',
    companySize: '',
  });

  // Mock salary data - TODO: Replace with Redux state
  const [salaryData] = useState([
    {
      id: 1,
      jobTitle: 'Software Engineer',
      avgSalary: 125000,
      minSalary: 85000,
      maxSalary: 175000,
      location: 'San Francisco, CA',
      experienceLevel: 'Mid-level',
      industry: 'Technology',
      companySize: 'Medium (201-1000)',
      totalReports: 1245,
      trend: '+8.5%',
    },
    {
      id: 2,
      jobTitle: 'Product Designer',
      avgSalary: 110000,
      minSalary: 75000,
      maxSalary: 155000,
      location: 'San Francisco, CA',
      experienceLevel: 'Mid-level',
      industry: 'Technology',
      companySize: 'Medium (201-1000)',
      totalReports: 856,
      trend: '+6.2%',
    },
    {
      id: 3,
      jobTitle: 'Data Scientist',
      avgSalary: 135000,
      minSalary: 95000,
      maxSalary: 185000,
      location: 'New York, NY',
      experienceLevel: 'Mid-level',
      industry: 'Technology',
      companySize: 'Large (1000+)',
      totalReports: 1032,
      trend: '+10.3%',
    },
    {
      id: 4,
      jobTitle: 'Marketing Manager',
      avgSalary: 95000,
      minSalary: 65000,
      maxSalary: 135000,
      location: 'Chicago, IL',
      experienceLevel: 'Senior',
      industry: 'Marketing',
      companySize: 'Medium (201-1000)',
      totalReports: 643,
      trend: '+4.8%',
    },
    {
      id: 5,
      jobTitle: 'DevOps Engineer',
      avgSalary: 130000,
      minSalary: 90000,
      maxSalary: 180000,
      location: 'Austin, TX',
      experienceLevel: 'Senior',
      industry: 'Technology',
      companySize: 'Medium (201-1000)',
      totalReports: 789,
      trend: '+9.1%',
    },
  ]);

  const experienceBreakdown = [
    { level: 'Entry Level (0-2 years)', avgSalary: 75000, percentage: 100 },
    { level: 'Mid Level (3-5 years)', avgSalary: 110000, percentage: 147 },
    { level: 'Senior (6-10 years)', avgSalary: 150000, percentage: 200 },
    { level: 'Lead/Principal (10+ years)', avgSalary: 185000, percentage: 247 },
  ];

  const locationComparison = [
    { city: 'San Francisco, CA', avgSalary: 145000, costOfLivingIndex: 180 },
    { city: 'New York, NY', avgSalary: 135000, costOfLivingIndex: 165 },
    { city: 'Seattle, WA', avgSalary: 130000, costOfLivingIndex: 140 },
    { city: 'Austin, TX', avgSalary: 115000, costOfLivingIndex: 105 },
    { city: 'Denver, CO', avgSalary: 110000, costOfLivingIndex: 115 },
  ];

  const filteredSalaries = salaryData.filter((salary) => {
    const matchesSearch =
      !searchQuery || salary.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation =
      !filters.location || salary.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesExperience =
      !filters.experienceLevel || salary.experienceLevel === filters.experienceLevel;
    const matchesIndustry = !filters.industry || salary.industry === filters.industry;
    const matchesCompanySize = !filters.companySize || salary.companySize === filters.companySize;

    return (
      matchesSearch &&
      matchesLocation &&
      matchesExperience &&
      matchesIndustry &&
      matchesCompanySize
    );
  });

  const SalaryCard = ({ salary }) => (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{salary.jobTitle}</h3>
          <p className="text-sm text-gray-600 mt-1">{salary.location}</p>
        </div>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
          {salary.trend}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-3xl font-bold text-blue-600">${salary.avgSalary.toLocaleString()}</p>
        <p className="text-sm text-gray-600 mt-1">Average annual salary</p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Range</span>
          <span>
            ${salary.minSalary.toLocaleString()} - ${salary.maxSalary.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{
              width: `${((salary.avgSalary - salary.minSalary) / (salary.maxSalary - salary.minSalary)) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500">Experience</p>
          <p className="font-medium text-gray-900">{salary.experienceLevel}</p>
        </div>
        <div>
          <p className="text-gray-500">Industry</p>
          <p className="font-medium text-gray-900">{salary.industry}</p>
        </div>
        <div className="col-span-2">
          <p className="text-gray-500">Company Size</p>
          <p className="font-medium text-gray-900">{salary.companySize}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">Based on {salary.totalReports.toLocaleString()} salary reports</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Salary Insights</h1>
        <p className="text-gray-600 mt-2">
          Explore salary data and compensation trends across industries and locations
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Job Title</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. Software Engineer, Product Manager..."
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              placeholder="City or state..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
            <select
              value={filters.experienceLevel}
              onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Levels</option>
              <option value="Entry-level">Entry Level</option>
              <option value="Mid-level">Mid Level</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead/Principal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <select
              value={filters.industry}
              onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Industries</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Marketing">Marketing</option>
              <option value="Education">Education</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
            <select
              value={filters.companySize}
              onChange={(e) => setFilters({ ...filters, companySize: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Sizes</option>
              <option value="Startup (1-50)">Startup (1-50)</option>
              <option value="Small (51-200)">Small (51-200)</option>
              <option value="Medium (201-1000)">Medium (201-1000)</option>
              <option value="Large (1000+)">Large (1000+)</option>
            </select>
          </div>
        </div>

        <button
          onClick={() =>
            setFilters({ location: '', experienceLevel: '', industry: '', companySize: '' })
          }
          className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          Clear all filters
        </button>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing <span className="font-semibold">{filteredSalaries.length}</span> salary insights
        </p>
      </div>

      {/* Salary Cards */}
      {filteredSalaries.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No salary data found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredSalaries.map((salary) => (
            <SalaryCard key={salary.id} salary={salary} />
          ))}
        </div>
      )}

      {/* Salary by Experience Level */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Salary Progression by Experience Level
        </h2>
        <div className="space-y-4">
          {experienceBreakdown.map((level, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{level.level}</span>
                <span className="text-lg font-bold text-gray-900">
                  ${level.avgSalary.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${level.percentage}%` }}
                >
                  <span className="text-white text-xs font-medium">{level.percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-6">
          * Percentages are relative to entry-level salaries (base 100%)
        </p>
      </div>

      {/* Location Comparison */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Top Paying Locations (Software Engineers)
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  City
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Average Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cost of Living Index
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Adjusted Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {locationComparison.map((location, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {location.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${location.avgSalary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {location.costOfLivingIndex}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-sm font-semibold rounded bg-blue-100 text-blue-800">
                      ${Math.round((location.avgSalary / location.costOfLivingIndex) * 100).toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          * Adjusted value normalizes salary by cost of living (base index: 100)
        </p>
      </div>

      {/* Market Trends */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <svg
            className="w-6 h-6 text-blue-600 mr-3 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Market Trends & Insights</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>
                • Technology sector salaries have increased by an average of <strong>8.3%</strong>{' '}
                year-over-year
              </li>
              <li>
                • Remote positions offer <strong>15-20% higher</strong> salaries compared to
                on-site roles in most markets
              </li>
              <li>
                • Data Science and AI-related roles show the highest growth rate at{' '}
                <strong>12.5%</strong> annually
              </li>
              <li>
                • Companies with 201-1000 employees typically offer the most competitive
                compensation packages
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Salary data is compiled from user-submitted reports and may vary based on factors such as
          skills, certifications, and company performance. Data is updated regularly.
        </p>
      </div>
    </div>
  );
}
