# Admin Redux Slice

A comprehensive Redux Toolkit slice for managing all admin operations in the QwikCareers platform.

## File Location

`/home/user/qwikcareers/frontend/src/store/slices/adminSlice.ts`

## Overview

This slice provides complete state management for admin operations including:
- User Management
- Content Moderation
- Analytics & Reporting
- System Settings
- Audit Logs

## Features

### 1. User Management
- Fetch users with advanced filtering (role, search, sorting, pagination)
- View individual user details
- Update user status (active, suspended, banned)
- Delete users

### 2. Content Moderation
- Fetch moderation queue with filters (content type, status, severity)
- View individual moderation items
- Approve content
- Reject reports
- Remove violating content
- Create new moderation reports

### 3. Analytics
- Platform-wide analytics
- User analytics
- Job analytics
- Recent activity tracking
- Configurable time periods (7 days, 30 days, 90 days, all time)

### 4. System Settings
- Fetch current system settings
- Update system settings
- Reset to default settings

### 5. Audit Logs
- Fetch audit logs with filters
- Filter by admin, action, target type, date range

## State Structure

```typescript
interface AdminState {
  // User Management
  users: User[];
  selectedUser: User | null;
  usersLoading: boolean;
  usersPagination: PaginationInfo | null;

  // Content Moderation
  moderationQueue: ModerationItem[];
  selectedModerationItem: ModerationItem | null;
  moderationLoading: boolean;
  moderationPagination: PaginationInfo | null;

  // Analytics
  platformAnalytics: any | null;
  userAnalytics: any | null;
  jobAnalytics: any | null;
  recentActivity: any | null;
  analyticsLoading: boolean;
  analyticsPeriod: '7days' | '30days' | '90days' | 'all';

  // Settings
  systemSettings: any | null;
  settingsLoading: boolean;

  // Audit Logs
  auditLogs: any[];
  auditLogsLoading: boolean;
  auditLogsPagination: PaginationInfo | null;

  // Global
  error: string | null;
}
```

## API Endpoints

All endpoints are prefixed with `/admin` and require admin authentication:

### User Management
- `GET /admin/users` - Fetch users
- `GET /admin/users/:userId` - Fetch user by ID
- `PATCH /admin/users/:userId/status` - Update user status
- `DELETE /admin/users/:userId` - Delete user

### Content Moderation
- `GET /admin/moderation` - Fetch moderation queue
- `GET /admin/moderation/:reportId` - Fetch moderation item
- `POST /admin/moderation/:reportId/approve` - Approve content
- `POST /admin/moderation/:reportId/reject` - Reject report
- `POST /admin/moderation/:reportId/remove` - Remove content
- `POST /admin/moderation` - Create moderation report

### Analytics
- `GET /admin/analytics/platform` - Platform analytics
- `GET /admin/analytics/users` - User analytics
- `GET /admin/analytics/jobs` - Job analytics
- `GET /admin/analytics/activity` - Recent activity

### Settings
- `GET /admin/settings` - Fetch settings
- `PUT /admin/settings` - Update settings
- `POST /admin/settings/reset` - Reset settings

### Audit Logs
- `GET /admin/audit-logs` - Fetch audit logs

## Async Thunks

### User Management
```typescript
fetchUsers(params?: FetchUsersParams)
fetchUserById(userId: string)
updateUserStatus({ userId: string, status: 'active' | 'suspended' | 'banned' })
deleteUser(userId: string)
```

### Content Moderation
```typescript
fetchModerationQueue(params?: FetchModerationQueueParams)
fetchModerationItemById(reportId: string)
approveContent({ reportId: string, resolution: string })
rejectReport({ reportId: string, resolution: string })
removeContent({ reportId: string, resolution: string })
createModerationReport(params: CreateModerationReportParams)
```

### Analytics
```typescript
fetchPlatformAnalytics(params?: { period: '7days' | '30days' | '90days' | 'all' })
fetchUserAnalytics(params?: { period: '7days' | '30days' | '90days' | 'all' })
fetchJobAnalytics(params?: { period: '7days' | '30days' | '90days' | 'all' })
fetchRecentActivity(params?: { limit: number })
```

### Settings
```typescript
fetchSystemSettings()
updateSystemSettings(settings: any)
resetSystemSettings()
```

### Audit Logs
```typescript
fetchAuditLogs(params?: FetchAuditLogsParams)
```

## Actions

### Helper Actions
```typescript
setAnalyticsPeriod(period: '7days' | '30days' | '90days' | 'all')
clearError()
clearSelectedUser()
clearSelectedModerationItem()
```

