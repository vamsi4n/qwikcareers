const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const morgan = require('morgan');

const authRoutes = require('./modules/auth/routes/auth.routes');
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

// 404 handler
app.use(notFound);

// Error handling
app.use(errorConverter);
app.use(errorHandler);

module.exports = app;