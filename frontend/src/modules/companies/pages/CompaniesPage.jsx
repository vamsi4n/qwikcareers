import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  UserGroupIcon,
  BookmarkIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { getCompanies, followCompany } from '../../../store/slices/companySlice';
import AnimatedCard from '../../../components/animations/AnimatedCard';
import GlassCard from '../../../components/ui/GlassCard';
import FloatingElements from '../../../components/animations/FloatingElements';

export default function CompaniesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companies, isLoading } = useSelector((state) => state.companies);
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [followedCompanies, setFollowedCompanies] = useState(new Set());

  useEffect(() => {
    dispatch(getCompanies());
  }, [dispatch]);

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !industryFilter || company.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  const industries = ['All', 'Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing'];

  const handleFollow = (e, companyId) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(followCompany(companyId));
    setFollowedCompanies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(companyId)) {
        newSet.delete(companyId);
      } else {
        newSet.add(companyId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <FloatingElements variant="dots" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-3 animate-fade-in">
            Discover Top Companies
          </h1>
          <p className="text-gray-600 text-lg animate-fade-in-up">
            Explore companies that are actively hiring
          </p>
        </div>

        {/* Search and Filters */}
        <GlassCard className="p-6 mb-8 animate-slide-in-up">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search companies..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-purple-300"
              />
            </div>
            <div className="relative">
              <BuildingOfficeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-500" />
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all hover:border-pink-300 appearance-none bg-white"
              >
                {industries.map((industry) => (
                  <option key={industry} value={industry === 'All' ? '' : industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </GlassCard>

        {isLoading ? (
          <GlassCard className="text-center py-20">
            <div className="relative inline-flex">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-pink-600 rounded-full animate-spin animation-delay-2000"></div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Discovering amazing companies...</p>
          </GlassCard>
        ) : filteredCompanies.length === 0 ? (
          <GlassCard className="text-center py-20">
            <BuildingOfficeIcon className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No companies found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </GlassCard>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company, index) => (
              <AnimatedCard
                key={company._id}
                delay={index * 50}
                animation="fadeUp"
                className="group"
              >
                <GlassCard
                  onClick={() => navigate(`/companies/${company._id}`)}
                  className="p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl mb-4 flex items-center justify-center shadow-lg">
                        {company.logo ? (
                          <img src={company.logo} alt={company.name} className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          <BuildingOfficeIcon className="w-10 h-10 text-purple-600" />
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {company.name}
                      </h3>
                      <p className="text-sm font-semibold text-purple-600 mb-3">{company.industry}</p>
                      <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">{company.description}</p>
                    </div>
                    <button
                      onClick={(e) => handleFollow(e, company._id)}
                      className={`p-2 rounded-full transition-all ${
                        followedCompanies.has(company._id)
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-gray-100 text-gray-400 hover:bg-purple-50 hover:text-purple-500'
                      }`}
                    >
                      {followedCompanies.has(company._id) ? (
                        <BookmarkSolidIcon className="w-5 h-5" />
                      ) : (
                        <BookmarkIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 flex-wrap">
                    <div className="flex items-center gap-1.5 bg-purple-50 px-3 py-1.5 rounded-lg">
                      <MapPinIcon className="w-4 h-4 text-purple-500" />
                      <span className="font-medium">{company.location}</span>
                    </div>
                    {company.size && (
                      <div className="flex items-center gap-1.5 bg-pink-50 px-3 py-1.5 rounded-lg">
                        <UserGroupIcon className="w-4 h-4 text-pink-500" />
                        <span className="font-medium">{company.size}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-700">
                      {company.openJobs || 0} <span className="text-gray-500 font-medium">open positions</span>
                    </span>
                    <div className="flex items-center gap-1 text-purple-600 font-semibold text-sm group-hover:gap-2 transition-all">
                      <span>View Profile</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </div>
                  </div>
                </GlassCard>
              </AnimatedCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
