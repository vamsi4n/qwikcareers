const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const morgan = require('morgan');

const authRoutes = require('./modules/auth/routes/auth.routes');
const userRoutes = require('./modules/users/routes/user.routes');
const jobSeekerRoutes = require('./modules/jobseekers/routes/jobseeker.routes');
const employerRoutes = require('./modules/employers/routes/employer.routes');
const companyRoutes = require('./modules/companies/routes/company.routes');
const jobRoutes = require('./modules/jobs/routes/job.routes');
const applicationRoutes = require('./modules/applications/routes/application.routes');
const savedJobRoutes = require('./modules/saved-jobs/routes/saved-job.routes');
const jobAlertRoutes = require('./modules/job-alerts/routes/job-alert.routes');
const messagingRoutes = require('./modules/messaging/routes/messaging.routes');
const notificationRoutes = require('./modules/notifications/routes/notification.routes');
const reviewRoutes = require('./modules/reviews/routes/review.routes');
const { errorConverter, errorHandler } = require('./shared/middleware/error-handler.middleware');
const notFound = require('./shared/middleware/not-found.middleware');
const ApiError = require('./shared/utils/ApiError');
const httpStatus = require('./shared/constants/http-status.constants');

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors());
app.options('*', cors());

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitize data
app.use(mongoSanitize());

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/jobseekers', jobSeekerRoutes);
app.use('/api/v1/employers', employerRoutes);
app.use('/api/v1/companies', companyRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/saved-jobs', savedJobRoutes);
app.use('/api/v1/job-alerts', jobAlertRoutes);
app.use('/api/v1/messaging', messagingRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/reviews', reviewRoutes);

// 404 handler
app.use(notFound);

// Error handling
app.use(errorConverter);
app.use(errorHandler);

module.exports = app;