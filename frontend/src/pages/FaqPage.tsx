import { useState } from 'react';

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openQuestionId, setOpenQuestionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'jobseeker', name: 'For Job Seekers' },
    { id: 'employer', name: 'For Employers' },
    { id: 'account', name: 'Account & Billing' },
    { id: 'technical', name: 'Technical Support' },
  ];

  const faqs = [
    // Job Seeker Questions
    {
      id: 1,
      category: 'jobseeker',
      question: 'How do I create a job seeker account?',
      answer:
        'Click on "Register" at the top of the page, select "Job Seeker" as your account type, and fill in your basic information. You\'ll receive a confirmation email to verify your account. Once verified, you can complete your profile and start applying for jobs.',
    },
    {
      id: 2,
      category: 'jobseeker',
      question: 'How do I upload my resume?',
      answer:
        'After logging in, go to your profile settings and click on "Resume" in the menu. You can upload multiple resumes in PDF or DOC format (max 5MB each). You can also designate one as your primary resume which will be used for quick apply features.',
    },
    {
      id: 3,
      category: 'jobseeker',
      question: 'How does the job recommendation system work?',
      answer:
        'Our AI-powered recommendation system analyzes your profile, skills, experience, and preferences to suggest relevant job opportunities. The more complete your profile is, the better the recommendations you\'ll receive. You can also see a match score for each recommended job.',
    },
    {
      id: 4,
      category: 'jobseeker',
      question: 'Can I apply to multiple jobs at once?',
      answer:
        'Yes! You can apply to as many jobs as you like. We offer a "Quick Apply" feature for jobs that accept it, allowing you to apply with your saved profile information and primary resume in just one click.',
    },
    {
      id: 5,
      category: 'jobseeker',
      question: 'How do I track my job applications?',
      answer:
        'Visit your Applications page to see all your submitted applications. You can filter by status (pending, reviewing, interview, etc.) and see detailed timelines for each application. You\'ll also receive email notifications when there are updates.',
    },
    {
      id: 6,
      category: 'jobseeker',
      question: 'What should I do if I haven\'t heard back from an employer?',
      answer:
        'Most employers review applications within 1-2 weeks. If it\'s been longer, you can send a polite follow-up message through our messaging system. However, we recommend waiting at least 2 weeks before following up.',
    },
    // Employer Questions
    {
      id: 7,
      category: 'employer',
      question: 'How do I post a job?',
      answer:
        'After creating an employer account and completing your company profile, go to your dashboard and click "Post a Job." Fill in the job details including title, description, requirements, and salary range. You can preview your job posting before publishing it.',
    },
    {
      id: 8,
      category: 'employer',
      question: 'What are the different pricing plans?',
      answer:
        'We offer three plans: Basic ($99/month) for 5 job postings, Professional ($299/month) for 50 postings plus advanced features like candidate database access, and Enterprise (custom pricing) with unlimited postings and dedicated support. All plans include a 14-day free trial.',
    },
    {
      id: 9,
      category: 'employer',
      question: 'How long will my job posting be active?',
      answer:
        'Standard job postings remain active for 30 days. You can edit, renew, or close a posting at any time from your dashboard. We also offer featured listings that get priority placement for an additional fee.',
    },
    {
      id: 10,
      category: 'employer',
      question: 'Can I search for candidates directly?',
      answer:
        'Yes! Professional and Enterprise plans include access to our Candidate Database where you can search for potential candidates based on skills, experience, location, and other criteria. You can also save candidate profiles and contact them directly.',
    },
    {
      id: 11,
      category: 'employer',
      question: 'How do I manage my team members?',
      answer:
        'Go to Settings > Team to add or remove team members. You can assign different roles (Admin, Recruiter, Viewer) with varying levels of access. Team members can collaborate on job postings and applications.',
    },
    // Account & Billing
    {
      id: 12,
      category: 'account',
      question: 'How do I reset my password?',
      answer:
        'Click on "Forgot Password" on the login page and enter your email address. You\'ll receive a password reset link via email. For security reasons, reset links expire after 24 hours.',
    },
    {
      id: 13,
      category: 'account',
      question: 'How do I upgrade or downgrade my plan?',
      answer:
        'Go to Settings > Billing and click "Change Plan." You can upgrade immediately, and downgrades take effect at the end of your current billing cycle. Any unused credits will be pro-rated.',
    },
    {
      id: 14,
      category: 'account',
      question: 'Can I cancel my subscription?',
      answer:
        'Yes, you can cancel anytime from Settings > Billing. Your account will remain active until the end of your paid period. You won\'t be charged again, but you\'ll lose access to premium features after the current period ends.',
    },
    {
      id: 15,
      category: 'account',
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and bank transfers for Enterprise plans. All payments are processed securely through our payment processor.',
    },
    {
      id: 16,
      category: 'account',
      question: 'How do I delete my account?',
      answer:
        'Go to Settings > Account > Delete Account. Note that this action is permanent and will delete all your data including profile, applications, and messages. We recommend downloading any important information before deletion.',
    },
    // Technical Support
    {
      id: 17,
      category: 'technical',
      question: 'Why can\'t I upload my resume?',
      answer:
        'Ensure your resume is in PDF or DOC format and under 5MB. Also check that your browser allows file uploads and that you have a stable internet connection. If the problem persists, try using a different browser or clearing your cache.',
    },
    {
      id: 18,
      category: 'technical',
      question: 'I\'m not receiving email notifications',
      answer:
        'Check your spam/junk folder first. Then go to Settings > Notifications and ensure email notifications are enabled. Add support@qwikcareers.com to your contacts to prevent our emails from being filtered.',
    },
    {
      id: 19,
      category: 'technical',
      question: 'The website is running slowly. What should I do?',
      answer:
        'Try clearing your browser cache and cookies, or use an incognito/private window. Ensure you\'re using a modern browser (Chrome, Firefox, Safari, or Edge). If the issue persists, it might be temporary server maintenance - check our status page.',
    },
    {
      id: 20,
      category: 'technical',
      question: 'How do I report a bug or technical issue?',
      answer:
        'Contact us through the Contact page and select "Report a Bug" as your inquiry type. Include details about what happened, steps to reproduce the issue, your browser/device information, and any screenshots if applicable.',
    },
  ];

  const toggleQuestion = (questionId) => {
    setOpenQuestionId(openQuestionId === questionId ? null : questionId);
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Find answers to common questions about QwikCareers
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        {filteredFaqs.length === 0 ? (
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
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">Try different keywords or browse by category</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-lg shadow hover:shadow-md transition">
                <button
                  onClick={() => toggleQuestion(faq.id)}
                  className="w-full text-left p-6 flex justify-between items-start"
                >
                  <span className="font-semibold text-gray-900 pr-8">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-blue-600 flex-shrink-0 transition-transform ${
                      openQuestionId === faq.id ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openQuestionId === faq.id && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Still Have Questions Section */}
        <div className="mt-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-blue-50 transition inline-flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Contact Support
            </a>
            <a
              href="mailto:support@qwikcareers.com"
              className="bg-blue-500 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-400 transition border-2 border-white inline-flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
