import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCompanies, followCompany } from '../../../store/slices/companySlice';

export default function CompaniesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companies, isLoading } = useSelector((state) => state.companies);
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');

  useEffect(() => {
    dispatch(getCompanies());
  }, [dispatch]);

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !industryFilter || company.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  const industries = ['All', 'Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing'];

  const handleFollow = (companyId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(followCompany(companyId));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Companies</h1>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search companies..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {industries.map((industry) => (
                <option key={industry} value={industry === 'All' ? '' : industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading companies...</p>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No companies found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <div
              key={company._id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => navigate(`/companies/${company._id}`)}
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{company.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{company.industry}</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{company.description}</p>
                </div>
                <button
                  onClick={() => handleFollow(company._id)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {company.location}
                </span>
                {company.size && (
                  <>
                    <span>•</span>
                    <span>{company.size}</span>
                  </>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{company.openJobs || 0} open positions</span>
                  <button
                    onClick={() => navigate(`/companies/${company._id}`)}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Profile →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
