export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: '1. Information We Collect',
      content: `We collect information you provide directly to us, including:

• Account Information: Name, email address, password, phone number, and profile details
• Resume and Application Data: Work history, education, skills, and other career-related information
• Payment Information: Credit card details and billing address (processed securely through third-party payment processors)
• Communications: Messages sent through our platform, support inquiries, and feedback
• Usage Data: Information about how you use our platform, including pages visited, features used, and time spent
• Device Information: IP address, browser type, operating system, and device identifiers`,
    },
    {
      title: '2. How We Use Your Information',
      content: `We use the information we collect to:

• Provide, maintain, and improve our services
• Create and manage your account
• Match job seekers with relevant job opportunities
• Facilitate communication between employers and job seekers
• Process payments and prevent fraud
• Send administrative notifications and updates
• Respond to your comments, questions, and support requests
• Analyze usage patterns and improve user experience
• Comply with legal obligations and enforce our terms`,
    },
    {
      title: '3. Information Sharing and Disclosure',
      content: `We may share your information in the following circumstances:

• With Employers: When you apply for a job, your profile, resume, and application materials are shared with the employer
• With Job Seekers: Employers can view candidate profiles in our database (Professional and Enterprise plans only)
• With Service Providers: Third-party vendors who help us operate our platform (payment processors, email services, analytics providers)
• For Legal Reasons: To comply with laws, regulations, legal processes, or governmental requests
• Business Transfers: In connection with a merger, acquisition, or sale of assets
• With Your Consent: When you give us explicit permission to share specific information`,
    },
    {
      title: '4. Data Security',
      content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:

• SSL/TLS encryption for data transmission
• Encrypted storage of sensitive information
• Regular security audits and penetration testing
• Access controls and authentication requirements
• Employee training on data protection practices

However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.`,
    },
    {
      title: '5. Your Privacy Rights',
      content: `Depending on your location, you may have the following rights:

• Access: Request a copy of your personal information
• Correction: Update or correct inaccurate information
• Deletion: Request deletion of your personal information
• Portability: Receive your data in a structured, machine-readable format
• Objection: Object to processing of your information for certain purposes
• Restriction: Request restriction of processing under certain circumstances
• Opt-out: Unsubscribe from marketing communications at any time

To exercise these rights, contact us at privacy@qwikcareers.com`,
    },
    {
      title: '6. Cookies and Tracking Technologies',
      content: `We use cookies and similar tracking technologies to:

• Remember your preferences and settings
• Understand how you use our platform
• Provide personalized content and recommendations
• Analyze traffic and usage patterns
• Prevent fraud and enhance security

You can control cookies through your browser settings, but disabling them may affect platform functionality.`,
    },
    {
      title: '7. Data Retention',
      content: `We retain your personal information for as long as necessary to:

• Provide our services to you
• Comply with legal obligations
• Resolve disputes and enforce our agreements
• Maintain business records

When you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it by law.`,
    },
    {
      title: '8. Children\'s Privacy',
      content: `Our platform is not intended for users under the age of 16. We do not knowingly collect personal information from children. If we discover that we have collected information from a child without parental consent, we will delete that information immediately.`,
    },
    {
      title: '9. International Data Transfers',
      content: `Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that are different from the laws of your country. We take appropriate safeguards to ensure your information receives adequate protection.`,
    },
    {
      title: '10. California Privacy Rights (CCPA)',
      content: `If you are a California resident, you have additional rights under the California Consumer Privacy Act:

• Right to know what personal information is collected, used, shared, or sold
• Right to delete personal information
• Right to opt-out of the sale of personal information (Note: We do not sell personal information)
• Right to non-discrimination for exercising your privacy rights`,
    },
    {
      title: '11. European Privacy Rights (GDPR)',
      content: `If you are in the European Economic Area, you have rights under the General Data Protection Regulation:

• Legal basis for processing your information
• Right to withdraw consent at any time
• Right to lodge a complaint with a supervisory authority
• Data protection officer contact information

Our legal basis for processing includes contract performance, legal obligations, legitimate interests, and your consent.`,
    },
    {
      title: '12. Changes to Privacy Policy',
      content: `We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. Continued use of the platform after changes constitute acceptance of the updated policy.`,
    },
    {
      title: '13. Contact Us',
      content: `If you have questions or concerns about this Privacy Policy or our data practices, please contact us:

Email: privacy@qwikcareers.com
Address: 123 Business St, San Francisco, CA 94105
Phone: +1 (555) 123-4567
Data Protection Officer: dpo@qwikcareers.com`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-blue-100">Last updated: January 15, 2025</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="prose prose-blue max-w-none">
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              At QwikCareers, we take your privacy seriously. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your personal information when you use our platform.
            </p>

            <div className="space-y-8">
              {sections.map((section, index) => (
                <div key={index} className="border-l-4 border-blue-600 pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{section.content}</p>
                </div>
              ))}
            </div>

            {/* Commitment Section */}
            <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Commitment to Your Privacy</h3>
              <p className="text-gray-700">
                We are committed to protecting your privacy and ensuring transparency in how we handle your data. We
                will never sell your personal information to third parties for marketing purposes.
              </p>
            </div>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="/terms"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                  Terms of Service
                </h3>
                <p className="text-gray-600 text-sm">Read our terms and conditions</p>
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
                <p className="text-gray-600 text-sm">Privacy questions? Reach out</p>
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
