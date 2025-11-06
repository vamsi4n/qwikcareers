import { useState, useEffect } from 'react';
import {
  XMarkIcon,
  CheckIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import {
  Permission,
  PERMISSION_LABELS,
  PERMISSION_DESCRIPTIONS,
  getPermissionsForRole,
  ROLE_PERMISSIONS
} from '../../../shared/utils/permissions';
import type { User } from '../../../types';
import GlassCard from '../../../shared/components/ui/GlassCard';

interface PermissionManagementModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (customPermissions: string[] | null) => void;
  isSaving?: boolean;
}

// Group permissions by category
const PERMISSION_CATEGORIES = {
  'User Management': [
    Permission.MANAGE_USERS,
    Permission.VIEW_USERS,
    Permission.SUSPEND_USERS,
    Permission.DELETE_USERS,
  ],
  'Content Moderation': [
    Permission.MODERATE_CONTENT,
    Permission.VIEW_MODERATION_QUEUE,
    Permission.APPROVE_CONTENT,
    Permission.REMOVE_CONTENT,
  ],
  'Analytics': [
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_ANALYTICS,
  ],
  'Settings': [
    Permission.MANAGE_SETTINGS,
    Permission.VIEW_SETTINGS,
  ],
  'Audit': [
    Permission.VIEW_AUDIT_LOGS,
  ],
  'Jobs': [
    Permission.MANAGE_ALL_JOBS,
    Permission.DELETE_ANY_JOB,
  ],
  'Companies': [
    Permission.MANAGE_COMPANIES,
    Permission.VERIFY_COMPANIES,
  ],
  'Reviews': [
    Permission.MODERATE_REVIEWS,
    Permission.DELETE_REVIEWS,
  ],
  'System': [
    Permission.MANAGE_PERMISSIONS,
    Permission.SYSTEM_MAINTENANCE,
  ],
};

export default function PermissionManagementModal({
  user,
  isOpen,
  onClose,
  onSave,
  isSaving = false,
}: PermissionManagementModalProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [useCustomPermissions, setUseCustomPermissions] = useState(false);

  // Get role-based permissions for reference
  const rolePermissions = getPermissionsForRole(user.role);

  // Initialize permissions on mount or when user changes
  useEffect(() => {
    if (user.customPermissions && user.customPermissions.length > 0) {
      setSelectedPermissions(new Set(user.customPermissions));
      setUseCustomPermissions(true);
    } else {
      setSelectedPermissions(new Set(rolePermissions));
      setUseCustomPermissions(false);
    }
  }, [user, rolePermissions]);

  const handleTogglePermission = (permission: Permission) => {
    const newPermissions = new Set(selectedPermissions);
    if (newPermissions.has(permission)) {
      newPermissions.delete(permission);
    } else {
      newPermissions.add(permission);
    }
    setSelectedPermissions(newPermissions);
    setUseCustomPermissions(true); // Switching to custom once user makes changes
  };

  const handleSelectAll = () => {
    setSelectedPermissions(new Set(Object.values(Permission)));
    setUseCustomPermissions(true);
  };

  const handleDeselectAll = () => {
    setSelectedPermissions(new Set());
    setUseCustomPermissions(true);
  };

  const handleResetToRole = () => {
    setSelectedPermissions(new Set(rolePermissions));
    setUseCustomPermissions(false);
  };

  const handleSave = () => {
    if (useCustomPermissions) {
      onSave(Array.from(selectedPermissions));
    } else {
      // Reset to role-based permissions
      onSave(null);
    }
  };

  const isPermissionInRole = (permission: Permission): boolean => {
    return rolePermissions.includes(permission);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Manage Permissions
              </h2>
              <p className="text-gray-600">
                Configure permissions for{' '}
                <span className="font-semibold">
                  {user.firstName} {user.lastName}
                </span>{' '}
                ({user.email})
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Permission Mode Indicator */}
          <div className="mt-4">
            {useCustomPermissions ? (
              <div className="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
                <ShieldCheckIcon className="w-5 h-5" />
                <span className="font-medium">Using Custom Permissions</span>
                <span className="text-blue-600">
                  ({selectedPermissions.size} permissions)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm bg-gray-50 text-gray-700 px-4 py-2 rounded-lg">
                <InformationCircleIcon className="w-5 h-5" />
                <span className="font-medium">Using Role-Based Permissions</span>
                <span className="text-gray-600">
                  ({rolePermissions.length} permissions from "{user.role}" role)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="px-8 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            Select All
          </button>
          <button
            onClick={handleDeselectAll}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            Deselect All
          </button>
          <button
            onClick={handleResetToRole}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            Reset to Role Defaults
          </button>

          <div className="ml-auto text-sm text-gray-600">
            <span className="font-medium">{selectedPermissions.size}</span> of{' '}
            <span className="font-medium">{Object.values(Permission).length}</span> permissions selected
          </div>
        </div>

        {/* Permissions List */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-6">
            {Object.entries(PERMISSION_CATEGORIES).map(([category, permissions]) => (
              <div key={category}>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  {category}
                  <span className="text-sm font-normal text-gray-500">
                    ({permissions.filter(p => selectedPermissions.has(p)).length}/{permissions.length})
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {permissions.map((permission) => {
                    const isSelected = selectedPermissions.has(permission);
                    const isInRole = isPermissionInRole(permission);

                    return (
                      <button
                        key={permission}
                        onClick={() => handleTogglePermission(permission)}
                        className={`text-left p-4 rounded-lg border-2 transition ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                              isSelected
                                ? 'bg-blue-600 border-blue-600'
                                : 'border-gray-300 bg-white'
                            }`}
                          >
                            {isSelected && (
                              <CheckIcon className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className={`font-semibold ${
                                isSelected ? 'text-blue-900' : 'text-gray-900'
                              }`}>
                                {PERMISSION_LABELS[permission]}
                              </p>
                              {isInRole && !useCustomPermissions && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
                                  Role Default
                                </span>
                              )}
                            </div>
                            <p className={`text-sm ${
                              isSelected ? 'text-blue-700' : 'text-gray-600'
                            }`}>
                              {PERMISSION_DESCRIPTIONS[permission]}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warning */}
        {useCustomPermissions && (
          <div className="px-8 py-4 bg-yellow-50 border-t border-yellow-200">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-yellow-900 mb-1">Custom Permissions Active</p>
                <p className="text-yellow-700">
                  Custom permissions will override the role-based permissions for this user.
                  Click "Reset to Role Defaults" to revert to role-based permissions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-6 py-3 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <CheckIcon className="w-5 h-5" />
                Save Permissions
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