## Selectors

All selectors are exported for easy access:

```typescript
// User Management
selectUsers
selectSelectedUser
selectUsersLoading
selectUsersPagination

// Content Moderation
selectModerationQueue
selectSelectedModerationItem
selectModerationLoading
selectModerationPagination

// Analytics
selectPlatformAnalytics
selectUserAnalytics
selectJobAnalytics
selectRecentActivity
selectAnalyticsLoading
selectAnalyticsPeriod

// Settings
selectSystemSettings
selectSettingsLoading

// Audit Logs
selectAuditLogs
selectAuditLogsLoading
selectAuditLogsPagination

// Global
selectAdminError
```

## Usage Examples

### Basic User Management

```typescript
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchUsers,
  updateUserStatus,
  selectUsers,
  selectUsersLoading
} from '@/store/slices/adminSlice';

function UserManagement() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const loading = useAppSelector(selectUsersLoading);

  useEffect(() => {
    dispatch(fetchUsers({
      page: 1,
      limit: 20,
      role: 'jobseeker'
    }));
  }, [dispatch]);

  const handleSuspendUser = (userId: string) => {
    dispatch(updateUserStatus({ userId, status: 'suspended' }));
  };

  return (
    <div>
      {loading ? <Loading /> : (
        <UserList users={users} onSuspend={handleSuspendUser} />
      )}
    </div>
  );
}
```

### Content Moderation

```typescript
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchModerationQueue,
  approveContent,
  removeContent,
  selectModerationQueue
} from '@/store/slices/adminSlice';

function ContentModeration() {
  const dispatch = useAppDispatch();
  const moderationQueue = useAppSelector(selectModerationQueue);

  useEffect(() => {
    dispatch(fetchModerationQueue({
      status: 'pending',
      severity: 'high'
    }));
  }, [dispatch]);

  const handleApprove = (reportId: string) => {
    dispatch(approveContent({
      reportId,
      resolution: 'Content approved after review'
    }));
  };

  const handleRemove = (reportId: string) => {
    dispatch(removeContent({
      reportId,
      resolution: 'Content removed for policy violation'
    }));
  };

  return <ModerationQueue items={moderationQueue} />;
}
```

### Analytics Dashboard

```typescript
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchPlatformAnalytics,
  fetchUserAnalytics,
  setAnalyticsPeriod,
  selectPlatformAnalytics,
  selectAnalyticsPeriod
} from '@/store/slices/adminSlice';

function AnalyticsDashboard() {
  const dispatch = useAppDispatch();
  const platformAnalytics = useAppSelector(selectPlatformAnalytics);
  const period = useAppSelector(selectAnalyticsPeriod);

  const handlePeriodChange = (newPeriod: '7days' | '30days' | '90days' | 'all') => {
    dispatch(setAnalyticsPeriod(newPeriod));
    dispatch(fetchPlatformAnalytics({ period: newPeriod }));
    dispatch(fetchUserAnalytics({ period: newPeriod }));
  };

  return <AnalyticsView data={platformAnalytics} period={period} />;
}
```

## Error Handling

All async thunks include proper error handling:

```typescript
try {
  const result = await dispatch(fetchUsers({ page: 1 }));

  if (fetchUsers.fulfilled.match(result)) {
    // Success
    console.log('Users loaded:', result.payload);
  } else if (fetchUsers.rejected.match(result)) {
    // Error
    console.error('Error:', result.payload);
  }
} catch (error) {
  console.error('Unexpected error:', error);
}
```

Error messages are stored in `state.error` and can be accessed via `selectAdminError`:

```typescript
const error = useAppSelector(selectAdminError);

useEffect(() => {
  if (error) {
    toast.error(error);
    dispatch(clearError());
  }
}, [error, dispatch]);
```

## TypeScript Support

All types are fully typed with TypeScript:
- Request parameters
- Response types
- State interface
- Action payloads

## Integration

The slice is already integrated into the Redux store:

```typescript
// store/index.ts
import adminReducer from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    // ... other reducers
    admin: adminReducer,
  },
});
```

## Testing

See `adminSlice.usage.example.ts` for comprehensive usage examples.

## Notes

- All API calls use the configured axios instance with authentication interceptors
- Pagination is handled consistently across all list endpoints
- Loading states are managed separately for different sections (users, moderation, analytics, etc.)
- Error states are centralized for easier error handling
- The slice follows Redux Toolkit best practices with proper TypeScript typing
