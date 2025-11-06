/**
 * Email Configuration
 * Configuration for email service
 */

module.exports = {
  // Email service provider
  provider: process.env.EMAIL_PROVIDER || 'smtp', // smtp, sendgrid, mailgun, etc.

  // SMTP Configuration
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true' || false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASSWORD || '',
    },
  },

  // Email defaults
  from: {
    name: process.env.EMAIL_FROM_NAME || 'QwikCareers',
    email: process.env.EMAIL_FROM_ADDRESS || 'noreply@qwikcareers.com',
  },

  // Admin notification emails
  adminEmails: (process.env.ADMIN_EMAILS || '').split(',').filter(Boolean),

  // Email templates path
  templatesPath: __dirname + '/../templates/emails',

  // Feature flags
  enabled: process.env.EMAIL_ENABLED === 'true' || false, // Set to true once nodemailer is installed
  logOnly: process.env.EMAIL_LOG_ONLY === 'true' || true, // Log emails instead of sending (for development)
};
