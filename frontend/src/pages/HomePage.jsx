import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, MapPinIcon, BriefcaseIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (location) params.append('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  const popularCategories = [
    { name: 'Software Development', count: 1234 },
    { name: 'Design', count: 567 },
    { name: 'Marketing', count: 890 },
    { name: 'Sales', count: 456 },
    { name: 'Finance', count: 678 },
    { name: 'Customer Service', count: 345 },
  ];

  const featuredCompanies = [
    { name: 'Tech Corp', jobs: 45, logo: '' },
    { name: 'Design Studio', jobs: 23, logo: '' },
    { name: 'Marketing Inc', jobs: 34, logo: '' },
    { name: 'Finance Plus', jobs: 56, logo: '' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Dream Job Today
            </h1>
            <p className="text-xl text-blue-100">
              Thousands of jobs in one place. Start your career journey with QwikCareers.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl p-4 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1 relative">
                <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="City or state"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md font-semibold transition"
              >
                Search Jobs
              </button>
            </div>
          </form>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">10,000+</div>
              <div className="text-blue-100">Jobs Posted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">5,000+</div>
              <div className="text-blue-100">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">50,000+</div>
              <div className="text-blue-100">Candidates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">8,000+</div>
              <div className="text-blue-100">Jobs Filled</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(category.name)}`)}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-500 transition text-center"
              >
                <BriefcaseIcon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="font-semibold text-gray-900 mb-1">{category.name}</div>
                <div className="text-sm text-gray-500">{category.count} jobs</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Featured Companies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredCompanies.map((company) => (
              <button
                key={company.name}
                onClick={() => navigate('/companies')}
                className="bg-white rounded-lg p-6 hover:shadow-lg transition text-center"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <BuildingOfficeIcon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="font-semibold text-gray-900 mb-1">{company.name}</div>
                <div className="text-sm text-gray-500">{company.jobs} open positions</div>
              </button>
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/companies')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              View all companies →
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-gray-600">
                Sign up and create a compelling profile to showcase your skills and experience.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Search & Apply</h3>
              <p className="text-gray-600">
                Browse thousands of jobs and apply to positions that match your skills.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Hired</h3>
              <p className="text-gray-600">
                Connect with employers and land your dream job.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of job seekers and employers on QwikCareers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
            >
              Sign Up as Job Seeker
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-700 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-800 transition border-2 border-white"
            >
              Sign Up as Employer
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
