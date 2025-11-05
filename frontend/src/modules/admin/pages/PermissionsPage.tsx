import { useState } from 'react';
import {
  ShieldCheckIcon,
  UserGroupIcon,
  LockClosedIcon,
  CheckIcon,
  XMarkIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import AnimatedCard from '../../../shared/components/animations/AnimatedCard';
import GlassCard from '../../../shared/components/ui/GlassCard';
import {
  Permission,
  ROLE_PERMISSIONS,
  PERMISSION_LABELS,
  PERMISSION_DESCRIPTIONS,
} from '../../../shared/utils/permissions';

type RoleType = 'admin' | 'moderator' | 'employer' | 'jobseeker';

interface PermissionGroup {
  name: string;
  permissions: Permission[];
}

export default function PermissionsPage() {
  const [selectedRole, setSelectedRole] = useState<RoleType>('admin');
  const [expandedGroup, setExpandedGroup] = useState<string | null>('User Management');

  // Group permissions by category
  const permissionGroups: PermissionGroup[] = [
    {
      name: 'User Management',
      permissions: [
        Permission.MANAGE_USERS,
        Permission.VIEW_USERS,
        Permission.SUSPEND_USERS,
        Permission.DELETE_USERS,
      ],
    },
    {
      name: 'Content Moderation',
      permissions: [
        Permission.MODERATE_CONTENT,
        Permission.VIEW_MODERATION_QUEUE,
        Permission.APPROVE_CONTENT,
        Permission.REMOVE_CONTENT,
      ],
    },
    {
      name: 'Analytics',
      permissions: [Permission.VIEW_ANALYTICS, Permission.EXPORT_ANALYTICS],
    },
    {
      name: 'Settings',
      permissions: [Permission.MANAGE_SETTINGS, Permission.VIEW_SETTINGS],
    },
    {
      name: 'Audit & Logs',
      permissions: [Permission.VIEW_AUDIT_LOGS],
    },
    {
      name: 'Job Management',
      permissions: [Permission.MANAGE_ALL_JOBS, Permission.DELETE_ANY_JOB],
    },
    {
      name: 'Company Management',
      permissions: [Permission.MANAGE_COMPANIES, Permission.VERIFY_COMPANIES],
    },
    {
      name: 'Review Management',
      permissions: [Permission.MODERATE_REVIEWS, Permission.DELETE_REVIEWS],
    },
    {
      name: 'System Administration',
      permissions: [Permission.MANAGE_PERMISSIONS, Permission.SYSTEM_MAINTENANCE],
    },
  ];

  const roles: { value: RoleType; label: string; description: string; color: string }[] = [
    {
      value: 'admin',
      label: 'Admin',
      description: 'Full system access with all permissions',
      color: 'text-red-600 bg-red-50 border-red-200',
    },
    {
      value: 'moderator',
      label: 'Moderator',
      description: 'Limited access for content moderation',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      value: 'employer',
      label: 'Employer',
      description: 'Standard employer permissions',
      color: 'text-green-600 bg-green-50 border-green-200',
    },
    {
      value: 'jobseeker',
      label: 'Job Seeker',
      description: 'Standard job seeker permissions',
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
  ];

  const rolePermissions = ROLE_PERMISSIONS[selectedRole] || [];

  const hasPermission = (permission: Permission): boolean => {
    return rolePermissions.includes(permission);
  };

  const getPermissionCountForRole = (role: RoleType): number => {
    return (ROLE_PERMISSIONS[role] || []).length;
  };

  const totalPermissions = Object.values(Permission).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Permissions Management</h1>
          </div>
          <p className="text-gray-600">Manage role-based access control and permissions</p>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">About Permissions</p>
              <p>
                Permissions control what actions users can perform in the system. Each role has a predefined
                set of permissions. Admin role has full access, while other roles have restricted access
                based on their responsibilities.
              </p>
            </div>
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {roles.map((role, index) => (
            <AnimatedCard key={role.value} animation="fadeUp" delay={index * 50}>
              <button
                onClick={() => setSelectedRole(role.value)}
                className={`w-full text-left p-6 rounded-lg border-2 transition-all ${
                  selectedRole === role.value
                    ? `${role.color} border-2 shadow-lg scale-105`
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-white border border-gray-200">
                    <UserGroupIcon className="w-6 h-6 text-gray-700" />
                  </div>
                  {selectedRole === role.value && (
                    <div className="p-1 rounded-full bg-blue-600">
                      <CheckIcon className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{role.label}</h3>
                <p className="text-xs text-gray-600 mb-3">{role.description}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{
                        width: `${(getPermissionCountForRole(role.value) / totalPermissions) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    {getPermissionCountForRole(role.value)}/{totalPermissions}
                  </span>
                </div>
              </button>
            </AnimatedCard>
          ))}
        </div>

        {/* Permissions Display */}
        <GlassCard className="overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {roles.find((r) => r.value === selectedRole)?.label} Permissions
                </h2>
                <p className="text-sm text-gray-600">
                  {rolePermissions.length} of {totalPermissions} permissions granted
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <p className="text-3xl font-bold text-blue-600">{rolePermissions.length}</p>
                <p className="text-xs text-gray-600 mt-1">Active Permissions</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {permissionGroups.map((group, index) => {
              const groupPermissionsCount = group.permissions.filter((p) =>
                hasPermission(p)
              ).length;
              const isExpanded = expandedGroup === group.name;

              return (
                <AnimatedCard key={group.name} animation="fadeUp" delay={index * 30}>
                  <div className="mb-4 last:mb-0">
                    <button
                      onClick={() => setExpandedGroup(isExpanded ? null : group.name)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <LockClosedIcon className="w-5 h-5 text-gray-600" />
                        <span className="font-semibold text-gray-900">{group.name}</span>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            groupPermissionsCount === group.permissions.length
                              ? 'bg-green-100 text-green-800'
                              : groupPermissionsCount > 0
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {groupPermissionsCount}/{group.permissions.length}
                        </span>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-600 transition-transform ${
                          isExpanded ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {isExpanded && (
                      <div className="mt-2 space-y-2">
                        {group.permissions.map((permission) => {
                          const hasAccess = hasPermission(permission);

                          return (
                            <div
                              key={permission}
                              className={`p-4 rounded-lg border-2 transition ${
                                hasAccess
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                  {hasAccess ? (
                                    <div className="p-1 bg-green-600 rounded-full">
                                      <CheckIcon className="w-4 h-4 text-white" />
                                    </div>
                                  ) : (
                                    <div className="p-1 bg-gray-400 rounded-full">
                                      <XMarkIcon className="w-4 h-4 text-white" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p
                                      className={`font-semibold ${
                                        hasAccess ? 'text-green-900' : 'text-gray-700'
                                      }`}
                                    >
                                      {PERMISSION_LABELS[permission]}
                                    </p>
                                    <code className="px-2 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono text-gray-600">
                                      {permission}
                                    </code>
                                  </div>
                                  <p
                                    className={`text-sm ${
                                      hasAccess ? 'text-green-700' : 'text-gray-600'
                                    }`}
                                  >
                                    {PERMISSION_DESCRIPTIONS[permission]}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </GlassCard>

        {/* Permission Matrix (Optional Detailed View) */}
        <div className="mt-8">
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Permission Matrix</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Permission
                    </th>
                    {roles.map((role) => (
                      <th
                        key={role.value}
                        className="px-4 py-3 text-center text-sm font-semibold text-gray-900"
                      >
                        {role.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.values(Permission).map((permission) => (
                    <tr key={permission} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {PERMISSION_LABELS[permission]}
                      </td>
                      {roles.map((role) => {
                        const roleHasPermission = (ROLE_PERMISSIONS[role.value] || []).includes(
                          permission
                        );
                        return (
                          <td key={role.value} className="px-4 py-3 text-center">
                            {roleHasPermission ? (
                              <div className="inline-flex p-1 bg-green-100 rounded-full">
                                <CheckIcon className="w-4 h-4 text-green-600" />
                              </div>
                            ) : (
                              <div className="inline-flex p-1 bg-gray-100 rounded-full">
                                <XMarkIcon className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
