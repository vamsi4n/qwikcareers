import { useMemo } from 'react';
import { useAppSelector } from '../store';
import {
  Permission,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getPermissionsForRole,
  canAccessAdminPanel,
} from '../shared/utils/permissions';

/**
 * Custom hook for permission checking
 * Provides easy access to permission-related utilities
 */
export const usePermissions = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Get user role and custom permissions
  const userRole = user?.role || '';
  const userPermissions = user?.permissions || [];

  /**
   * Check if user has a specific permission
   */
  const checkPermission = useMemo(
    () => (permission: Permission): boolean => {
      if (!isAuthenticated || !user) return false;
      return hasPermission(userRole, permission, userPermissions);
    },
    [isAuthenticated, user, userRole, userPermissions]
  );

  /**
   * Check if user has ANY of the specified permissions
   */
  const checkAnyPermission = useMemo(
    () => (permissions: Permission[]): boolean => {
      if (!isAuthenticated || !user) return false;
      return hasAnyPermission(userRole, permissions, userPermissions);
    },
    [isAuthenticated, user, userRole, userPermissions]
  );

  /**
   * Check if user has ALL of the specified permissions
   */
  const checkAllPermissions = useMemo(
    () => (permissions: Permission[]): boolean => {
      if (!isAuthenticated || !user) return false;
      return hasAllPermissions(userRole, permissions, userPermissions);
    },
    [isAuthenticated, user, userRole, userPermissions]
  );

  /**
   * Get all permissions for current user
   */
  const allPermissions = useMemo(() => {
    if (!isAuthenticated || !user) return [];
    if (userPermissions.length > 0) return userPermissions;
    return getPermissionsForRole(userRole);
  }, [isAuthenticated, user, userRole, userPermissions]);

  /**
   * Check if user can access admin panel
   */
  const canAccessAdmin = useMemo(() => {
    if (!isAuthenticated || !user) return false;
    return canAccessAdminPanel(userRole);
  }, [isAuthenticated, user, userRole]);

  /**
   * Check if user is admin
   */
  const isAdmin = useMemo(() => {
    return userRole === 'admin';
  }, [userRole]);

  /**
   * Check if user is moderator
   */
  const isModerator = useMemo(() => {
    return userRole === 'moderator';
  }, [userRole]);

  /**
   * Check if user is employer
   */
  const isEmployer = useMemo(() => {
    return userRole === 'employer';
  }, [userRole]);

  /**
   * Check if user is jobseeker
   */
  const isJobSeeker = useMemo(() => {
    return userRole === 'jobseeker';
  }, [userRole]);

  return {
    // Permission checking functions
    can: checkPermission,
    canAny: checkAnyPermission,
    canAll: checkAllPermissions,

    // Utilities
    permissions: allPermissions,
    canAccessAdmin,

    // Role checks
    isAdmin,
    isModerator,
    isEmployer,
    isJobSeeker,
    role: userRole,
  };
};

export default usePermissions;
