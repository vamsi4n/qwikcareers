/**
 * Permission System
 * Defines all available permissions and permission checking utilities
 */

export enum Permission {
  // User Management
  MANAGE_USERS = 'manage_users',
  VIEW_USERS = 'view_users',
  SUSPEND_USERS = 'suspend_users',
  DELETE_USERS = 'delete_users',

  // Content Moderation
  MODERATE_CONTENT = 'moderate_content',
  VIEW_MODERATION_QUEUE = 'view_moderation_queue',
  APPROVE_CONTENT = 'approve_content',
  REMOVE_CONTENT = 'remove_content',

  // Analytics
  VIEW_ANALYTICS = 'view_analytics',
  EXPORT_ANALYTICS = 'export_analytics',

  // Settings
  MANAGE_SETTINGS = 'manage_settings',
  VIEW_SETTINGS = 'view_settings',

  // Audit Logs
  VIEW_AUDIT_LOGS = 'view_audit_logs',

  // Job Management
  MANAGE_ALL_JOBS = 'manage_all_jobs',
  DELETE_ANY_JOB = 'delete_any_job',

  // Company Management
  MANAGE_COMPANIES = 'manage_companies',
  VERIFY_COMPANIES = 'verify_companies',

  // Reviews
  MODERATE_REVIEWS = 'moderate_reviews',
  DELETE_REVIEWS = 'delete_reviews',

  // System
  MANAGE_PERMISSIONS = 'manage_permissions',
  SYSTEM_MAINTENANCE = 'system_maintenance',
}

/**
 * Role-based permission mappings
 * Defines which permissions each role has
 */
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: [
    // Full access to all permissions
    Permission.MANAGE_USERS,
    Permission.VIEW_USERS,
    Permission.SUSPEND_USERS,
    Permission.DELETE_USERS,
    Permission.MODERATE_CONTENT,
    Permission.VIEW_MODERATION_QUEUE,
    Permission.APPROVE_CONTENT,
    Permission.REMOVE_CONTENT,
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_ANALYTICS,
    Permission.MANAGE_SETTINGS,
    Permission.VIEW_SETTINGS,
    Permission.VIEW_AUDIT_LOGS,
    Permission.MANAGE_ALL_JOBS,
    Permission.DELETE_ANY_JOB,
    Permission.MANAGE_COMPANIES,
    Permission.VERIFY_COMPANIES,
    Permission.MODERATE_REVIEWS,
    Permission.DELETE_REVIEWS,
    Permission.MANAGE_PERMISSIONS,
    Permission.SYSTEM_MAINTENANCE,
  ],
  moderator: [
    // Moderator has limited permissions
    Permission.VIEW_USERS,
    Permission.MODERATE_CONTENT,
    Permission.VIEW_MODERATION_QUEUE,
    Permission.APPROVE_CONTENT,
    Permission.REMOVE_CONTENT,
    Permission.VIEW_ANALYTICS,
    Permission.MODERATE_REVIEWS,
  ],
  employer: [
    // Employer permissions (for their own content)
    // Note: These are basic permissions, additional checks needed for ownership
  ],
  jobseeker: [
    // Jobseeker permissions (for their own content)
    // Note: These are basic permissions, additional checks needed for ownership
  ],
};

/**
 * Check if a user has a specific permission
 * @param userRole - User's role
 * @param permission - Permission to check
 * @param userPermissions - Optional custom permissions array
 * @returns boolean
 */
export const hasPermission = (
  userRole: string,
  permission: Permission,
  userPermissions?: Permission[]
): boolean => {
  // If custom permissions provided, check those
  if (userPermissions && userPermissions.length > 0) {
    return userPermissions.includes(permission);
  }

  // Otherwise check role-based permissions
  const rolePerms = ROLE_PERMISSIONS[userRole] || [];
  return rolePerms.includes(permission);
};

/**
 * Check if user has ANY of the specified permissions
 * @param userRole - User's role
 * @param permissions - Array of permissions to check
 * @param userPermissions - Optional custom permissions array
 * @returns boolean
 */
export const hasAnyPermission = (
  userRole: string,
  permissions: Permission[],
  userPermissions?: Permission[]
): boolean => {
  return permissions.some((permission) =>
    hasPermission(userRole, permission, userPermissions)
  );
};

