export default function TermsPage() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing and using QwikCareers ("the Platform"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms of Service, please do not use the Platform.`,
    },
    {
      title: '2. Account Registration',
      content: `To use certain features of the Platform, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all activities that occur under your account.`,
    },
    {
      title: '3. User Conduct',
      content: `You agree not to use the Platform to:

• Post false, inaccurate, misleading, defamatory, or libelous content
• Impersonate any person or entity or misrepresent your affiliation with any person or entity
• Violate any local, state, national, or international law
• Transmit any viruses, worms, defects, or other items of a destructive nature
• Interfere with or disrupt the Platform or servers or networks connected to the Platform
• Collect or store personal data about other users without their consent
• Use the Platform for any unlawful purpose or to solicit the performance of any illegal activity`,
    },
    {
      title: '4. Job Postings and Applications',
      content: `Employers agree that all job postings are accurate and truthful. Job seekers agree to provide accurate information in their profiles and applications. Both parties acknowledge that QwikCareers is a platform facilitating connections and is not directly involved in the hiring process or employment relationship between employers and job seekers.`,
    },
    {
      title: '5. Payment and Refunds',
      content: `Subscription fees are billed in advance on a monthly or annual basis. All fees are non-refundable except as required by law. We reserve the right to change our pricing with 30 days notice to active subscribers. Cancellation of services will take effect at the end of the current billing period.`,
    },
    {
      title: '6. Intellectual Property',
      content: `The Platform and its original content, features, and functionality are owned by QwikCareers and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. Users retain ownership of content they post but grant QwikCareers a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute such content in connection with the Platform.`,
    },
    {
      title: '7. Privacy and Data Protection',
      content: `Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using the Platform, you consent to the collection and use of your information as described in our Privacy Policy.`,
    },
    {
      title: '8. Third-Party Links',
      content: `The Platform may contain links to third-party websites or services that are not owned or controlled by QwikCareers. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.`,
    },
    {
      title: '9. Disclaimer of Warranties',
      content: `The Platform is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied. QwikCareers does not warrant that the Platform will be uninterrupted, error-free, or free of viruses or other harmful components.`,
    },
    {
      title: '10. Limitation of Liability',
      content: `In no event shall QwikCareers, its directors, employees, partners, or agents be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Platform.`,
    },
    {
      title: '11. Indemnification',
      content: `You agree to defend, indemnify, and hold harmless QwikCareers and its affiliates from and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the Platform, violation of these Terms, or violation of any third-party rights.`,
    },
    {
      title: '12. Termination',
      content: `We may terminate or suspend your account and access to the Platform immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the Platform will immediately cease.`,
    },
    {
      title: '13. Governing Law',
      content: `These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. Any disputes arising from these Terms or use of the Platform shall be resolved in the courts located in San Francisco, California.`,
    },
    {
      title: '14. Changes to Terms',
      content: `We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.`,
    },
    {
      title: '15. Contact Information',
      content: `If you have any questions about these Terms, please contact us at:

Email: legal@qwikcareers.com
Address: 123 Business St, San Francisco, CA 94105
Phone: +1 (555) 123-4567`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl text-blue-100">Last updated: January 15, 2025</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="prose prose-blue max-w-none">
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Please read these Terms of Service ("Terms") carefully before using the QwikCareers platform. These
              Terms govern your access to and use of our services.
            </p>

            <div className="space-y-8">
              {sections.map((section, index) => (
                <div key={index} className="border-l-4 border-blue-600 pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{section.content}</p>
                </div>
              ))}
            </div>

            {/* Agreement Section */}
            <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Agreement</h3>
              <p className="text-gray-700">
                By clicking "I Agree" or by accessing or using the Platform, you acknowledge that you have read,
                understood, and agree to be bound by these Terms of Service and our Privacy Policy.
              </p>
            </div>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="/privacy"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                  Privacy Policy
                </h3>
                <p className="text-gray-600 text-sm">Learn how we protect your data</p>
              </div>
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          <a
            href="/contact"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                  Contact Us
                </h3>
                <p className="text-gray-600 text-sm">Have questions? Get in touch</p>
              </div>
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
