# QwikCareers - Job Portal Application

A comprehensive job portal application with frontend (web), backend (API), and mobile support.

## Project Structure

This monorepo contains three main applications:

- **backend/** - Node.js/Express REST API server
- **frontend/** - React web application
- **mobile/** - React Native mobile application

## Features

### For Job Seekers
- User registration and authentication
- Profile management with resume builder
- Job search with advanced filters
- Application tracking
- Job recommendations
- Saved jobs and job alerts
- Company reviews and insights
- Real-time messaging with employers

### For Employers
- Company profile management
- Job posting and management
- Applicant tracking system (ATS)
- Candidate database search
- Interview scheduling
- Analytics and reporting
- Team management

### Admin Features
- User management
- Content moderation
- Platform analytics
- System settings
- Fraud detection

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB (Database)
- Redis (Caching)
- Elasticsearch (Search)
- Socket.io (Real-time communication)
- Bull (Job queues)
- JWT Authentication
- Payment integration (Stripe/Razorpay)

### Frontend
- React 18
- Redux Toolkit (State management)
- React Router (Navigation)
- Axios (HTTP client)
- Tailwind CSS (Styling)
- Vite (Build tool)

### Mobile
- React Native
- Redux Toolkit
- React Navigation
- Axios
- Native modules for push notifications

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Redis
- Elasticsearch (optional, for search features)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/qwikcareers.git
cd qwikcareers
```

2. Install backend dependencies
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file
npm run dev
```

3. Install frontend dependencies
```bash
cd frontend
npm install
cp .env.example .env
# Configure your .env file
npm run dev
```

4. Install mobile dependencies
```bash
cd mobile
npm install
cp .env.example .env
# Configure your .env file

# For iOS
cd ios && pod install && cd ..
npm run ios

# For Android
npm run android
```

## Environment Variables

### Backend
See `backend/.env.example` for required environment variables.

### Frontend
See `frontend/.env.example` for required environment variables.

### Mobile
See `mobile/.env.example` for required environment variables.

## Development

### Running Tests

Backend:
```bash
cd backend
npm test
```

Frontend:
```bash
cd frontend
npm test
```

Mobile:
```bash
cd mobile
npm test
```

### Building for Production

Backend:
```bash
cd backend
npm run build
npm start
```

Frontend:
```bash
cd frontend
npm run build
```

Mobile:
```bash
cd mobile
# For iOS
npm run build:ios

# For Android
npm run build:android
```

## API Documentation

API documentation is available at `/api-docs` when running the backend server.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@qwikcareers.com or join our Slack channel.

## Roadmap

- [ ] Video interviews
- [ ] AI-powered resume screening
- [ ] Skills assessments
- [ ] Salary benchmarking
- [ ] Career path recommendations
- [ ] Integration with LinkedIn
- [ ] Mobile app improvements

## Authors

- Your Team Name

## Acknowledgments

- Thanks to all contributors
- Inspired by leading job portals
