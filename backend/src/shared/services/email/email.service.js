/**
 * Email Service
 * Handles sending emails using configured email provider
 *
 * Note: This implementation logs emails by default. To enable actual email sending:
 * 1. Install nodemailer: npm install nodemailer
 * 2. Set EMAIL_ENABLED=true and EMAIL_LOG_ONLY=false in environment variables
 * 3. Configure SMTP settings in .env file
 */

const emailConfig = require('../../config/email.config');
const logger = require('../../utils/logger');

/**
 * Email Service Class
 */
class EmailService {
  constructor() {
    this.config = emailConfig;
    this.transporter = null;

    // Initialize transporter if email is enabled
    if (this.config.enabled && !this.config.logOnly) {
      this.initializeTransporter();
    }
  }

  /**
   * Initialize email transporter
   * Currently logs a message. Will use nodemailer when installed.
   */
  initializeTransporter() {
    logger.info('Email service initialized (nodemailer not installed - will log emails)');

    // TODO: Uncomment when nodemailer is installed
    // const nodemailer = require('nodemailer');
    // this.transporter = nodemailer.createTransport(this.config.smtp);
  }

  /**
   * Send an email
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email address
   * @param {string} options.subject - Email subject
   * @param {string} options.text - Plain text content
   * @param {string} options.html - HTML content
   * @param {string} options.template - Template name (optional)
   * @param {Object} options.context - Template context/data (optional)
   * @returns {Promise<Object>} Send result
   */
  async sendEmail(options) {
    const {to, subject, text, html, template, context} = options;

    // Build email message
    const message = {
      from: `${this.config.from.name} <${this.config.from.email}>`,
      to,
      subject,
      text,
      html: html || text,
    };

    // Log email for development/testing
    if (this.config.logOnly || !this.config.enabled) {
      logger.info('📧 Email (Log Mode):', {
        to: message.to,
        subject: message.subject,
        template: template || 'none',
        context: context || {},
      });

      return {
        success: true,
        messageId: `log-${Date.now()}`,
        mode: 'logged',
      };
    }

    // Send actual email when enabled
    try {
      // TODO: Uncomment when nodemailer is installed
      // const info = await this.transporter.sendMail(message);
      // logger.info('Email sent:', { messageId: info.messageId, to });
      // return { success: true, messageId: info.messageId };

      logger.warn('Email sending skipped - nodemailer not installed');
      return {
        success: false,
        error: 'Email service not configured',
      };
    } catch (error) {
      logger.error('Email send error:', error);
      throw error;
    }
  }

  /**
   * Send admin notification email
   * @param {string} subject - Email subject
   * @param {string} message - Email message
   * @param {Object} data - Additional data
   * @returns {Promise<Object>} Send result
   */
  async sendAdminNotification(subject, message, data = {}) {
    const adminEmails = this.config.adminEmails;

    if (!adminEmails || adminEmails.length === 0) {
      logger.warn('No admin emails configured for notifications');
      return { success: false, error: 'No admin emails configured' };
    }

    const html = this.generateAdminNotificationHTML(subject, message, data);

    return this.sendEmail({
      to: adminEmails.join(', '),
      subject: `[QwikCareers Admin] ${subject}`,
      text: message,
      html,
    });
  }

  /**
   * Generate HTML for admin notifications
   * @param {string} subject - Notification subject
   * @param {string} message - Notification message
   * @param {Object} data - Additional data
   * @returns {string} HTML content
   */
  generateAdminNotificationHTML(subject, message, data) {
    const dataRows = Object.entries(data)
      .map(([key, value]) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${key}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${value}</td>
        </tr>
      `)
      .join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${subject}</h1>
            </div>
            <div class="content">
              <p>${message}</p>
              ${dataRows ? `
                <table>
                  <tbody>${dataRows}</tbody>
                </table>
              ` : ''}
            </div>
            <div class="footer">
              <p>This is an automated message from QwikCareers Admin Panel</p>
              <p>&copy; ${new Date().getFullYear()} QwikCareers. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Send user notification email
   * @param {string} to - Recipient email
   * @param {string} subject - Email subject
   * @param {string} message - Email message
   * @returns {Promise<Object>} Send result
   */
  async sendUserNotification(to, subject, message) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>QwikCareers</h1>
            </div>
            <div class="content">
              <h2>${subject}</h2>
              <p>${message}</p>
            </div>
            <div class="footer">
              <p>This is an automated message from QwikCareers</p>
              <p>If you have questions, please contact support@qwikcareers.com</p>
              <p>&copy; ${new Date().getFullYear()} QwikCareers. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to,
      subject,
      text: message,
      html,
    });
  }
}

// Export singleton instance
module.exports = new EmailService();
