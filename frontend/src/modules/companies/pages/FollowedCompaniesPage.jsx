import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFollowedCompanies, unfollowCompany } from '../../../store/slices/companySlice';

export default function FollowedCompaniesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { followedCompanies, isLoading } = useSelector((state) => state.companies);
  const [sortBy, setSortBy] = useState('recent'); // recent, name, jobs

  useEffect(() => {
    dispatch(getFollowedCompanies());
  }, [dispatch]);

  const handleUnfollow = (companyId, companyName) => {
    if (window.confirm(`Are you sure you want to unfollow ${companyName}?`)) {
      dispatch(unfollowCompany(companyId));
    }
  };

  const sortedCompanies = [...(followedCompanies || [])].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'jobs':
        return (b.openPositions || 0) - (a.openPositions || 0);
      case 'recent':
      default:
        return new Date(b.followedAt) - new Date(a.followedAt);
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Followed Companies</h1>
          <p className="text-gray-600 mt-2">
            Companies you're following • {followedCompanies?.length || 0} total
          </p>
        </div>

        {followedCompanies && followedCompanies.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="recent">Recently Followed</option>
              <option value="name">Company Name</option>
              <option value="jobs">Open Positions</option>
            </select>
          </div>
        )}
      </div>

      {/* Companies List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading followed companies...</p>
        </div>
      ) : !followedCompanies || followedCompanies.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No companies followed yet</h3>
          <p className="text-gray-600 mb-6">
            Follow companies to stay updated on their job postings and company news
          </p>
          <button
            onClick={() => navigate('/companies')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-medium"
          >
            Browse Companies
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedCompanies.map((company) => (
            <div key={company._id} className="bg-white rounded-lg shadow hover:shadow-md transition p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-gray-600">
                        {company.name?.[0]}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer truncate"
                      onClick={() => navigate(`/companies/${company._id}`)}
                    >
                      {company.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{company.industry}</p>

                    {company.location && (
                      <p className="text-sm text-gray-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {company.location.city}, {company.location.state}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleUnfollow(company._id, company.name)}
                  className="text-gray-400 hover:text-red-600 transition"
                  title="Unfollow"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {company.description && (
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                  {company.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex gap-6 mb-4 pb-4 border-b border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {company.openPositions || 0}
                  </p>
                  <p className="text-xs text-gray-600">Open Jobs</p>
                </div>
                {company.size && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{company.size}</p>
                    <p className="text-xs text-gray-600">Employees</p>
                  </div>
                )}
                {company.rating && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{company.rating}</p>
                    <p className="text-xs text-gray-600">Rating</p>
                  </div>
                )}
              </div>

              {/* Latest Jobs */}
              {company.latestJobs && company.latestJobs.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Latest Positions:</p>
                  <div className="space-y-2">
                    {company.latestJobs.slice(0, 3).map((job) => (
                      <div
                        key={job._id}
                        onClick={() => navigate(`/jobs/${job._id}`)}
                        className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        {job.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/companies/${company._id}`)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium text-sm"
                >
                  View Company
                </button>
                {company.openPositions > 0 && (
                  <button
                    onClick={() => navigate(`/companies/${company._id}?tab=jobs`)}
                    className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 transition font-medium text-sm"
                  >
                    View Jobs ({company.openPositions})
                  </button>
                )}
              </div>

              {/* Followed Date */}
              <p className="text-xs text-gray-500 mt-4">
                Followed on {new Date(company.followedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Info Section */}
      {followedCompanies && followedCompanies.length > 0 && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Stay Updated</h3>
              <p className="text-sm text-blue-800">
                You'll receive notifications when these companies post new jobs or have updates. You can manage your notification preferences in settings.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
