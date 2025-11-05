import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, MapPinIcon, BriefcaseIcon, BuildingOfficeIcon, SparklesIcon, RocketLaunchIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import AnimatedCard from '../components/animations/AnimatedCard';
import AnimatedSection from '../components/animations/AnimatedSection';
import FloatingElements from '../components/animations/FloatingElements';
import GlassCard from '../components/ui/GlassCard';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation({ threshold: 0.3 });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (location) params.append('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  const popularCategories = [
    { name: 'Software Development', count: 1234, icon: '💻', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Design', count: 567, icon: '🎨', gradient: 'from-purple-500 to-pink-500' },
    { name: 'Marketing', count: 890, icon: '📱', gradient: 'from-orange-500 to-red-500' },
    { name: 'Sales', count: 456, icon: '💼', gradient: 'from-green-500 to-emerald-500' },
    { name: 'Finance', count: 678, icon: '💰', gradient: 'from-yellow-500 to-orange-500' },
    { name: 'Customer Service', count: 345, icon: '🎧', gradient: 'from-indigo-500 to-purple-500' },
  ];

  const featuredCompanies = [
    { name: 'Tech Corp', jobs: 45, logo: '', color: 'bg-blue-500' },
    { name: 'Design Studio', jobs: 23, logo: '', color: 'bg-purple-500' },
    { name: 'Marketing Inc', jobs: 34, logo: '', color: 'bg-orange-500' },
    { name: 'Finance Plus', jobs: 56, logo: '', color: 'bg-green-500' },
  ];

  const steps = [
    {
      icon: <SparklesIcon className="w-8 h-8" />,
      title: 'Create Your Profile',
      description: 'Sign up and create a compelling profile to showcase your skills and experience.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <MagnifyingGlassIcon className="w-8 h-8" />,
      title: 'Search & Apply',
      description: 'Browse thousands of jobs and apply to positions that match your skills.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <RocketLaunchIcon className="w-8 h-8" />,
      title: 'Get Hired',
      description: 'Connect with employers and land your dream job.',
      color: 'from-orange-500 to-red-500'
    },
  ];

  const benefits = [
    'AI-powered job matching',
    'Direct employer connections',
    'Resume builder tools',
    'Salary insights',
    'Career resources',
    'Interview preparation'
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section with Floating Elements */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 bg-size-300% animate-gradient text-white py-20 overflow-hidden">
        <FloatingElements variant="circles" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/30">
                  <SparklesIcon className="w-5 h-5" />
                  <span className="text-sm font-semibold">AI-Powered Job Platform</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  Find Your
                  <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    Dream Job
                  </span>
                  Today
                </h1>
                <p className="text-xl text-blue-100 max-w-xl">
                  Discover opportunities that match your skills and aspirations. Join thousands of professionals finding their perfect career fit.
                </p>
              </div>

              {/* Benefits List */}
              <div className="grid grid-cols-2 gap-3">
                {benefits.map((benefit, index) => (
                  <div
                    key={benefit}
                    className={`
                      flex items-center gap-2 text-sm
                      opacity-0 translate-x-8
                      animate-slide-in-left
                    `}
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                  >
                    <CheckCircleIcon className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Search Card */}
            <div className="animate-fade-in animation-delay-500">
              <GlassCard className="p-8 backdrop-blur-xl bg-white/10">
                <form onSubmit={handleSearch} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">What position are you looking for?</label>
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Job title, keywords, or company"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border-2 border-white/30 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Where?</label>
                    <div className="relative">
                      <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="City, state, or remote"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border-2 border-white/30 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                  >
                    Search Jobs
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-sm text-center text-blue-100 mb-3">Popular Searches:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['Remote', 'Full-time', 'Part-time', 'Internship'].map((tag) => (
                      <button
                        key={tag}
                        className="px-3 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-sm transition"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Animated Stats */}
          <div ref={statsRef} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '10,000+', label: 'Jobs Posted' },
              { value: '5,000+', label: 'Companies' },
              { value: '50,000+', label: 'Candidates' },
              { value: '8,000+', label: 'Jobs Filled' }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`
                  text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20
                  ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                  transition-all duration-700
                `}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Popular Categories with Unique Cards */}
      <AnimatedSection className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Explore by <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Category</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse opportunities across various industries and specializations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {popularCategories.map((category, index) => (
              <AnimatedCard
                key={category.name}
                delay={index * 100}
                animation="scale"
                className="group cursor-pointer"
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(category.name)}`)}
              >
                <div className="relative overflow-hidden bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-transparent shadow-lg hover:shadow-2xl transition-all duration-300">
                  {/* Gradient Overlay on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                  <div className="relative z-10 text-center space-y-3">
                    <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </div>
                    <div className="text-sm text-gray-500">{category.count} jobs</div>
                  </div>

                  {/* Arrow on Hover */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Featured Companies with Glass Cards */}
      <AnimatedSection className="py-24 relative overflow-hidden">
        <FloatingElements variant="dots" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Companies</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join innovative companies that are hiring now
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {featuredCompanies.map((company, index) => (
              <AnimatedCard
                key={company.name}
                delay={index * 150}
                animation="fadeUp"
                className="group"
              >
                <GlassCard className="p-8 text-center cursor-pointer hover:scale-105 transition-transform duration-300">
                  <div className={`w-20 h-20 ${company.color} rounded-2xl mx-auto mb-6 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300`}>
                    <BuildingOfficeIcon className="h-10 w-10 text-white" />
                  </div>
                  <div className="font-bold text-gray-900 mb-2 text-lg">{company.name}</div>
                  <div className="text-sm text-gray-600">{company.jobs} open positions</div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center justify-center gap-2 w-full">
                      View Jobs
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </GlassCard>
              </AnimatedCard>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/companies')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Explore All Companies
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </AnimatedSection>

      {/* How It Works with Timeline */}
      <AnimatedSection className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 -translate-y-1/2"></div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {steps.map((step, index) => (
                <AnimatedCard
                  key={step.title}
                  delay={index * 200}
                  animation="fadeUp"
                  className="relative"
                >
                  <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 border-2 border-gray-100">
                    {/* Step Number */}
                    <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg transform rotate-6`}>
                      {index + 1}
                    </div>

                    <div className="mt-8 text-center space-y-4">
                      <div className={`inline-flex p-4 bg-gradient-to-br ${step.color} rounded-2xl text-white`}>
                        {step.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section with Gradient */}
      <AnimatedSection className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-size-300% animate-gradient"></div>
        <FloatingElements variant="circles" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 border border-white/30">
              <RocketLaunchIcon className="w-5 h-5" />
              <span className="font-semibold">Join 50,000+ Professionals</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Ready to Take the Next
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Step in Your Career?
              </span>
            </h2>

            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of job seekers and employers who are finding success on QwikCareers every day.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="group px-10 py-5 bg-white text-blue-600 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                <span className="flex items-center justify-center gap-2">
                  Sign Up as Job Seeker
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <button
                onClick={() => navigate('/register')}
                className="group px-10 py-5 bg-transparent text-white rounded-xl font-bold text-lg border-3 border-white hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-200"
              >
                <span className="flex items-center justify-center gap-2">
                  Sign Up as Employer
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
