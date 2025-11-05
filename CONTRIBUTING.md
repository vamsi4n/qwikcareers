# Contributing to QwikCareers

Thank you for your interest in contributing to QwikCareers! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and constructive in all interactions.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in the Issues section
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details (OS, browser, versions)

### Suggesting Features

1. Check if the feature has already been suggested
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Potential implementation approach

### Pull Requests

1. Fork the repository
2. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. Make your changes following our coding standards
4. Write or update tests as needed
5. Ensure all tests pass
6. Commit your changes with clear messages:
   ```bash
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve issue with..."
   ```

7. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

8. Create a Pull Request with:
   - Clear title and description
   - Reference to related issues
   - Screenshots/videos (if UI changes)
   - Test results

## Development Setup

### Prerequisites
- Node.js (v18+)
- MongoDB
- Redis
- Git

### Installation

1. Clone your fork:
```bash
git clone https://github.com/your-username/qwikcareers.git
cd qwikcareers
```

2. Install dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your configuration

# Frontend
cd ../frontend
cp .env.example .env
# Edit .env with your configuration

# Mobile
cd ../mobile
cp .env.example .env
# Edit .env with your configuration
```

4. Start development servers:
```bash
# From root directory
npm run dev
```

## Coding Standards

### General
- Use meaningful variable and function names
- Write clear comments for complex logic
- Keep functions small and focused
- Follow DRY (Don't Repeat Yourself) principle

### JavaScript/React
- Use ES6+ features
- Follow Airbnb JavaScript Style Guide
- Use functional components and hooks
- PropTypes or TypeScript for type checking

### Commit Messages
Follow the Conventional Commits specification:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat: add job search filters
fix: resolve authentication redirect issue
docs: update API documentation
```

### Testing
- Write unit tests for utilities and services
- Write integration tests for API endpoints
- Write component tests for React components
- Maintain test coverage above 80%

### Code Review
All submissions require code review:
- At least one approval from maintainers
- All CI checks must pass
- No merge conflicts
- Updated documentation (if needed)

## Project Structure

```
qwikcareers/
├── backend/          # Node.js/Express API
├── frontend/         # React web application
├── mobile/           # React Native mobile app
├── docs/             # Additional documentation
└── scripts/          # Utility scripts
```

## Running Tests

```bash
# Backend tests
npm run test:backend

# Frontend tests
npm run test:frontend

# Mobile tests
npm run test:mobile

# All tests
npm test
```

## Building for Production

```bash
# Backend
npm run build:backend

# Frontend
npm run build:frontend

# Mobile (iOS)
npm run build:mobile:ios

# Mobile (Android)
npm run build:mobile:android
```

## Documentation

- Update README.md for user-facing changes
- Update API documentation for API changes
- Add JSDoc comments for functions
- Update CHANGELOG.md

## Questions?

- Check existing documentation
- Search closed issues
- Ask in Discussions
- Contact maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to QwikCareers! 🎉
