export default function AboutPage() {
  const stats = [
    { label: 'Active Jobs', value: '50,000+' },
    { label: 'Companies', value: '10,000+' },
    { label: 'Job Seekers', value: '500,000+' },
    { label: 'Success Stories', value: '100,000+' },
  ];

  const values = [
    {
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      title: 'Trust & Transparency',
      description: 'We believe in building trust through transparent practices and honest communication with both job seekers and employers.',
    },
    {
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      title: 'Innovation',
      description: 'We continuously innovate to provide cutting-edge tools and features that make job searching and hiring more efficient.',
    },
    {
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      title: 'Inclusivity',
      description: 'We are committed to creating an inclusive platform where everyone has equal opportunity to find their dream job.',
    },
    {
      icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from user experience to customer support and platform performance.',
    },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: null,
      bio: '15+ years in HR technology and talent acquisition',
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: null,
      bio: 'Former tech lead at major Silicon Valley companies',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Product',
      image: null,
      bio: 'Product strategy expert with a passion for user experience',
    },
    {
      name: 'James Wilson',
      role: 'Head of Sales',
      image: null,
      bio: 'Built successful B2B sales teams across multiple industries',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About QwikCareers</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Connecting talented professionals with their dream opportunities since 2020
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
          <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto leading-relaxed">
            At QwikCareers, our mission is to revolutionize the way people find jobs and companies find talent.
            We believe that everyone deserves to find meaningful work that aligns with their skills, values, and
            aspirations. By leveraging cutting-edge technology and data-driven insights, we make the job search
            process faster, smarter, and more transparent for everyone involved.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-blue-100 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                QwikCareers was founded in 2020 by a team of HR professionals and technology experts who
                experienced firsthand the challenges of traditional job searching and recruiting.
              </p>
              <p>
                We saw talented professionals struggling to find the right opportunities, while companies
                spent countless hours sifting through unqualified applications. We knew there had to be a
                better way.
              </p>
              <p>
                Today, QwikCareers serves over 500,000 job seekers and 10,000 companies worldwide, with
                more than 100,000 successful placements. Our platform continues to evolve based on user
                feedback and industry trends, ensuring we always provide the best possible experience.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-8 md:p-12">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900 mb-2">2020 - Founded</h3>
                  <p className="text-gray-700 text-sm">QwikCareers launched with a vision to transform job searching</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900 mb-2">2021 - Rapid Growth</h3>
                  <p className="text-gray-700 text-sm">Reached 100,000 users and 1,000 partner companies</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900 mb-2">2023 - AI Integration</h3>
                  <p className="text-gray-700 text-sm">Introduced AI-powered job matching and recommendations</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  4
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900 mb-2">2025 - Market Leader</h3>
                  <p className="text-gray-700 text-sm">Now serving 500,000+ users and 10,000+ companies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={value.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Meet Our Leadership Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="h-64 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-blue-600">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have found their dream jobs through QwikCareers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register?role=jobseeker"
              className="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-blue-50 transition"
            >
              Find Jobs
            </a>
            <a
              href="/register?role=employer"
              className="bg-blue-500 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-400 transition border-2 border-white"
            >
              Post Jobs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
