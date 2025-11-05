job-portal-mobile/
│
├── android/
│   └── (Android native files)
│
├── ios/
│   └── (iOS native files)
│
├── src/
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── screens/
│   │   │   │   ├── LoginScreen.jsx
│   │   │   │   ├── RegisterScreen.jsx
│   │   │   │   ├── ForgotPasswordScreen.jsx
│   │   │   │   └── VerifyEmailScreen.jsx
│   │   │   ├── components/
│   │   │   │   ├── LoginForm/
│   │   │   │   ├── RegisterForm/
│   │   │   │   └── SocialLoginButtons/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   └── index.js
│   │   │
│   │   ├── jobseeker/
│   │   │   ├── screens/
│   │   │   │   ├── ProfileScreen.jsx
│   │   │   │   ├── EditProfileScreen.jsx
│   │   │   │   ├── ResumeScreen.jsx
│   │   │   │   └── DashboardScreen.jsx
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   └── index.js
│   │   │
│   │   ├── employer/
│   │   │   ├── screens/
│   │   │   │   ├── DashboardScreen.jsx
│   │   │   │   ├── PostJobScreen.jsx
│   │   │   │   ├── ManageJobsScreen.jsx
│   │   │   │   └── ApplicantsScreen.jsx
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   └── index.js
│   │   │
│   │   ├── jobs/
│   │   │   ├── screens/
│   │   │   │   ├── JobSearchScreen.jsx
│   │   │   │   ├── JobDetailsScreen.jsx
│   │   │   │   ├── SavedJobsScreen.jsx
│   │   │   │   └── JobAlertsScreen.jsx
│   │   │   ├── components/
│   │   │   │   ├── JobCard/
│   │   │   │   ├── JobList/
│   │   │   │   ├── SearchBar/
│   │   │   │   └── FilterSheet/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   └── index.js
│   │   │
│   │   ├── applications/
│   │   │   ├── screens/
│   │   │   │   ├── ApplyJobScreen.jsx
│   │   │   │   ├── MyApplicationsScreen.jsx
│   │   │   │   └── ApplicationDetailsScreen.jsx
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   └── index.js
│   │   │
│   │   ├── companies/
│   │   │   ├── screens/
│   │   │   │   ├── CompaniesScreen.jsx
│   │   │   │   └── CompanyProfileScreen.jsx
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   └── index.js
│   │   │
│   │   ├── messaging/
│   │   │   ├── screens/
│   │   │   │   ├── MessagesScreen.jsx
│   │   │   │   └── ChatScreen.jsx
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   └── index.js
│   │   │
│   │   └── notifications/
│   │       ├── screens/
│   │       │   └── NotificationsScreen.jsx
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── services/
│   │       ├── store/
│   │       └── index.js
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button/
│   │   │   │   ├── Input/
│   │   │   │   ├── Card/
│   │   │   │   ├── Avatar/
│   │   │   │   ├── Badge/
│   │   │   │   ├── Chip/
│   │   │   │   ├── Modal/
│   │   │   │   ├── BottomSheet/
│   │   │   │   ├── ActionSheet/
│   │   │   │   ├── Skeleton/
│   │   │   │   ├── Spinner/
│   │   │   │   └── Toast/
│   │   │   ├── layout/
│   │   │   │   ├── Screen/
│   │   │   │   ├── Header/
│   │   │   │   ├── TabBar/
│   │   │   │   └── Container/
│   │   │   └── common/
│   │   │       ├── Logo/
│   │   │       ├── SearchBar/
│   │   │       └── EmptyState/
│   │   │
│   │   ├── hooks/
│   │   │   ├── useDebounce.js
│   │   │   ├── useKeyboard.js
│   │   │   ├── useOrientation.js
│   │   │   └── usePushNotifications.js
│   │   │
│   │   ├── navigation/
│   │   │   ├── AppNavigator.jsx
│   │   │   ├── AuthNavigator.jsx
│   │   │   ├── MainTabNavigator.jsx
│   │   │   ├── EmployerNavigator.jsx
│   │   │   ├── JobseekerNavigator.jsx
│   │   │   └── navigationHelpers.js
│   │   │
│   │   ├── utils/
│   │   │   ├── api/
│   │   │   ├── validation/
│   │   │   ├── helpers/
│   │   │   ├── storage/
│   │   │   └── formatters/
│   │   │
│   │   ├── services/
│   │   │   ├── http.service.js
│   │   │   ├── storage.service.js
│   │   │   ├── push-notification.service.js
│   │   │   └── analytics.service.js
│   │   │
│   │   ├── constants/
│   │   │   ├── routes.constants.js
│   │   │   ├── api.constants.js
│   │   │   └── app.constants.js
│   │   │
│   │   ├── types/
│   │   │
│   │   ├── styles/
│   │   │   ├── theme/
│   │   │   │   ├── colors.js
│   │   │   │   ├── typography.js
│   │   │   │   ├── spacing.js
│   │   │   │   └── index.js
│   │   │   └── globalStyles.js
│   │   │
│   │   └── config/
│   │       ├── navigation.config.js
│   │       └── features.config.js
│   │
│   ├── store/
│   │   ├── index.js
│   │   ├── rootReducer.js
│   │   └── middleware/
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   ├── fonts/
│   │   └── animations/
│   │
│   ├── locales/
│   │   ├── en/
│   │   ├── es/
│   │   └── fr/
│   │
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── NotificationContext.jsx
│   │
│   ├── App.jsx
│   └── index.js
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── scripts/
│   ├── build-android.sh
│   └── build-ios.sh
│
├── .env
├── .env.development
├── .env.staging
├── .env.production
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── package.json
├── package-lock.json
├── babel.config.js
├── metro.config.js
├── jest.config.js
├── app.json
├── README.md
└── LICENSE