/**
 * Check if user has ALL of the specified permissions
 * @param userRole - User's role
 * @param permissions - Array of permissions to check
 * @param userPermissions - Optional custom permissions array
 * @returns boolean
 */
export const hasAllPermissions = (
  userRole: string,
  permissions: Permission[],
  userPermissions?: Permission[]
): boolean => {
  return permissions.every((permission) =>
    hasPermission(userRole, permission, userPermissions)
  );
};

/**
 * Get all permissions for a role
 * @param userRole - User's role
 * @returns Array of permissions
 */
export const getPermissionsForRole = (userRole: string): Permission[] => {
  return ROLE_PERMISSIONS[userRole] || [];
};

/**
 * Check if user can access admin panel
 * @param userRole - User's role
 * @returns boolean
 */
export const canAccessAdminPanel = (userRole: string): boolean => {
  return ['admin', 'moderator'].includes(userRole);
};

/**
 * Permission action labels for UI display
 */
export const PERMISSION_LABELS: Record<Permission, string> = {
  [Permission.MANAGE_USERS]: 'Manage Users',
  [Permission.VIEW_USERS]: 'View Users',
  [Permission.SUSPEND_USERS]: 'Suspend Users',
  [Permission.DELETE_USERS]: 'Delete Users',
  [Permission.MODERATE_CONTENT]: 'Moderate Content',
  [Permission.VIEW_MODERATION_QUEUE]: 'View Moderation Queue',
  [Permission.APPROVE_CONTENT]: 'Approve Content',
  [Permission.REMOVE_CONTENT]: 'Remove Content',
  [Permission.VIEW_ANALYTICS]: 'View Analytics',
  [Permission.EXPORT_ANALYTICS]: 'Export Analytics',
  [Permission.MANAGE_SETTINGS]: 'Manage Settings',
  [Permission.VIEW_SETTINGS]: 'View Settings',
  [Permission.VIEW_AUDIT_LOGS]: 'View Audit Logs',
  [Permission.MANAGE_ALL_JOBS]: 'Manage All Jobs',
  [Permission.DELETE_ANY_JOB]: 'Delete Any Job',
  [Permission.MANAGE_COMPANIES]: 'Manage Companies',
  [Permission.VERIFY_COMPANIES]: 'Verify Companies',
  [Permission.MODERATE_REVIEWS]: 'Moderate Reviews',
  [Permission.DELETE_REVIEWS]: 'Delete Reviews',
  [Permission.MANAGE_PERMISSIONS]: 'Manage Permissions',
  [Permission.SYSTEM_MAINTENANCE]: 'System Maintenance',
};

/**
 * Permission descriptions for UI
 */
export const PERMISSION_DESCRIPTIONS: Record<Permission, string> = {
  [Permission.MANAGE_USERS]: 'Full access to create, update, and delete users',
  [Permission.VIEW_USERS]: 'View user profiles and information',
  [Permission.SUSPEND_USERS]: 'Suspend or activate user accounts',
  [Permission.DELETE_USERS]: 'Permanently delete user accounts',
  [Permission.MODERATE_CONTENT]: 'Full content moderation capabilities',
  [Permission.VIEW_MODERATION_QUEUE]: 'View pending moderation items',
  [Permission.APPROVE_CONTENT]: 'Approve flagged content',
  [Permission.REMOVE_CONTENT]: 'Remove violating content',
  [Permission.VIEW_ANALYTICS]: 'View platform analytics and insights',
  [Permission.EXPORT_ANALYTICS]: 'Export analytics data',
  [Permission.MANAGE_SETTINGS]: 'Modify system settings and configuration',
  [Permission.VIEW_SETTINGS]: 'View system settings',
  [Permission.VIEW_AUDIT_LOGS]: 'View audit logs and admin activity',
  [Permission.MANAGE_ALL_JOBS]: 'Manage all job postings regardless of owner',
  [Permission.DELETE_ANY_JOB]: 'Delete any job posting',
  [Permission.MANAGE_COMPANIES]: 'Manage company profiles and information',
  [Permission.VERIFY_COMPANIES]: 'Verify company authenticity',
  [Permission.MODERATE_REVIEWS]: 'Moderate company and job reviews',
  [Permission.DELETE_REVIEWS]: 'Delete reviews',
  [Permission.MANAGE_PERMISSIONS]: 'Manage user roles and permissions',
  [Permission.SYSTEM_MAINTENANCE]: 'Perform system maintenance tasks',
};
