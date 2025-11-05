import { ReactNode } from 'react';
import { Permission } from '../../utils/permissions';
import { usePermissions } from '../../../hooks/usePermissions';

interface PermissionGuardProps {
  /** Single permission required */
  permission?: Permission;

  /** Multiple permissions (user must have ANY) */
  anyOf?: Permission[];

  /** Multiple permissions (user must have ALL) */
  allOf?: Permission[];

  /** Content to render if user has permission */
  children: ReactNode;

  /** Optional content to render if user doesn't have permission */
  fallback?: ReactNode;

  /** If true, hides the element instead of unmounting (useful for SEO) */
  hideInsteadOfUnmount?: boolean;
}

/**
 * PermissionGuard Component
 * Conditionally renders children based on user permissions
 *
 * @example
 * // Render button only if user can manage users
 * <PermissionGuard permission={Permission.MANAGE_USERS}>
 *   <button>Delete User</button>
 * </PermissionGuard>
 *
 * @example
 * // Render section if user has any of the permissions
 * <PermissionGuard anyOf={[Permission.VIEW_USERS, Permission.MANAGE_USERS]}>
 *   <UsersList />
 * </PermissionGuard>
 *
 * @example
 * // Show fallback content if user doesn't have permission
 * <PermissionGuard
 *   permission={Permission.VIEW_ANALYTICS}
 *   fallback={<p>You don't have access to analytics</p>}
 * >
 *   <AnalyticsChart />
 * </PermissionGuard>
 */
const PermissionGuard = ({
  permission,
  anyOf,
  allOf,
  children,
  fallback = null,
  hideInsteadOfUnmount = false,
}: PermissionGuardProps) => {
  const { can, canAny, canAll } = usePermissions();

  let hasAccess = false;

  // Check single permission
  if (permission) {
    hasAccess = can(permission);
  }
  // Check if user has ANY of the specified permissions
  else if (anyOf && anyOf.length > 0) {
    hasAccess = canAny(anyOf);
  }
  // Check if user has ALL of the specified permissions
  else if (allOf && allOf.length > 0) {
    hasAccess = canAll(allOf);
  }
  // If no permission specified, allow access by default
  else {
    hasAccess = true;
  }

  // Hide instead of unmount (useful for SEO)
  if (hideInsteadOfUnmount) {
    return (
      <div style={{ display: hasAccess ? 'block' : 'none' }}>
        {hasAccess ? children : fallback}
      </div>
    );
  }

  // Standard conditional rendering
  return <>{hasAccess ? children : fallback}</>;
};

export default PermissionGuard;
