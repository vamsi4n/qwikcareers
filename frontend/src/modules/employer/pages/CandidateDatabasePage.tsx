import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CandidateDatabasePage() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    search: '',
    skills: [],
    experience: '',
    location: '',
    availability: '',
    education: '',
  });

  const [showFilters, setShowFilters] = useState(true);
  const [savedCandidates, setSavedCandidates] = useState([]);

  // Mock candidate data - TODO: Replace with Redux state
  const [candidates] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      experience: '7 years',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'GraphQL'],
      education: 'BS Computer Science - Stanford University',
      availability: 'Available immediately',
      summary: 'Experienced full-stack developer with expertise in modern web technologies and cloud infrastructure.',
      desiredSalary: '$140,000 - $180,000',
      profileImage: null,
      lastActive: '2 days ago',
      matchScore: 95,
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'Product Designer',
      location: 'New York, NY',
      experience: '5 years',
      skills: ['Figma', 'UI/UX Design', 'Prototyping', 'User Research', 'Design Systems'],
      education: 'BFA Design - Parsons School of Design',
      availability: '2 weeks notice',
      summary: 'Creative product designer focused on user-centered design and creating intuitive digital experiences.',
      desiredSalary: '$110,000 - $140,000',
      profileImage: null,
      lastActive: '1 day ago',
      matchScore: 88,
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      title: 'Data Scientist',
      location: 'Remote',
      experience: '4 years',
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Data Visualization'],
      education: 'MS Data Science - MIT',
      availability: 'Available immediately',
      summary: 'Data scientist specializing in machine learning and predictive analytics with strong statistical background.',
      desiredSalary: '$130,000 - $160,000',
      profileImage: null,
      lastActive: '5 hours ago',
      matchScore: 92,
    },
    {
      id: 4,
      name: 'James Wilson',
      title: 'DevOps Engineer',
      location: 'Austin, TX',
      experience: '6 years',
      skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Terraform'],
      education: 'BS Information Technology - UT Austin',
      availability: '1 month notice',
      summary: 'DevOps specialist with expertise in container orchestration and cloud infrastructure automation.',
      desiredSalary: '$125,000 - $155,000',
      profileImage: null,
      lastActive: '1 week ago',
      matchScore: 85,
    },
    {
      id: 5,
      name: 'Aisha Patel',
      title: 'Marketing Manager',
      location: 'Chicago, IL',
      experience: '8 years',
      skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics', 'Social Media'],
      education: 'MBA Marketing - Northwestern University',
      availability: 'Available immediately',
      summary: 'Results-driven marketing leader with proven track record in digital strategy and brand growth.',
      desiredSalary: '$100,000 - $130,000',
      profileImage: null,
      lastActive: '3 days ago',
      matchScore: 78,
    },
  ]);

  const handleSaveCandidate = (candidateId) => {
    if (savedCandidates.includes(candidateId)) {
      setSavedCandidates(savedCandidates.filter((id) => id !== candidateId));
    } else {
      setSavedCandidates([...savedCandidates, candidateId]);
    }
  };

  const handleContactCandidate = (candidate) => {
    // TODO: Navigate to messages or open contact modal
    navigate(`/messages?userId=${candidate.id}`);
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      !filters.search ||
      candidate.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      candidate.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      candidate.skills.some((skill) =>
        skill.toLowerCase().includes(filters.search.toLowerCase())
      );

    const matchesExperience =
      !filters.experience ||
      (filters.experience === 'entry' && parseInt(candidate.experience) <= 2) ||
      (filters.experience === 'mid' &&
        parseInt(candidate.experience) >= 3 &&
        parseInt(candidate.experience) <= 5) ||
      (filters.experience === 'senior' && parseInt(candidate.experience) >= 6);

    const matchesLocation =
      !filters.location ||
      candidate.location.toLowerCase().includes(filters.location.toLowerCase());

    const matchesAvailability =
      !filters.availability || candidate.availability.includes(filters.availability);

    return matchesSearch && matchesExperience && matchesLocation && matchesAvailability;
  });

  const skillOptions = [
    'React',
    'Node.js',
    'Python',
    'Java',
    'TypeScript',
    'AWS',
    'Docker',
    'Kubernetes',
    'Machine Learning',
    'UI/UX Design',
    'Figma',
    'SQL',
    'GraphQL',
    'TensorFlow',
    'Digital Marketing',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Candidate Database</h1>
        <p className="text-gray-600 mt-2">
          Search and browse qualified candidates for your open positions
        </p>
      </div>

      {/* Search and Filter Toggle */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search by name, title, or skills..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition font-medium flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <select
                value={filters.experience}
                onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Levels</option>
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (3-5 years)</option>
                <option value="senior">Senior Level (6+ years)</option>
              </select>
            </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <select
                value={filters.availability}
                onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any</option>
                <option value="immediately">Available Immediately</option>
                <option value="2 weeks">2 Weeks Notice</option>
                <option value="1 month">1 Month Notice</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
              <select
                value={filters.education}
                onChange={(e) => setFilters({ ...filters, education: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any Level</option>
                <option value="high-school">High School</option>
                <option value="bachelors">Bachelor's Degree</option>
                <option value="masters">Master's Degree</option>
                <option value="phd">PhD</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600">
          Found <span className="font-semibold">{filteredCandidates.length}</span> candidates
        </p>
        <button
          onClick={() =>
            setFilters({
              search: '',
              skills: [],
              experience: '',
              location: '',
              availability: '',
              education: '',
            })
          }
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          Clear all filters
        </button>
      </div>

      {/* Candidates Grid */}
      {filteredCandidates.length === 0 ? (
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No candidates found</h3>
          <p className="text-gray-600">Try adjusting your filters to see more results</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCandidates.map((candidate) => (
            <div key={candidate.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
              {/* Match Score Badge */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-blue-600">
                      {candidate.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                    <p className="text-blue-600 font-medium">{candidate.title}</p>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {candidate.location}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                    {candidate.matchScore}% Match
                  </span>
                  <button
                    onClick={() => handleSaveCandidate(candidate.id)}
                    className="text-gray-400 hover:text-blue-600 transition"
                  >
                    <svg
                      className={`w-6 h-6 ${
                        savedCandidates.includes(candidate.id)
                          ? 'fill-blue-600 text-blue-600'
                          : 'fill-none'
                      }`}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Summary */}
              <p className="text-gray-700 text-sm mb-4">{candidate.summary}</p>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div>
                  <p className="text-gray-500">Experience</p>
                  <p className="font-medium text-gray-900">{candidate.experience}</p>
                </div>
                <div>
                  <p className="text-gray-500">Availability</p>
                  <p className="font-medium text-gray-900">{candidate.availability}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Desired Salary</p>
                  <p className="font-medium text-gray-900">{candidate.desiredSalary}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Education</p>
                  <p className="font-medium text-gray-900">{candidate.education}</p>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Last Active */}
              <p className="text-xs text-gray-500 mb-4">Last active {candidate.lastActive}</p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/profile/${candidate.id}`)}
                  className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 transition font-medium"
                >
                  View Profile
                </button>
                <button
                  onClick={() => handleContactCandidate(candidate)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium"
                >
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
