/**
 * Unit tests for Permission System
 * Tests all permission utility functions and permission checking logic
 */

import { describe, it, expect } from 'vitest';
import {
  Permission,
  ROLE_PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getPermissionsForRole,
  canAccessAdminPanel,
  PERMISSION_LABELS,
  PERMISSION_DESCRIPTIONS
} from './permissions';

describe('Permission System', () => {
  describe('hasPermission', () => {
    it('should return true if user role has the permission', () => {
      expect(hasPermission('admin', Permission.MANAGE_USERS)).toBe(true);
      expect(hasPermission('admin', Permission.VIEW_ANALYTICS)).toBe(true);
      expect(hasPermission('admin', Permission.MANAGE_SETTINGS)).toBe(true);
    });

    it('should return false if user role does not have the permission', () => {
      expect(hasPermission('moderator', Permission.MANAGE_SETTINGS)).toBe(false);
      expect(hasPermission('moderator', Permission.DELETE_USERS)).toBe(false);
      expect(hasPermission('employer', Permission.MANAGE_USERS)).toBe(false);
      expect(hasPermission('jobseeker', Permission.VIEW_ANALYTICS)).toBe(false);
    });

    it('should check moderator permissions correctly', () => {
      expect(hasPermission('moderator', Permission.MODERATE_CONTENT)).toBe(true);
      expect(hasPermission('moderator', Permission.VIEW_USERS)).toBe(true);
      expect(hasPermission('moderator', Permission.APPROVE_CONTENT)).toBe(true);
      expect(hasPermission('moderator', Permission.MANAGE_USERS)).toBe(false);
      expect(hasPermission('moderator', Permission.DELETE_USERS)).toBe(false);
    });

    it('should return false for unknown roles', () => {
      expect(hasPermission('unknown_role', Permission.MANAGE_USERS)).toBe(false);
      expect(hasPermission('guest', Permission.VIEW_ANALYTICS)).toBe(false);
    });

    it('should use custom permissions when provided', () => {
      const customPermissions = [Permission.VIEW_ANALYTICS, Permission.VIEW_USERS];

      // Should return true for permissions in custom array
      expect(hasPermission('jobseeker', Permission.VIEW_ANALYTICS, customPermissions)).toBe(true);
      expect(hasPermission('jobseeker', Permission.VIEW_USERS, customPermissions)).toBe(true);

      // Should return false for permissions not in custom array
      expect(hasPermission('jobseeker', Permission.MANAGE_USERS, customPermissions)).toBe(false);
    });

    it('should prioritize custom permissions over role permissions', () => {
      const customPermissions = [Permission.MANAGE_USERS];

      // Jobseeker normally doesn't have MANAGE_USERS, but custom permissions override
      expect(hasPermission('jobseeker', Permission.MANAGE_USERS, customPermissions)).toBe(true);

      // Admin normally has VIEW_ANALYTICS, but custom permissions don't include it
      expect(hasPermission('admin', Permission.VIEW_ANALYTICS, customPermissions)).toBe(false);
    });

    it('should handle empty custom permissions array', () => {
      const customPermissions: Permission[] = [];

      // Empty array means no permissions
      expect(hasPermission('admin', Permission.MANAGE_USERS, customPermissions)).toBe(false);
      expect(hasPermission('admin', Permission.VIEW_ANALYTICS, customPermissions)).toBe(false);
    });
  });

  describe('hasAnyPermission', () => {
    it('should return true if user has at least one of the permissions', () => {
      const permissions = [Permission.MANAGE_USERS, Permission.DELETE_USERS, Permission.VIEW_SETTINGS];

      expect(hasAnyPermission('admin', permissions)).toBe(true);
      expect(hasAnyPermission('moderator', permissions)).toBe(false); // Moderator has none of these
    });

    it('should return false if user has none of the permissions', () => {
      const permissions = [Permission.MANAGE_SETTINGS, Permission.DELETE_USERS, Permission.SYSTEM_MAINTENANCE];

      expect(hasAnyPermission('moderator', permissions)).toBe(false);
      expect(hasAnyPermission('employer', permissions)).toBe(false);
    });

    it('should work with custom permissions', () => {
      const permissionsToCheck = [Permission.MANAGE_USERS, Permission.DELETE_USERS];
      const customPermissions = [Permission.VIEW_ANALYTICS];

      // User doesn't have any of the permissions to check
      expect(hasAnyPermission('jobseeker', permissionsToCheck, customPermissions)).toBe(false);

      // Add one permission that matches
      const customPermissions2 = [Permission.MANAGE_USERS, Permission.VIEW_ANALYTICS];
      expect(hasAnyPermission('jobseeker', permissionsToCheck, customPermissions2)).toBe(true);
    });

    it('should return false for empty permission array', () => {
      expect(hasAnyPermission('admin', [])).toBe(false);
    });
  });

  describe('hasAllPermissions', () => {
    it('should return true if user has all of the permissions', () => {
      const permissions = [Permission.MANAGE_USERS, Permission.VIEW_ANALYTICS, Permission.MODERATE_CONTENT];

      expect(hasAllPermissions('admin', permissions)).toBe(true);
    });

    it('should return false if user is missing even one permission', () => {
      const permissions = [Permission.VIEW_USERS, Permission.MANAGE_SETTINGS]; // Moderator has VIEW_USERS but not MANAGE_SETTINGS

      expect(hasAllPermissions('moderator', permissions)).toBe(false);
    });

    it('should work with custom permissions', () => {
      const permissionsToCheck = [Permission.MANAGE_USERS, Permission.VIEW_ANALYTICS];
      const customPermissions = [Permission.MANAGE_USERS, Permission.VIEW_ANALYTICS, Permission.DELETE_USERS];

      // User has all required permissions
      expect(hasAllPermissions('jobseeker', permissionsToCheck, customPermissions)).toBe(true);

      // User is missing one permission
      const customPermissions2 = [Permission.MANAGE_USERS]; // Missing VIEW_ANALYTICS
      expect(hasAllPermissions('jobseeker', permissionsToCheck, customPermissions2)).toBe(false);
    });

    it('should return true for empty permission array', () => {
      // Having all permissions from an empty set is vacuously true
      expect(hasAllPermissions('admin', [])).toBe(true);
      expect(hasAllPermissions('jobseeker', [])).toBe(true);
    });
  });

  describe('getPermissionsForRole', () => {
    it('should return all permissions for admin role', () => {
      const adminPermissions = getPermissionsForRole('admin');

      expect(adminPermissions).toContain(Permission.MANAGE_USERS);
      expect(adminPermissions).toContain(Permission.MANAGE_SETTINGS);
      expect(adminPermissions).toContain(Permission.VIEW_ANALYTICS);
      expect(adminPermissions).toContain(Permission.SYSTEM_MAINTENANCE);
      expect(adminPermissions.length).toBeGreaterThan(0);
    });

    it('should return limited permissions for moderator role', () => {
      const moderatorPermissions = getPermissionsForRole('moderator');

      expect(moderatorPermissions).toContain(Permission.MODERATE_CONTENT);
      expect(moderatorPermissions).toContain(Permission.VIEW_USERS);
      expect(moderatorPermissions).not.toContain(Permission.MANAGE_SETTINGS);
      expect(moderatorPermissions).not.toContain(Permission.DELETE_USERS);
    });

    it('should return empty array for employer role', () => {
      const employerPermissions = getPermissionsForRole('employer');

      expect(employerPermissions).toEqual([]);
    });

    it('should return empty array for jobseeker role', () => {
      const jobseekerPermissions = getPermissionsForRole('jobseeker');

      expect(jobseekerPermissions).toEqual([]);
    });

    it('should return empty array for unknown role', () => {
      const unknownPermissions = getPermissionsForRole('unknown_role');

      expect(unknownPermissions).toEqual([]);
    });

    it('should return the same array as defined in ROLE_PERMISSIONS', () => {
      expect(getPermissionsForRole('admin')).toEqual(ROLE_PERMISSIONS.admin);
      expect(getPermissionsForRole('moderator')).toEqual(ROLE_PERMISSIONS.moderator);
    });
  });

  describe('canAccessAdminPanel', () => {
    it('should return true for admin role', () => {
      expect(canAccessAdminPanel('admin')).toBe(true);
    });

    it('should return true for moderator role', () => {
      expect(canAccessAdminPanel('moderator')).toBe(true);
    });

    it('should return false for employer role', () => {
      expect(canAccessAdminPanel('employer')).toBe(false);
    });

    it('should return false for jobseeker role', () => {
      expect(canAccessAdminPanel('jobseeker')).toBe(false);
    });

    it('should return false for unknown roles', () => {
      expect(canAccessAdminPanel('guest')).toBe(false);
      expect(canAccessAdminPanel('unknown')).toBe(false);
      expect(canAccessAdminPanel('')).toBe(false);
    });
  });

  describe('ROLE_PERMISSIONS', () => {
    it('should define permissions for all expected roles', () => {
      expect(ROLE_PERMISSIONS).toHaveProperty('admin');
      expect(ROLE_PERMISSIONS).toHaveProperty('moderator');
      expect(ROLE_PERMISSIONS).toHaveProperty('employer');
      expect(ROLE_PERMISSIONS).toHaveProperty('jobseeker');
    });

    it('should have admin with more permissions than moderator', () => {
      expect(ROLE_PERMISSIONS.admin.length).toBeGreaterThan(ROLE_PERMISSIONS.moderator.length);
    });

    it('should ensure admin has all critical permissions', () => {
      const criticalPermissions = [
        Permission.MANAGE_USERS,
        Permission.DELETE_USERS,
        Permission.MANAGE_SETTINGS,
        Permission.VIEW_ANALYTICS,
        Permission.MODERATE_CONTENT,
        Permission.SYSTEM_MAINTENANCE,
        Permission.MANAGE_PERMISSIONS
      ];

      criticalPermissions.forEach(permission => {
        expect(ROLE_PERMISSIONS.admin).toContain(permission);
      });
    });

    it('should ensure moderator has moderation permissions', () => {
      const moderationPermissions = [
        Permission.MODERATE_CONTENT,
        Permission.VIEW_MODERATION_QUEUE,
        Permission.APPROVE_CONTENT,
        Permission.REMOVE_CONTENT
      ];

      moderationPermissions.forEach(permission => {
        expect(ROLE_PERMISSIONS.moderator).toContain(permission);
      });
    });

    it('should ensure moderator does not have dangerous permissions', () => {
      const dangerousPermissions = [
        Permission.DELETE_USERS,
        Permission.MANAGE_SETTINGS,
        Permission.SYSTEM_MAINTENANCE,
        Permission.MANAGE_PERMISSIONS
      ];

      dangerousPermissions.forEach(permission => {
        expect(ROLE_PERMISSIONS.moderator).not.toContain(permission);
      });
    });
  });

  describe('PERMISSION_LABELS', () => {
    it('should have labels for all permissions', () => {
      Object.values(Permission).forEach(permission => {
        expect(PERMISSION_LABELS).toHaveProperty(permission);
        expect(PERMISSION_LABELS[permission]).toBeTruthy();
        expect(typeof PERMISSION_LABELS[permission]).toBe('string');
      });
    });

    it('should have human-readable labels', () => {
      expect(PERMISSION_LABELS[Permission.MANAGE_USERS]).toBe('Manage Users');
      expect(PERMISSION_LABELS[Permission.VIEW_ANALYTICS]).toBe('View Analytics');
      expect(PERMISSION_LABELS[Permission.MODERATE_CONTENT]).toBe('Moderate Content');
    });
  });

  describe('PERMISSION_DESCRIPTIONS', () => {
    it('should have descriptions for all permissions', () => {
      Object.values(Permission).forEach(permission => {
        expect(PERMISSION_DESCRIPTIONS).toHaveProperty(permission);
        expect(PERMISSION_DESCRIPTIONS[permission]).toBeTruthy();
        expect(typeof PERMISSION_DESCRIPTIONS[permission]).toBe('string');
      });
    });

    it('should have descriptions longer than labels', () => {
      Object.values(Permission).forEach(permission => {
        const label = PERMISSION_LABELS[permission];
        const description = PERMISSION_DESCRIPTIONS[permission];

        expect(description.length).toBeGreaterThan(label.length);
      });
    });

    it('should have meaningful descriptions', () => {
      expect(PERMISSION_DESCRIPTIONS[Permission.MANAGE_USERS]).toContain('create');
      expect(PERMISSION_DESCRIPTIONS[Permission.VIEW_ANALYTICS]).toContain('View');
      expect(PERMISSION_DESCRIPTIONS[Permission.SYSTEM_MAINTENANCE]).toContain('maintenance');
    });
  });

  describe('Permission Enum', () => {
    it('should have all expected permission values', () => {
      const expectedPermissions = [
        'manage_users',
        'view_users',
        'suspend_users',
        'delete_users',
        'moderate_content',
        'view_moderation_queue',
        'approve_content',
        'remove_content',
        'view_analytics',
        'export_analytics',
        'manage_settings',
        'view_settings',
        'view_audit_logs',
        'manage_all_jobs',
        'delete_any_job',
        'manage_companies',
        'verify_companies',
        'moderate_reviews',
        'delete_reviews',
        'manage_permissions',
        'system_maintenance'
      ];

      expectedPermissions.forEach(permission => {
        expect(Object.values(Permission)).toContain(permission);
      });
    });

    it('should use snake_case for permission values', () => {
      Object.values(Permission).forEach(permission => {
        expect(permission).toMatch(/^[a-z_]+$/);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle null or undefined gracefully', () => {
      // @ts-expect-error Testing runtime behavior with invalid input
      expect(hasPermission(null, Permission.MANAGE_USERS)).toBe(false);
      // @ts-expect-error Testing runtime behavior with invalid input
      expect(hasPermission(undefined, Permission.MANAGE_USERS)).toBe(false);
    });

    it('should handle case sensitivity correctly', () => {
      // Roles should be case-sensitive
      expect(hasPermission('Admin', Permission.MANAGE_USERS)).toBe(false);
      expect(hasPermission('ADMIN', Permission.MANAGE_USERS)).toBe(false);
      expect(hasPermission('admin', Permission.MANAGE_USERS)).toBe(true);
    });

    it('should not mutate original permission arrays', () => {
      const originalAdminPerms = [...ROLE_PERMISSIONS.admin];
      const customPerms = [Permission.VIEW_USERS];

      hasPermission('admin', Permission.MANAGE_USERS, customPerms);

      expect(ROLE_PERMISSIONS.admin).toEqual(originalAdminPerms);
      expect(customPerms).toEqual([Permission.VIEW_USERS]);
    });
  });
});
